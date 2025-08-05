import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, Cell, ResponsiveContainer } from 'recharts';
import CustomTooltip from '../components/CustomTooltip';
import { COLORS, TEXT_COLOR, GRID_COLOR } from '../utils/colors';

const DepartmentBarChart = ({ departmentData, candidateKeys }) => {
  if (!departmentData) {
    return <p>Selecciona un departamento en el mapa para ver sus votos.</p>;
  }

  const chartData = candidateKeys.map(candidate => ({
    name: candidate,
    votos: departmentData[candidate] || 0,
  }));

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Votos en {departmentData.Departamento}</h3>
      <ResponsiveContainer width="100%" height={400}>
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

export default DepartmentBarChart;
