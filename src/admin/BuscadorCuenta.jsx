import React from 'react'
import "./BuscadorCuenta.css"
const BuscadorCuenta = ({ value, onChange, placeholder = "Buscar...", className = "" }) => {
  return (
    <div className={`buscador-componente ${className}`}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <i className="bx bx-search" />
    </div>
  )
}

export default BuscadorCuenta
