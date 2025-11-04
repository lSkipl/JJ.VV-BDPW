import LeftBarregistros from '@/componente/LeftBarRegistros'; // ajusta la ruta si es necesario
import './contabilidad.css';
export default function editarDirigentePage() {
  return (
      <div className="contabilidad-layout">
        <LeftBarregistros />
        <section className="contenido">
          <h1>Pagina de Ingreso</h1>
        </section>
      </div>
    );
}