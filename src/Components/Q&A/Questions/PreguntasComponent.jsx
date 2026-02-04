import React, { useState, useEffect } from 'react';
import './PreguntasComponent.css';
import { MdOutlineDeleteForever } from 'react-icons/md';
import { LiaEditSolid } from "react-icons/lia";
import PreguntaService from './PreguntaService';
import RespuestasComponent from '../Answers/RespuestasComponent';
import RespuestaService from '../Answers/RespuestaService';

const PreguntasComponent = ({ salonId, usuarioAutenticado, usuarioId }) => {
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

  // Verificar token y usuario
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const tokenId = payload.id;
        setTokenUsuarioId(tokenId);

        if (usuarioId && tokenId !== usuarioId) {
          console.error('⚠️ INCONSISTENCIA DETECTADA');
          console.error('Token ID:', tokenId);
          console.error('Redux ID:', usuarioId);
          setInconsistencia(true);
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

    try {
      setEnviandoPregunta(true);
      await PreguntaService.crearPregunta(salonId, nuevaPregunta);
      setNuevaPregunta('');
      cargarPreguntas();
    } catch (err) {
      console.error('Error al enviar pregunta:', err);
      setError(err.response?.data?.message || 'Error al enviar pregunta');
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

  const renderizarPregunta = (pregunta) => (
    <div key={pregunta.id_pregunta} className="qa-item">
      {/* Encabezado de pregunta - CAMBIADO DE button A div */}
      <div
        onClick={() => setPreguntaExpandida(
          preguntaExpandida === pregunta.id_pregunta ? null : pregunta.id_pregunta
        )}
        className="qa-question-header"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setPreguntaExpandida(
              preguntaExpandida === pregunta.id_pregunta ? null : pregunta.id_pregunta
            );
          }
        }}
      >
        <div className="qa-question-content">
          <div className="qa-question-main">
            {editandoPregunta === pregunta.id_pregunta ? (
              <div className="qa-edit-container">
                <textarea
                  value={editandoContenido}
                  onChange={(e) => setEditandoContenido(e.target.value)}
                  className="qa-edit-textarea"
                  rows={2}
                />
                <div className="qa-edit-buttons">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      guardarPreguntaEditada(pregunta.id_pregunta);
                    }}
                    className="qa-edit-save"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      cancelarEdicionPregunta();
                    }}
                    className="qa-edit-cancel"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <span className="qa-question-text">{pregunta.contenido}</span>
            )}

            {pregunta.tiene_respuestas && (
              <span className="qa-answered-badge">
                <span className="qa-check-icon">✓</span>
                Respondida
              </span>
            )}

            {/* Botones de editar y eliminar pregunta - SÓLO PARA EL AUTOR */}
            {usuarioAutenticado && usuarioId === pregunta.autor.id_usuario && (
              <div className="qa-question-actions">
                {editandoPregunta !== pregunta.id_pregunta && (
                  <button
                    className="qa-edit-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      iniciarEdicionPregunta(pregunta.id_pregunta, pregunta.contenido);
                    }}
                    title="Editar pregunta"
                  >
                    <LiaEditSolid />
                  </button>
                )}

                <button
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
                </button>
              </div>
            )}
          </div>

          <div className="qa-question-meta">
            <span className="qa-author">
              <span className="qa-author-avatar">
                {pregunta.autor.nombre.charAt(0)}
              </span>
              {pregunta.autor.nombre}
            </span>
            <span className="qa-date">{formatearFecha(pregunta.fecha_creacion)}</span>
          </div>
        </div>
        <svg
          className={`qa-chevron ${preguntaExpandida === pregunta.id_pregunta ? 'qa-chevron-open' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Contenido expandido (respuestas) */}
      {preguntaExpandida === pregunta.id_pregunta && (
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
    </div>
  );

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
      {/* Mostrar advertencia si hay inconsistencia */}
      {inconsistencia && (
        <div className="qa-warning" style={{
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          color: '#856404'
        }}>
          <strong>⚠️ Advertencia:</strong> Tu sesión parece inconsistente.
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.reload();
            }}
            style={{
              marginLeft: '1rem',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cerrar sesión y recargar
          </button>
        </div>
      )}

      <h2 className="qa-title">Preguntas y Respuestas</h2>

      {/* Estado "sin consultas" */}
      {preguntas.length === 0 && !error && (
        <div className="qa-empty-state">
          <div className="empty-icon">?</div>
          <h3>No hay consultas sobre este salón</h3>
          <p>Sé el primero en preguntar algo</p>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="qa-error">
          <p>{error}</p>
          <button onClick={cargarPreguntas} className="retry-button">
            Reintentar
          </button>
        </div>
      )}

      {/* Formulario para nueva pregunta */}
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
            <button
              type="submit"
              className="qa-submit-button"
              disabled={enviandoPregunta || !nuevaPregunta.trim()}
            >
              {enviandoPregunta ? 'Enviando...' : 'Enviar pregunta'}
            </button>
          </div>
        </form>
      )}

      {/* Lista de preguntas tipo acordeón */}
      <div className="qa-list">
        {preguntas.map(renderizarPregunta)}
      </div>

      {/* Información para usuarios no autenticados */}
      {!usuarioAutenticado && preguntas.length > 0 && (
        <div className="qa-login-prompt">
          <p>💡 <strong>¿Quieres hacer una pregunta?</strong> Inicia sesión para preguntar al dueño del salón.</p>
        </div>
      )}
    </div>
  );
};

export default PreguntasComponent;