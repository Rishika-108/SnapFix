export default function BadgeCard({ badge, unlocked = false }) {
  return (
    <div
      className={`relative flex flex-col items-center p-4 rounded-xl transition-all ${
        unlocked
          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 shadow-md'
          : 'bg-gray-100 opacity-60'
      }`}
    >
      <div
        className={`text-4xl mb-2 transition-transform ${
          unlocked ? 'scale-100' : 'scale-90 grayscale'
        }`}
      >
        {badge.icon}
      </div>
      <h4 className={`font-semibold text-sm text-center ${unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
        {badge.name}
      </h4>
      <p className="text-xs text-gray-500 text-center mt-1">{badge.description}</p>
      {!unlocked && (
        <div className="mt-2 text-xs font-medium text-blue-600">
          {badge.requiredCQI} CQI needed
        </div>
      )}
    </div>
  );
}
