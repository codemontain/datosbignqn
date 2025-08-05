import { TEXT_COLOR } from '../utils/colors';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        color: TEXT_COLOR,
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '10px',
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <p className="label" style={{ fontWeight: 'bold', marginBottom: '5px' }}>{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color, margin: '2px 0' }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

export default CustomTooltip;