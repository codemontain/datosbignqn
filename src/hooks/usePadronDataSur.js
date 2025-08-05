import { useState, useEffect, useCallback } from 'react';
import { csv } from 'd3-fetch';

const localityFileMap = {
  "Villa La Angostura": "villa-la-angostura-sheet1.csv",
  "Villa Traful": "villa-traful-sheet1.csv",
  "Trompul": "trompul-sheet1.csv",
  "Quila Quina": "quila-quina-sheet1.csv",
  "Paso Coihue": "paso-coihue-sheet1.csv",
  "Paimun": "paimun-sheet1.csv",
  "Lago Meliquina": "lago-meliquina-sheet1.csv",
  "San Martin de los Andes": "san-martin-de-los-andes-sheet1.csv",
  "Atreuco": "atreuco-sheet1.csv",
  "Aucapan": "aucapan-sheet1.csv",
  "Costa del Malleo": "costa-del-malleo-sheet1.csv",
  "Lago Hermoso": "lago-hermoso-sheet1.csv",
  "Junin de los Andes": "junin-de-los-andes-sheet1.csv",
  "Cuyin Manzano": "cuyin-manzano-sheet1.csv",
  "Hua Hum": "hua-hum-sheet1.csv",
  "Chiuquilihuin": "chiuquilihuin-sheet1.csv",
};

const usePadronDataSur = () => {
  const [localities, setLocalities] = useState([]);
  const [mesaData, setMesaData] = useState(null);
  const [totalLocalidad, setTotalLocalidad] = useState(0);
  const [localidadName, setLocalidadName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize the list of localities from the map keys
    setLocalities(Object.keys(localityFileMap).sort());
  }, []);

  const loadMesaData = useCallback(async (selectedLocalityName) => {
    setLoading(true);
    setError(null);
    setMesaData(null); // Clear previous data
    setTotalLocalidad(0);
    setLocalidadName('');

    const filename = localityFileMap[selectedLocalityName];
    if (!filename) {
      setError(`Localidad "${selectedLocalityName}" no encontrada.`);
      setLoading(false);
      return;
    }

    try {
      const rawData = await csv(`${import.meta.env.BASE_URL}${filename}`);

      const mesaDetails = {};
      let currentTotalRows = 0;
      let currentLocalidadName = '';

      rawData.forEach(row => {
        const mesa = row.UN_MESA;
        const dni = parseInt(row.NU_MATRICULA, 10);
        const apellido = row.TX_APELLIDO;

        if (mesa) {
          if (!mesaDetails[mesa]) {
            mesaDetails[mesa] = {
              count: 0,
              dnis: [],
              apellidos: new Set(),
            };
          }
          mesaDetails[mesa].count++;
          if (!isNaN(dni)) {
            mesaDetails[mesa].dnis.push(dni);
          }
          if (apellido) {
            mesaDetails[mesa].apellidos.add(apellido);
          }
          currentTotalRows++;
        }
        if (row.TX_LOCALIDAD && !currentLocalidadName) {
          currentLocalidadName = row.TX_LOCALIDAD;
        }
      });

      const formattedData = Object.keys(mesaDetails).map(mesa => ({
        name: `Mesa ${mesa}`,
        value: mesaDetails[mesa].count,
        dnis: mesaDetails[mesa].dnis,
        apellidos: Array.from(mesaDetails[mesa].apellidos),
      }));

      setMesaData(formattedData);
      setTotalLocalidad(currentTotalRows);
      setLocalidadName(currentLocalidadName || selectedLocalityName); // Fallback to selected name if CSV doesn't have TX_LOCALIDAD
    } catch (err) {
      console.error(`Error loading ${filename}:`, err);
      setError(`Error al cargar los datos de ${selectedLocalityName}.`);
      setMesaData([]); // Ensure it's an empty array on error
      setTotalLocalidad(0);
      setLocalidadName(selectedLocalityName);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies, as localityFileMap is constant

  return { localities, mesaData, totalLocalidad, localidadName, loading, error, loadMesaData, localityFileMap };
};

export default usePadronDataSur;
