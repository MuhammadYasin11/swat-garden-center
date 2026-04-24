import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

def upgrade_database():
    load_dotenv()
    DATABASE_URL = os.getenv("DATABASE_URL", "")    
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as conn:
        print("🚀 Starting NEON Production Database Upgrade...")
        
        # PostgreSQL migration block
        try:
            conn.execute(text("ALTER TABLE physical_sales RENAME COLUMN amount TO total_sale;"))
            print("✅ Renamed amount -> total_sale")
        except Exception as e:
            print(f"ℹ️ Skipping rename: Column may already be renamed.")

        try:
            # Postgres supports 'IF NOT EXISTS' for columns in recent versions, 
            # but standard ALTER is safer with a try/except block
            conn.execute(text("ALTER TABLE physical_sales ADD COLUMN date VARCHAR;"))
            print("✅ Added date column")
        except Exception as e:
            print(f"ℹ️ Skipping add date: Column likely exists.")
            
        try:
            conn.execute(text("ALTER TABLE physical_sales ADD COLUMN expense FLOAT NOT NULL DEFAULT 0.0;"))
            print("✅ Added expense column")
        except Exception as e:
            print(f"ℹ️ Skipping add expense: Column likely exists.")
            
        try:
            conn.execute(text("ALTER TABLE physical_sales ADD COLUMN net_sale FLOAT NOT NULL DEFAULT 0.0;"))
            print("✅ Added net_sale column")
        except Exception as e:
            print(f"ℹ️ Skipping add net_sale: Column likely exists.")
            
        try:
            # Populate existing data using Postgres-specific TO_CHAR
            conn.execute(text("UPDATE physical_sales SET date = TO_CHAR(created_at, 'YYYY-MM-DD') WHERE date IS NULL;"))
            conn.execute(text("UPDATE physical_sales SET net_sale = total_sale WHERE net_sale = 0.0;"))
            print("✅ Populated new columns with existing data.")
        except Exception as e:
            print(f"❌ Error populating data: {e}")
            
        try:
            # Add unique constraint to date (Postgres syntax)
            conn.execute(text("ALTER TABLE physical_sales ADD CONSTRAINT unique_date UNIQUE (date);"))
            print("✅ Added unique constraint on date.")
        except Exception as e:
            print(f"ℹ️ Skipping unique constraint: Likely already exists.")

        conn.commit()
        print("\n✨ PRODUCTION DATABASE UPGRADE COMPLETE! ✨")

if __name__ == "__main__":
    upgrade_database()