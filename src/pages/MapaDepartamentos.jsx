import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocalidadData } from '../hooks/useLocalidadData';
import { useEffect, useState } from 'react';
import L from 'leaflet'; // Importar Leaflet para configurar los iconos

// Configuración de iconos por defecto de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const COLORS = { // Asignar un color a cada candidato principal
  'Rolando Figueroa': '#00C49F',
  'Marcos Koopmann Irizar': '#0088FE',
  'Ramón Rioseco': '#FFBB28',
  'default': '#808080' // Un color por defecto
};

const MapaDepartamentos = () => {
  const data = useLocalidadData();
  const [geojsonData, setGeojsonData] = useState([]);
  const [winners, setWinners] = useState({});
  const [mapMounted, setMapMounted] = useState(false); // Estado para renderizado condicional

  useEffect(() => {
    const departmentFiles = {
      'Chos Malal': 'chosmalal.geojson',
      'Loncopué': 'loncopue.geojson',
      'Minas': 'minasg.geojson',
      'Ñorquín': 'ñorquin.geojson',
      'Pehuenches': 'pehuenches.geojson'
    };
    const fetchGeojson = async () => {
      const allGeojson = await Promise.all(
        Object.entries(departmentFiles).map(([name, file]) =>
          fetch(`${import.meta.env.BASE_URL}${file}`).then(res => res.json()).then(json => ({ ...json, name }))
        )
      );
      setGeojsonData(allGeojson);
    };
    fetchGeojson();
    setMapMounted(true); // El mapa se ha montado en el cliente
  }, []);

  useEffect(() => {
    if (data) {
      const totalsByDept = data.reduce((acc, row) => {
        const dept = row.Departamento;
        if (!acc[dept]) {
          acc[dept] = {};
        }
        Object.keys(row).forEach(key => {
          if (key !== 'Localidad' && key !== 'Departamento') {
            if (!acc[dept][key]) {
              acc[dept][key] = 0;
            }
            acc[dept][key] += +row[key] || 0;
          }
        });
        return acc;
      }, {});

      const deptWinners = {};
      for (const dept in totalsByDept) {
        let maxVotes = -1;
        let winner = 'Sin Datos';
        for (const candidate in totalsByDept[dept]) {
          if (totalsByDept[dept][candidate] > maxVotes) {
            maxVotes = totalsByDept[dept][candidate];
            winner = candidate;
          } else if (totalsByDept[dept][candidate] === maxVotes) {
            winner = 'Empate'; // Manejar empates si es necesario
          }
        }
        deptWinners[dept] = { winner, votes: totalsByDept[dept] };
      }
      setWinners(deptWinners);
    }
  }, [data]);

  if (!data || geojsonData.length === 0 || !mapMounted) {
    return <p>Cargando datos y mapas...</p>;
  }

  const getColor = (deptName) => {
    const winner = winners[deptName]?.winner;
    return COLORS[winner] || COLORS.default;
  };

  return (
    <div>
      <h2>Mapa de Ganadores por Departamento</h2>
      {mapMounted && (
        <MapContainer center={[-37.5, -70.5]} zoom={7.5} style={{ height: '600px', width: '1200px' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {geojsonData.map((geo) => (
            <GeoJSON key={geo.name} data={geo} style={{ fillColor: getColor(geo.name), color: 'black', weight: 1 }}>
              <Tooltip>
                <h3>{geo.name}</h3>
                <b>Ganador: {winners[geo.name]?.winner}</b>
                <ul>
                  {winners[geo.name] && Object.entries(winners[geo.name].votes).map(([c, v]) => (
                    <li key={c}>{c}: {v} votos</li>
                  ))}
                </ul>
              </Tooltip>
            </GeoJSON>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default MapaDepartamentos;