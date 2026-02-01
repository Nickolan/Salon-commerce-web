import React from 'react';
import { Button } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { iniciarConversacion } from '../../../store/features/chat/chatSlice';

// Supongamos que recibes los datos del salón como props
const BotonContactar = ({ publicanteId, usuarioLogueadoId }) => {
  const dispatch = useDispatch();

  const handleContactar = () => {
    // Despachamos la acción para crear/buscar chat y abrir el panel
    dispatch(iniciarConversacion({ 
      clienteId: usuarioLogueadoId, 
      publicanteId: publicanteId 
    }));
  };

  return (
    <Button 
      type="primary" 
      shape="round" 
      icon={<MessageOutlined />} 
      size="large"
      style={{ 
        backgroundColor: '#6a1b9a', 
        borderColor: '#6a1b9a',
        fontWeight: 'bold',
      }}
      onClick={handleContactar}
    >
      Contactar al Publicante
    </Button>
  );
};

export default BotonContactar;