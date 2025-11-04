'use client';
import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import LeftBar from '@/componente/LeftBar';
import './contabilidad.css';

export default function IngresoPage() {
  const [egresos, setIngresos] = useState([
    {
      rut: '13.345.678-9',
      nombre: 'Jose',
      apellido: 'Hernandez',
      monto: 20000,
      fecha: '2025-09-06',
      descripcion: 'Cuota mensualidad socio',
    },
  ]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoIngreso, setNuevoIngreso] = useState({
    rut: '',
    nombre: '',
    apellido: '',
    monto: '',
    fecha: '',
    descripcion: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoIngreso({ ...nuevoIngreso, [name]: value });
  };

  const agregarEgreso = () => {
    setIngresos([...egresos, { ...nuevoIngreso, monto: parseInt(nuevoIngreso.monto) }]);
    setNuevoIngreso({ rut: '', nombre: '', apellido: '', monto: '', fecha: '', descripcion: '' });
    setModalAbierto(false);
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text('Listado de Ingresos', 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [['RUT', 'Nombre', 'Apellido', 'Monto', 'Fecha', 'Descripción']],
      body: egresos.map((e) => [
        e.rut,
        e.nombre,
        e.apellido,
        `$${e.monto.toLocaleString()}`,
        e.fecha,
        e.descripcion,
      ]),
    });

    doc.save('historial_Ingresos.pdf'); // ✅ Descarga automática
  };

  return (
    <div className="contabilidad-layout">
      <LeftBar />
      <section className="contenido">
        <h1>Historial de Ingresos</h1>

        <table className="tabla-egresos">
          <thead>
            <tr>
              <th>RUT</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {egresos.map((e, index) => (
              <tr key={index}>
                <td>{e.rut}</td>
                <td>{e.nombre}</td>
                <td>{e.apellido}</td>
                <td>${e.monto.toLocaleString()}</td>
                <td>{e.fecha}</td>
                <td>{e.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="botones-finales">
          <button className="btn-agregar" onClick={() => setModalAbierto(true)}>
            Agregar Ingreso
          </button>
          <button className="btn-exportar" onClick={exportarPDF}>
            Exportar como PDF
          </button>
        </div>

        {modalAbierto && (
          <div className="modal">
            <div className="modal-contenido">
              <h2 className='h2'>Nuevo Ingreso</h2>
              <input name="rut" placeholder="RUT" value={nuevoIngreso.rut} onChange={handleChange} />
              <input name="nombre" placeholder="Nombre" value={nuevoIngreso.nombre} onChange={handleChange} />
              <input name="apellido" placeholder="Apellido" value={nuevoIngreso.apellido} onChange={handleChange} />
              <input name="monto" placeholder="Monto" type="number" value={nuevoIngreso.monto} onChange={handleChange} />
              <input name="fecha" type="date" value={nuevoIngreso.fecha} onChange={handleChange} />
              <textarea name="descripcion" placeholder="Descripción" value={nuevoIngreso.descripcion} onChange={handleChange} />
              <div className="modal-botones">
                <button onClick={agregarEgreso}>Guardar</button>
                <button onClick={() => setModalAbierto(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}