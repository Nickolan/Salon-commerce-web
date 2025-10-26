import React, { useState, useEffect } from 'react';
import SearchbarAdmin from '../SearchbarAdmin/SearchbarAdmin';
import BloquearButton from '../BloquearButton/BloquearButton';

// Helper function to format the month string for display
const formatDisplayMonth = (yyyyMm) => { //
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]; //
    const [year, monthIndex] = yyyyMm.split('-').map(Number); //
    return `${monthNames[monthIndex - 1]} ${year}`; //
};

const PanelUsuarios = ({ usuarios, selectedMonth }) => { //
  const [selectedUser, setSelectedUser] = useState(null); //

  useEffect(() => { //
    // If the selected user is no longer in the filtered list (e.g., month changed), deselect them
    if (selectedUser && !usuarios.find(u => u.id_usuario === selectedUser.id_usuario)) { //
        setSelectedUser(null); //
    }
  }, [usuarios, selectedUser]); //

  const handleSelectUser = (user) => { //
    setSelectedUser(user); //
  };

  return (
    <div className="admin-panel"> {/* */}
      <h2 className="panel-title">Usuarios ({formatDisplayMonth(selectedMonth)})</h2> {/* */}
      <SearchbarAdmin //
        items={usuarios} //
        onSelect={handleSelectUser} //
        placeholder="Buscar por ID de usuario..." //
        displayKey="id_usuario" //
      />

      {/* Display user details only if users exist and one is selected */}
      {usuarios.length > 0 && selectedUser && ( //
         <div className="details-container"> {/* */}
          <div className="detail-item"><strong>ID del Usuario</strong><span>{selectedUser.id_usuario}</span></div> {/* */}
          <div className="detail-item"><strong>Nombre de Usuario</strong><span>{selectedUser.nombre_usuario}</span></div> {/* */}
          <div className="detail-item"><strong>Nombre</strong><span>{`${selectedUser.nombre} ${selectedUser.apellido}`}</span></div> {/* */}
          <div className="detail-item"><strong>Correo Electrónico</strong><span>{selectedUser.email}</span></div> {/* */}
          <div className="detail-item"><strong>Teléfono</strong><span>{selectedUser.telefono}</span></div> {/* */}
          {/* Ensure reservas is an array before accessing length */}
          <div className="detail-item"><strong>Cantidad de Reservas</strong><span>{Array.isArray(selectedUser.reservas) ? selectedUser.reservas.length : 0}</span></div> {/* */}
          <BloquearButton type="usuario" id={selectedUser.id_usuario} /> {/* */}
        </div>
      )}

      {/* Message when no users are found for the selected month */}
      {usuarios.length === 0 && ( //
        <p>No se encontraron usuarios para el período seleccionado.</p> //
      )}
    </div>
  );
};

export default PanelUsuarios;