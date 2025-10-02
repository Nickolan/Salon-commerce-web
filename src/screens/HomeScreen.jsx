import React, {useState} from 'react'
import '../styles/HomeScreen.css'
import Searchbar from '../Components/SearchBar/searchbar'
import salones from '../utils/Salones.json';


const HomeScreen = () => {
const [lugares, setLugares] = useState([]); //lista de lugares
const handleBuscar = (ubicacion, personasMin) => {
  if (!ubicacion.trim()) return;

  
  const geocoder = new window.google.maps.Geocoder();
  geocoder.geocode({ address: ubicacion }, (results, status) => {
    if (status === 'OK' && results[0]) {
      const { lat, lng } = results[0].geometry.location;

     
      const resultados = salones.filter(salon => {
        const distancia = calcularDistanciaKm(lat, lng, salon.lat, salon.lng);
        return distancia <= 5 && salon.capacidad >= personasMin; 
      });

      if (resultados.length === 0) {
        alert('No se encontraron salones cercanos en esa ubicación.');
      }

      setLugares(resultados);
    } else {
      alert('No se pudo encontrar la ubicación.');
    }
  });
};
function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
  function name(params) {
    
  }
  return (
    <div className='screen-wrapper'>
      <h1>hola</h1>
      <Searchbar onBuscar={handleBuscar} />
      <h2>Lugares encontrados:</h2>
{lugares.length === 0 ? (
  <p>No hay lugares aún.</p>
) : (
  <ul>
  {lugares.map((lugar, index) => (
    <li key={index}>
      <strong>{lugar.name}</strong> - {lugar.direccion} - Capacidad: {lugar.capacidad}
    </li>
  ))}
</ul>
)}
    </div>
  )
}

export default HomeScreen
