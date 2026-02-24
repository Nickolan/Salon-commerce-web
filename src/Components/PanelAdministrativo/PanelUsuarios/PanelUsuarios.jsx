import React, { useState, useMemo } from 'react';
import SearchbarUsuarios from './ComponenteUserAdmin/SearchbarUsuarios';
import UserCard from './ComponenteUserAdmin/UserCard';
import './PanelUsuarios.css';

const PanelUsuarios = ({ usuarios, selectedMonth, onUserDeleted }) => { // <-- Añadir onUserDeleted
  const [filterValue, setFilterValue] = useState("");

  console.log('PanelUsuarios - usuarios recibidos:', usuarios);

  // Filtrar usuarios
  const filteredUsers = useMemo(() => {
    if (!filterValue.trim()) return usuarios;

    const searchTerm = filterValue.toLowerCase().trim();
    return usuarios.filter(user => 
      user.nombre?.toLowerCase().includes(searchTerm) ||
      user.apellido?.toLowerCase().includes(searchTerm) ||
      `${user.nombre} ${user.apellido}`.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm)
    );
  }, [filterValue, usuarios]);

  const handleFilterChange = (value) => {
    setFilterValue(value);
  };

  const handleApplyFilter = () => {
    console.log('Filtro aplicado:', filterValue);
  };

  // NUEVO: Manejador para cuando se elimina un usuario
  const handleDeleteUser = (userId) => {
    if (onUserDeleted) {
      onUserDeleted(userId);
    }
  };

  return (
    <div className="panel-usuarios">
      <SearchbarUsuarios
        filterValue={filterValue}
        onFilterChange={handleFilterChange}
        onApplyFilter={handleApplyFilter}
        totalResultados={filteredUsers.length}
      />

      <div className="usuarios-cards-container">
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <UserCard
              key={user.id_usuario}
              user={user}
              selectedMonth={selectedMonth}
              onDeleteUser={handleDeleteUser} // <-- Pasar el manejador
            />
          ))
        ) : (
          <div className="no-results">
            {filterValue.trim() 
              ? `No se encontraron usuarios con "${filterValue}"`
              : 'No se encontraron usuarios para el período seleccionado.'
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default PanelUsuarios;