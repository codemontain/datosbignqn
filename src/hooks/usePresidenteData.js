
import { useState, useEffect } from 'react';
import { csvParse } from 'd3-dsv';

export const usePresidenteData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data_presidente.csv`)
      .then(response => response.text())
      .then(text => {
        const parsed = csvParse(text);
        const cleanedData = parsed.map(row => {
          const newRow = {};
          for (const key in row) {
            // Columnas de votos que necesitan limpieza de puntos y conversión a número
            if (['Sergio Massa', 'Javier Milei', 'Patricia Bullrich', 'Juan Schiaretti', 'Myriam Bregman', 'Votos en Blanco', 'Votos Anulados'].includes(key)) {
              newRow[key] = parseInt(row[key].replace(/\./g, '')) || 0; // Eliminar puntos y convertir a entero
            } else if (key === 'Participación' || key === 'Votos Totales Emitidos' || key === 'Escrutado') {
                // Estas columnas se ignoran o se manejan de forma diferente si se necesitan
                // Por ahora, las convertimos a número si tienen comas como decimales
                newRow[key] = parseFloat(row[key].replace(',', '.')) || 0;
            } else {
              newRow[key] = row[key];
            }
          }
          return newRow;
        });
        setData(cleanedData);
      });
  }, []);

  return data;
};
