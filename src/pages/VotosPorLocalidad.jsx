
import { useState } from 'react';
import { useLocalidadData } from '../hooks/useLocalidadData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, Cell, ResponsiveContainer } from 'recharts';
import CustomTooltip from '../components/CustomTooltip';
import { COLORS, TEXT_COLOR, GRID_COLOR } from '../utils/colors';

const VotosPorLocalidad = () => {
  const data = useLocalidadData();
  const [selectedLocalidad, setSelectedLocalidad] = useState('Huinganco');

  if (!data) {
    return <p>Cargando datos...</p>;
  }

  const localidades = data.map(d => d.Localidad);
  const selectedData = data.find(d => d.Localidad === selectedLocalidad);

  const chartData = selectedData ? Object.keys(selectedData)
    .filter(key => key !== 'Localidad' && key !== 'Departamento')
    .map(key => ({
      name: key,
      votos: +selectedData[key] || 0,
    })) : [];

  return (
    <div>
      <h2>Votos por Localidad</h2>
      <p>Este gráfico de barras muestra la cantidad de votos que cada candidato recibió en la localidad seleccionada.</p>
      <select onChange={e => setSelectedLocalidad(e.target.value)} value={selectedLocalidad} style={{ marginBottom: '20px', fontSize: '1.1em', padding: '8px 12px' }}>
        {localidades.map((loc, index) => (
          <option key={index} value={loc}>{loc}</option>
        ))}
      </select>
      <ResponsiveContainer width="100%" height={450}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 5 }} barSize={30}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
        <XAxis type="number" style={{ fill: TEXT_COLOR }} />
        <YAxis type="category" dataKey="name" style={{ fill: TEXT_COLOR }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: TEXT_COLOR }} />
        <Bar dataKey="votos">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          <LabelList dataKey="votos" position="right" style={{ fill: TEXT_COLOR }} />
        </Bar>
      </BarChart>
      </ResponsiveContainer>
      <p><strong>Análisis:</strong> En la localidad seleccionada, el candidato con más votos es <strong>{chartData.length > 0 ? chartData.reduce((prev, current) => (prev.votos > current.votos) ? prev : current).name : 'N/A'}</strong>, con un total de <strong>{chartData.length > 0 ? chartData.reduce((prev, current) => (prev.votos > current.votos) ? prev : current).votos : 'N/A'}</strong> votos.</p>
    </div>
  );
};

export default VotosPorLocalidad;
