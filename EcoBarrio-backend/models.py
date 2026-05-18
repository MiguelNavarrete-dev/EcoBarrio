from sqlalchemy.orm import relationship
from sqlalchemy import Column, DateTime, Float, Integer, String, ForeignKey
from database import Base
from datetime import datetime, timezone


class PuntoVerde(Base):
    __tablename__ = "puntos_verdes"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(35), index=True)
    slug = Column(String(100), index=True)
    latitud = Column(Float, index=True)
    longitud = Column(Float, index=True)
    comuna = Column(String(50), index=True)
    nivel_resistencia = Column(Integer, index=True)
    foto_referencia = Column(String(255), index=True)
    interacciones = relationship("Interaccion", back_populates="punto")

class Interaccion(Base):
    __tablename__ = "interacciones"
    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String(20), index=True)
    latitud_usuario = Column(Float, index=True)
    longitud_usuario = Column(Float, index=True)
    fecha_hora = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    texto = Column(String(255), nullable=True, index=True)
    punto_id = Column(Integer, ForeignKey("puntos_verdes.id"))
    
    punto = relationship("PuntoVerde", back_populates="interacciones")