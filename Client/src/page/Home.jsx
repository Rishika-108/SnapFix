import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Flame, TrendingUp } from 'lucide-react';
import ModuleCard from '../components/eduModule/ModuleCard';
import { MODULES } from '../mockData/modules';
import { getUserData, calculateLevel, initializeUserData } from '../mockData/gamification';

export default function Home() {
  const [userData, setUserData] = useState(null);
  const [level, setLevel] = useState(null);

  useEffect(() => {
    const data = initializeUserData();
    setUserData(data);
    setLevel(calculateLevel(data.cqi));
  }, []);

  if (!userData) return null;

  const inProgressModule = MODULES.find(
    m => userData.moduleProgress[m.id] && !userData.completedModules.includes(m.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, Citizen! 👋
          </h2>
          <p className="text-gray-600">Continue your journey to becoming a civic champion</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total CQI</p>
                <p className="text-3xl font-bold text-gray-800">{userData.cqi}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Civic Quotient Index</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-orange-100 p-3 rounded-xl">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Learning Streak</p>
                <p className="text-3xl font-bold text-gray-800">{userData.streak}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Days in a row</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-100 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Level</p>
                <p className="text-xl font-bold text-gray-800">{level?.name}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Level {level?.level}</p>
          </div>
        </div>

        {inProgressModule && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 mb-8 shadow-xl text-white">
            <h3 className="text-lg font-semibold mb-2">Continue Learning</h3>
            <p className="text-blue-100 mb-4">Pick up where you left off</p>
            <Link
              to={`/module/${inProgressModule.id}`}
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Resume: {inProgressModule.title}
            </Link>
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Available Modules</h3>
          <p className="text-gray-600">Explore topics and earn CQI points</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {MODULES.map(module => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </div>
    </div>
  );
}
