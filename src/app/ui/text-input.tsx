export default function TextInput({ name, type, placeholder }: { name: string; type: string; placeholder: string }) {
    return (
      <div>
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required
          className="w-full p-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-transparent"
        />
      </div>
    );
  }