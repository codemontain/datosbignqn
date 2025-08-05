import { useData } from '../hooks/useData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, ResponsiveContainer } from 'recharts';
import CustomTooltip from '../components/CustomTooltip';
import { COLORS, TEXT_COLOR, GRID_COLOR } from '../utils/colors';

const VotosTotales = () => {
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
    votos: totals[key],
  }));

  return (
    <div>
      <h2>Votos Totales por Candidato</h2>
      <p>Este gráfico de barras muestra la suma total de votos recibidos por cada candidato en todas las localidades.</p>
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
    </div>
  );
};

export default VotosTotales;