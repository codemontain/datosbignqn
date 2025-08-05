import React, { useState, useEffect } from 'react';
import usePadronData from '../hooks/usePadronData';
import useAgeDistribution from '../hooks/useAgeDistribution';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { COLORS } from '../utils/colors';
import AgeDistributionChart from '../components/AgeDistributionChart';
import MesaAgeDistributionChart from '../components/MesaAgeDistributionChart';

const PadronMesas = () => {
  const { localities, mesaData, totalLocalidad, localidadName, loading, error, loadMesaData, localityFileMap } = usePadronData();
  const { ageData, loading: ageLoading, error: ageError, loadAgeData } = useAgeDistribution();
  const [selectedLocality, setSelectedLocality] = useState('');

  // Cargar datos de la primera localidad al montar el componente
  useEffect(() => {
    if (localities.length > 0 && !selectedLocality) {
      const firstLocality = localities[0];
      setSelectedLocality(firstLocality);
    }
  }, [localities, selectedLocality]);

  // Cargar datos cuando cambia la localidad seleccionada
  useEffect(() => {
    if (selectedLocality) {
      loadMesaData(selectedLocality);
      const filename = localityFileMap[selectedLocality];
      if (filename) {
        loadAgeData(filename);
      }
    }
  }, [selectedLocality, loadMesaData, loadAgeData, localities, localityFileMap]);

  const handleLocalityChange = (event) => {
    setSelectedLocality(event.target.value);
  };

  if (loading && !mesaData) {
    return <p>Cargando datos del padrón...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Padrón y Mesas - {localidadName}</h1>
      <p>Selecciona una localidad para ver la distribución de votantes por mesa.</p>

      <select onChange={handleLocalityChange} value={selectedLocality} style={{ marginBottom: '20px', fontSize: '1.1em', padding: '8px 12px' }}>
        <option value="">Selecciona una localidad</option>
        {localities.map((loc) => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>

      {mesaData && mesaData.length > 0 ? (
        <>
          <p>Cantidad total de votantes en {localidadName}: <strong>{totalLocalidad}</strong></p>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={mesaData}
              margin={{
                top: 20, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Cantidad de Votantes" fill={COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>

          <h2>Distribución de Votantes por Edad</h2>
          {ageLoading && <p>Cargando datos de edades...</p>}
          {ageError && <p style={{ color: 'red' }}>Error: {ageError}</p>}
          {ageData && <AgeDistributionChart data={ageData} />}

          <h2>Detalle por Mesa:</h2>
          <ul>
            {mesaData.map((entry, index) => (
              <li key={`mesa-${index}`}>
                <strong>{entry.name}:</strong> {entry.value} votantes
                {entry.apellidos && entry.apellidos.length > 0 && (
                  <p>Apellidos: {entry.apellidos.join(', ')}</p>
                )}
                <MesaAgeDistributionChart mesa={entry} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        !loading && <p>No hay datos disponibles para la localidad seleccionada.</p>
      )}
    </div>
  );
};

export default PadronMesas;