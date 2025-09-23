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
# --- Endpoints para Contabilidad ---
@app.get("/contabilidad/")
def Obtener_contabilidad():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("SELECT Rut, Monto, Tipo, Fecha, Descripcion FROM Contabilidad")
    rows = cursor.fetchall()
    conn.close()
    return [
        {"Rut": r[0], "Monto": r[1], "Tipo": r[2], "Fecha": r[3], "Descripcion": r[4]}
        for r in rows
    ]

@app.post("/contabilidad/")
def Agregar_contabilidad(item: ContabilidadIn):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO Contabilidad (Rut, Monto, Tipo, Fecha, Descripcion) VALUES (?, ?, ?, ?, ?)",
        (item.Rut, item.Monto, item.Tipo, item.Fecha, item.Descripcion)
    )
    conn.commit()
    conn.close()
    return item

# --- Endpoints para Dirigente ---
@app.get("/dirigente/")
def Obtener_dirigente():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("SELECT Clave, Rut FROM Dirigente")
    rows = cursor.fetchall()
    conn.close()
    return [
        {"Clave": r[0], "Rut": r[1]}
        for r in rows
    ]

@app.post("/dirigente/")
def Agregar_dirigente(item: DirigenteIn):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO Dirigente (Clave, Rut) VALUES (?, ?)",
        (item.Clave, item.Rut)
    )
    conn.commit()
    conn.close()
    return item

# --- Endpoints para Invitado ---
@app.get("/invitado/")
def Obtener_invitado():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("SELECT Rut, Num_Solicitud FROM Invitado")
    rows = cursor.fetchall()
    conn.close()
    return [
        {"Rut": r[0], "Num_Solicitud": r[1]}
        for r in rows
    ]

@app.post("/invitado/")
def Agregar_invitado(item: InvitadoIn):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO Invitado (Rut, Num_Solicitud) VALUES (?, ?)",
        (item.Rut, item.Num_Solicitud)
    )
    conn.commit()
    conn.close()
    return item

# --- Endpoints para Vecino ---
@app.get("/vecino/")
def Obtener_vecino():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("""SELECT Rut, Primer_Nombre, Segundo_Nombre, Primer_Apellido, Segundo_Apellido, Sexo, Pasaje, Poblacion, Telefono, Socio, Num_Casa FROM Vecino""")
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "Rut": r[0], "Primer_Nombre": r[1], "Segundo_Nombre": r[2], "Primer_Apellido": r[3],
            "Segundo_Apellido": r[4], "Sexo": r[5], "Pasaje": r[6], "Poblacion": r[7],
            "Telefono": r[8], "Socio": r[9], "Num_Casa": r[10]
        }
        for r in rows
    ]

@app.post("/vecino/")
def Agregar_vecino(item: VecinoIn):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute(
        """INSERT INTO Vecino (Rut, Primer_Nombre, Segundo_Nombre, Primer_Apellido, Segundo_Apellido, Sexo, Pasaje, Poblacion, Telefono, Socio, Num_Casa)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            item.Rut, item.Primer_Nombre, item.Segundo_Nombre, item.Primer_Apellido,
            item.Segundo_Apellido, item.Sexo, item.Pasaje, item.Poblacion,
            item.Telefono, item.Socio, item.Num_Casa
        )
    )
    conn.commit()
    conn.close()
    return item