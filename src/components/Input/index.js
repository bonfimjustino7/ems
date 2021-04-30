import React from "react";

import "./styles.css";
import InputMask from "react-input-mask";

function Input({
  value,
  onChange,
  label,
  type = "text",
  className,
  mask,
  readOnly,
}) {
  return (
    <div className="form-row">
      <label className={className}>{label}</label>

      {type === "textarea" ? (
        <textarea
          className={className}
          onChange={onChange}
          id="field"
          value={value}
          readOnly={readOnly}
        />
      ) : mask ? (
        <InputMask
          className={className}
          mask={mask}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
        />
      ) : (
        <input
          className={className}
          onChange={onChange}
          id="field"
          type={type}
          value={value}
          readOnly={readOnly}
        />
      )}
    </div>
  );
}

export default Input;
