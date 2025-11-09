export const BADGES = {
  equality_champion: {
    id: 'equality_champion',
    name: 'Equality Champion',
    description: 'Master the principles of equality and justice',
    icon: '⚖️',
    requiredCQI: 50,
  },
  green_citizen: {
    id: 'green_citizen',
    name: 'Green Citizen',
    description: 'Champion environmental awareness',
    icon: '🌱',
    requiredCQI: 75,
  },
  rights_defender: {
    id: 'rights_defender',
    name: 'Rights Defender',
    description: 'Understand and protect human rights',
    icon: '🛡️',
    requiredCQI: 100,
  },
  civic_leader: {
    id: 'civic_leader',
    name: 'Civic Leader',
    description: 'Lead by example in civic engagement',
    icon: '👑',
    requiredCQI: 150,
  },
  democracy_guardian: {
    id: 'democracy_guardian',
    name: 'Democracy Guardian',
    description: 'Protect democratic values',
    icon: '🗳️',
    requiredCQI: 200,
  },
};

export const LEVELS = [
  { level: 1, name: 'Civic Newcomer', minCQI: 0 },
  { level: 2, name: 'Aware Citizen', minCQI: 50 },
  { level: 3, name: 'Citizen Advocate', minCQI: 100 },
  { level: 4, name: 'Community Leader', minCQI: 150 },
  { level: 5, name: 'Civic Champion', minCQI: 250 },
];

export const calculateLevel = (cqi) => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (cqi >= LEVELS[i].minCQI) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
};

export const getUnlockedBadges = (cqi) => {
  return Object.values(BADGES).filter(badge => cqi >= badge.requiredCQI);
};

export const getNextBadge = (cqi) => {
  return Object.values(BADGES).find(badge => cqi < badge.requiredCQI);
};

export const calculateStreak = (lastVisit) => {
  if (!lastVisit) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastDate = new Date(lastVisit);
  lastDate.setHours(0, 0, 0, 0);

  const diffTime = today - lastDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays === 1 ? 1 : 0;
};

export const initializeUserData = () => {
  const existing = localStorage.getItem('civicUserData');
  if (!existing) {
    const userData = {
      cqi: 0,
      streak: 0,
      lastVisit: new Date().toISOString(),
      completedModules: [],
      moduleProgress: {},
      quizzesTaken: {},
    };
    localStorage.setItem('civicUserData', JSON.stringify(userData));
    return userData;
  }
  return JSON.parse(existing);
};

export const getUserData = () => {
  return JSON.parse(localStorage.getItem('civicUserData')) || initializeUserData();
};

export const updateUserData = (updates) => {
  const current = getUserData();
  const updated = { ...current, ...updates, lastVisit: new Date().toISOString() };
  localStorage.setItem('civicUserData', JSON.stringify(updated));
  return updated;
};

export const addCQI = (points) => {
  const current = getUserData();
  return updateUserData({ cqi: current.cqi + points });
};

export const completeModule = (moduleId, earnedCQI) => {
  const current = getUserData();
  if (!current.completedModules.includes(moduleId)) {
    return updateUserData({
      cqi: current.cqi + earnedCQI,
      completedModules: [...current.completedModules, moduleId],
    });
  }
  return current;
};

export const updateModuleProgress = (moduleId, slideIndex, totalSlides) => {
  const current = getUserData();
  const progress = Math.round(((slideIndex + 1) / totalSlides) * 100);

  return updateUserData({
    moduleProgress: {
      ...current.moduleProgress,
      [moduleId]: { currentSlide: slideIndex, progress },
    },
  });
};

export const recordQuizTaken = (moduleId) => {
  const current = getUserData();
  return updateUserData({
    quizzesTaken: {
      ...current.quizzesTaken,
      [moduleId]: true,
    },
  });
};

export const hasQuizBeenTaken = (moduleId) => {
  const current = getUserData();
  return current.quizzesTaken?.[moduleId] === true;
};

export const getQuizPoints = (correctAnswers, totalQuestions) => {
  const percentage = (correctAnswers / totalQuestions) * 100;
  if (percentage === 100) return 30;
  if (percentage >= 80) return 25;
  if (percentage >= 60) return 20;
  if (percentage >= 40) return 15;
  return 10;
};
