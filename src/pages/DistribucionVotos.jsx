
import { useData } from '../hooks/useData';
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts';
import CustomTooltip from '../components/CustomTooltip';
import { COLORS, TEXT_COLOR } from '../utils/colors';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const DistribucionVotos = () => {
  const data = useData();

  if (!data) {
    return <p>Cargando datos...</p>;
  }

  const totals = data.reduce((acc, row) => {
    Object.keys(row).forEach(key => {
      if (key !== 'Candidato') {
        if (!acc[row.Candidato]) {
          acc[row.Candidato] = 0;
        }
        acc[row.Candidato] += +row[key];
      }
    });
    return acc;
  }, {});

  const chartData = Object.keys(totals).map(key => ({
    name: key,
    value: totals[key],
  }));

  return (
    <div>
      <h2>Distribución de Votos</h2>
      <p>Este gráfico de pastel muestra la proporción de votos totales que cada candidato recibió, ofreciendo una vista rápida de la distribución general.</p>
      <ResponsiveContainer width="100%" height={500}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius="80%"
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} /> {/* Usar CustomTooltip */}
          <Legend wrapperStyle={{ color: TEXT_COLOR }} />
        </PieChart>
      </ResponsiveContainer>
      <p><strong>Análisis:</strong> El candidato con la mayor proporción de votos es <strong>{chartData.length > 0 ? chartData.reduce((prev, current) => (prev.value > current.value) ? prev : current).name : 'N/A'}</strong>, lo que indica su liderazgo en la distribución general de votos.</p>
    </div>
  );
};

export default DistribucionVotos;
