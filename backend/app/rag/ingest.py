from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.restaurant import Restaurant
from app.rag.vector_store import vector_store


def build_restaurant_document(restaurant: Restaurant) -> str:
    return f"""
Restaurant: {restaurant.name}
Location: {restaurant.location}
Cuisine: {restaurant.cuisine}
Rating: {restaurant.rating}/5
Price Range: {restaurant.price_range}
Available Tables: {restaurant.available_tables}
""".strip()


def ingest_restaurants():
    db: Session = SessionLocal()

    try:
        restaurants = db.query(Restaurant).all()

        if not restaurants:
            print("No restaurants found in the database.")
            return

        documents = []
        ids = []
        metadatas = []

        for restaurant in restaurants:
            documents.append(
                build_restaurant_document(restaurant)
            )

            ids.append(
                f"restaurant_{restaurant.id}"
            )

            metadatas.append({
                "restaurant_id": restaurant.id,
                "name": restaurant.name,
                "location": restaurant.location,
                "cuisine": restaurant.cuisine,
                "rating": restaurant.rating,
                "price_range": restaurant.price_range,
            })

        vector_store.add_texts(
            texts=documents,
            metadatas=metadatas,
            ids=ids,
        )

        print(
            f"Successfully ingested "
            f"{len(restaurants)} restaurants into ChromaDB."
        )

    finally:
        db.close()


if __name__ == "__main__":
    ingest_restaurants()