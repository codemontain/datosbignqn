import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import useDepartamentosData from '../hooks/useDepartamentosData'; // Usar el hook de departamentos
import { COLORS } from '../utils/colors';
import L from 'leaflet'; // Importar Leaflet para el popup
import DepartmentBarChart from '../components/DepartmentBarChart';

const MapaVotosGobernador = () => {
  const [geoJsonData, setGeoJsonData] = useState({});
  const [selectedDepartmentData, setSelectedDepartmentData] = useState(null);
  const rawGobernadorData = useDepartamentosData(); // Datos crudos del CSV
  const [gobernadorData, setGobernadorData] = useState(null); // Datos transformados

  // Mapeo de nombres de departamentos de GeoJSON (propiedad 'nombre' en minúsculas) a nombres de CSV
  const departmentNameMap = useMemo(() => ({
    'chos malal': 'Chos Malal',
    'loncopue': 'Loncopué',
    'minas': 'Minas',
    'ñorquin': 'Ñorquín',
    'pehuenches': 'Pehuenches',
  }), []);

  useEffect(() => {
    const loadGeoJson = async () => {
      const departments = ['chosmalal', 'loncopue', 'minasg', 'ñorquin', 'pehuenches'];
      const loadedData = {};
      for (const dept of departments) {
        const response = await fetch(`/geodataelecnort/${dept}.geojson`);
        loadedData[dept] = await response.json();
      }
      setGeoJsonData(loadedData);
    };
    loadGeoJson();
  }, []);

  useEffect(() => {
    if (rawGobernadorData) {
      const transformedData = {};
      rawGobernadorData.forEach(row => {
        const candidate = row.Candidato;
        for (const deptKey in row) {
          if (deptKey !== 'Candidato') {
            const departmentNameInCsv = departmentNameMap[deptKey.toLowerCase()]; // Normalizar la clave del departamento
            if (departmentNameInCsv) { // Asegurarse de que el mapeo exista
              if (!transformedData[departmentNameInCsv]) {
                transformedData[departmentNameInCsv] = { Departamento: departmentNameInCsv };
              }
              transformedData[departmentNameInCsv][candidate] = +row[deptKey] || 0;
            }
          }
        }
      });
      setGobernadorData(Object.values(transformedData));
    }
  }, [rawGobernadorData, departmentNameMap]);


  if (!gobernadorData || Object.keys(geoJsonData).length === 0) {
    return <p>Cargando datos del mapa...</p>;
  }

  const candidateKeys = [
    'Marcos Koopmann Irizar',
    'Rolando Figueroa',
    'Ramón Rioseco',
    'Mario Pablo Cervi',
    'Carlos Eguía',
    'Patricia Jure',
  ];

  const getStyle = (feature) => {
    const departmentNameRaw = feature.properties.nombre;
    const departmentNameInCsv = departmentNameMap[departmentNameRaw.toLowerCase()];

    const departmentData = gobernadorData.find(d => d.Departamento === departmentNameInCsv);

    let fillColor = '#ccc'; // Color por defecto

    if (departmentData) {
      const departmentIndex = Object.values(departmentNameMap).indexOf(departmentNameInCsv);
      if (departmentIndex !== -1) {
        fillColor = COLORS[departmentIndex % COLORS.length];
      }
    }

    return {
      fillColor: fillColor,
      weight: 1,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.nombre) {
      const departmentNameRaw = feature.properties.nombre;
      const departmentNameInCsv = departmentNameMap[departmentNameRaw.toLowerCase()];
      const departmentData = gobernadorData.find(d => d.Departamento === departmentNameInCsv);

      layer.on({
        click: () => {
          setSelectedDepartmentData(departmentData);
        }
      });

      let popupContent = `<h3>${departmentNameInCsv}</h3>`;
      if (departmentData) {
        popupContent += '<ul>';
        candidateKeys.forEach(candidate => {
          const votes = departmentData[candidate];
          if (votes !== undefined) {
            popupContent += `<li>${candidate}: ${votes}</li>`;
          }
        });
        popupContent += '</ul>';
      } else {
        popupContent += '<p>Datos no disponibles para este departamento.</p>';
      }
      layer.bindPopup(popupContent);
    }
  };

  return (
    <div>
      <h2>Mapa de Votos Gobernador por Departamento</h2>
      <p>Este mapa muestra la distribución de votos de gobernador por departamento. Haz clic en un departamento para ver el detalle de votos por candidato.</p>
      <MapContainer center={[-37.5, -70.5]} zoom={8} style={{ height: '600px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {Object.keys(geoJsonData).map(deptKey => (
          <GeoJSON key={deptKey} data={geoJsonData[deptKey]} style={getStyle} onEachFeature={onEachFeature} />
        ))}
      </MapContainer>
      <DepartmentBarChart departmentData={selectedDepartmentData} candidateKeys={candidateKeys} />
      {selectedDepartmentData && (
        <p style={{ marginTop: '10px' }}><strong>Análisis del Departamento:</strong> En <strong>{selectedDepartmentData.Departamento}</strong>, el candidato a gobernador con más votos es <strong>{selectedDepartmentData && candidateKeys.reduce((prev, current) => (selectedDepartmentData[prev] > selectedDepartmentData[current] ? prev : current))}</strong>, con un total de <strong>{selectedDepartmentData && candidateKeys.reduce((prev, current) => (selectedDepartmentData[prev] > selectedDepartmentData[current] ? selectedDepartmentData[prev] : selectedDepartmentData[current]))}</strong> votos.</p>
      )}
    </div>
  );
};

export default MapaVotosGobernador;
