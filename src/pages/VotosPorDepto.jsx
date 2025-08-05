
import { useState } from 'react';
import { useData } from '../hooks/useData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, ResponsiveContainer } from 'recharts';
import CustomTooltip from '../components/CustomTooltip';
import { COLORS, TEXT_COLOR, GRID_COLOR } from '../utils/colors';

const VotosPorDepto = () => {
  const data = useData();
  const [selectedDept, setSelectedDept] = useState('minas');

  if (!data) {
    return <p>Cargando datos...</p>;
  }

  const depts = Object.keys(data[0]).filter(key => key !== 'Candidato');

  const chartData = data.map(row => ({
    name: row.Candidato,
    votos: +row[selectedDept],
  }));

  return (
    <div>
      <h2>Votos por Departamento</h2>
      <p>Este gráfico de barras muestra la cantidad de votos que cada candidato recibió en el departamento seleccionado.</p>
      <select onChange={e => setSelectedDept(e.target.value)} value={selectedDept} style={{ marginBottom: '20px', fontSize: '1.1em', padding: '8px 12px' }}>
        {depts.map(dept => (
          <option key={dept} value={dept}>{dept}</option>
        ))}
      </select>
      <ResponsiveContainer width="100%" height={450}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barSize={30}> {/* barSize para grosor */}
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
        <XAxis dataKey="name" stroke={TEXT_COLOR} />
        <YAxis stroke={TEXT_COLOR} />
        <Tooltip content={<CustomTooltip />} /> {/* Usar CustomTooltip */}
        <Legend wrapperStyle={{ color: TEXT_COLOR }} />
        <Bar dataKey="votos" fill={(entry, index) => COLORS[index % COLORS.length]}> {/* Aplicar fill como función */}
          <LabelList dataKey="votos" position="top" fill={TEXT_COLOR} />
        </Bar>
      </BarChart>
      </ResponsiveContainer>
      <p><strong>Análisis:</strong> En el departamento seleccionado, el candidato con más votos es <strong>{chartData.length > 0 ? chartData.reduce((prev, current) => (prev.votos > current.votos) ? prev : current).name : 'N/A'}</strong>, con un total de <strong>{chartData.length > 0 ? chartData.reduce((prev, current) => (prev.votos > current.votos) ? prev : current).votos : 'N/A'}</strong> votos.</p>
    </div>
  );
};

export default VotosPorDepto;
