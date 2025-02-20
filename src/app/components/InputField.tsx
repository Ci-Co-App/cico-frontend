import React from "react";

interface InputFieldProps {
  type: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  required,
}) => {
  return (
    <div className="w-full">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
      />
    </div>
  );
};

export default InputField;
