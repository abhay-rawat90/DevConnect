const Input = ({ label, type, name,value, onChange}) => (
    <div className="mb-4">
        <label className="block mb-1 font-medium">{label}</label>
        <input
        type= {type}
        name = {name}
        value = {value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded"
        />
    </div>
);

export default Input;