'use client';
import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import LeftBar from '@/componente/LeftBar';
import './contabilidad.css';

export default function egresoPage() {
  const [egresos, setEgresos] = useState([
    {
      rut: '12.345.678-9',
      nombre: 'Ana',
      apellido: 'González',
      monto: 50000,
      fecha: '2025-10-01',
      descripcion: 'Compra de materiales para sede',
    },
  ]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoEgreso, setNuevoEgreso] = useState({
    rut: '',
    nombre: '',
    apellido: '',
    monto: '',
    fecha: '',
    descripcion: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoEgreso({ ...nuevoEgreso, [name]: value });
  };

  const agregarEgreso = () => {
    setEgresos([...egresos, { ...nuevoEgreso, monto: parseInt(nuevoEgreso.monto) }]);
    setNuevoEgreso({ rut: '', nombre: '', apellido: '', monto: '', fecha: '', descripcion: '' });
    setModalAbierto(false);
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text('Listado de Egresos', 14, 20);

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

    doc.save('historial_egresos.pdf'); // ✅ Descarga automática
  };

  return (
    <div className="contabilidad-layout">
      <LeftBar />
      <section className="contenido">
        <h1>Historial de Egreso</h1>

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
            Agregar egreso
          </button>
          <button className="btn-exportar" onClick={exportarPDF}>
            Exportar como PDF
          </button>
        </div>

        {modalAbierto && (
          <div className="modal">
            <div className="modal-contenido">
              <h2 className='h2'>Nuevo egreso</h2>
              <input name="rut" placeholder="RUT" value={nuevoEgreso.rut} onChange={handleChange} />
              <input name="nombre" placeholder="Nombre" value={nuevoEgreso.nombre} onChange={handleChange} />
              <input name="apellido" placeholder="Apellido" value={nuevoEgreso.apellido} onChange={handleChange} />
              <input name="monto" placeholder="Monto" type="number" value={nuevoEgreso.monto} onChange={handleChange} />
              <input name="fecha" type="date" value={nuevoEgreso.fecha} onChange={handleChange} />
              <textarea name="descripcion" placeholder="Descripción" value={nuevoEgreso.descripcion} onChange={handleChange} />
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