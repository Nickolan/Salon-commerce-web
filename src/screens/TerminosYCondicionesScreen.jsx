import React, { useState } from "react";
import "../styles/TerminosYCondicionesScreen.css";

export default function TerminosYCondicionesScreen() {
  const [openIndex, setOpenIndex] = useState(null);

  const sections = [
    {
      title: "1. Generalidades del Servicio",
      content: (
        <>
          <p>La plataforma ofrece un espacio digital para que los usuarios (en adelante, "Publicadores") puedan publicar y alquilar salones de estudio por hora, y para que otros usuarios (en adelante, "Arrendatarios") puedan buscar, reservar y pagar por su uso. Nos reservamos el derecho de modificar o discontinuar el servicio en cualquier momento sin previo aviso.</p>
        </>
      ),
    },
    {
      title: "2. Registro y Cuentas de Usuario",
      content: (
        <>
          <p>Para utilizar los servicios de la plataforma, debes crear una cuenta de usuario. Eres responsable de mantener la confidencialidad de tus datos de acceso y de toda la actividad que ocurra bajo tu cuenta. Si olvidas tu contraseña, puedes restablecerla a través de un enlace enviado a tu correo electrónico.</p>
          <p><strong>Edición de Perfil:</strong> Puedes modificar tu información personal en la pantalla de edición de datos de perfil en cualquier momento.</p>
        </>
      ),
    },
    {
      title: "3. Publicaciones de Salones",
      content: (
        <>
          <p>Los publicadores pueden listar sus salones de estudio en la plataforma, proporcionando la siguiente información:</p>
          <ul>
            <li>Nombre del salón</li>
            <li>Descripción detallada</li>
            <li>Precio por hora</li>
            <li>Capacidad de personas</li>
            <li>Ubicación</li>
            <li>Días y franjas horarias de disponibilidad</li>
            <li>Reglas específicas del salón</li>
            <li>Lista de equipamientos (Internet, proyector, pizarrón, etc.)</li>
          </ul>
          <p><strong>Borradores de Publicación:</strong> Puedes guardar una publicación como borrador y completarla en un momento posterior.</p>
          <p><strong>Validación de Publicaciones:</strong> Toda nueva publicación debe ser validada por un administrador antes de ser mostrada al público. Nos reservamos el derecho de rechazar publicaciones que no cumplan con nuestros estándares de calidad o que infrinjan estos términos.</p>
          <p><strong>Modificación y Ocultación:</strong> Los publicadores pueden modificar o deshabilitar (ocultar) sus publicaciones en cualquier momento.</p>
        </>
      ),
    },
    {
      title: "4. Búsqueda y Reservas",
      content: (
        <>
          <p>Los arrendatarios pueden buscar salones utilizando filtros como ubicación, precio por hora, equipamientos y reseñas.</p>
          <p><strong>Proceso de reserva:</strong> Una vez que encuentres un salón, puedes seleccionar la fecha y hora para realizar la reserva.</p>
          <p><strong>Gestión de Reservas:</strong> Los usuarios tienen acceso a una lista de sus reservas realizadas como arrendatario y a las reservas que otros han hecho en sus salones como publicador.</p>
          <p><strong>Favoritos:</strong> Puedes marcar salones como favoritos para guardarlos y reservarlos en el futuro.</p>
        </>
      ),
    },
    {
      title: "5. Pagos y Comisiones",
      content: (
        <>
          <p>El pago de las reservas se realiza a través de Mercado Pago y criptomonedas. Al realizar un pago, el usuario acepta las políticas de privacidad y los términos de servicio de la plataforma de pago correspondiente.</p>
          <p><strong>Comisión por Gestión:</strong> A los publicadores se les cobrará una comisión del 10% sobre las ganancias de cada reserva. Este cobro se deduce automáticamente del monto total del alquiler antes de transferir las ganancias al publicador.</p>
          <p>Por ejemplo, si un salón se alquila por $5000 por hora, la comisión será de $500, y el publicador recibirá $4500.</p>
        </>
      ),
    },
    {
      title: "6. Política de Cancelación",
      content: (
        <>
          <p>Las cancelaciones de reservas están sujetas a la siguiente política:</p>
          <ul>
            <li><strong>Cancelación con más de 24 horas de anticipación:</strong> Se realizará un reembolso total del monto pagado.</li>
            <li><strong>Cancelación con menos de 24 horas de anticipación:</strong> No se realizará ningún reembolso. En este caso, el pago no se devuelve al arrendatario y la reserva se considera completada.</li>
          </ul>
        </>
      ),
    },
    {
      title: "7. Reseñas y Comentarios",
      content: (
        <>
          <p>Una vez que una reserva ha sido completada y la fecha establecida ha pasado, los arrendatarios pueden dejar una reseña sobre el salón.</p>
          <p><strong>Contenido de las Reseñas:</strong> Las reseñas deben ser honestas y reflejar la experiencia real del usuario. Nos reservamos el derecho de eliminar cualquier reseña que contenga lenguaje ofensivo, discriminatorio o que infrinja nuestros estándares de la comunidad.</p>
        </>
      ),
    },
    {
      title: "8. Notificaciones",
      content: (
        <>
          <p>Para mantenerte informado sobre la actividad de tu cuenta, te enviaremos notificaciones por correo electrónico sobre los siguientes eventos:</p>
          <ul>
            <li>Creación de cuenta y verificación de correo electrónico</li>
            <li>Confirmación de reserva realizada</li>
            <li>Aprobación de una publicación</li>
            <li>Mensajes y actualizaciones relevantes</li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <div className="terminos-container">
      <div className="terminos-card">
        <header>
          <h1>Términos y Condiciones de Uso</h1>
          <p className="fecha">Fecha de última actualización: <span>8 de septiembre de 2025</span></p>
          <p className="intro">Bienvenido a nuestra plataforma de alquiler de salones de estudio. Al acceder y utilizar nuestros servicios, aceptas y te comprometes a cumplir con los siguientes términos y condiciones.</p>
        </header>

        <main>
          {sections.map((s, idx) => (
            <section key={idx} className="section">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="section-header"
              >
                <span>{s.title}</span>
                <span>{openIndex === idx ? "-" : "+"}</span>
              </button>

              <div className={`section-content ${openIndex === idx ? "open" : ""}`}>
                {s.content}
              </div>
            </section>
          ))}

         
        </main>
      </div>
    </div>
  );
}
