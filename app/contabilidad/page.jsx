'use client';

import LeftBar from '@/componente/LeftBar'; // ajusta la ruta si es necesario
import './contabilidad.css';

export default function ContratabilidadPage() {
  return (
    <div className="contabilidad-layout">
      <LeftBar />
      <section className="contenido">
        <h1>Contabilidad</h1>
      </section>
    </div>
  );
}