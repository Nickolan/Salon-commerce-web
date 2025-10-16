import React, { useState } from "react";
import "../styles/PoliticaPrivacidadScreen.css";

// SE UTILIZA UNA DIRECCIÓN DE EMAIL FALSA "privacidad@focusroom.com", LUEGO HAY QUE CAMBIARLA POR LA REAL

export default function PoliticaPrivacidadScreen() {
  const [openIndex, setOpenIndex] = useState(null);

  const sections = [
    {
      title: "1. Información general",
      content: (
        <>
          <p>
            En <strong>Focus Room</strong>, valoramos la privacidad de nuestros usuarios y nos comprometemos a proteger la información personal que nos proporcionan al utilizar nuestros servicios. Esta política describe cómo recopilamos, utilizamos y protegemos los datos de los usuarios que interactúan con nuestra plataforma.
          </p>
          <p>
            Esta política aplica a todos los usuarios de Focus Room, tanto <em>publicadores</em> como <em>arrendatarios</em>, dentro del territorio de Argentina.
          </p>
          <p>
            Para cualquier consulta o solicitud relacionada con la privacidad, podés comunicarte con nosotros a través del correo electrónico: <strong>privacidad@focusroom.com</strong>.
          </p>
        </>
      ),
    },
    {
      title: "2. Datos personales que recopilamos",
      content: (
        <>
          <p>
            Al registrarte o utilizar nuestros servicios, recopilamos los siguientes datos personales:
          </p>
          <ul>
            <li>Nombre y dirección de correo electrónico (obligatorios al registrarse).</li>
            <li>Contraseña de acceso a la cuenta.</li>
            <li>DNI, teléfono, ubicación y coordenadas (opcionales dentro del perfil).</li>
          </ul>
          <p>
            {/* Además, recopilamos automáticamente la dirección IP del dispositivo desde el cual accedés a la plataforma, con fines de seguridad y control de actividad. */}
          </p>
          <p>
            No permitimos el inicio de sesión mediante redes sociales ni terceros proveedores de identidad.
          </p>
        </>
      ),
    },
    {
      title: "3. Uso de la información",
      content: (
        <>
          <p>Utilizamos los datos personales de los usuarios para los siguientes fines:</p>
          <ul>
            <li>Gestionar reservas y publicaciones de salones.</li>
            <li>Contactar usuarios y enviar correos de confirmación de reserva.</li>
            <li>Mostrar salones cercanos según la ubicación del usuario.</li>
            <li>Gestionar pagos a través de las plataformas integradas.</li>
            <li>Verificar la identidad de los usuarios y mantener la seguridad del sistema.</li>
          </ul>
          <p>No utilizamos la información para fines publicitarios ni comerciales ajenos al funcionamiento de la plataforma.</p>
        </>
      ),
    },
    {
      title: "4. Procesamiento de pagos",
      content: (
        <>
          <p>
            Los pagos dentro de Focus Room se gestionan a través de las plataformas externas <strong>Mercado Pago</strong> y <strong>Coinbase</strong>. Al realizar un pago, el usuario acepta las políticas de privacidad y los términos de servicio de dichos proveedores.
          </p>
          <p>
            Focus Room <strong>no almacena información financiera ni datos de tarjetas</strong> en su base de datos. Toda la información de pago se procesa directamente en los entornos seguros de las pasarelas mencionadas.
          </p>
        </>
      ),
    },
    {
      title: "5. Almacenamiento y seguridad de los datos",
      content: (
        <>
          <p>
            Los datos personales se almacenan en la base de datos del servidor de Focus Room. Aunque actualmente no contamos con mecanismos avanzados de seguridad implementados, tomamos medidas razonables para proteger la información frente a accesos no autorizados o pérdidas accidentales.
          </p>
          <p>
            {/* En futuras versiones del sistema, se prevé la implementación de protocolos de seguridad adicionales como cifrado de contraseñas, HTTPS y control de roles. */}
          </p>
        </>
      ),
    },
    {
      title: "6. Derechos de los usuarios",
      content: (
        <>
          <p>Los usuarios de Focus Room pueden ejercer los siguientes derechos sobre sus datos personales:</p>
          <ul>
            <li><strong>Acceso:</strong> conocer qué información personal se encuentra registrada en su cuenta.</li>
            <li><strong>Rectificación:</strong> modificar o actualizar los datos personales desde su perfil.</li>
            <li><strong>Eliminación:</strong> solicitar la eliminación total de su cuenta y los datos asociados.</li>
          </ul>
          <p>
            Para ejercer cualquiera de estos derechos, los usuarios pueden enviar una solicitud a <strong>privacidad@focusroom.com</strong>.
          </p>
        </>
      ),
    },
    {
      title: "7. Notificaciones y comunicaciones",
      content: (
        <>
          <p>
            Focus Room podrá enviar correos electrónicos automáticos relacionados con el uso de la plataforma, incluyendo:
          </p>
          <ul>
            <li>Confirmaciones de reserva.</li>
            <li>Actualizaciones o cambios en la disponibilidad de salones.</li>
            <li>Mensajes importantes sobre la cuenta del usuario.</li>
          </ul>
          <p>No enviamos publicidad ni correos promocionales.</p>
        </>
      ),
    },
    {
      title: "8. Uso de cookies y tecnologías similares",
      content: (
        <>
          <p>
            Actualmente, Focus Room no utiliza cookies ni tecnologías similares. Sin embargo, en futuras versiones del sitio se podrían implementar cookies con fines de autenticación y mejora de la experiencia de usuario.
          </p>
          <p>
            Si dichas funciones se efectúan y activan, se informará claramente al usuario.
          </p>
        </>
      ),
    },
    {
      title: "9. Integraciones de terceros",
      content: (
        <>
          <p>
            Nuestra plataforma integra servicios externos para mejorar la experiencia del usuario, entre ellos:
          </p>
          <ul>
            <li><strong>Google Maps:</strong> para mostrar ubicaciones y distancias.</li>
            <li><strong>Mercado Pago:</strong> para procesar pagos en moneda local.</li>
            <li><strong>Coinbase:</strong> para gestionar pagos en criptomonedas.</li>
            <li><strong>ChatBot con IA:</strong> para brindar asistencia automatizada al usuario.</li>
          </ul>
          <p>
            Estos servicios pueden recopilar información según sus propias políticas de privacidad, las cuales el usuario puede consultar directamente en los sitios oficiales de cada proveedor.
          </p>
        </>
      ),
    },
    {
      title: "10. Cambios en esta política",
      content: (
        <>
          <p>
            Focus Room podrá actualizar esta Política de Privacidad en cualquier momento. Las modificaciones serán publicadas en esta misma página y entrarán en vigor desde el momento de su publicación.
          </p>
          <p>Última actualización: <strong>14 de octubre de 2025</strong></p>
        </>
      ),
    },
  ];

  return (
    <div className="privacidad-container">
      <div className="privacidad-card">
        <header>
          <h1>Política de Privacidad</h1>
          <p className="fecha">
            Fecha de última actualización: <span>14 de octubre de 2025</span>
          </p>
          <p className="intro">
            Esta Política de Privacidad describe cómo <strong>Focus Room</strong> recopila, utiliza, almacena y protege los datos personales de sus usuarios. Al utilizar nuestros servicios, aceptás los términos descritos a continuación.
          </p>
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
