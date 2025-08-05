import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { COLORS } from '../utils/colors';

const ageRanges = {
  "90+ años": { min: 0, max: 9999999 },
  "70-90 años": { min: 10000000, max: 19999999 },
  "50-70 años": { min: 20000000, max: 29999999 },
  "30-50 años": { min: 30000000, max: 39999999 },
  "10-30 años": { min: 40000000, max: 49999999 },
  // "Menos de 10 años": { min: 50000000, max: Infinity }, // Excluido según solicitud anterior
};

const getAgeRange = (dni) => {
  for (const range in ageRanges) {
    if (dni >= ageRanges[range].min && dni <= ageRanges[range].max) {
      return range;
    }
  }
  return "Sin correlación";
};

const MesaAgeDistributionChart = ({ mesa }) => {
  if (!mesa || !mesa.dnis || mesa.dnis.length === 0) {
    return <p>No hay datos de edad disponibles para esta mesa.</p>;
  }

  const ageCounts = {};
  mesa.dnis.forEach(dni => {
    const ageRange = getAgeRange(dni);
    if (ageRange !== "Sin correlación") { // Excluir si no hay correlación
      ageCounts[ageRange] = (ageCounts[ageRange] || 0) + 1;
    }
  });

  const formattedAgeData = Object.keys(ageCounts).map(range => ({
    name: range,
    value: ageCounts[range],
  })).sort((a, b) => {
    const order = ["10-30 años", "30-50 años", "50-70 años", "70-90 años", "90+ años", "Sin correlación"];
    return order.indexOf(a.name) - order.indexOf(b.name);
  });

  if (formattedAgeData.length === 0) {
    return <p>No hay datos de edad válidos para esta mesa.</p>;
  }

  return (
    <div>
      <h4>Distribución de Edades para {mesa.name}</h4>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={formattedAgeData}
          margin={{
            top: 5, right: 10, left: 10, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" name="Cantidad de Votantes" fill={COLORS[2]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MesaAgeDistributionChart;