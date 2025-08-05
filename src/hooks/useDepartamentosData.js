import { useState, useEffect } from 'react';
import { csv } from 'd3-fetch';

const useDepartamentosData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await csv(`${import.meta.env.BASE_URL}data_departamentos.csv`); // Asume que el CSV estará en la carpeta public
        setData(result);
      } catch (error) {
        console.error('Error loading the CSV data:', error);
      }
    };

    fetchData();
  }, []);

  return data;
};

export default useDepartamentosData;
