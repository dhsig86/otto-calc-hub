import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Em produção (Render), a variável DATABASE_URL aponta para /data/otto_calc.db (Render Disk)
# Em desenvolvimento local, usa SQLite relativo
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./otto_calc.db")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
