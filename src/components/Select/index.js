import React from "react";

import "./styles.css";

function Select({ value, options, label, onSelect, className }) {
  return (
    <>
      <label className={className}>{label}</label>
      <select
        value={value}
        onChange={onSelect}
        className={`select-field ${className}`}
      >
        <option value={null}>Nenhum</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}

export default Select;
