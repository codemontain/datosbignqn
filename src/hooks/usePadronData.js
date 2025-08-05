import { useState, useEffect, useCallback } from 'react';
import { csv } from 'd3-fetch';

const localityFileMap = {
  "Andacollo": "andacollo-sheet1.csv",
  "Butalón Norte": "butalon-norte-sheet1.csv",
  "Caepe Malal": "caepe-malal-sheet1.csv",
  "Cajón de Almazán": "cajon-de-almazan-sheet1.csv",
  "Cajón del Curileuvú": "cajon-del-curileuvu-sheet1.csv",
  "Caviahue": "caviahue-sheet1.csv",
  "Chacay Melehue": "chacay-melehue-sheet1.csv",
  "Chapua": "chapua-sheet1.csv",
  "Chorriaca": "chorriaca-sheet1.csv",
  "Chos Malal": "chos-malal-sheet1.csv",
  "Cochico": "cochico-sheet1.csv",
  "Colipilli": "colipilli-sheet1.csv",
  "Coyuco": "coyuco-sheet1.csv",
  "El Cholar": "el-cholar-sheet1.csv",
  "El Huecú": "el-huecu-sheet1.csv",
  "Guanacos": "guanacos-sheet1.csv",
  "Huarenchenque": "huarenchenque-sheet1.csv",
  "Huinganco": "huinganco-sheet1.csv",
  "Huncal": "huncal-sheet1.csv",
  "La Salada": "la-salada-sheet1.csv",
  "Las Ovejas": "las-ovejas-sheet1.csv",
  "Loncopué": "loncopue-sheet1.csv",
  "Los Carrizos": "los-carrizos-sheet1.csv",
  "Los Miches": "los-miches-sheet1.csv",
  "Manzano Amargo": "manzano-amargo-sheet1.csv",
  "Naunauco": "naunauco-sheet1.csv",
  "Quintuco": "quintuco-sheet1.csv",
  "Taquimilán Abajo": "taquimilan-abajo-sheet1.csv",
  "Taquimilán Centro": "taquimilan-centro-sheet1.csv",
  "Tralaitue": "tralaitue-sheet1.csv",
  "Tres Chorros": "tres-chorros-sheet1.csv",
  "Tricao Malal": "tricao-malal-sheet1.csv",
  "Varvarco": "varvarco-sheet1.csv",
};

const usePadronData = () => {
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

export default usePadronData;
