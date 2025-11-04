'use client';
import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import LeftBar from '@/componente/LeftBar';
import './contabilidad.css';

const ingresos = [
  {
    rut: '12.345.678-9',
    nombre: 'Ana',
    apellido: 'González',
    monto: 80000,
    fecha: '2025-10-10',
    descripcion: 'Pago de cuota mensual',
    tipo: 'Ingreso',
  },
];

const egresos = [
  {
    rut: '12.345.678-9',
    nombre: 'Jose',
    apellido: 'Hernandez',
    monto: 20000,
    fecha: '2025-10-01',
    descripcion: 'Compra de materiales para sede',
    tipo: 'Egreso',
  },
];

export default function datosPage() {
  const [filtro, setFiltro] = useState('');

  const registrosCombinados = [...ingresos, ...egresos].filter((r) => {
    const texto = filtro.toLowerCase();
    return (
      r.rut.toLowerCase().includes(texto) ||
      r.nombre.toLowerCase().includes(texto) ||
      r.apellido.toLowerCase().includes(texto) ||
      r.descripcion.toLowerCase().includes(texto) ||
      r.tipo.toLowerCase().includes(texto) ||
      r.fecha.toLowerCase().includes(texto)
    );
  });

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text('Registro Financiero', 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [['RUT', 'Nombre', 'Apellido', 'Monto', 'Fecha', 'Descripción', 'Tipo']],
      body: registrosCombinados.map((r) => [
        r.rut,
        r.nombre,
        r.apellido,
        `$${r.monto.toLocaleString()}`,
        r.fecha,
        r.descripcion,
        r.tipo,
      ]),
    });

    doc.save('registro_financiero.pdf');
  };

  return (
    <div className="contabilidad-layout">
      <LeftBar />
      <section className="contenido">
        <h1>Visualizar datos financieros</h1>

        <input
          type="text"
          placeholder="Filtrar por cualquier campo..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="filtro-rut"
        />

        <table className="tabla-vecinos">
          <thead>
            <tr>
              <th>RUT</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {registrosCombinados.map((r, index) => (
              <tr key={index}>
                <td>{r.rut}</td>
                <td>{r.nombre}</td>
                <td>{r.apellido}</td>
                <td>${r.monto.toLocaleString()}</td>
                <td>{r.fecha}</td>
                <td>{r.descripcion}</td>
                <td>{r.tipo}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="btn-exportar" onClick={exportarPDF}>
          Exportar como PDF
        </button>
      </section>
    </div>
  );
}