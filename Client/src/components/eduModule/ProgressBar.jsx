export default function ProgressBar({ progress, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    emerald: 'bg-emerald-500',
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
      <div
        className={`h-full ${colorClasses[color]} transition-all duration-500 ease-out rounded-full`}
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
  );
}
