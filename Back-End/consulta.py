import sqlite3

conn = sqlite3.connect("jj.vv.sqlite")
cursor = conn.cursor()
cursor.execute("SELECT * FROM Vecino")  # Cambia la consulta si lo deseas
rows = cursor.fetchall()
conn.close()

for row in rows:
    print(row)