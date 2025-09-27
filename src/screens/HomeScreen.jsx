import React, {useState} from 'react'
import '../styles/HomeScreen.css'
import Searchbar from '../Components/SearchBar/searchbar'
Searchbar

const HomeScreen = () => {
const [lugares, setLugares] = useState([]); //lista de lugares
const handleBuscar = (ubicacion) => {
  if (!ubicacion) return;
  const geocoder = new window.google.maps.Geocoder();
  geocoder.geocode({ address: ubicacion }, (results, status) => {
    if (status === 'OK' && results[0]) {
      const location = results[0].geometry.location;

      
      const map = new window.google.maps.Map(document.createElement('div'));
      const service = new window.google.maps.places.PlacesService(map);

      service.nearbySearch(
        {
          location,
          radius: 2000,
          type:  ['restaurant', 'cafe', 'bar'], // cambiá tipos si querés
        },
        (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setLugares(results);
          } else {
            setLugares([]);
          }
        }
      );
    } else {
      alert('No se pudo encontrar la ubicación.');
    }
  });
};
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
        <strong>{lugar.name}</strong> - {lugar.vicinity || lugar.formatted_address}
      </li>
    ))}
  </ul>
)}
    </div>
  )
}

export default HomeScreen
