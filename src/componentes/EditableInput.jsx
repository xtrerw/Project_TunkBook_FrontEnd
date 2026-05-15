import React, { useRef, useState } from "react";
import "./EditableInput.css";

const suggestions = ["@maria", "@marcos", "@manuel", "@max"];

const EditableInput = ({
  value = "",
  onChange,
  placeholder = "Escribe tu respuesta aquí..."
}) => {
  const divRef = useRef(null);
  const [matches, setMatches] = useState([]);
  const [selected, setSelected] = useState(0);

  const handleInput = () => {
    const content = divRef.current.innerText;
    onChange && onChange(content);

    // 自动补全触发逻辑
    const match = content.match(/@(\w*)$/);
    if (match) {
      const query = match[1].toLowerCase();
      const filtered = suggestions.filter(s => s.toLowerCase().includes(query));
      setMatches(filtered);
    } else {
      setMatches([]);
    }
  };

  const applySuggestion = (s) => {
    const content = divRef.current.innerText;
    const updated = content.replace(/@(\w*)$/, s + " ");
    divRef.current.innerText = updated;
    onChange && onChange(updated);
    setMatches([]);
    divRef.current.focus();
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
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      >
        {value}
      </div>

      {matches.length > 0 && (
        <ul className="autocomplete-list">
          {matches.map((s, i) => (
            <li
              key={s}
              onClick={() => applySuggestion(s)}
              className={i === selected ? "selected" : ""}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EditableInput;