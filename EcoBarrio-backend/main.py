from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

# Importaciones locales
import models
import schemas
import crud
from database import SessionLocal, engine

# Crear las tablas en la base de datos
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EcoBarrio API",
    description="API para gestionar puntos verdes y sus interacciones (riego y limpieza) en el proyecto EcoBarrio.",
    version="1.0.0"
)

# Configuración de CORS para permitir solicitudes desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En producción pondrás tu dominio, por ahora "*" está bien
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- RUTAS DE PUNTOS VERDES ---

# Ruta para listar los puntos verdes por slug
@app.get("/puntos-verdes/{slug}", response_model=schemas.PuntoVerde)
def listar_punto_por_slug(slug: str, db: Session = Depends(get_db)):
    punto = crud.get_punto_verde_by_slug(db, slug=slug)
    if not punto:
        raise HTTPException(status_code=404, detail="Punto verde no encontrado")
    return punto

# Ruta para listar todos los puntos verdes
@app.get("/puntos-verdes/", response_model=list[schemas.PuntoVerde])
def listar_puntos_verdes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_puntos_verdes(db, skip=skip, limit=limit)

# Ruta para crear un punto nuevo
@app.post("/puntos-verdes/", response_model=schemas.PuntoVerde)
def crear_punto(punto: schemas.PuntoVerdeCreate, db: Session = Depends(get_db)):
    return crud.create_punto_verde(db=db, punto_verde=punto)

@app.put("/puntos-verdes/{slug}", response_model=schemas.PuntoVerde)
def update_punto_verde(
        slug: str, 
        punto: schemas.PuntoVerdeUpdate, # <--- Ahora este nombre sí existirá
        db: Session = Depends(get_db)
    ):
    punto_db = crud.get_punto_verde_by_slug(db, slug=slug)
    if not punto_db:
        raise HTTPException(status_code=404, detail="Punto verde no encontrado")
    
    return crud.update_punto_verde(db=db, punto=punto_db, punto_actualizado=punto)
# --- RUTAS DE INTERACCIONES ---

# Ruta para registrar un riego o limpieza
@app.post("/interacciones/", response_model=schemas.Interaccion)
def crear_interaccion(interaccion: schemas.InteraccionCreate, db: Session = Depends(get_db)):
    return crud.create_interaccion(db=db, interaccion=interaccion)

# Ruta para eliminar un punto verde
@app.delete("/puntos-verdes/{slug}")
def eliminar_punto(slug: str, db: Session = Depends(get_db)):
    punto = crud.get_punto_verde_by_slug(db, slug=slug)
    if not punto:
        raise HTTPException(status_code=404, detail="Punto verde no encontrado")
    db.delete(punto)
    db.commit()
    return {"mensaje": f"Punto verde {slug} está eliminado"}