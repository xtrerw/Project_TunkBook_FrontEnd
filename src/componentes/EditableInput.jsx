import React, { useRef, useState } from "react";
import "./EditableInput.css";

const EditableInput = ({
  value = "",
  onChange,
  placeholder = "Escribe tu respuesta aquí..."
}) => {
  // Guarda la referencia al div editable para leer su contenido actual.
  const divRef = useRef(null);

  // Notifica al componente padre cada vez que el usuario modifica el texto.
  const handleInput = () => {
    const content = divRef.current.innerText;
    onChange && onChange(content);
  };

  return (
    <div className="editable-wrapper">
      <div
        ref={divRef}
        contentEditable
        className="editable-input"
        role="textbox"
        aria-multiline="true"
        onInput={handleInput}
        // El CSS usa este atributo para mostrar el placeholder cuando esta vacio.
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      >
        {value}
      </div>
    </div>
  );
};

export default EditableInput;
