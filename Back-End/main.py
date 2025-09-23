import sqlite3
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()
DATABASE = "jj.vv.sqlite"

# --- Modelos Pydantic para cada tabla ---
class ContabilidadIn(BaseModel):
    Rut: str
    Monto: int
    Tipo: int
    Fecha: str
    Descripcion: str = None  # Agregado

class DirigenteIn(BaseModel):
    Clave: str
    Rut: str

class InvitadoIn(BaseModel):
    Rut: str
    Num_Solicitud: int

class VecinoIn(BaseModel):
    Rut: str
    Primer_Nombre: str
    Segundo_Nombre: str
    Primer_Apellido: str
    Segundo_Apellido: str
    Sexo: str
    Pasaje: str
    Poblacion: str
    Telefono: int
    Socio: int
    Num_Casa: int
    estado_solicitud: int # Agregado
# --- Endpoints para Dirigente ---
@app.delete("/dirigente/")
def Eliminar_Tabla_Dirigente():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("DROP TABLE Dirigente")
    conn.commit()
    conn.close()
    return {"mensaje": "Tabla Dirigente eliminada."}
    
# --- Endpoints para Vecino ---
@app.get("/vecino/")
def Obtener_vecino_Apellido(apellido: str):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Vecino WHERE Primer_Apellido = ?", (apellido,))
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "Rut": r[0], "Primer_Nombre": r[1], "Segundo_Nombre": r[2], "Primer_Apellido": r[3],
            "Segundo_Apellido": r[4], "Sexo": r[5], "Pasaje": r[6], "Poblacion": r[7],
            "Telefono": r[8], "Socio": r[9], "Num_Casa": r[10], "Estado_Solicitud": r[11]
        }
        for r in rows
    ]
@app.get("/vecino/Join-contabilidad/")
def Obtener_Vecino_Egreso(TIPO: str, MONTO: int):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT 
            Vecino.rut, Vecino.Primer_Nombre, Vecino.Segundo_Nombre, Vecino.Primer_Apellido,
            Vecino.Segundo_Apellido, Vecino.Sexo, Vecino.Pasaje, Vecino.Poblacion,
            Vecino.Telefono, Vecino.Socio, Vecino.Num_Casa, Vecino.Estado_Solicitud,
            Contabilidad.Monto, Contabilidad.Tipo, Contabilidad.Fecha, Contabilidad.Descripcion
        FROM Vecino
        INNER JOIN Contabilidad ON Vecino.rut = Contabilidad.Rut
        WHERE Contabilidad.Monto <= ? AND Contabilidad.Tipo = ?
    """, (MONTO, TIPO))
    
    rows = cursor.fetchall()
    conn.close()
    
    return [
        {
            "Rut": r[0], "Primer_Nombre": r[1], "Segundo_Nombre": r[2], "Primer_Apellido": r[3],
            "Segundo_Apellido": r[4], "Sexo": r[5], "Pasaje": r[6], "Poblacion": r[7],
            "Telefono": r[8], "Socio": r[9], "Num_Casa": r[10], "Estado_Solicitud": r[11],
            "Monto": r[12], "Tipo": r[13], "Fecha": r[14], "Descripcion": r[15]
        }
        for r in rows
    ]

@app.get("/vecino/Join-Tipo/")
def Obtener_Vecino_Tipo_Contabilidad(TIPO: str):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT 
            Vecino.rut, Vecino.Primer_Nombre, Vecino.Segundo_Nombre, Vecino.Primer_Apellido,
            Vecino.Segundo_Apellido, Vecino.Sexo, Vecino.Pasaje, Vecino.Poblacion,
            Vecino.Telefono, Vecino.Socio, Vecino.Num_Casa, Vecino.Estado_Solicitud,
            Contabilidad.Monto, Contabilidad.Tipo, Contabilidad.Fecha, Contabilidad.Descripcion
        FROM Vecino
        INNER JOIN Contabilidad ON Vecino.rut = Contabilidad.Rut
        WHERE Contabilidad.Tipo = ?
    """, (TIPO,))
    
    rows = cursor.fetchall()
    conn.close()
    
    return [
        {
            "Rut": r[0], "Primer_Nombre": r[1], "Segundo_Nombre": r[2], "Primer_Apellido": r[3],
            "Segundo_Apellido": r[4], "Sexo": r[5], "Pasaje": r[6], "Poblacion": r[7],
            "Telefono": r[8], "Socio": r[9], "Num_Casa": r[10], "Estado_Solicitud": r[11],
            "Monto": r[12], "Tipo": r[13], "Fecha": r[14], "Descripcion": r[15]
        }
        for r in rows
    ]
    

@app.put("/alter/agregar-columna")
def Agregar_columna(tabla: str, nombre_columna: str, tipo_dato: str): #parametros a pedir
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    try:
        sql = f"ALTER TABLE {tabla} ADD COLUMN {nombre_columna} {tipo_dato}"
        cursor.execute(sql)
        conn.commit()
        mensaje = f"Columna '{nombre_columna}' de tipo '{tipo_dato}' agregada a la tabla '{tabla}'."
    except sqlite3.OperationalError as e:
        mensaje = f"Error al agregar la columna: {str(e)}"
    finally:
        conn.close()
    return {"mensaje": mensaje}

@app.put("/alter/Cambiar-nombre-columna")
def Cambiar_nombre_columna(tabla: str, nombre_columna: str, nombre_nuevo: str): #parametros a pedir
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    try:
        sql = f"ALTER TABLE {tabla} RENAME COLUMN {nombre_columna} TO {nombre_nuevo}"
        cursor.execute(sql)
        conn.commit()
        mensaje = f"Haz cambiado correctamente el nombre de la columna '{nombre_columna}' a '{nombre_nuevo}' en la tabla '{tabla}'."
    except sqlite3.OperationalError as e:
        mensaje = f"Error al cambiar el nombre de la columna: {str(e)}"
    finally:
        conn.close()
    return {"mensaje": mensaje}



@app.put("/vecino/{rut}")
def Actualizar_vecino(rut: str, item: VecinoIn):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    # Verificar si el vecino existe
    cursor.execute("SELECT * FROM Vecino WHERE Rut = ?", (rut,))
    existente = cursor.fetchone()
    if not existente:
        conn.close()
        raise HTTPException(status_code=404, detail=f"Vecino con Rut {rut} no encontrado.")

    # Actualizar los datos
    cursor.execute("""
        UPDATE Vecino SET
            Primer_Nombre = ?, Segundo_Nombre = ?, Primer_Apellido = ?, Segundo_Apellido = ?,
            Sexo = ?, Pasaje = ?, Poblacion = ?, Telefono = ?, Socio = ?, Num_Casa = ?, Estado_Solicitud = ?
        WHERE Rut = ?
    """, (
        item.Primer_Nombre, item.Segundo_Nombre, item.Primer_Apellido, item.Segundo_Apellido,
        item.Sexo, item.Pasaje, item.Poblacion, item.Telefono, item.Socio, item.Num_Casa,
        rut, item.estado_solicitud
    ))

    conn.commit()
    conn.close()
    return {"mensaje": f"Vecino con Rut {rut} actualizado correctamente."}

@app.post("/vecino/")
def Agregar_vecino(item: VecinoIn):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute(
        """INSERT INTO Vecino (Rut, Primer_Nombre, Segundo_Nombre, Primer_Apellido, Segundo_Apellido, Sexo, Pasaje, Poblacion, Telefono, Socio, Num_Casa, Estado_Solicitud)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            item.Rut, item.Primer_Nombre, item.Segundo_Nombre, item.Primer_Apellido,
            item.Segundo_Apellido, item.Sexo, item.Pasaje, item.Poblacion,
            item.Telefono, item.Socio, item.Num_Casa, item.estado_solicitud
        )
    )
@app.delete("/vecino/{rut}")
def Eliminar_vecino(rut: str):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM Vecino WHERE Rut = ?", (rut,))
    conn.commit()
    conn.close()
    return {"mensaje": f"Vecino con Rut {rut} eliminado."}

    conn.commit()
    conn.close()
    return item
