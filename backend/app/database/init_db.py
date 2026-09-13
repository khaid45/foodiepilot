from app.database.database import Base, engine

# Import all models here
from app.models.restaurant import Restaurant


def init_db():
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")


if __name__ == "__main__":
    init_db()