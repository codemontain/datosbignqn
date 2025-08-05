import { useState } from 'react';
import usePresidenteDataNuevo from '../hooks/usePresidenteDataNuevo';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, Cell, ResponsiveContainer } from 'recharts';
import CustomTooltip from '../components/CustomTooltip';
import { COLORS, TEXT_COLOR, GRID_COLOR } from '../utils/colors';

const VotosPresidentePorDeptoNuevo = () => {
  const data = usePresidenteDataNuevo();
  const [selectedDepartamento, setSelectedDepartamento] = useState('Minas');

  if (!data) {
    return <p>Cargando datos...</p>;
  }

  const departamentos = data.map(d => d.Departamento);
  const selectedData = data.find(d => d.Departamento === selectedDepartamento);

  const candidateKeys = [
    'Sergio Massa',
    'Javier Milei',
    'Patricia Bullrich',
    'Juan Schiaretti',
    'Myriam Bregman',
    'Votos en Blanco',
  ];

  const chartData = selectedData ? candidateKeys.map(candidate => ({
    name: candidate,
    votos: +selectedData[candidate] || 0,
  })) : [];

  return (
    <div>
      <h2>Votos Presidenciales por Departamento</h2>
      <select onChange={e => setSelectedDepartamento(e.target.value)} value={selectedDepartamento} style={{ marginBottom: '20px', fontSize: '1.1em', padding: '8px 12px' }}>
        {departamentos.map(dept => (
          <option key={dept} value={dept}>{dept}</option>
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
    </div>
  );
};

export default VotosPresidentePorDeptoNuevo;
