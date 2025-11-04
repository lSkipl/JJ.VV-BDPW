from fastapi import APIRouter, HTTPException
from database import get_connection
from models import VecinoIn

router = APIRouter(prefix="/vecino", tags=["Vecino"])

# --- Consultar vecinos por apellido ---
@router.get("/")
def obtener_vecino_apellido(apellido: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Vecino WHERE Primer_Apellido = ?", (apellido,))
    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "Rut": r[0],
            "Primer_Nombre": r[1],
            "Segundo_Nombre": r[2],
            "Primer_Apellido": r[3],
            "Segundo_Apellido": r[4],
            "Sexo": r[5],
            "Pasaje": r[6],
            "Poblacion": r[7],
            "Telefono": r[8],
            "Socio": r[9],
            "Num_Casa": r[10],
            "Estado_Solicitud": r[11],
        }
        for r in rows
    ]


# --- JOIN: Vecino + Contabilidad (por monto y tipo) ---
@router.get("/Join-contabilidad/")
def obtener_vecino_egreso(TIPO: str, MONTO: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT Vecino.rut, Vecino.Primer_Nombre, Vecino.Segundo_Nombre,
               Vecino.Primer_Apellido, Vecino.Segundo_Apellido, Vecino.Sexo,
               Vecino.Pasaje, Vecino.Poblacion, Vecino.Telefono, Vecino.Socio,
               Vecino.Num_Casa, Vecino.Estado_Solicitud,
               Contabilidad.Monto, Contabilidad.Tipo, Contabilidad.Fecha, Contabilidad.Descripcion
        FROM Vecino
        INNER JOIN Contabilidad ON Vecino.rut = Contabilidad.Rut
        WHERE Contabilidad.Monto <= ? AND Contabilidad.Tipo = ?
    """, (MONTO, TIPO))
    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "Rut": r[0],
            "Primer_Nombre": r[1],
            "Segundo_Nombre": r[2],
            "Primer_Apellido": r[3],
            "Segundo_Apellido": r[4],
            "Sexo": r[5],
            "Pasaje": r[6],
            "Poblacion": r[7],
            "Telefono": r[8],
            "Socio": r[9],
            "Num_Casa": r[10],
            "Estado_Solicitud": r[11],
            "Monto": r[12],
            "Tipo": r[13],
            "Fecha": r[14],
            "Descripcion": r[15],
        }
        for r in rows
    ]


# --- JOIN: Vecino + Contabilidad (por tipo) ---
@router.get("/Join-Tipo/")
def obtener_vecino_tipo_contabilidad(TIPO: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT Vecino.rut, Vecino.Primer_Nombre, Vecino.Segundo_Nombre,
               Vecino.Primer_Apellido, Vecino.Segundo_Apellido, Vecino.Sexo,
               Vecino.Pasaje, Vecino.Poblacion, Vecino.Telefono, Vecino.Socio,
               Vecino.Num_Casa, Vecino.Estado_Solicitud,
               Contabilidad.Monto, Contabilidad.Tipo, Contabilidad.Fecha, Contabilidad.Descripcion
        FROM Vecino
        INNER JOIN Contabilidad ON Vecino.rut = Contabilidad.Rut
        WHERE Contabilidad.Tipo = ?
    """, (TIPO,))
    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "Rut": r[0],
            "Primer_Nombre": r[1],
            "Segundo_Nombre": r[2],
            "Primer_Apellido": r[3],
            "Segundo_Apellido": r[4],
            "Sexo": r[5],
            "Pasaje": r[6],
            "Poblacion": r[7],
            "Telefono": r[8],
            "Socio": r[9],
            "Num_Casa": r[10],
            "Estado_Solicitud": r[11],
            "Monto": r[12],
            "Tipo": r[13],
            "Fecha": r[14],
            "Descripcion": r[15],
        }
        for r in rows
    ]


# --- CRUD Vecino ---
@router.post("/")
def agregar_vecino(item: VecinoIn):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO Vecino (Rut, Primer_Nombre, Segundo_Nombre, Primer_Apellido,
        Segundo_Apellido, Sexo, Pasaje, Poblacion, Telefono, Socio, Num_Casa, Estado_Solicitud)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        item.Rut, item.Primer_Nombre, item.Segundo_Nombre, item.Primer_Apellido,
        item.Segundo_Apellido, item.Sexo, item.Pasaje, item.Poblacion,
        item.Telefono, item.Socio, item.Num_Casa, item.estado_solicitud
    ))
    conn.commit()
    conn.close()
    return {"mensaje": f"Vecino {item.Primer_Nombre} agregado correctamente."}


@router.put("/{rut}")
def actualizar_vecino(rut: str, item: VecinoIn):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Vecino WHERE Rut = ?", (rut,))
    existente = cursor.fetchone()

    if not existente:
        conn.close()
        raise HTTPException(status_code=404, detail=f"Vecino con Rut {rut} no encontrado.")

    cursor.execute("""
        UPDATE Vecino SET Primer_Nombre=?, Segundo_Nombre=?, Primer_Apellido=?, Segundo_Apellido=?,
        Sexo=?, Pasaje=?, Poblacion=?, Telefono=?, Socio=?, Num_Casa=?, Estado_Solicitud=? WHERE Rut=?
    """, (
        item.Primer_Nombre, item.Segundo_Nombre, item.Primer_Apellido, item.Segundo_Apellido,
        item.Sexo, item.Pasaje, item.Poblacion, item.Telefono, item.Socio, item.Num_Casa,
        item.estado_solicitud, rut
    ))
    conn.commit()
    conn.close()
    return {"mensaje": f"Vecino con Rut {rut} actualizado correctamente."}


@router.delete("/{rut}")
def eliminar_vecino(rut: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM Vecino WHERE Rut = ?", (rut,))
    conn.commit()
    conn.close()
    return {"mensaje": f"Vecino con Rut {rut} eliminado."}
