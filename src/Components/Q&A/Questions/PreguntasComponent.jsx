import React, { useState, useEffect } from 'react';
import './PreguntasComponent.css';
import { MdOutlineDeleteForever } from 'react-icons/md';
import { LiaEditSolid } from "react-icons/lia";
import { FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import { RiSpam2Fill } from 'react-icons/ri';
import PreguntaService from './PreguntaService';
import RespuestasComponent from '../Answers/RespuestasComponent';
import RespuestaService from '../Answers/RespuestaService';
import ModerationPopup from '../Moderation/ModerationPopup';

const PreguntasComponent = ({ salonId, usuarioAutenticado, usuarioId, esDuenoSalon }) => {
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nuevaPregunta, setNuevaPregunta] = useState('');
  const [preguntaExpandida, setPreguntaExpandida] = useState(null);
  const [enviandoPregunta, setEnviandoPregunta] = useState(false);
  const [respuestasEnviando, setRespuestasEnviando] = useState({});
  const [eliminandoPregunta, setEliminandoPregunta] = useState({});
  const [tokenUsuarioId, setTokenUsuarioId] = useState(null);
  const [inconsistencia, setInconsistencia] = useState(false);
  const [editandoPregunta, setEditandoPregunta] = useState(null);
  const [editandoContenido, setEditandoContenido] = useState('');
  const [eliminandoRespuesta, setEliminandoRespuesta] = useState({});
  const [editandoRespuesta, setEditandoRespuesta] = useState({});
  const [mostrarSoloAprobadas, setMostrarSoloAprobadas] = useState(true);
  const [misPreguntas, setMisPreguntas] = useState([]);
  const [preguntaSeleccionada, setPreguntaSeleccionada] = useState(null);
  const [mostrarPopupModeracion, setMostrarPopupModeracion] = useState(false);

  const testToken = async () => {
    try {
      const token = PreguntaService.getToken();
      console.log('Token existe:', !!token);
      if (token) {
        console.log('Primeros 20 chars:', token.substring(0, 20) + '...');
        
        // Decodificar token para ver payload
        const base64Payload = token.split('.')[1];
        const payload = JSON.parse(atob(base64Payload));
        console.log('Token payload:', payload);
        console.log('Usuario ID del token:', payload.id);
        console.log('Usuario ID de Redux:', usuarioId);
      }
    } catch (e) {
      console.error('Error al verificar token:', e);
    }
  };

  // Verificar token y usuario
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const tokenId = payload.id;
        setTokenUsuarioId(tokenId);

        if (usuarioId && tokenId !== usuarioId) {
          console.warn('⚠️ Inconsistencia detectada - Confiando en Redux ID:', usuarioId);
          setInconsistencia(false);
        }
      } catch (e) {
        console.error('Error decodificando token:', e);
      }
    }
  }, [usuarioId]);

  // Cargar preguntas
  useEffect(() => {
    if (salonId) {
      cargarPreguntas();
    }
  }, [salonId]);

  const cargarPreguntas = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await PreguntaService.getPreguntasPorSalon(salonId);
      setPreguntas(data);
    } catch (err) {
      console.error('Error al cargar preguntas:', err);
      setError('Error al cargar preguntas. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const enviarPregunta = async (e) => {
    e.preventDefault();
    if (!nuevaPregunta.trim() || !usuarioAutenticado) {
      setError(usuarioAutenticado ? 'Escribe una pregunta' : 'Debes iniciar sesión para preguntar');
      return;
    }

    if (esDuenoSalon) {
      setError('No puedes hacer preguntas en tu propio salón');
      return;
    }

    try {
      setEnviandoPregunta(true);
      await PreguntaService.crearPregunta(salonId, nuevaPregunta);
      setNuevaPregunta('');
      cargarPreguntas();
    } catch (err) {
      console.error('Error al enviar pregunta:', err);
      if (err.response?.status === 401) {
        setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else {
        setError(err.response?.data?.message || 'Error al enviar pregunta');
      }
    } finally {
      setEnviandoPregunta(false);
    }
  };

  const eliminarPregunta = async (preguntaId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) {
      return;
    }

    try {
      setEliminandoPregunta(prev => ({ ...prev, [preguntaId]: true }));
      await PreguntaService.eliminarPregunta(preguntaId);
      cargarPreguntas();
    } catch (err) {
      console.error('Error al eliminar pregunta:', err);
      setError(err.response?.data?.message || 'Error al eliminar pregunta');
    } finally {
      setEliminandoPregunta(prev => ({ ...prev, [preguntaId]: false }));
    }
  };

  const enviarRespuesta = async (preguntaId, contenido) => {
    if (!contenido.trim()) return;

    try {
      setRespuestasEnviando(prev => ({ ...prev, [preguntaId]: true }));
      await RespuestaService.crearRespuesta(preguntaId, contenido, salonId);
      cargarPreguntas();
    } catch (err) {
      console.error('Error al enviar respuesta:', err);
      setError(err.response?.data?.message || 'Error al enviar respuesta');
    } finally {
      setRespuestasEnviando(prev => ({ ...prev, [preguntaId]: false }));
    }
  };

  const iniciarEdicionPregunta = (preguntaId, contenido) => {
    setEditandoPregunta(preguntaId);
    setEditandoContenido(contenido);
  };

  const cancelarEdicionPregunta = () => {
    setEditandoPregunta(null);
    setEditandoContenido('');
  };

  const guardarPreguntaEditada = async (preguntaId) => {
    if (!editandoContenido.trim()) return;

    try {
      await PreguntaService.actualizarPregunta(preguntaId, editandoContenido);
      setEditandoPregunta(null);
      setEditandoContenido('');
      cargarPreguntas();
    } catch (err) {
      console.error('Error al editar pregunta:', err);
      setError(err.response?.data?.message || 'Error al editar pregunta');
    }
  };

  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleRechazarPregunta = async (preguntaId, motivoCategoria, motivoDetalle) => {
    try {
      // Primero obtener información del salón para verificar que es el dueño
      const pregunta = preguntas.find(p => p.id_pregunta === preguntaId);
      if (!pregunta) return;
      
      if (!esDuenoSalon) {
        alert('Solo el dueño del salón puede rechazar preguntas');
        return;
      }
      
      // Llamar al servicio
      await PreguntaService.rechazarPregunta(preguntaId, motivoCategoria, motivoDetalle);
      
      // Actualizar el estado local
      setPreguntas(preguntas.map(p => 
        p.id_pregunta === preguntaId 
          ? { 
              ...p, 
              estado_moderacion: 'rechazada',
              motivo_categoria: motivoCategoria,
              motivo_detalle: motivoDetalle,
              activa: false
            }
          : p
      ));
      
      // Cerrar el popup
      setMostrarPopupModeracion(false);
      setPreguntaSeleccionada(null);
      
      // Mostrar mensaje de éxito
      alert('Pregunta rechazada exitosamente');
      
    } catch (error) {
      console.error('Error al rechazar pregunta:', error);
      alert(error.response?.data?.message || 'Error al rechazar pregunta');
    }
  };

  const renderizarPregunta = (pregunta) => {
    console.log('Renderizando pregunta:', {
      id: pregunta.id_pregunta,
      esDuenoSalon: esDuenoSalon, 
      usuarioAutenticado: usuarioAutenticado,
      estado: pregunta.estado_moderacion,
      usuarioId: usuarioId,
      autorId: pregunta.autor?.id_usuario,
      salonPublicadorId: pregunta.salon?.publicador?.id_usuario
    });

    if (mostrarSoloAprobadas && pregunta.estado_moderacion !== 'aprobada' && !esAdmin) {
      return null;
    }

    return (
      <div
        key={pregunta.id_pregunta}
        className={`qa-item ${pregunta.estado_moderacion !== 'aprobada' ? 'qa-pending' : ''}`}
      >
        <div
          onClick={() => {
            if (pregunta.estado_moderacion === 'aprobada') {
              setPreguntaExpandida(
                preguntaExpandida === pregunta.id_pregunta ? null : pregunta.id_pregunta
              );
            }
          }}
          className="qa-question-header"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && pregunta.estado_moderacion === 'aprobada') {
              e.preventDefault();
              setPreguntaExpandida(
                preguntaExpandida === pregunta.id_pregunta ? null : pregunta.id_pregunta
              );
            }
          }}
        >
          <div className="qa-question-content">
            <div className="qa-question-main">
              {pregunta.estado_moderacion === 'pendiente' && (
                <span className="qa-moderation-status qa-pending-status">
                  <FaClock /> Pendiente de moderación
                </span>
              )}
              {pregunta.estado_moderacion === 'rechazada' && (
                <span className="qa-moderation-status qa-rejected-status">
                  <FaTimes /> Rechazada: {pregunta.motivo_detalle || pregunta.motivo_categoria}
                </span>
              )}

              {editandoPregunta === pregunta.id_pregunta ? (
                <div className="qa-edit-container">
                  <textarea
                    value={editandoContenido}
                    onChange={(e) => setEditandoContenido(e.target.value)}
                    className="qa-edit-textarea"
                    rows={2}
                  />
                  <div className="qa-edit-buttons">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        guardarPreguntaEditada(pregunta.id_pregunta);
                      }}
                      className="qa-edit-save"
                    >
                      Guardar
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelarEdicionPregunta();
                      }}
                      className="qa-edit-cancel"
                    >
                      Cancelar
                    </div>
                  </div>
                </div>
              ) : (
                <span className="qa-question-text">{pregunta.contenido}</span>
              )}

              <div className="qa-question-actions">
                {pregunta.estado_moderacion === 'aprobada' && usuarioAutenticado && usuarioId === pregunta.autor.id_usuario && (
                  <>
                    {editandoPregunta !== pregunta.id_pregunta && (
                      <div
                        className="qa-edit-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          iniciarEdicionPregunta(pregunta.id_pregunta, pregunta.contenido);
                        }}
                        title="Editar pregunta"
                      >
                        <LiaEditSolid />
                      </div>
                    )}
                    <div
                      className="qa-delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        eliminarPregunta(pregunta.id_pregunta);
                      }}
                      disabled={eliminandoPregunta[pregunta.id_pregunta]}
                      title="Eliminar pregunta"
                    >
                      <MdOutlineDeleteForever
                        className={eliminandoPregunta[pregunta.id_pregunta] ? 'qa-deleting' : ''}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="qa-question-meta">
              <span className="qa-author">
                <span className="qa-author-avatar">
                  {pregunta.autor.nombre.charAt(0)}
                </span>
                {pregunta.autor.nombre}
              </span>
              <span className="qa-date">{formatearFecha(pregunta.fecha_creacion)}</span>
              
              <div className="qa-meta-right">
                {pregunta.estado_moderacion === 'aprobada' && pregunta.tiene_respuestas && (
                  <span className="qa-respondido-badge">
                    Respondido
                  </span>
                )}
                
               {usuarioAutenticado && esDuenoSalon && pregunta.estado_moderacion === 'aprobada' && ( 
                  <div
                    className="qa-reject-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreguntaSeleccionada(pregunta.id_pregunta);
                      setMostrarPopupModeracion(true);
                    }}
                    title="Rechazar pregunta"
                  >
                    <RiSpam2Fill />
                </div>
                )}

              </div>
              
              {pregunta.estado_moderacion !== 'aprobada' && (
                <span className={`qa-moderation-badge qa-${pregunta.estado_moderacion}`}>
                  {pregunta.estado_moderacion === 'pendiente' ? 'Pendiente' : 'Rechazada'}
                </span>
              )}
            </div>
          </div>

          {pregunta.estado_moderacion === 'aprobada' && (
            <svg
              className={`qa-chevron ${preguntaExpandida === pregunta.id_pregunta ? 'qa-chevron-open' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>

        {pregunta.estado_moderacion === 'aprobada' && preguntaExpandida === pregunta.id_pregunta && (
          <RespuestasComponent
            pregunta={pregunta}
            usuarioAutenticado={usuarioAutenticado}
            usuarioId={usuarioId}
            editandoRespuesta={editandoRespuesta}
            editandoContenido={editandoContenido}
            setEditandoRespuesta={setEditandoRespuesta}
            setEditandoContenido={setEditandoContenido}
            respuestasEnviando={respuestasEnviando}
            enviarRespuesta={enviarRespuesta}
            eliminandoRespuesta={eliminandoRespuesta}
            setEliminandoRespuesta={setEliminandoRespuesta}
            cargarPreguntas={cargarPreguntas}
            RespuestaService={RespuestaService}
          />
        )}

        {pregunta.estado_moderacion === 'rechazada' && (
          <div className="qa-rejection-reason">
            <strong>Motivo de rechazo:</strong> {pregunta.motivo_detalle || pregunta.motivo_categoria}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="qa-container">
        <div className="qa-loading">
          <div className="spinner"></div>
          <p>Cargando preguntas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="qa-container">

      <h2 className="qa-title">Preguntas y Respuestas</h2>

      <div className="qa-moderation-info">
        <p>
          <FaClock /> Las preguntas son revisadas antes de publicarse para evitar spam y contenido inapropiado.
        </p>
      </div>

      {preguntas.filter(p => mostrarSoloAprobadas ? p.estado_moderacion === 'aprobada' : true).length === 0 && !error && (
        <div className="qa-empty-state">
          <div className="empty-icon">?</div>
          <h3>{mostrarSoloAprobadas ? 'No hay consultas aprobadas' : 'No hay consultas'}</h3>
          <p>{mostrarSoloAprobadas ? 'Sé el primero en preguntar algo' : 'No hay preguntas para mostrar'}</p>
        </div>
      )}

      {error && (
        <div className="qa-error">
          <p>{error}</p>
          <div onClick={cargarPreguntas} className="retry-button" role="button">
            Reintentar
          </div>
        </div>
      )}

      {usuarioAutenticado && (
        <form onSubmit={enviarPregunta} className="qa-form">
          <textarea
            value={nuevaPregunta}
            onChange={(e) => setNuevaPregunta(e.target.value)}
            placeholder="¿Tienes alguna pregunta sobre este salón?"
            className="qa-textarea"
            rows={3}
            maxLength={500}
            disabled={enviandoPregunta}
          />
          <div className="qa-form-footer">
            <span className="qa-char-count">{nuevaPregunta.length}/500</span>
            <div
              onClick={enviarPregunta}
              className={`qa-submit-button ${enviandoPregunta || !nuevaPregunta.trim() ? 'disabled' : ''}`}
              role="button"
            >
              {enviandoPregunta ? 'Enviando...' : 'Enviar pregunta'}
            </div>
          </div>
        </form>
      )}

      <div className="qa-list">
        {preguntas
          .filter(p => mostrarSoloAprobadas ? p.estado_moderacion === 'aprobada' : true)
          .map(renderizarPregunta)}
      </div>

      {mostrarPopupModeracion && (
        <ModerationPopup
          preguntaId={preguntaSeleccionada}
          onRechazar={handleRechazarPregunta}
          onCancelar={() => {
            setMostrarPopupModeracion(false);
            setPreguntaSeleccionada(null);
          }}
          isOpen={mostrarPopupModeracion}
        />
      )}

      {!usuarioAutenticado && preguntas.filter(p => p.estado_moderacion === 'aprobada').length > 0 && (
        <div className="qa-login-prompt">
          <p>💡 <strong>¿Quieres hacer una pregunta?</strong> Inicia sesión para preguntar al dueño del salón.</p>
        </div>
      )}
    </div>
  );
};

export default PreguntasComponent;
