
import { useLocalidadData } from '../hooks/useLocalidadData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, ResponsiveContainer } from 'recharts';
import CustomTooltip from '../components/CustomTooltip';
import { COLORS, TEXT_COLOR, GRID_COLOR } from '../utils/colors';

const ComposicionVoto = () => {
  const data = useLocalidadData();

  if (!data) {
    return <p>Cargando datos...</p>;
  }

  const totalsByDept = data.reduce((acc, row) => {
    const dept = row.Departamento;
    if (!acc[dept]) {
      acc[dept] = { name: dept };
    }
    Object.keys(row).forEach(key => {
      if (key !== 'Localidad' && key !== 'Departamento') {
        if (!acc[dept][key]) {
          acc[dept][key] = 0;
        }
        acc[dept][key] += +row[key] || 0;
      }
    });
    return acc;
  }, {});

  const chartData = Object.values(totalsByDept);
  const candidates = Object.keys(data[0]).filter(k => k !== 'Localidad' && k !== 'Departamento');

  return (
    <div>
      <h2>Composición del Voto por Departamento</h2>
      <p>Este gráfico muestra la distribución de votos por candidato, apilados por departamento, permitiendo visualizar la fuerza de cada candidato en cada región.</p>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 5 }} barSize={30}> {/* barSize para grosor */}
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
        <XAxis type="number" stroke={TEXT_COLOR} />
        <YAxis type="category" dataKey="name" stroke={TEXT_COLOR} />
        <Tooltip content={<CustomTooltip />} /> {/* Usar CustomTooltip */}
        <Legend />
        {candidates.map((candidate, index) => (
          <Bar key={candidate} dataKey={candidate} stackId="a" fill={COLORS[index % COLORS.length]} />
        ))}
      </BarChart>
      </ResponsiveContainer>
      <p><strong>Análisis:</strong> Este gráfico permite observar la contribución de cada candidato al total de votos en cada departamento, destacando las regiones donde un candidato tiene mayor o menor apoyo.</p>
    </div>
  );
};

export default ComposicionVoto;
