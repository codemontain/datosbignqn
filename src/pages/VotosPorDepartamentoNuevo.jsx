import { useState } from 'react';
import useDepartamentosData from '../hooks/useDepartamentosData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, Cell } from 'recharts';
import CustomTooltip from '../components/CustomTooltip';
import { COLORS, TEXT_COLOR, GRID_COLOR } from '../utils/colors';

const VotosPorDepartamentoNuevo = () => {
  const data = useDepartamentosData();
  const [selectedDepartamento, setSelectedDepartamento] = useState('minas');

  if (!data) {
    return <p>Cargando datos...</p>;
  }

  const departamentos = Object.keys(data[0]).filter(key => key !== 'Candidato');
  const selectedData = data.find(d => d.Candidato === 'Marcos Koopmann Irizar'); // Solo para obtener los nombres de los departamentos

  const chartData = selectedData ? data.map(row => ({
    name: row.Candidato,
    votos: +row[selectedDepartamento] || 0,
  })) : [];

  return (
    <div>
      <h2>Votos por Departamento</h2>
      <p>Este gráfico de barras muestra la cantidad de votos que cada candidato a gobernador recibió en el departamento seleccionado.</p>
      <select onChange={e => setSelectedDepartamento(e.target.value)} value={selectedDepartamento} style={{ marginBottom: '20px', fontSize: '1.1em', padding: '8px 12px' }}>
        {departamentos.map(dept => (
          <option key={dept} value={dept}>{dept.charAt(0).toUpperCase() + dept.slice(1)}</option>
        ))}
      </select>
      <BarChart width={800} height={450} data={chartData} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 5 }} barSize={30}>
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
    </div>
  );
};

export default VotosPorDepartamentoNuevo;
