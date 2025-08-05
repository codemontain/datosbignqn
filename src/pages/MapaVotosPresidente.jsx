import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import usePresidenteDataNuevo from '../hooks/usePresidenteDataNuevo';
import { COLORS } from '../utils/colors';
import L from 'leaflet'; // Importar Leaflet para el popup
import DepartmentBarChart from '../components/DepartmentBarChart';

const MapaVotosPresidente = () => {
  const [geoJsonData, setGeoJsonData] = useState({});
  const [selectedDepartmentData, setSelectedDepartmentData] = useState(null);
  const presidenteData = usePresidenteDataNuevo();

  // Mapeo de nombres de departamentos de GeoJSON a nombres de CSV
  const departmentNameMap = {
    'chos malal': 'Chos Malal',
    'loncopue': 'Loncopué',
    'minas': 'Minas',
    'ñorquin': 'Ñorquín',
    'pehuenches': 'Pehuenches',
  };

  useEffect(() => {
    const loadGeoJson = async () => {
      const departments = ['chosmalal', 'loncopue', 'minasg', 'ñorquin', 'pehuenches'];
      const loadedData = {};
      for (const dept of departments) {
        const response = await fetch(`${import.meta.env.BASE_URL}${dept}.geojson`);
        loadedData[dept] = await response.json();
      }
      setGeoJsonData(loadedData);
    };
    loadGeoJson();
  }, []);

  if (!presidenteData || Object.keys(geoJsonData).length === 0) {
    return <p>Cargando datos del mapa...</p>;
  }

  const candidateKeys = [
    'Sergio Massa',
    'Javier Milei',
    'Patricia Bullrich',
    'Juan Schiaretti',
    'Myriam Bregman',
    'Votos en Blanco',
  ];

  // Función para normalizar nombres de departamentos (manejar tildes y capitalización)
  const normalizeDepartmentName = (name) => {
    if (!name) return '';
    // Convertir a minúsculas, reemplazar caracteres especiales y capitalizar primera letra de cada palabra
    return name
      .normalize("NFD") // Descomponer caracteres acentuados en su forma base y diacríticos
      .replace(/[\u0300-\u036f]/g, "") // Eliminar diacríticos
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  const getStyle = (feature) => {
    const departmentNameRaw = feature.properties.nombre;
    const departmentName = normalizeDepartmentName(departmentNameRaw);

    const departmentData = presidenteData.find(d => normalizeDepartmentName(d.Departamento) === departmentName);

    let fillColor = '#ccc'; // Color por defecto

    if (departmentData) {
      const departmentIndex = ['Chos Malal', 'Loncopue', 'Minas', 'Ñorquin', 'Pehuenches'].indexOf(departmentName);
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
      const departmentData = presidenteData.find(d => d.Departamento === departmentNameInCsv);

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
      <h2>Mapa de Votos Presidenciales por Departamento</h2>
      <p>Este mapa muestra la distribución de votos presidenciales por departamento. Haz clic en un departamento para ver el detalle de votos por candidato.</p>
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
        <p style={{ marginTop: '10px' }}><strong>Análisis del Departamento:</strong> En <strong>{selectedDepartmentData.Departamento}</strong>, el candidato presidencial con más votos es <strong>{selectedDepartmentData && candidateKeys.reduce((prev, current) => (selectedDepartmentData[prev] > selectedDepartmentData[current] ? prev : current))}</strong>, con un total de <strong>{selectedDepartmentData && candidateKeys.reduce((prev, current) => (selectedDepartmentData[prev] > selectedDepartmentData[current] ? selectedDepartmentData[prev] : selectedDepartmentData[current]))}</strong> votos.</p>
      )}
    </div>
  );
};

export default MapaVotosPresidente;
