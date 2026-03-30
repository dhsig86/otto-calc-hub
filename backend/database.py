from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite local database (persistente)
SQLALCHEMY_DATABASE_URL = "sqlite:///./otto_calc.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Gerador de sessão para injeção de dependência nativa do FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
