from fastapi import APIRouter
from database import get_connection

router = APIRouter(prefix="/dirigente", tags=["Dirigente"])

@router.delete("/")
def eliminar_tabla_dirigente():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DROP TABLE Dirigente")
    conn.commit()
    conn.close()
    return {"mensaje": "Tabla Dirigente eliminada."}
