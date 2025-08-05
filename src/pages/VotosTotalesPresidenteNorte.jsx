import usePresidenteDataNuevo from '../hooks/usePresidenteDataNuevo';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, Cell } from 'recharts';
import CustomTooltip from '../components/CustomTooltip';
import { COLORS, TEXT_COLOR, GRID_COLOR } from '../utils/colors';

const VotosTotalesPresidenteNorte = () => {
  const data = usePresidenteDataNuevo();

  if (!data) {
    return <p>Cargando datos...</p>;
  }

  const candidateKeys = [
    'Sergio Massa',
    'Javier Milei',
    'Patricia Bullrich',
    'Juan Schiaretti',
    'Myriam Bregman',
    'Votos en Blanco',
  ];

  const totals = data.reduce((acc, row) => {
    candidateKeys.forEach(candidate => {
      if (!acc[candidate]) {
        acc[candidate] = 0;
      }
      acc[candidate] += +row[candidate] || 0;
    });
    return acc;
  }, {});

  const chartData = Object.keys(totals).map(key => ({
    name: key,
    votos: totals[key],
  }));

  return (
    <div>
      <h2>Votos Totales de Presidente en el Norte Neuquino</h2>
      <p>Este gráfico muestra la suma total de votos de cada candidato presidencial en todos los departamentos del Norte Neuquino.</p>
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
      <p><strong>Análisis:</strong> El candidato presidencial con más votos en el Norte Neuquino es <strong>{chartData.length > 0 ? chartData.reduce((prev, current) => (prev.votos > current.votos) ? prev : current).name : 'N/A'}</strong>, con un total de <strong>{chartData.length > 0 ? chartData.reduce((prev, current) => (prev.votos > current.votos) ? prev : current).votos : 'N/A'}</strong> votos.</p>
    </div>
  );
};

export default VotosTotalesPresidenteNorte;
