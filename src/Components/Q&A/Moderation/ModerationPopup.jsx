import React, { useState, useEffect } from 'react';
import './ModerationPopup.css';
import { RiSpam2Fill, RiForbidFill, RiFileEditFill, RiRestartFill, RiQuestionFill } from 'react-icons/ri';
import PreguntaService from '../Questions/PreguntaService';

const ModerationPopup = ({
  preguntaId,
  onRechazar,
  onCancelar,
  isOpen
}) => {
  const [paso, setPaso] = useState(1);
  const [motivoCategoria, setMotivoCategoria] = useState('');
  const [motivoDetalle, setMotivoDetalle] = useState('');
  const [enviando, setEnviando] = useState(false);

  const opcionesRechazo = [
    { value: 'spam', label: 'Spam o publicidad no deseada', icon: <RiSpam2Fill /> },
    { value: 'lenguaje_obsceno', label: 'Lenguaje obsceno o ofensivo', icon: <RiForbidFill /> },
    { value: 'contenido_inapropiado', label: 'Contenido inapropiado', icon: <RiForbidFill /> },
    { value: 'fuera_de_tema', label: 'Fuera del tema del salón', icon: <RiFileEditFill /> },
    { value: 'duplicada', label: 'Pregunta duplicada', icon: <RiRestartFill /> },
    { value: 'otro', label: 'Otro motivo', icon: <RiQuestionFill /> },
  ];

  useEffect(() => {
    if (isOpen) {
      setPaso(1);
      setMotivoCategoria('');
      setMotivoDetalle('');
    }
  }, [isOpen]);

  const handleConfirmarRechazo = async () => {
    if (paso === 1) {
      setPaso(2);
      return;
    }

    if (!motivoCategoria || !motivoDetalle.trim()) {
      alert('Por favor selecciona un motivo y proporciona detalles');
      return;
    }

    try {
      setEnviando(true);
      await onRechazar(preguntaId, motivoCategoria, motivoDetalle);
    } catch (error) {
      console.error('Error al rechazar pregunta:', error);
      alert(error.message || 'Error al rechazar la pregunta. Intenta nuevamente.');
    } finally {
      setEnviando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="moderation-overlay" onClick={onCancelar}>
      <div className="moderation-popup" onClick={(e) => e.stopPropagation()}>
        <div className="moderation-header">
          <RiSpam2Fill className="moderation-icon" />
          <h3>{paso === 1 ? '¿Rechazar esta pregunta?' : 'Selecciona el motivo'}</h3>
          <div
            className="moderation-close"
            onClick={onCancelar}
            role="button"
          >
            ×
          </div>
        </div>

        <div className="moderation-content">
          {paso === 1 ? (
            <div className="moderation-confirm">
              <p>Esta pregunta será marcada como rechazada y no será visible para otros usuarios.</p>
              <div className="moderation-warning">
                <strong><RiForbidFill /> Esta acción no se puede deshacer</strong>
                <p>Se notificará al usuario sobre el rechazo.</p>
              </div>
            </div>
          ) : (
            <div className="moderation-reasons">
              <p>Selecciona la categoría principal del motivo:</p>

              <div className="reasons-grid">
                {opcionesRechazo.map((opcion) => (
                  <div
                    key={opcion.value}
                    className={`reason-option ${motivoCategoria === opcion.value ? 'selected' : ''}`}
                    onClick={() => setMotivoCategoria(opcion.value)}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="reason-icon">{opcion.icon}</span>
                    <span className="reason-label">{opcion.label}</span>
                  </div>
                ))}
              </div>

              {motivoCategoria && (
                <div className="reason-detail">
                  <label>Explica brevemente el motivo:</label>
                  <textarea
                    value={motivoDetalle}
                    onChange={(e) => setMotivoDetalle(e.target.value)}
                    placeholder={
                      motivoCategoria === 'otro'
                        ? 'Describe el motivo específico...'
                        : 'Proporciona más detalles...'
                    }
                    rows={3}
                    maxLength={200}
                    required
                  />
                  <div className="char-counter">
                    <span>{motivoDetalle.length}/200 caracteres</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="moderation-actions">
          <div
            className="moderation-btn cancel-btn"
            onClick={onCancelar}
            role="button"
            tabIndex={0}
          >
            Cancelar
          </div>
          <div
            className={`moderation-btn confirm-btn ${(paso === 2 && (!motivoCategoria || !motivoDetalle.trim())) ? 'disabled' : ''}`}
            onClick={handleConfirmarRechazo}
            role="button"
            tabIndex={0}
          >
            {enviando ? 'Procesando...' : (paso === 1 ? 'Continuar' : 'Rechazar Pregunta')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModerationPopup;
