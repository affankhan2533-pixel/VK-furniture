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

# Initial products catalog data to seed if db is empty
INITIAL_PRODUCTS = [
    {
        "id": "handcrafted-teak-sofa",
        "name": "Royal Teak Sofa Set",
        "category": "Sofas",
        "price": "Direct Factory Rate",
        "material": "Genuine Seasoned Teak Wood (Sagwan)",
        "image": "/images/sofa-teak.png",
        "description": "Ornate hand-carved details in a classic honey-teak finish. Features premium high-density support cushions upholstered in premium stain-resistant velvet fabric.",
        "specs": {
            "Wood Type": "Seasoned Teak Wood (Sagwan)",
            "Cushion Foam": "40 Density Premium Foam",
            "Wood Polish": "Premium natural honey shade polyurethane",
            "Dimensions (3-Seater)": "78\" W x 32\" D x 36\" H",
            "Dimensions (1-Seater)": "36\" W x 32\" D x 36\" H"
        }
    },
    {
        "id": "l-shape-sectional-sofa",
        "name": "L-Shape Teak Sectional Sofa",
        "category": "Sofas",
        "price": "Wholesale Price Direct",
        "material": "Solid Teak Frame & Premium Fabric",
        "image": "/images/sofa-lshape.png",
        "description": "Modern modular L-shape sectional sofa that fits perfectly in any living space. Heavy-gauge structural framework built to last for decades.",
        "specs": {
            "Wood Type": "A-Grade Hardwood & Teak Outer Panel",
            "Cushion Foam": "38 Density Soft-Orthopedic Foam",
            "Fabric Options": "Custom Premium Linen/Leatherette",
            "Overall Dimensions": "108\" L x 72\" W x 32\" H"
        }
    },
    {
        "id": "modern-sofa-cum-bed",
        "name": "Modern Teak Sofa Cum Bed",
        "category": "Sofas",
        "price": "Direct Factory Rate",
        "material": "Premium Teak & Heavy Metal Mechanism",
        "image": "/images/sofa-cumbed.png",
        "description": "Smart spacesaving furniture that easily transitions from a luxury three-seater sofa to a spacious double bed. Heavy-duty mechanism ensures effortless operation.",
        "specs": {
            "Mechanism": "Premium pull-out steel drawer glide",
            "Wood Type": "Kiln-dried Teak (Sagwan) panels",
            "Sofa Dimensions": "76\" W x 36\" D x 34\" H",
            "Bed Dimensions": "72\" L x 60\" W x 18\" H"
        }
    },
    {
        "id": "handcrafted-teak-dining-set",
        "name": "Solid Teak Dining Table Set",
        "category": "Tables",
        "price": "Wholesale Rates direct",
        "material": "100% Seasoned Teak & Premium Glass",
        "image": "/images/dining-4seater.png",
        "description": "Classic solid teakwood frame featuring elegant carvings. Set comes with matching high-back chairs upholstered in stain-resistant fabric.",
        "specs": {
            "Wood Type": "Selected seasoned Teak (Sagwan)",
            "Glass Top Thickness": "12mm Beveled Tempered Glass",
            "Table Dimensions (4-Seater)": "48\" L x 36\" W x 30\" H",
            "Table Dimensions (6-Seater)": "72\" L x 36\" W x 30\" H"
        }
    },
    {
        "id": "royal-hydraulic-bed",
        "name": "Royal Teak Hydraulic Bed",
        "category": "Beds",
        "price": "Direct Factory Rate",
        "material": "Teak Wood Frame & Plywood Box",
        "image": "/images/bed-hydraulic.png",
        "description": "Smart king-size bed with a smooth gas-lift hydraulic storage mechanism, heavy-gauge solid wood framework, and modern headboard.",
        "specs": {
            "Wood Frame": "Genuine Teak Wood (Sagwan)",
            "Storage System": "120kg Force Gas-Lift Hydraulic Shockers",
            "Box Structure": "18mm Premium Boiling-Water-Resistant Plywood",
            "Overall Dimensions": "78\" W x 82\" L x 48\" H (Headboard)"
        }
    },
    {
        "id": "vintage-carved-bed",
        "name": "Vintage Hand-Carved Bed",
        "category": "Beds",
        "price": "Direct Wholesale Price",
        "material": "Selected Premium Seasoned Teak",
        "image": "/images/bed-vintage.png",
        "description": "Classic heritage four-pillar design featuring ornate floral wood carvings on the headboard and posts. Polished natural honey shade.",
        "specs": {
            "Carving Type": "Deep manual relief carving by artisans",
            "Wood Type": "Premium seasoned Teak wood",
            "Dimensions (King Size)": "72\" W x 78\" L x 54\" H (Headboard)"
        }
    },
    {
        "id": "upholstered-accent-armchair",
        "name": "Modern Upholstered Accent Chair",
        "category": "Chairs",
        "price": "MOQ: 50 Units for Bulk pricing",
        "material": "Walnut Finish Legs & Premium Fabric",
        "image": "/images/grey-armchair.png",
        "description": "Chic lounge armchair featuring modern curved aesthetics, walnut-finished wood frame, and premium stain-resistant upholstery.",
        "specs": {
            "Frame": "Premium solid Ashwood / Teak legs",
            "Upholstery": "High-grade linen blend fabric",
            "Dimensions": "28\" W x 30\" D x 34\" H"
        }
    }
]

INITIAL_GALLERY = [
    {
        "id": "g1",
        "src": "/images/dining-4seater.png",
        "alt": "Teak Glass-Top 4-Seater Dining Set",
        "category": "Dining",
        "label": "4-Seater Glass Dining Set",
        "productId": "handcrafted-teak-dining-set"
    },
    {
        "id": "g2",
        "src": "/images/dining-6seater.png",
        "alt": "6-Seater Sagwan Dining Table with Chairs",
        "category": "Dining",
        "label": "6-Seater Sagwan Dining Set",
        "productId": "handcrafted-teak-dining-set"
    },
    {
        "id": "g3",
        "src": "/images/grey-armchair.png",
        "alt": "Modern Grey Upholstered Accent Chair",
        "category": "Chairs",
        "label": "Luxury Accent Armchair",
        "productId": "upholstered-accent-armchair"
    },
    {
        "id": "g4",
        "src": "/images/sofa-teak.png",
        "alt": "Royal Classic Teak Wood Sofa set",
        "category": "Living",
        "label": "Royal Classic Teak Sofa Set",
        "productId": "handcrafted-teak-sofa"
    },
    {
        "id": "g5",
        "src": "/images/sofa-lshape.png",
        "alt": "Teak Modular L-Shape Sectional sofa",
        "category": "Living",
        "label": "L-Shape Sectional Teak Sofa",
        "productId": "l-shape-sectional-sofa"
    },
    {
        "id": "g6",
        "src": "/images/king-bed.png",
        "alt": "Royal Solid Sagwan King size Bed",
        "category": "Bedroom",
        "label": "Royal Sagwan Bed",
        "productId": "royal-hydraulic-bed"
    }
]

# ── Lifespan context ─────────────────────────────────────────────────────────
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    global client, db
    logger.info("Connecting to MongoDB Atlas / Local …")
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    logger.info(f"Connected to database: {db_name}")

    # Seed initial items if collection is empty
    try:
        if await db.products.count_documents({}) == 0:
            logger.info("Database is empty. Seeding initial products data...")
            await db.products.insert_many(INITIAL_PRODUCTS)
        if await db.gallery.count_documents({}) == 0:
            logger.info("Database is empty. Seeding initial gallery items data...")
            await db.gallery.insert_many(INITIAL_GALLERY)
    except Exception as e:
        logger.error(f"Error seeding database: {e}")

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

# Pydantic Schemas for new CRUD and Admin Dashboard support
class AdminLoginRequest(BaseModel):
    username: str
    password: str

class ProductDb(BaseModel):
    id: str
    name: str
    category: str
    price: str
    material: str
    image: str
    description: str
    specs: dict
    stock: int = 5

class ProductCreate(BaseModel):
    name: str
    category: str
    price: str
    material: str
    image: str
    description: str
    specs: dict
    stock: int = 5

class GalleryItemDb(BaseModel):
    id: str
    src: str
    alt: str
    category: str
    label: str
    productId: Optional[str] = None

class GalleryItemCreate(BaseModel):
    src: str
    alt: str
    category: str
    label: str
    productId: Optional[str] = None

class TrackVisitRequest(BaseModel):
    path: str

class EnquiryStatusUpdate(BaseModel):
    status: str

class AppointmentCreate(BaseModel):
    name: str
    phone: str
    date: str
    time: str
    notes: Optional[str] = None

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
        owner_email = os.environ.get('BUSINESS_OWNER_EMAIL', 'riteshsharma9930@gmail.com')
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
              <p><strong>V.K. Furniture Team</strong><br/>Naik Nagar, Dharavi, Mumbai<br/>Contact: +91 99306 68406</p>
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
        owner_email = os.environ.get('BUSINESS_OWNER_EMAIL', 'riteshsharma9930@gmail.com')
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

# ── Dynamic Products Public/Admin Routes ──────────────────────────────────────
@api_router.get("/products", response_model=List[ProductDb])
async def get_products():
    cursor = db.products.find({})
    results = await cursor.to_list(length=100)
    # Map _id object if it's there
    for r in results:
        if "_id" in r:
            del r["_id"]
    return results

@api_router.get("/products/{pid}", response_model=ProductDb)
async def get_product(pid: str):
    p = await db.products.find_one({"id": pid})
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    if "_id" in p:
        del p["_id"]
    return p

@api_router.post("/products", response_model=ProductDb, status_code=201)
async def create_product(payload: ProductCreate):
    pid = payload.name.lower().replace(" ", "-")
    # check collision
    collision = await db.products.find_one({"id": pid})
    if collision:
        pid = f"{pid}-{str(uuid.uuid4())[:4]}"
    
    product_dict = payload.model_dump()
    product_dict["id"] = pid
    await db.products.insert_one(product_dict)
    
    if "_id" in product_dict:
        del product_dict["_id"]
    return product_dict

@api_router.put("/products/{pid}", response_model=ProductDb)
async def update_product(pid: str, payload: ProductCreate):
    p = await db.products.find_one({"id": pid})
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = payload.model_dump()
    await db.products.update_one({"id": pid}, {"$set": update_data})
    
    update_data["id"] = pid
    return update_data

@api_router.delete("/products/{pid}")
async def delete_product(pid: str):
    res = await db.products.delete_one({"id": pid})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

# ── Dynamic Gallery Public/Admin Routes ────────────────────────────────────────
@api_router.get("/gallery", response_model=List[GalleryItemDb])
async def get_gallery():
    cursor = db.gallery.find({})
    results = await cursor.to_list(length=100)
    for r in results:
        if "_id" in r:
            del r["_id"]
    return results

@api_router.post("/gallery", response_model=GalleryItemDb, status_code=201)
async def create_gallery_item(payload: GalleryItemCreate):
    gid = f"g-{str(uuid.uuid4())[:8]}"
    item_dict = payload.model_dump()
    item_dict["id"] = gid
    await db.gallery.insert_one(item_dict)
    
    if "_id" in item_dict:
        del item_dict["_id"]
    return item_dict

@api_router.delete("/gallery/{gid}")
async def delete_gallery_item(gid: str):
    res = await db.gallery.delete_one({"id": gid})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return {"message": "Gallery item deleted successfully"}

# ── Analytics Traffic Tracker ─────────────────────────────────────────────────
@api_router.post("/analytics/track")
async def track_visit(payload: TrackVisitRequest, request: Request):
    client_ip = get_client_ip(request)
    doc = {
        "path": payload.path,
        "ip": client_ip,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    await db.visits.insert_one(doc)
    return {"status": "tracked"}

# ── Secure Admin Login Endpoint ──────────────────────────────────────────────
@api_router.post("/admin/login")
async def admin_login(payload: AdminLoginRequest):
    admin_user = os.environ.get("ADMIN_USERNAME", "admin")
    admin_pass = os.environ.get("ADMIN_PASSWORD", "admin123")
    
    if payload.username == admin_user and payload.password == admin_pass:
        return {
            "token": "vk-admin-session-token-9988",
            "role": "admin",
            "message": "Login successful"
        }
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials. Please verify username/password."
    )

# ── Dashboard Statistics Pipeline ─────────────────────────────────────────────
@api_router.get("/analytics/stats")
async def get_stats():
    total_views = await db.visits.count_documents({})
    
    # Unique visitors count
    pipeline_ips = [
        {"$group": {"_id": "$ip"}},
        {"$count": "count"}
    ]
    cursor_ips = await db.visits.aggregate(pipeline_ips).to_list(1)
    unique_ips = cursor_ips[0]["count"] if cursor_ips else 0
    
    total_enquiries = await db.enquiries.count_documents({})
    total_custom = await db.custom_orders.count_documents({})
    
    # Views grouped by path
    pipeline_paths = [
        {"$group": {"_id": "$path", "views": {"$sum": 1}}},
        {"$sort": {"views": -1}},
        {"$limit": 5}
    ]
    paths_views = await db.visits.aggregate(pipeline_paths).to_list(5)
    top_pages = [{"path": p["_id"], "views": p["views"]} for p in paths_views]
    
    # Group by status
    pipeline_status = [
        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
    ]
    status_cursor = await db.enquiries.aggregate(pipeline_status).to_list(10)
    enquiry_status = {s["_id"]: s["count"] for s in status_cursor}
    
    return {
        "totalViews": total_views,
        "uniqueVisitors": unique_ips,
        "totalEnquiries": total_enquiries + total_custom,
        "topPages": top_pages,
        "enquiryStatus": enquiry_status
    }

# ── Admin Enquiries CRM Management ───────────────────────────────────────────
@api_router.get("/admin/enquiries")
async def get_all_enquiries():
    enqs = await db.enquiries.find({}).to_list(length=200)
    customs = await db.custom_orders.find({}).to_list(length=200)
    
    # Merge both structures with a helper tag
    all_leads = []
    for e in enqs:
        if "_id" in e: del e["_id"]
        e["type"] = "wholesale"
        all_leads.append(e)
        
    for c in customs:
        if "_id" in c: del c["_id"]
        c["type"] = "custom"
        c["subject"] = f"Custom {c['category']} Design"
        c["message"] = f"Dimensions: {c['dimensions']} | Polish: {c['wood_finish']} | Fabric: {c.get('fabric', 'N/A')} | Notes: {c.get('notes', '')}"
        c["date"] = c["timestamp"]
        c["ip"] = "N/A"
        c["status"] = c.get("status", "pending")
        all_leads.append(c)
        
    # Sort descending by date
    all_leads.sort(key=lambda x: x.get("date") or x.get("timestamp"), reverse=True)
    return all_leads

@api_router.put("/admin/enquiries/{eid}")
async def update_enquiry_status(eid: str, payload: EnquiryStatusUpdate):
    # Try updating standard enquiries first
    res = await db.enquiries.update_one({"id": eid}, {"$set": {"status": payload.status}})
    if res.matched_count == 0:
        # Try custom orders second
        res_custom = await db.custom_orders.update_one({"id": eid}, {"$set": {"status": payload.status}})
        if res_custom.matched_count == 0:
            raise HTTPException(status_code=404, detail="Lead not found")
            
    return {"message": "Status updated successfully"}

@api_router.delete("/admin/enquiries/{eid}")
async def delete_enquiry(eid: str):
    res = await db.enquiries.delete_one({"id": eid})
    if res.deleted_count == 0:
        res_custom = await db.custom_orders.delete_one({"id": eid})
        if res_custom.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Lead not found")
            
    return {"message": "Lead deleted successfully"}

# ── CRM Customers Aggregate List ─────────────────────────────────────────────
@api_router.get("/admin/customers")
async def get_customers():
    enquiries = await db.enquiries.find({}).to_list(1000)
    customs = await db.custom_orders.find({}).to_list(1000)
    
    customers = {}
    for e in enquiries:
        phone = e.get("phone")
        if not phone: continue
        if phone not in customers:
            customers[phone] = {
                "name": e.get("name"),
                "phone": phone,
                "email": e.get("email", "") or "N/A",
                "requestsCount": 0,
                "lastActive": e.get("date") or e.get("timestamp")
            }
        customers[phone]["requestsCount"] += 1
        active_time = e.get("date") or e.get("timestamp")
        if active_time > customers[phone]["lastActive"]:
            customers[phone]["lastActive"] = active_time

    for c in customs:
        phone = c.get("phone")
        if not phone: continue
        if phone not in customers:
            customers[phone] = {
                "name": c.get("name"),
                "phone": phone,
                "email": "N/A",
                "requestsCount": 0,
                "lastActive": c.get("timestamp")
            }
        customers[phone]["requestsCount"] += 1
        active_time = c.get("timestamp")
        if active_time > customers[phone]["lastActive"]:
            customers[phone]["lastActive"] = active_time

    return list(customers.values())

# ── Appointment Booking & Order Tracking Endpoints ────────────────────────────
@api_router.post("/appointments", status_code=201)
async def create_appointment(payload: AppointmentCreate):
    doc = payload.model_dump()
    aid = f"APT-{str(uuid.uuid4())[:8].upper()}"
    doc["id"] = aid
    doc["timestamp"] = datetime.now(timezone.utc).isoformat()
    doc["status"] = "scheduled"
    await db.appointments.insert_one(doc)
    logger.info(f"Appointment booked: {aid} for {payload.name}")
    return {"message": "Appointment scheduled successfully", "id": aid}

@api_router.get("/orders/track")
async def track_order(phone: str):
    order = await db.orders.find_one({"phone": phone})
    if order:
        if "_id" in order: del order["_id"]
        return order
    # Default mock order progression for ease of visual verification
    return {
        "id": f"VK-{str(abs(hash(phone)))[:6].upper()}",
        "phone": phone,
        "name": "Valued Customer",
        "status": "Artisan Carving",
        "step": 3,
        "items": "Teak Wood Sofa Set (Sagwan)",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

# ── Admin Dashboard Appointments List ─────────────────────────────────────────
@api_router.get("/admin/appointments")
async def get_appointments():
    cursor = db.appointments.find({})
    results = await cursor.to_list(length=100)
    for r in results:
        if "_id" in r: del r["_id"]
    return results

@api_router.delete("/admin/appointments/{aid}")
async def delete_appointment(aid: str):
    res = await db.appointments.delete_one({"id": aid})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Appointment slot not found")
    return {"message": "Appointment deleted successfully"}

class ChatMessage(BaseModel):
    message: str
    context: Optional[dict] = None

@api_router.post("/ai/chat")
async def ai_chat(payload: ChatMessage):
    msg = payload.message.lower().strip()
    
    reply = ""
    recommendations = []
    layout = ""
    
    # 1. Budget Recommendation logic
    import re
    budget_match = re.search(r'(?:budget|rs\.?|inr|price|cost|under|around)\s*(\d+[\d,]*)\b', msg)
    if budget_match:
        budget_str = budget_match.group(1).replace(",", "")
        try:
            budget_val = int(budget_str)
            cursor = db.products.find({})
            all_prods = await cursor.to_list(100)
            
            approx_prices = {
                "handcrafted-teak-sofa": 45000,
                "l-shape-sectional-sofa": 65000,
                "modern-sofa-cum-bed": 38000,
                "handcrafted-teak-dining-set": 48000,
                "royal-hydraulic-bed": 55000,
                "vintage-carved-bed": 60000,
                "upholstered-accent-armchair": 18000
            }
            
            recs = []
            for p in all_prods:
                pid = p["id"]
                price = approx_prices.get(pid, 25000)
                if price <= budget_val:
                    recs.append({
                        "id": pid,
                        "name": p["name"],
                        "category": p["category"],
                        "price": p["price"],
                        "image": p["image"]
                    })
            
            if recs:
                recommendations = recs[:3]
                reply = f"Based on your budget of ₹{budget_val:,}, here are some recommended direct-factory rate options that fit perfectly. We can also customize dimensions to adjust costs further!"
            else:
                reply = f"With a budget of ₹{budget_val:,}, we recommend accent chairs or custom stools. We can also manufacture compact customized versions of our Royal Sofas to fit your budget. Please contact us directly!"
        except ValueError:
            pass

    # 2. Room Planner Layout logic
    if not reply and any(k in msg for k in ["room", "size", "layout", "dimension", "space", "plan"]):
        reply = "For smaller rooms (e.g. 10x12 ft), we recommend placing a 3-seater Teak Sofa along the main wall and pairing it with a glass-top coffee table. For larger halls (12x18 ft), our L-Shape Teak Sectional Sofa creates a premium divider effect, leaving plenty of walking space."
        layout = "Hall Layout: [Sofa along 12ft wall] <--> [Coffee Table (3ft gap)] <--> [TV Unit opposite]"
    
    # 3. FAQ logic
    if not reply and any(k in msg for k in ["delivery", "ship", "time", "lead"]):
        reply = "We offer direct door-to-door delivery across Mumbai. Custom fabrications take between 10 to 18 days depending on the carving complexity."
    elif not reply and any(k in msg for k in ["where", "location", "address", "showroom", "dharavi"]):
        reply = "Our showroom and workshop are located in Naik Nagar, Lal Bahadur Shastri Marg, Dharavi, Mumbai, Maharashtra 400070. You are welcome to visit anytime between 10:00 AM and 8:30 PM."
    elif not reply and any(k in msg for k in ["wood", "teak", "sagwan", "quality"]):
        reply = "V.K. Furniture builds exclusively with fully seasoned A-Grade Teak Wood (Sagwan). Seasoned wood ensures zero wrapping, warping, or cracking over decades of usage."
    elif not reply and any(k in msg for k in ["price", "cost", "wholesale"]):
        reply = "As manufacturers, we sell directly to customers at factory prices, eliminating dealer markups of 30-40%. Let me know what category you want to estimate!"
        
    # 4. Fallback conversational reply
    if not reply:
        reply = "Hello! I am your V.K. Furniture AI Assistant. Ask me about custom wood choices, calculate estimations, plan layout sizes, or track active orders!"
        
    return {
        "reply": reply,
        "recommendations": recommendations,
        "layout": layout
    }

class OrderCreate(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None
    address: str
    city: str
    pincode: str
    items: List[dict]
    subtotal: float
    shipping: float
    discount: float
    total: float
    coupon: Optional[str] = None

@api_router.post("/orders", status_code=201)
async def create_order(payload: OrderCreate):
    oid = f"VK-ORD-{str(uuid.uuid4())[:8].upper()}"
    doc = payload.model_dump()
    doc["id"] = oid
    doc["timestamp"] = datetime.now(timezone.utc).isoformat()
    doc["status"] = "Order Received"
    doc["step"] = 1
    doc["payment_status"] = "Paid" # Simulatively verified
    
    await db.orders.insert_one(doc)
    logger.info(f"Order created: {oid} for {payload.name}")
    
    # Optional SMTP alerts to buyer
    if payload.email:
        order_details_html = "".join([
            f"<li>{item['name']} x {item['quantity']} - ₹{item['price']}</li>"
            for item in payload.items
        ])
        body = f"""
        <div style="font-family:sans-serif;color:#2C241B;background:#F9F6F0;padding:24px;border:1px solid #E5E0D8;">
          <h2 style="font-family:serif;color:#4A3525;">V.K. Furniture Showroom Order Confirmation</h2>
          <p>Dear {payload.name},</p>
          <p>Thank you for shopping with us! We have received your payment and registered your order <strong>{oid}</strong>.</p>
          <hr style="border:none;border-top:1px dashed #E5E0D8;margin:16px 0;"/>
          <h4>Items Ordered:</h4>
          <ul>{order_details_html}</ul>
          <p><strong>Total Amount Paid:</strong> ₹{payload.total:,.2f}</p>
          <p><strong>Shipping Address:</strong> {payload.address}, {payload.city} - {payload.pincode}</p>
          <p>Our workshop team in Dharavi is selecting the seasoned Sagwan timber blocks. You can track your order using your contact phone number on our website!</p>
          <br/>
          <p>Best Regards,</p>
          <p><strong>V.K. Furniture Team</strong><br/>Naik Nagar, Dharavi, Mumbai</p>
        </div>
        """
        send_email_notification(payload.email, f"Order Confirmed: {oid} - V.K. Furniture", body)
        
    return doc

# ── Admin Dashboard Orders list ───────────────────────────────────────────────
@api_router.get("/admin/orders")
async def get_orders():
    cursor = db.orders.find({})
    results = await cursor.to_list(length=100)
    for r in results:
        if "_id" in r: del r["_id"]
    return results

class OrderStepUpdate(BaseModel):
    status: str
    step: int

@api_router.put("/admin/orders/{oid}")
async def update_order_step(oid: str, payload: OrderStepUpdate):
    res = await db.orders.update_one(
        {"id": oid}, 
        {"$set": {"status": payload.status, "step": payload.step}}
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order tracking status updated successfully"}

@api_router.delete("/admin/orders/{oid}")
async def delete_order(oid: str):
    res = await db.orders.delete_one({"id": oid})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order removed successfully"}

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
