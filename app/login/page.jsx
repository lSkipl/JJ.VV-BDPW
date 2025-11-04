// app/login/page.jsx
'use client';

import Link from 'next/link';
import './login.css';

export default function LogInPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Inicio de sesión enviado');
  };

  return (
    <div className="login-container">
      <div className="back-button">
        <Link href="/">
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <h1>Inicio de Sesión</h1>
        <input type="text" placeholder="Usuario" required />
        <input type="password" placeholder="Contraseña" required />
        <button type="submit">Log In</button>
        <div className="forgot">
          <Link href="#">¿Olvidó su contraseña?</Link>
        </div>
      </form>
    </div>
  );
}