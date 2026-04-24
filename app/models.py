from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="admin", nullable=False)

class Plant(Base):
    __tablename__ = "plants"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    type = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0)
    ai_score = Column(Float, default=0.0)
    light_requirement = Column(String, nullable=True)
    water_frequency = Column(String, nullable=True)
    temp_min = Column(Integer, nullable=True)
    temp_max = Column(Integer, nullable=True)
    maintenance_level = Column(String, nullable=True)
    growth_rate = Column(String, nullable=True)
    image_url = Column(String, nullable=True)

class Tool(Base):
    __tablename__ = "tools"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0)

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String, nullable=False)
    customer_contact = Column(String, nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String, default="Pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class PhysicalSale(Base):
    __tablename__ = "physical_sales"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, unique=True, index=True, nullable=False)
    total_sale = Column(Float, nullable=False, default=0.0)
    expense = Column(Float, nullable=False, default=0.0)
    net_sale = Column(Float, nullable=False, default=0.0)
    description = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
