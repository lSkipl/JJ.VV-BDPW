'use client';

import { useState } from 'react';
import LeftBarregistros from '@/componente/LeftBarRegistros';
import './contabilidad.css';

export default function verDatosPage() {
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

  const [filtro, setFiltro] = useState('');
  const [mostrarAgregar, setMostrarAgregar] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [rutEliminar, setRutEliminar] = useState('');
  const [rutNoExiste, setRutNoExiste] = useState(false);

  const [nuevo, setNuevo] = useState({
    rut: '',
    pasaje: '',
    numCasa: '',
    poblacion: '',
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    telefono: '',
    estadoSocio: false,
    genero: '',
    fechaNac: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNuevo({
      ...nuevo,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const agregarVecino = () => {
    const existe = vecinos.some((v) => v.rut === nuevo.rut);
    if (existe) return;
    setVecinos([...vecinos, nuevo]);
    setMostrarAgregar(false);
    setNuevo({
      rut: '',
      pasaje: '',
      numCasa: '',
      poblacion: '',
      primerNombre: '',
      segundoNombre: '',
      primerApellido: '',
      segundoApellido: '',
      telefono: '',
      estadoSocio: false,
      genero: '',
      fechaNac: '',
    });
  };

  const eliminarVecino = () => {
    const existe = vecinos.some((v) => v.rut === rutEliminar);
    if (!existe) {
      setRutNoExiste(true);
      return;
    }
    setVecinos(vecinos.filter((v) => v.rut !== rutEliminar));
    setMostrarEliminar(false);
    setRutEliminar('');
    setRutNoExiste(false);
  };

  const vecinosFiltrados = vecinos.filter((v) => {
    const texto = filtro.toLowerCase();
    return Object.values(v).some((valor) =>
      String(valor).toLowerCase().includes(texto)
    );
  });

  return (
    <div className="contabilidad-layout">
      <LeftBarregistros />
      <section className="contenido">
        <h1>Registro de Vecinos</h1>

        <input
          type="text"
          placeholder="Buscar por cualquier campo..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="filtro-unico"
        />

        <table className="tabla-vecinos">
          <thead>
            <tr>
              <th>RUT</th>
              <th>Nombre 1</th>
              <th>Nombre 2</th>
              <th>Apellido 1</th>
              <th>Apellido 2</th>
              <th>Pasaje</th>
              <th>N° Casa</th>
              <th>Población</th>
              <th>Teléfono</th>
              <th>Socio</th>
              <th>Género</th>
              <th>Fecha Nac.</th>
            </tr>
          </thead>
          <tbody>
            {vecinosFiltrados.map((v, index) => (
              <tr key={index}>
                <td>{v.rut}</td>
                <td>{v.primerNombre}</td>
                <td>{v.segundoNombre}</td>
                <td>{v.primerApellido}</td>
                <td>{v.segundoApellido}</td>
                <td>{v.pasaje}</td>
                <td>{v.numCasa}</td>
                <td>{v.poblacion}</td>
                <td>{v.telefono}</td>
                <td>{v.estadoSocio ? 'Activo' : 'Inactivo'}</td>
                <td>{v.genero}</td>
                <td>{v.fechaNac}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="botones-finales">
          <button className="btn-agregar" onClick={() => setMostrarAgregar(true)}>Agregar vecino</button>
          <button className="btn-eliminar" onClick={() => setMostrarEliminar(true)}>Eliminar vecino</button>
        </div>
      </section>

      {/* Modal Agregar */}
      {mostrarAgregar && (
        <div className="modal">
          <div className="modal-contenido">
            <h2 className="titulo-modal">Agregar vecino</h2>
            {Object.keys(nuevo).map((campo) =>
              campo === 'estadoSocio' ? (
                <label key={campo}>
                  <input
                    type="checkbox"
                    name="estadoSocio"
                    checked={nuevo.estadoSocio}
                    onChange={handleChange}
                  />
                  Socio activo
                </label>
              ) : (
                <input
                  key={campo}
                  name={campo}
                  placeholder={campo}
                  type={campo === 'fechaNac' ? 'date' : 'text'}
                  value={nuevo[campo]}
                  onChange={handleChange}
                />
              )
            )}
            <div className="modal-botones">
              <button onClick={agregarVecino}>Agregar</button>
              <button onClick={() => setMostrarAgregar(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {mostrarEliminar && (
        <div className="modal">
          <div className="modal-contenido">
            <h2 className="titulo-modal">Eliminar vecino</h2>
            <input
              type="text"
              placeholder="Ingrese RUT"
              value={rutEliminar}
              onChange={(e) => {
                setRutEliminar(e.target.value);
                setRutNoExiste(false);
              }}
              className={rutNoExiste ? 'input-error' : ''}
            />
            {rutNoExiste && <p className="mensaje-error">El RUT no existe en el registro.</p>}
            <div className="modal-botones">
              <button onClick={eliminarVecino}>Eliminar</button>
              <button onClick={() => {
                setMostrarEliminar(false);
                setRutEliminar('');
                setRutNoExiste(false);
              }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}