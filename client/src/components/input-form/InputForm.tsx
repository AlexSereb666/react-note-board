import React, { ChangeEvent } from "react";
import './InputForm.css';

interface InputFormProps {
    placeholder?: string;
    value?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const InputForm: React.FC<InputFormProps> = ({ placeholder, value, onChange }) => {
  return (
    <div className="input-form">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="custom-input"
      />
    </div>
  );
}
 
export default InputForm;
