
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import VotosPorLocalidad from './pages/VotosPorLocalidad';
import VotosPorDepartamentoNuevo from './pages/VotosPorDepartamentoNuevo';
import VotosTotalesNorte from './pages/VotosTotalesNorte';
import VotosPresidentePorDeptoNuevo from './pages/VotosPresidentePorDeptoNuevo';
import VotosTotalesPresidenteNorte from './pages/VotosTotalesPresidenteNorte';
import MapaVotosPresidente from './pages/MapaVotosPresidente';
import MapaVotosGobernador from './pages/MapaVotosGobernador';
import PadronMesas from './pages/PadronMesas';
import PadronMesasSur from './pages/PadronMesasSur';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <BrowserRouter basename="/datosbignqn/">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="votos-por-localidad" element={<VotosPorLocalidad />} />
          <Route path="votos-por-departamento-nuevo" element={<VotosPorDepartamentoNuevo />} />
          <Route path="votos-totales-norte" element={<VotosTotalesNorte />} />
          <Route path="votos-presidente-por-depto-nuevo" element={<VotosPresidentePorDeptoNuevo />} />
          <Route path="votos-totales-presidente-norte" element={<VotosTotalesPresidenteNorte />} />
          <Route path="mapa-votos-presidente" element={<MapaVotosPresidente />} />
          <Route path="mapa-votos-gobernador" element={<MapaVotosGobernador />} />
          <Route path="padron-mesas" element={<PadronMesas />} />
          <Route path="padron-mesas-sur" element={<PadronMesasSur />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
