import React, { useState } from 'react';
import SearchbarAdmin from '../SearchbarAdmin/SearchbarAdmin';
import BloquearButton from '../BloquearButton/BloquearButton';

const PanelUsuarios = ({ usuarios }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="admin-panel">
      <h2 className="panel-title">Usuarios</h2>
      <SearchbarAdmin
        items={usuarios}
        onSelect={handleSelectUser}
        placeholder="Buscar por ID de usuario..."
        displayKey="id_usuario"
      />

      {selectedUser && (
        <div className="details-container">
          <div className="detail-item">
            <strong>ID del Usuario</strong>
            <span>{selectedUser.id_usuario}</span>
          </div>
          <div className="detail-item">
            <strong>Nombre de Usuario</strong>
            <span>{selectedUser.nombre_usuario}</span>
          </div>
          <div className="detail-item">
            <strong>Nombre</strong>
            <span>{`${selectedUser.nombre} ${selectedUser.apellido}`}</span>
          </div>
          <div className="detail-item">
            <strong>Correo Electrónico</strong>
            <span>{selectedUser.email}</span>
          </div>
          <div className="detail-item">
            <strong>Teléfono</strong>
            <span>{selectedUser.telefono}</span>
          </div>
          <div className="detail-item">
            <strong>Cantidad de Reservas</strong>
            <span>{selectedUser.reservas.length}</span>
          </div>
          <BloquearButton type="usuario" id={selectedUser.id_usuario} />
        </div>
      )}
    </div>
  );
};

export default PanelUsuarios;