from langchain_chroma import Chroma

from app.rag.embeddings import embeddings


CHROMA_PATH = "./chroma_db"

vector_store = Chroma(
    collection_name="restaurants",
    embedding_function=embeddings,
    persist_directory=CHROMA_PATH,
)