import React from "react";

import "./styles.css";

function Input({ value, onChange, label, type = "text", className }) {
  return (
    <div className="form-row">
      <label className={className}>{label}</label>

      {type === "textarea" ? (
        <textarea
          className={className}
          onChange={onChange}
          id="field"
          value={value}
        />
      ) : (
        <input
          className={className}
          onChange={onChange}
          id="field"
          type={type}
          value={value}
        />
      )}
    </div>
  );
}

export default Input;
