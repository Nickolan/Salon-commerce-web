import React, { useState, useMemo } from 'react';
import SearchbarUsuarios from './ComponenteUserAdmin/SearchbarUsuarios';
import UserCard from './ComponenteUserAdmin/UserCard';
import './PanelUsuarios.css';

const PanelUsuarios = ({ usuarios, reservas, transacciones, selectedMonth, onUserDeleted }) => {
  const [filterValue, setFilterValue] = useState("");

  console.log('PanelUsuarios - usuarios recibidos:', usuarios);
  console.log('PanelUsuarios - reservas recibidas:', reservas?.length);
  console.log('PanelUsuarios - transacciones recibidas:', transacciones?.length);

  // Enriquecer usuarios con sus transacciones
  const usuariosEnriquecidos = useMemo(() => {
    return usuarios.map(usuario => {
      // Encontrar reservas del usuario
      const reservasUsuario = reservas.filter(
        r => r.arrendatario?.id_usuario === usuario.id_usuario
      );

      // Encontrar transacciones de esas reservas
      const reservasConTransacciones = reservasUsuario.map(reserva => {
        const transaccionesReserva = transacciones.filter(
          t => t.reservaIdReserva === reserva.id_reserva || t.id_reserva === reserva.id_reserva
        );
        return {
          ...reserva,
          transacciones: transaccionesReserva
        };
      });

      return {
        ...usuario,
        reservas: reservasConTransacciones
      };
    });
  }, [usuarios, reservas, transacciones]);

  // Filtrar usuarios
  const filteredUsers = useMemo(() => {
    if (!filterValue.trim()) return usuariosEnriquecidos;

    const searchTerm = filterValue.toLowerCase().trim();
    return usuariosEnriquecidos.filter(user => 
      user.nombre?.toLowerCase().includes(searchTerm) ||
      user.apellido?.toLowerCase().includes(searchTerm) ||
      `${user.nombre} ${user.apellido}`.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm)
    );
  }, [filterValue, usuariosEnriquecidos]);

  const handleFilterChange = (value) => {
    setFilterValue(value);
  };

  const handleApplyFilter = () => {
    console.log('Filtro aplicado:', filterValue);
  };

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
              onDeleteUser={handleDeleteUser}
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