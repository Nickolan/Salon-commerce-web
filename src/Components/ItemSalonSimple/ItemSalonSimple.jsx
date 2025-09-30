import "./ItemSalonSimple.css";
import { useNavigate } from "react-router-dom";
import BotonFavoritos from "../BotonFavoritos/BotonFavoritos";

const ItemSalonSimple = ({ id_salon, nombre, precio, imagen, reservas, resenias }) => {

    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/detalle-salon/${id_salon}`);
    }

    const calcularPromedio = (salonId) => {
        const reservasDelSalon = reservas.filter(r => r.id_salon === salonId);
        const idsReservas = reservasDelSalon.map(r => r.id_reserva);
        const reseniasDelSalon = resenias.filter(res => idsReservas.includes(res.id_reserva));
        return reseniasDelSalon.length > 0
            ? (reseniasDelSalon.reduce((acc, r) => acc + r.calificacion, 0) / reseniasDelSalon.length).toFixed(1) : "0.0";
    };

    return (
        <div className="salon-card" onClick={handleCardClick}>
            <div className="salon-card-wrapper-img">
                <img src={imagen} alt={nombre} className="salon-card-img" />
                <BotonFavoritos id_salon={id_salon}/>
            </div>
            <div className="salon-card-info-izq">
                <p className="salon-card-info-nombre">{nombre}</p>
                <p className="salon-card-info-precio">$ {precio} / hora</p>
            </div>
            <div className="salon-card-info-der">
                {calcularPromedio(id_salon)}
            </div>
        </div>
    )
}

export default ItemSalonSimple;