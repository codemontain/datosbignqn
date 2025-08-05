import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './Layout.css'; // Importar el archivo CSS

const Layout = () => {
  const [isResultadosOpen, setIsResultadosOpen] = useState(false);
  const [isPadronOpen, setIsPadronOpen] = useState(false); // Nuevo estado para Padrón-Mesas
  const location = useLocation();

  const toggleResultados = () => {
    setIsResultadosOpen(!isResultadosOpen);
    setIsPadronOpen(false); // Cierra el otro menú si está abierto
  };

  const togglePadron = () => {
    setIsPadronOpen(!isPadronOpen);
    setIsResultadosOpen(false); // Cierra el otro menú si está abierto
  };

  useEffect(() => {
    // Cierra ambos menús desplegables cuando la ruta cambia
    setIsResultadosOpen(false);
    setIsPadronOpen(false);
  }, [location.pathname]);

  return (
    <div className="layout-container">
      <nav className="sidebar-nav">
        <h2>Menú</h2>
        <ul>
          <li><Link to="/" className="link-style">Dashboard</Link></li>
          <li className="menu-item-style">
            <button onClick={togglePadron} className="button-style">
              Padron Mesas Zona Norte {isPadronOpen ? '▲' : '▼'}
            </button>
            {isPadronOpen && (
              <ul className="submenu-style">
                <li><Link to="/padron-mesas" className="link-style" onClick={() => setIsPadronOpen(false)}>Seleccionar Localidad</Link></li>
              </ul>
            )}
          </li>
          <li className="menu-item-style">
            <button onClick={togglePadron} className="button-style">
              Padron Mesas Zona Sur {isPadronOpen ? '▲' : '▼'}
            </button>
            {isPadronOpen && (
              <ul className="submenu-style">
                <li><Link to="/padron-mesas-sur" className="link-style" onClick={() => setIsPadronOpen(false)}>Seleccionar Localidad</Link></li>
              </ul>
            )}
          </li>
          <li className="menu-item-style">
            <button onClick={toggleResultados} className="button-style">
              Resultados 2023 {isResultadosOpen ? '▲' : '▼'}
            </button>
            {isResultadosOpen && (
              <ul className="submenu-style">
                <li><Link to="/votos-por-localidad" className="link-style" onClick={() => setIsResultadosOpen(false)}>Votos por Localidad</Link></li>
                <li><Link to="/votos-por-departamento-nuevo" className="link-style" onClick={() => setIsResultadosOpen(false)}>Votos por Departamento</Link></li>
                <li><Link to="/votos-totales-norte" className="link-style" onClick={() => setIsResultadosOpen(false)}>Votos Totales en el Norte</Link></li>
                <li><Link to="/votos-presidente-por-depto-nuevo" className="link-style" onClick={() => setIsResultadosOpen(false)}>Votos Presidente por Departamento</Link></li>
                <li><Link to="/votos-totales-presidente-norte" className="link-style" onClick={() => setIsResultadosOpen(false)}>Votos Totales Presidente en el Norte</Link></li>
                <li><Link to="/mapa-votos-presidente" className="link-style" onClick={() => setIsResultadosOpen(false)}>Mapa Votos Presidente</Link></li>
                <li><Link to="/mapa-votos-gobernador" className="link-style" onClick={() => setIsResultadosOpen(false)}>Mapa Votos Gobernador</Link></li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;