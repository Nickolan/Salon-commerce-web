class GpsService {
  static isGeolocationSupported() {
    return 'geolocation' in navigator;
  }

  static getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!this.isGeolocationSupported()) {
        reject(new Error('Tu navegador no soporta geolocalización'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitud: position.coords.latitude,
            longitud: position.coords.longitude
          });
        },
        (error) => {
          let errorMessage = 'Error al obtener la ubicación';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Parece que tiene la ubicación desactivada puede dirigirse a ver información del sitio y activar ubicación';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'La información de ubicación no está disponible';
              break;
            case error.TIMEOUT:
              errorMessage = 'Se agotó el tiempo de espera para obtener la ubicación';
              break;
            default:
              errorMessage = error.message || 'Error desconocido al obtener la ubicación';
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }

  static calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distancia = R * c; 
    return distancia;
  }

  static deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  static ordenarSalonesPorDistancia(salones, ubicacionUsuario) {
    if (!ubicacionUsuario || !ubicacionUsuario.latitud || !ubicacionUsuario.longitud) {
      return salones;
    }

    return salones.map(salon => {
      const distancia = this.calcularDistancia(
        ubicacionUsuario.latitud,
        ubicacionUsuario.longitud,
        salon.latitud,
        salon.longitud
      );
      return {
        ...salon,
        distancia: parseFloat(distancia.toFixed(1))
      };
    }).sort((a, b) => a.distancia - b.distancia);
  }

  static filtrarSalonesPorRadio(salones, ubicacionUsuario, radioMaximo = 10) {
    if (!ubicacionUsuario || !ubicacionUsuario.latitud || !ubicacionUsuario.longitud) {
      return [];
    }

    return this.ordenarSalonesPorDistancia(salones, ubicacionUsuario)
      .filter(salon => salon.distancia <= radioMaximo);
  }
}

export default GpsService;