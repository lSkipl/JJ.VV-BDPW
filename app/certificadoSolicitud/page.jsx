'use client';
import { useState } from 'react';
import './certificado.css';

export default function CertificadoSolicitudPage() {
  const [rut, setRut] = useState('');
  const [certificados, setCertificados] = useState([]);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Base de datos ficticia
  const baseDatos = {
    '21.338.841-4': [
      { id: 1, tipo: 'Residencia', estado: 'Aprobado' },
      { id: 2, tipo: 'Propiedad', estado: 'Pendiente' },
    ],
  };

  const buscarCertificados = () => {
    const resultado = baseDatos[rut.trim()];
    if (resultado) {
      setCertificados(resultado);
      setError('');
    } else {
      setCertificados([]);
      setError('No se encontraron certificados para este RUT.');
    }
  };

  const getEstadoClase = (estado) => {
    switch (estado) {
      case 'Aprobado': return 'estado aprobado';
      case 'Pendiente': return 'estado pendiente';
      case 'Rechazado': return 'estado rechazado';
      default: return 'estado';
    }
  };

  return (
    <div className="certificado-container">
      <div className="certificado-card">
        <h1>Consulta de Certificados</h1>

        <input
          type="text"
          placeholder="Ingrese RUT (ej: 21.338.841-4)"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
        />
        <button onClick={buscarCertificados}>Buscar</button>
        <button onClick={() => setModalVisible(true)}>Pedir certificado</button>

        {error && <p className="error">{error}</p>}

        {certificados.length > 0 && (
          <table className="certificado-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {certificados.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.tipo}</td>
                  <td><span className={getEstadoClase(c.estado)}>{c.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Solicitud de Certificado</h2>
            <input type="text" placeholder="RUT" />
            <select>
              <option value="">Seleccione tipo</option>
              <option value="Arrendatario">Arrendatario</option>
              <option value="Dueño de hogar">Dueño de hogar</option>
              <option value="Otro">Otro</option>
            </select>
            <textarea placeholder="Motivo de la solicitud" />
            <button>Enviar</button>
            <button onClick={() => setModalVisible(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}