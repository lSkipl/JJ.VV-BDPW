'use client';

import { useState } from 'react';
import LeftBarregistros from '@/componente/LeftBarRegistros';
import './contabilidad.css';

export default function editarVecinoPage() {
  const [vecinos, setVecinos] = useState([
    {
      rut: '12.345.678-9',
      pasaje: 'Los Álamos',
      numCasa: 101,
      poblacion: 'Villa Esperanza',
      primerNombre: 'Ana',
      segundoNombre: 'María',
      primerApellido: 'González',
      segundoApellido: 'Muñoz',
      telefono: '912345678',
      estadoSocio: true,
      genero: 'F',
      fechaNac: '1991-05-12',
    },
  ]);

  const [rutBusqueda, setRutBusqueda] = useState('');
  const [vecinoEditado, setVecinoEditado] = useState(null);
  const [rutNoExiste, setRutNoExiste] = useState(false);
  const [mensajeGuardado, setMensajeGuardado] = useState('');

  const buscarVecino = () => {
    const encontrado = vecinos.find((v) => v.rut === rutBusqueda);
    if (!encontrado) {
      setVecinoEditado(null);
      setRutNoExiste(true);
      setMensajeGuardado('');
    } else {
      setVecinoEditado({ ...encontrado });
      setRutNoExiste(false);
      setMensajeGuardado('');
    }
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVecinoEditado({
      ...vecinoEditado,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const guardarCambios = () => {
    setVecinos(vecinos.map((v) => (v.rut === vecinoEditado.rut ? vecinoEditado : v)));
    setMensajeGuardado('Cambios guardados correctamente.');
    setTimeout(() => setMensajeGuardado(''), 4000);
  };

  return (
    <div className="contabilidad-layout">
      <LeftBarregistros />
      <section className="contenido">
        <h1>Editar Vecino</h1>

        <div className="formulario-edicion">
          <input
            type="text"
            placeholder="Ingrese RUT"
            value={rutBusqueda}
            onChange={(e) => {
              setRutBusqueda(e.target.value);
              setRutNoExiste(false);
              setMensajeGuardado('');
            }}
            className={rutNoExiste ? 'input-error' : ''}
          />
          <button onClick={buscarVecino}>Buscar</button>
        </div>

        {rutNoExiste && <p className="mensaje-error">El RUT no existe en el registro.</p>}

        <div className="cuadro-edicion">
          {[
            'rut', 'primerNombre', 'segundoNombre', 'primerApellido', 'segundoApellido',
            'pasaje', 'numCasa', 'poblacion', 'telefono', 'genero', 'fechaNac'
          ].map((campo) => (
            <input
              key={campo}
              name={campo}
              placeholder={campo}
              type={campo === 'fechaNac' ? 'date' : 'text'}
              value={vecinoEditado?.[campo] || ''}
              onChange={handleEditChange}
              disabled={!vecinoEditado}
            />
          ))}

          <label>
            <input
              type="checkbox"
              name="estadoSocio"
              checked={vecinoEditado?.estadoSocio || false}
              onChange={handleEditChange}
              disabled={!vecinoEditado}
            />
            Socio activo
          </label>

          {mensajeGuardado && <p className="mensaje-exito">{mensajeGuardado}</p>}

          <button
            className="btn-guardar"
            onClick={guardarCambios}
            disabled={!vecinoEditado}
          >
            Guardar cambios
          </button>
        </div>
      </section>
    </div>
  );
}