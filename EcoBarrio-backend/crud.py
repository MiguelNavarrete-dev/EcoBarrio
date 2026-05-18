from sqlalchemy.orm import Session
import schemas
from models import PuntoVerde, Interaccion

# Buscar por slug
def get_punto_verde_by_slug(db: Session, slug: str):
    return db.query(PuntoVerde).filter(PuntoVerde.slug == slug).first()

# Actualizar un punto verde
def update_punto_verde(db: Session, punto: PuntoVerde, punto_actualizado: schemas.PuntoVerdeUpdate):
    update_data = punto_actualizado.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(punto, key, value)
    db.commit()
    db.refresh(punto)
    return punto

# consultar todos los puntos verdes
def get_puntos_verdes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(PuntoVerde).offset(skip).limit(limit).all()

#Crear un nuevo punto verde
def create_punto_verde(db: Session, punto_verde: schemas.PuntoVerdeCreate):
    db_punto_verde = PuntoVerde(**punto_verde.model_dump())
    db.add(db_punto_verde)
    db.commit()
    db.refresh(db_punto_verde)
    return db_punto_verde

# Crear una nueva interacción (riego o limpieza)
def create_interaccion(db: Session, interaccion: schemas.InteraccionCreate):
    db_interaccion = Interaccion(**interaccion.model_dump())
    db.add(db_interaccion)
    db.commit()
    db.refresh(db_interaccion)
    return db_interaccion