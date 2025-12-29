export default function FormInput({
  label,
  icon,
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
}) {
  return (
    <div className="form-control">
      {label && <label className="label text-base mb-1">{label}</label>}

      <div className="relative">
        {icon && <span className="absolute top-4 left-3 mr-1">{icon}</span>}

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-10 py-3 border border-base-content/20 outline-none rounded-lg ${className}`}
        />
      </div>
    </div>
  );
}
