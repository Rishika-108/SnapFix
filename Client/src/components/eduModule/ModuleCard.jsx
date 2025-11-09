import { Link } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { getUserData } from '../../mockData/gamification';

export default function ModuleCard({ module }) {
  const userData = getUserData();
  const isCompleted = userData.completedModules.includes(module.id);
  const progress = userData.moduleProgress[module.id]?.progress || 0;

  const colorMap = {
    'from-blue-200 to-blue-300': 'blue',
    'from-green-200 to-green-300': 'green',
    'from-purple-200 to-purple-300': 'purple',
    'from-emerald-200 to-teal-300': 'emerald',
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden group">
      <div className={`h-32 bg-gradient-to-br ${module.color} flex items-center justify-center relative`}>
        <span className="text-6xl group-hover:scale-110 transition-transform">{module.icon}</span>
        {isCompleted && (
          <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md">
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{module.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{module.description}</p>

        <div className="space-y-3 mb-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-600">Progress</span>
              <span className="text-xs font-bold text-gray-700">{progress}%</span>
            </div>
            <ProgressBar progress={progress} color={colorMap[module.color]} />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <span className="font-medium text-gray-600">Reward:</span>
              <span className="font-bold text-blue-600">+{module.cqiReward} CQI</span>
            </div>
          </div>
        </div>

        <Link
          to={`/module/${module.id}`}
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all group"
        >
          {isCompleted ? 'Review Module' : progress > 0 ? 'Continue Learning' : 'Start Module'}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
