import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# Get the URL from environment variables
DATABASE_URL = os.getenv("DATABASE_URL")

# FIX: SQLAlchemy requires 'postgresql://', but some providers give 'postgres://'
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Check if DATABASE_URL exists to prevent crashing if it's missing
if not DATABASE_URL:
    raise ValueError("No DATABASE_URL found in environment variables!")

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()