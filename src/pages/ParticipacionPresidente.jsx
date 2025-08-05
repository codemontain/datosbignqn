import { usePresidenteData } from '../hooks/usePresidenteData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, ResponsiveContainer } from 'recharts';
import CustomTooltip from '../components/CustomTooltip';
import { PRIMARY_COLOR, TEXT_COLOR, GRID_COLOR } from '../utils/colors';

const ParticipacionPresidente = () => {
  const data = usePresidenteData();

  if (!data) {
    return <p>Cargando datos...</p>;
  }

  const chartData = data.map(row => ({
    name: row.Departamento,
    participacion: row.Participación,
  }));

  return (
    <div>
      <h2>Participación Presidencial por Departamento</h2>
      <p>Este gráfico de barras muestra el porcentaje de participación en las elecciones presidenciales por cada departamento.</p>
      <ResponsiveContainer width="100%" height={450}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barSize={30}> {/* barSize para grosor */}
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
        <XAxis dataKey="name" stroke={TEXT_COLOR} />
        <YAxis domain={[0, 100]} label={{ value: '%', angle: -90, position: 'insideLeft', fill: TEXT_COLOR }} stroke={TEXT_COLOR} />
        <Tooltip content={<CustomTooltip />} /> {/* Usar CustomTooltip */}
        <Legend wrapperStyle={{ color: TEXT_COLOR }} />
        <Bar dataKey="participacion" fill={PRIMARY_COLOR}> {/* Color fijo para participación */}
          <LabelList dataKey="participacion" position="top" formatter={(value) => `${value}%`} fill={TEXT_COLOR} />
        </Bar>
      </BarChart>
      </ResponsiveContainer>
      <p><strong>Análisis:</strong> El departamento con la mayor participación es <strong>{chartData.length > 0 ? chartData.reduce((prev, current) => (prev.participacion > current.participacion) ? prev : current).name : 'N/A'}</strong>, con un <strong>{chartData.length > 0 ? chartData.reduce((prev, current) => (prev.participacion > current.participacion) ? prev : current).participacion : 'N/A'}%</strong>.</p>
    </div>
  );
};

export default ParticipacionPresidente;