import os
from dotenv import load_dotenv
from sqlalchemy import create_engine 
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()
# conectarse a la base de datos, si no se encuentra la variable de entorno, se usará sqlite
URL_DATABASE = os.getenv("URL_DATABASE", "sqlite:///./ecobarrio.db")

# Crear el motor de la base de datos, la base declarativa y la sesión local
engine = create_engine(URL_DATABASE, connect_args={"check_same_thread": False})
Base = declarative_base()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

