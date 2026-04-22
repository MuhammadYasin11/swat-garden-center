import os
from app.database import engine
from app import models
from dotenv import load_dotenv

def main():
    load_dotenv()
    print("Dropping old database tables...")
    models.Base.metadata.drop_all(bind=engine)
    print("Creating new database tables...")
    models.Base.metadata.create_all(bind=engine)
    print("Database reset successfully.")

if __name__ == "__main__":
    main()
