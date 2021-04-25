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
        <option value={0}>Nenhum</option>
        {options.map((option) => (
          <option value={option}>{option}</option>
        ))}
      </select>
    </>
  );
}

export default Select;
