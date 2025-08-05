import { useState, useEffect } from 'react';
import { csv } from 'd3-fetch';

const usePresidenteDataNuevo = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await csv(`${import.meta.env.BASE_URL}data_presidente_nuevo.csv`, (row) => {
          const newRow = { ...row };
          for (const key in newRow) {
            if (Object.prototype.hasOwnProperty.call(newRow, key) && key !== 'Departamento') {
              let value = newRow[key];
              if (typeof value === 'string') {
                if (value.endsWith('%')) {
                  // Para porcentajes como "9,40%"
                  value = value.replace('%', '').replace(',', '.');
                  newRow[key] = parseFloat(value) / 100;
                } else {
                  // Para números con separador de miles como "2.000"
                  value = value.replace(/\./g, ''); // Eliminar puntos (separadores de miles)
                  newRow[key] = parseFloat(value);
                }
              }
            }
          }
          return newRow;
        });
        setData(result);
      } catch (error) {
        console.error('Error loading the CSV data:', error);
      }
    };

    fetchData();
  }, []);

  return data;
};

export default usePresidenteDataNuevo;
