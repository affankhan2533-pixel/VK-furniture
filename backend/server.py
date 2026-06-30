import time
import os
import logging
import uuid
import smtplib
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Optional
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from collections import defaultdict

from fastapi import FastAPI, APIRouter, HTTPException, status, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict, EmailStr, field_validator

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection settings
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'vk_furniture')

client = None
db = None

# ── Lifespan context ─────────────────────────────────────────────────────────
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    global client, db
    logger.info("Connecting to MongoDB Atlas / Local …")
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    logger.info(f"Connected to database: {db_name}")
    yield
    logger.info("Disconnecting from database …")
    client.close()

app = FastAPI(title="V.K. Furniture Backend API", lifespan=lifespan)
api_router = APIRouter(prefix="/api")

# ── Security & Anti-Spam Helpers ──────────────────────────────────────────────

# 1. In-Memory Rate Limiter (Limit: 5 requests per 60 seconds per IP)
class RateLimiter:
    def __init__(self, limit: int, window: int):
        self.limit = limit
        self.window = window
        self.requests = defaultdict(list)

    def is_allowed(self, ip: str) -> bool:
        now = time.time()
        # Clean timestamps older than the window
        self.requests[ip] = [t for t in self.requests[ip] if now - t < self.window]
        if len(self.requests[ip]) >= self.limit:
            return False
        self.requests[ip].append(now)
        return True

limiter = RateLimiter(limit=5, window=60)

# 2. Duplicate submission prevention (Same Phone + Message within 5 minutes)
class DuplicateChecker:
    def __init__(self, expiry_seconds: int = 300):
        self.expiry_seconds = expiry_seconds
        self.submissions = {}

    def is_duplicate(self, phone: str, message: str) -> bool:
        now = time.time()
        # Expire old submissions
        self.submissions = {k: v for k, v in self.submissions.items() if now - v < self.expiry_seconds}
        
        # Check current key
        key = (phone.strip(), message.strip())
        if key in self.submissions:
            return True
        self.submissions[key] = now
        return False

dup_checker = DuplicateChecker()

# 3. Client IP helper (resolves proxy client IPs)
def get_client_ip(request: Request) -> str:
    x_forwarded_for = request.headers.get("x-forwarded-for")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()
    return request.client.host if request.client else "127.0.0.1"

# 4. Email Notification Dispatcher
def send_email_notification(to_email: str, subject: str, html_body: str):
    smtp_host = os.environ.get('SMTP_HOST', '')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_user = os.environ.get('SMTP_USER', '')
    smtp_password = os.environ.get('SMTP_PASSWORD', '')

    if not (smtp_host and smtp_user and smtp_password):
        logger.warning("SMTP settings not configured. Logging notification instead:")
        logger.info(f"EMAIL NOTIFICATION -> To: {to_email} | Subject: {subject}\nHTML Body preview: {html_body[:250]}...")
        return

    try:
        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(html_body, 'html'))

        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
        logger.info(f"Email successfully dispatched to {to_email}")
    except Exception as e:
        logger.error(f"Failed to dispatch email to {to_email}: {e}")

# ── Schemas & Models ──────────────────────────────────────────────────────────
class Enquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: Optional[str] = None
    subject: str
    message: str
    date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    ip: str
    status: str = "pending"

class EnquiryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=10, max_length=15)
    email: Optional[EmailStr] = None
    subject: str = Field(..., min_length=3, max_length=150)
    message: str = Field(..., min_length=5, max_length=1000)

    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        # Strip spaces, hyphens, and check digits
        cleaned = ''.join(c for c in v if c.isdigit() or c == '+')
        if len(cleaned) < 10:
            raise ValueError('Phone number must have at least 10 digits')
        return cleaned

class CustomOrder(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    category: str
    dimensions: str
    wood_finish: str
    cushion_density: Optional[str] = None
    fabric: Optional[str] = None
    notes: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CustomOrderCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=10, max_length=15)
    category: str
    dimensions: str = Field(..., min_length=3)
    wood_finish: str
    cushion_density: Optional[str] = None
    fabric: Optional[str] = None
    notes: Optional[str] = None

    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        cleaned = ''.join(c for c in v if c.isdigit() or c == '+')
        if len(cleaned) < 10:
            raise ValueError('Phone number must have at least 10 digits')
        return cleaned

# ── Routes ────────────────────────────────────────────────────────────────────
@api_router.get("/")
async def root():
    return {"message": "Welcome to V.K. Furniture API", "status": "running"}

@api_router.post("/enquiries", response_model=Enquiry, status_code=status.HTTP_201_CREATED)
async def create_enquiry(payload: EnquiryCreate, request: Request):
    client_ip = get_client_ip(request)

    # 1. Rate Limiting Check
    if not limiter.is_allowed(client_ip):
        logger.warning(f"Rate limit exceeded for IP: {client_ip}")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Please wait a minute before submitting again."
        )

    # 2. Duplicate Check
    if dup_checker.is_duplicate(payload.phone, payload.message):
        logger.warning(f"Duplicate submission rejected for phone: {payload.phone}")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already submitted this message recently. We will contact you soon!"
        )

    try:
        # Create standard Enquiry model
        enquiry_dict = payload.model_dump()
        enquiry_dict["ip"] = client_ip
        enquiry_obj = Enquiry(**enquiry_dict)

        # Convert to database document format
        doc = enquiry_obj.model_dump()
        doc["date"] = doc["date"].isoformat()

        # Insert to database
        await db.enquiries.insert_one(doc)
        logger.info(f"Enquiry created: {enquiry_obj.id} from {enquiry_obj.name}")

        # Send notifications
        # Owner Alert
        owner_email = os.environ.get('BUSINESS_OWNER_EMAIL', os.environ.get('SMTP_USER', ''))
        if owner_email:
            owner_body = f"""
            <h3>New Custom / Wholesale Enquiry Received</h3>
            <p><strong>Name:</strong> {enquiry_obj.name}</p>
            <p><strong>Phone:</strong> {enquiry_obj.phone}</p>
            <p><strong>Email:</strong> {enquiry_obj.email or 'N/A'}</p>
            <p><strong>Subject:</strong> {enquiry_obj.subject}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="background:#f9f9f9;padding:12px;border-left:4px solid #4A3525;">
              {enquiry_obj.message}
            </blockquote>
            <hr/>
            <p style="font-size:11px;color:#888;">Submitted from IP: {enquiry_obj.ip} at {enquiry_obj.date.isoformat()}</p>
            """
            send_email_notification(owner_email, f"New Lead: {enquiry_obj.subject}", owner_body)

        # Client Auto-Confirmation
        if enquiry_obj.email:
            client_body = f"""
            <div style="font-family:sans-serif;color:#2C241B;background:#F9F6F0;padding:24px;border:1px solid #E5E0D8;">
              <h2 style="font-family:serif;color:#4A3525;">V.K. Furniture (वी.के. फर्नीचर)</h2>
              <p>Dear {enquiry_obj.name},</p>
              <p>Thank you for reaching out to us. We have received your query regarding <strong>"{enquiry_obj.subject}"</strong>.</p>
              <p>Our workshop team in Dharavi is reviewing your requirements, and we will get back to you shortly over call or WhatsApp.</p>
              <br/>
              <p><strong>Your Message:</strong></p>
              <p style="font-style:italic;color:#57534E;">"{enquiry_obj.message}"</p>
              <br/>
              <p>Best Regards,</p>
              <p><strong>V.K. Furniture Team</strong><br/>Naik Nagar, Dharavi, Mumbai<br/>Contact: 098214 54706</p>
            </div>
            """
            send_email_notification(enquiry_obj.email, "Enquiry Confirmation - V.K. Furniture", client_body)

        return enquiry_obj

    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error saving enquiry: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit your enquiry. Please try again later."
        )

# Custom Order Endpoint
@api_router.post("/custom-orders", response_model=CustomOrder, status_code=status.HTTP_201_CREATED)
async def create_custom_order(payload: CustomOrderCreate, request: Request):
    client_ip = get_client_ip(request)

    if not limiter.is_allowed(client_ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Please wait a minute before submitting again."
        )

    try:
        order_obj = CustomOrder(**payload.model_dump())
        doc = order_obj.model_dump()
        doc["timestamp"] = doc["timestamp"].isoformat()
        
        await db.custom_orders.insert_one(doc)
        logger.info(f"Custom order saved: {order_obj.id} from {order_obj.name}")

        # Dispatch email notifications for custom orders
        owner_email = os.environ.get('BUSINESS_OWNER_EMAIL', os.environ.get('SMTP_USER', ''))
        if owner_email:
            owner_body = f"""
            <h3>New Custom Design Plan Received</h3>
            <p><strong>Customer Name:</strong> {order_obj.name}</p>
            <p><strong>Phone:</strong> {order_obj.phone}</p>
            <p><strong>Furniture Type:</strong> {order_obj.category}</p>
            <p><strong>Custom Dimensions:</strong> {order_obj.dimensions}</p>
            <p><strong>Wood Polish:</strong> {order_obj.wood_finish}</p>
            <p><strong>Cushion Foam:</strong> {order_obj.cushion_density or 'N/A'}</p>
            <p><strong>Upholstery Fabric:</strong> {order_obj.fabric or 'N/A'}</p>
            <p><strong>Special Carving Notes:</strong> {order_obj.notes or 'None'}</p>
            """
            send_email_notification(owner_email, f"New Custom Design: {order_obj.category} ({order_obj.name})", owner_body)

        return order_obj
    except Exception as exc:
        logger.error(f"Error saving custom order: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save custom design plan."
        )

app.include_router(api_router)

# CORS Middlewares
cors_origins_str = os.environ.get("CORS_ORIGINS", "*")
origins = ["*"] if cors_origins_str == "*" else cors_origins_str.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
