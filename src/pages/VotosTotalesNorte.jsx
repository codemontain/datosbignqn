import useDepartamentosData from '../hooks/useDepartamentosData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, Cell, ResponsiveContainer } from 'recharts';
import CustomTooltip from '../components/CustomTooltip';
import { COLORS, TEXT_COLOR, GRID_COLOR } from '../utils/colors';

const VotosTotalesNorte = () => {
  const data = useDepartamentosData();

  if (!data) {
    return <p>Cargando datos...</p>;
  }

  const totals = data.reduce((acc, row) => {
    const candidateName = row.Candidato;
    let totalVotes = 0;
    Object.keys(row).forEach(key => {
      if (key !== 'Candidato') {
        totalVotes += +row[key] || 0;
      }
    });
    acc[candidateName] = totalVotes;
    return acc;
  }, {});

  const chartData = Object.keys(totals).map(key => ({
    name: key,
    votos: totals[key],
  }));

  return (
    <div>
      <h2>Votos Totales por Candidato en el Norte</h2>
      <p>Este gráfico muestra la suma total de votos de cada candidato en todos los departamentos del Norte Neuquino.</p>
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

export default VotosTotalesNorte;
