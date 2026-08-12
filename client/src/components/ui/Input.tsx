interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="mb-4">
  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
      <input
        {...props}
        className={`w-full px-4 py-2.5 rounded-lg border ${
          error ? 'border-red-400 focus:ring-red-300' : 'border-slate-200 focus:ring-indigo-300'
       } focus:outline-none focus:ring-2 transition text-slate-800 dark:text-slate-100 dark:bg-slate-800 dark:border-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}