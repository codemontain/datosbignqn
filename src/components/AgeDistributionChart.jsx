import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { COLORS } from '../utils/colors';

const AgeDistributionChart = ({ data }) => {
  if (!data) {
    return <p>Cargando datos de distribución de edades...</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" name="Cantidad de Votantes" fill={COLORS[1]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AgeDistributionChart;
