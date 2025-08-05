import { useData } from '../hooks/useData';

const TablaDatos = () => {
  const data = useData();

  if (!data) {
    return <p>Cargando datos...</p>;
  }

  const headers = Object.keys(data[0]);

  return (
    <div>
      <h2>Tabla de Datos</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header} style={{ border: '1px solid #ddd', padding: '8px' }}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {headers.map(header => (
                <td key={header} style={{ border: '1px solid #ddd', padding: '8px' }}>{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaDatos;