from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class PuntoVerdeBase(BaseModel):
    nombre: str
    slug: str
    latitud: float
    longitud: float
    comuna: str
    nivel_resistencia: int
    foto_referencia: Optional[str] = None # Optional por si no hay foto aún

class PuntoVerdeUpdate(BaseModel):
    nombre: Optional[str] = None
    slug: Optional[str] = None
    latitud: Optional[float] = None
    longitud: Optional[float] = None
    comuna: Optional[str] = None
    nivel_resistencia: Optional[int] = None
    foto_referencia: Optional[str] = None

class PuntoVerdeCreate(PuntoVerdeBase):
    pass

class PuntoVerde(PuntoVerdeBase):
    id: int

    # Relación con Interaccion: un Punto Verde puede tener muchas Interacciones
    interacciones: List['Interaccion'] = [] # Relación con Interaccion

    model_config = ConfigDict(from_attributes=True)

class InteraccionBase(BaseModel):
    punto_verde_id: int
    tipo: str
    texto: Optional[str] = None
    latitud_usuario: float
    longitud_usuario: float

class InteraccionCreate(InteraccionBase):
    pass

class Interaccion(InteraccionBase):
    id: int

    model_config = ConfigDict(from_attributes=True)