'use client';
import LeftBarregistros from '@/componente/LeftBarRegistros'; // ajusta la ruta si es necesario
import './contabilidad.css';

export default function registrosPage() {
  return (
    <div className="contabilidad-layout">
      <LeftBarregistros />
      <section className="contenido">
        <h1>Registros</h1>
      </section>
    </div>
  );
}