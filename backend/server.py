from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter, HTTPException, status
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'vk_furniture')

client = None
db = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global client, db
    logger.info("Connecting to MongoDB …")
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    logger.info(f"Connected to MongoDB database: {db_name}")
    yield
    logger.info("Closing MongoDB connection …")
    client.close()

app = FastAPI(title="V.K. Furniture Backend API", lifespan=lifespan)
api_router = APIRouter(prefix="/api")

# ── Models for General Enquiries ──────────────────────────────────────────────
class Enquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: Optional[str] = None
    product_interest: Optional[str] = None
    message: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EnquiryCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    product_interest: Optional[str] = None
    message: str

# ── Models for Custom Design Configurations ───────────────────────────────────
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
    name: str
    phone: str
    category: str
    dimensions: str
    wood_finish: str
    cushion_density: Optional[str] = None
    fabric: Optional[str] = None
    notes: Optional[str] = None

# ── Endpoints ─────────────────────────────────────────────────────────────────
@api_router.get("/")
async def root():
    return {"message": "Welcome to V.K. Furniture API", "status": "running"}

# Enquiry Endpoints
@api_router.post("/enquiries", response_model=Enquiry, status_code=status.HTTP_201_CREATED)
async def create_enquiry(payload: EnquiryCreate):
    try:
        enquiry_obj = Enquiry(**payload.model_dump())
        doc = enquiry_obj.model_dump()
        doc["timestamp"] = doc["timestamp"].isoformat()
        await db.enquiries.insert_one(doc)
        logger.info(f"Enquiry saved: {enquiry_obj.id} from {enquiry_obj.name}")
        return enquiry_obj
    except Exception as exc:
        logger.error(f"Error creating enquiry: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save enquiry."
        )

@api_router.get("/enquiries", response_model=List[Enquiry])
async def get_enquiries():
    try:
        docs = await db.enquiries.find({}, {"_id": 0}).sort("timestamp", -1).to_list(1000)
        for doc in docs:
            if isinstance(doc.get("timestamp"), str):
                doc["timestamp"] = datetime.fromisoformat(doc["timestamp"])
        return docs
    except Exception as exc:
        logger.error(f"Error listing enquiries: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch enquiries."
        )

# Custom Order Endpoints
@api_router.post("/custom-orders", response_model=CustomOrder, status_code=status.HTTP_201_CREATED)
async def create_custom_order(payload: CustomOrderCreate):
    try:
        order_obj = CustomOrder(**payload.model_dump())
        doc = order_obj.model_dump()
        doc["timestamp"] = doc["timestamp"].isoformat()
        await db.custom_orders.insert_one(doc)
        logger.info(f"Custom order saved: {order_obj.id} from {order_obj.name}")
        return order_obj
    except Exception as exc:
        logger.error(f"Error saving custom order: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save custom order."
        )

@api_router.get("/custom-orders", response_model=List[CustomOrder])
async def get_custom_orders():
    try:
        docs = await db.custom_orders.find({}, {"_id": 0}).sort("timestamp", -1).to_list(1000)
        for doc in docs:
            if isinstance(doc.get("timestamp"), str):
                doc["timestamp"] = datetime.fromisoformat(doc["timestamp"])
        return docs
    except Exception as exc:
        logger.error(f"Error fetching custom orders: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch custom orders."
        )

app.include_router(api_router)

# CORS
cors_origins_str = os.environ.get("CORS_ORIGINS", "*")
origins = ["*"] if cors_origins_str == "*" else cors_origins_str.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
