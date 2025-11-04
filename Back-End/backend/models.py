from pydantic import BaseModel

class ContabilidadIn(BaseModel):
    Rut: str
    Monto: int
    Tipo: int
    Fecha: str
    Descripcion: str | None = None

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
    estado_solicitud: int
