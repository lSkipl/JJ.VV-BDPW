from fastapi import FastAPI
from routers import vecino, dirigente, alter

app = FastAPI(title="Backend Junta de Vecinos")

# Incluir los routers (rutas)
app.include_router(vecino.router)
app.include_router(dirigente.router)
app.include_router(alter.router)
