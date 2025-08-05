import { useState, useEffect } from 'react';
import { csvParse } from 'd3-dsv';

export const useLocalidadData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data_localidad.csv`)
      .then(response => response.text())
      .then(text => {
        const parsed = csvParse(text);
        // Limpiar datos: eliminar filas vacías y encabezados repetidos
        const cleanedData = parsed.filter(d => d.Localidad && d.Localidad !== 'Localidad');
        setData(cleanedData);
      });
  }, []);

  return data;
};