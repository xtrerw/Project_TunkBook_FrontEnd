import React, { useRef } from "react";
import "./EditableInput.css";

const EditableInput = ({ value = "", onChange, placeholder = "Escribe tu respuesta aquí..." }) => {
  const divRef = useRef(null);

  const handleInput = () => {
    const content = divRef.current.innerText;
    onChange && onChange(content);
  };

  return (
    <div
      ref={divRef}
      contentEditable
      className="editable-input"
      role="textbox"
      aria-multiline="true"
      onInput={handleInput}
      data-placeholder={placeholder}
      suppressContentEditableWarning={true}
    >
      {value}
    </div>
  );
};

export default EditableInput;