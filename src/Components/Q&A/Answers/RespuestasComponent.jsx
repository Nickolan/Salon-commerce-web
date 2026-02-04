import React from 'react';
import './RespuestasComponent.css';
import { MdOutlineDeleteForever } from 'react-icons/md';
import { LiaEditSolid } from "react-icons/lia";

const RespuestasComponent = ({
  pregunta,
  usuarioAutenticado,
  usuarioId,
  editandoRespuesta,
  editandoContenido,
  setEditandoRespuesta,
  setEditandoContenido,
  respuestasEnviando,
  enviarRespuesta,
  eliminandoRespuesta,
  setEliminandoRespuesta,
  cargarPreguntas,
  RespuestaService, 
}) => {

  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const iniciarEdicionRespuesta = (respuestaId, contenido) => {
    setEditandoRespuesta(prev => ({ ...prev, [respuestaId]: true }));
    setEditandoContenido(contenido);
  };

  const cancelarEdicionRespuesta = (respuestaId) => {
    setEditandoRespuesta(prev => ({ ...prev, [respuestaId]: false }));
    setEditandoContenido('');
  };

  const guardarRespuestaEditada = async (respuestaId) => {
    if (!editandoContenido.trim()) return;

    try {
      await RespuestaService.actualizarRespuesta(respuestaId, editandoContenido);
      setEditandoRespuesta(prev => ({ ...prev, [respuestaId]: false }));
      setEditandoContenido('');
      cargarPreguntas();
    } catch (err) {
      console.error('Error al editar respuesta:', err);
      throw err; // Deja que el error se maneje en el componente padre si es necesario
    }
  };

  const eliminarRespuesta = async (respuestaId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta respuesta?')) {
      return;
    }

    try {
      setEliminandoRespuesta(prev => ({ ...prev, [respuestaId]: true }));
      await RespuestaService.eliminarRespuesta(respuestaId);
      cargarPreguntas();
    } catch (err) {
      console.error('Error al eliminar respuesta:', err);
      throw err; // Deja que el error se maneje en el componente padre si es necesario
    } finally {
      setEliminandoRespuesta(prev => ({ ...prev, [respuestaId]: false }));
    }
  };

  return (
    <div className="qa-expanded-content">
      {pregunta.respuestas.length === 0 ? (
        <div className="qa-no-answers">
          <p className="qa-no-answers-text">Aún no hay respuestas para esta pregunta.</p>
          {usuarioId === pregunta.salon_id && (
            <p className="qa-owner-hint">Como dueño del salón, puedes ser el primero en responder.</p>
          )}
        </div>
      ) : (
        <div className="qa-answers-list">
          {pregunta.respuestas.map((respuesta) => (
            <div
              key={respuesta.id_respuesta}
              className={`qa-answer ${respuesta.destacada ? 'qa-answer-highlighted' : ''}`}
            >
              <div className="qa-answer-header">
                <div className="qa-answer-author">
                  <span className="qa-author-avatar">
                    {respuesta.autor.nombre.charAt(0)}
                  </span>
                  <div>
                    <span className="qa-answer-author-name">{respuesta.autor.nombre}</span>
                    {respuesta.destacada && (
                      <span className="qa-owner-badge">
                        <span className="qa-star-icon">⭐</span>
                        Dueño del salón
                      </span>
                    )}
                  </div>
                </div>
                <div className="qa-answer-actions">
                  <span className="qa-answer-date">
                    {formatearFecha(respuesta.fecha_creacion)}
                  </span>

                  {/* Botones de editar y eliminar respuesta - SÓLO PARA EL AUTOR */}
                  {usuarioAutenticado && usuarioId === respuesta.autor.id_usuario && (
                    <div className="qa-answer-action-buttons">
                      {editandoRespuesta[respuesta.id_respuesta] ? (
                        <>
                          <button
                            onClick={() => guardarRespuestaEditada(respuesta.id_respuesta)}
                            className="qa-edit-save"
                            disabled={!editandoContenido.trim()}
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => cancelarEdicionRespuesta(respuesta.id_respuesta)}
                            className="qa-edit-cancel"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="qa-edit-button"
                            onClick={() => iniciarEdicionRespuesta(respuesta.id_respuesta, respuesta.contenido)}
                            title="Editar respuesta"
                          >
                            <LiaEditSolid />
                          </button>
                          <button
                            className="qa-delete-button"
                            onClick={() => eliminarRespuesta(respuesta.id_respuesta)}
                            disabled={eliminandoRespuesta[respuesta.id_respuesta]}
                            title="Eliminar respuesta"
                          >
                            <MdOutlineDeleteForever
                              className={eliminandoRespuesta[respuesta.id_respuesta] ? 'qa-deleting' : ''}
                            />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {editandoRespuesta[respuesta.id_respuesta] ? (
                <textarea
                  value={editandoContenido}
                  onChange={(e) => setEditandoContenido(e.target.value)}
                  className="qa-edit-textarea"
                  rows={2}
                />
              ) : (
                <p className="qa-answer-content">{respuesta.contenido}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Formulario para responder (solo dueño del salón) */}
      {usuarioAutenticado && usuarioId === pregunta.salon.publicador.id_usuario && (
        <div className="qa-answer-form">
          <textarea
            placeholder="Escribe tu respuesta como dueño del salón..."
            className="qa-answer-textarea"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const value = e.target.value.trim();
                if (value) {
                  enviarRespuesta(pregunta.id_pregunta, value);
                  e.target.value = '';
                }
              }
            }}
            disabled={respuestasEnviando[pregunta.id_pregunta]}
          />
          <button
            onClick={(e) => {
              const textarea = e.target.previousSibling;
              const value = textarea.value.trim();
              if (value) {
                enviarRespuesta(pregunta.id_pregunta, value);
                textarea.value = '';
              }
            }}
            className="qa-answer-submit"
            disabled={respuestasEnviando[pregunta.id_pregunta]}
          >
            {respuestasEnviando[pregunta.id_pregunta] ? 'Enviando...' : 'Responder'}
          </button>
        </div>
      )}
    </div>
  );
};

export default RespuestasComponent;
