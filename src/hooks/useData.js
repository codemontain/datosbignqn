import { useState, useEffect } from 'react';
import { csvParse } from 'd3-dsv';

export const useData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/data.csv')
      .then(response => response.text())
      .then(text => setData(csvParse(text)));
  }, []);

  return data;
};