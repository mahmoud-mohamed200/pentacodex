import os
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGO_DB_NAME", "pentacodex")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Collections
inquiries_collection = db["inquiries"]
bookings_collection = db["bookings"]

def get_mongo_db():
    return db
