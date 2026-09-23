from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.restaurant import Restaurant
from app.rag.vector_store import add_restaurant_embeddings


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
        restaurant_ids = []
        metadatas = []

        for restaurant in restaurants:
            documents.append(
                build_restaurant_document(restaurant)
            )

            ids.append(
                f"restaurant_{restaurant.id}"
            )

            restaurant_ids.append(
                restaurant.id
            )

            metadatas.append({
                "restaurant_id": restaurant.id,
                "name": restaurant.name,
                "location": restaurant.location,
                "cuisine": restaurant.cuisine,
                "rating": restaurant.rating,
                "price_range": restaurant.price_range,
            })

        add_restaurant_embeddings(
            ids=ids,
            restaurant_ids=restaurant_ids,
            texts=documents,
            metadatas=metadatas,
        )

        print(
            f"Successfully ingested "
            f"{len(restaurants)} restaurants into PostgreSQL pgvector."
        )

    finally:
        db.close()


if __name__ == "__main__":
    ingest_restaurants()