import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import "./BarraBusqueda.css"

const BarraBusqueda = ({placeholder="Buscar...", onSearch, totalSalones=0}) => {

    const [query, setQuery] = useState("");

    return (
        <div className="barra-busqueda-container">
            <form onSubmit={(e) => {
                e.preventDefault();
                onSearch(query);
            }} className="form-barraBusqueda">
                <FiSearch/>
                <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                />
            </form>
            <span className="total-salones">{totalSalones} salones</span>
        </div>
    )

}

export default BarraBusqueda;