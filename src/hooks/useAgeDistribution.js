import { useState, useCallback } from 'react';
import { csv } from 'd3-fetch';

const ageRanges = {
  "90+ años": { min: 0, max: 9999999 },
  "70-90 años": { min: 10000000, max: 19999999 },
  "50-70 años": { min: 20000000, max: 29999999 },
  "30-50 años": { min: 30000000, max: 39999999 },
  "10-30 años": { min: 40000000, max: 49999999 },
  
};

const getAgeRange = (dni) => {
  for (const range in ageRanges) {
    if (dni >= ageRanges[range].min && dni <= ageRanges[range].max) {
      return range;
    }
  }
  return "Sin correlación";
};

const useAgeDistribution = () => {
  const [ageData, setAgeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadAgeData = useCallback(async (filename) => {
    setLoading(true);
    setError(null);
    setAgeData(null);

    try {
      const rawData = await csv(`${import.meta.env.BASE_URL}${filename}`);
      const ageCounts = {};

      rawData.forEach(row => {
        const dni = parseInt(row.NU_MATRICULA, 10);
        if (!isNaN(dni)) {
          const ageRange = getAgeRange(dni);
          ageCounts[ageRange] = (ageCounts[ageRange] || 0) + 1;
        }
      });

      const formattedData = Object.keys(ageCounts).map(range => ({
        name: range,
        value: ageCounts[range],
      })).sort((a, b) => {
        const order = ["10-30 años", "30-50 años", "50-70 años", "70-90 años", "90+ años", "Sin correlación"];
        return order.indexOf(a.name) - order.indexOf(b.name);
      });

      setAgeData(formattedData);
    } catch (err) {
      console.error(`Error loading ${filename}:`, err);
      setError(`Error al cargar los datos de distribución de edades.`);
      setAgeData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { ageData, loading, error, loadAgeData };
};

export default useAgeDistribution;
