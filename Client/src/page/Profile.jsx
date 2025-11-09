import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Award, TrendingUp, Target } from 'lucide-react';
import BadgeCard from '../components/eduModule/BadgeCard';
import ProgressBar from '../components/eduModule/ProgressBar';
import { getUserData, calculateLevel, getUnlockedBadges, getNextBadge, BADGES } from '../mockData/gamification';
import { MODULES } from '../mockData/modules';

export default function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [level, setLevel] = useState(null);
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [nextBadge, setNextBadge] = useState(null);

  useEffect(() => {
    const data = getUserData();
    setUserData(data);
    setLevel(calculateLevel(data.cqi));
    setUnlockedBadges(getUnlockedBadges(data.cqi));
    setNextBadge(getNextBadge(data.cqi));
  }, []);

  if (!userData) return null;

  const completionRate = Math.round((userData.completedModules.length / MODULES.length) * 100);
  const nextLevelCQI = level && level.level < 5 ? calculateLevel(userData.cqi + 1).minCQI : null;
  const cqiToNextLevel = nextLevelCQI ? nextLevelCQI - userData.cqi : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-400 to-purple-400 w-24 h-24 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-4xl">👤</span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Civic Learner</h1>
              <p className="text-lg text-gray-600 mb-3">{level?.name} - Level {level?.level}</p>
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 px-4 py-2 rounded-xl">
                  <span className="text-sm text-gray-600">Total CQI:</span>
                  <span className="text-xl font-bold text-blue-600 ml-2">{userData.cqi}</span>
                </div>
                <div className="bg-orange-50 px-4 py-2 rounded-xl">
                  <span className="text-sm text-gray-600">Streak:</span>
                  <span className="text-xl font-bold text-orange-600 ml-2">{userData.streak} days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-200 p-2 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Level Progress</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {cqiToNextLevel > 0 ? `${cqiToNextLevel} CQI to next level` : 'Max level reached!'}
              </p>
              {cqiToNextLevel > 0 && (
                <ProgressBar progress={(userData.cqi / nextLevelCQI) * 100} color="blue" />
              )}
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-200 p-2 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Badges Earned</h3>
              </div>
              <p className="text-3xl font-bold text-purple-600">
                {unlockedBadges.length} / {Object.keys(BADGES).length}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-200 p-2 rounded-lg">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Completion</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {userData.completedModules.length} / {MODULES.length} modules
              </p>
              <ProgressBar progress={completionRate} color="green" />
            </div>
          </div>
        </div>

        {nextBadge && (
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 mb-8 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Next Badge Milestone</h3>
            <div className="flex items-center gap-4">
              <span className="text-4xl">{nextBadge.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{nextBadge.name}</p>
                <p className="text-sm text-gray-600 mb-2">{nextBadge.description}</p>
                <div className="flex items-center gap-3">
                  <ProgressBar
                    progress={(userData.cqi / nextBadge.requiredCQI) * 100}
                    color="blue"
                  />
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    {nextBadge.requiredCQI - userData.cqi} CQI needed
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.values(BADGES).map(badge => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                unlocked={userData.cqi >= badge.requiredCQI}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Module Progress</h2>
          <div className="space-y-4">
            {MODULES.map(module => {
              const isCompleted = userData.completedModules.includes(module.id);
              const progress = userData.moduleProgress[module.id]?.progress || 0;

              return (
                <div key={module.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <span className="text-3xl">{module.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{module.title}</h3>
                      {isCompleted && (
                        <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                          Completed
                        </span>
                      )}
                    </div>
                    <ProgressBar progress={isCompleted ? 100 : progress} color="blue" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
