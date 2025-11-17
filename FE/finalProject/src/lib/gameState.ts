// Game State Management for Petualangan Informatika
export interface User {
  id: string;
  username: string;
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  badges: string[];
  avatar: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'active' | 'completed';
  xpReward: number;
  progress: number;
  chapter: number;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  xpGained: number;
  completed: boolean;
}

const baseUserState: User = {
  id: '',
  username: '',
  name: '',
  level: 1,
  xp: 0,
  maxXp: 100,
  badges: [],
  avatar: '👤',
};

// Default game data
export const defaultUser: User = { ...baseUserState };

export const missions: Mission[] = [
  {
    id: '1',
    title: 'Introduction to Programming',
    description: 'Learn the basics of programming and algorithms',
    status: 'active',
    xpReward: 50,
    progress: 0,
    chapter: 1,
  },
  {
    id: '2',
    title: 'Data Structures',
    description: 'Explore arrays, lists, and basic data structures',
    status: 'locked',
    xpReward: 75,
    progress: 0,
    chapter: 2,
  },
  {
    id: '3',
    title: 'Object-Oriented Programming',
    description: 'Master classes, objects, and OOP principles',
    status: 'locked',
    xpReward: 100,
    progress: 0,
    chapter: 3,
  },
  {
    id: '4',
    title: 'Web Development Basics',
    description: 'HTML, CSS, and JavaScript fundamentals',
    status: 'locked',
    xpReward: 125,
    progress: 0,
    chapter: 4,
  },
  {
    id: '5',
    title: 'Database Systems',
    description: 'Learn SQL and database design principles',
    status: 'locked',
    xpReward: 150,
    progress: 0,
    chapter: 5,
  },
  {
    id: '6',
    title: 'Advanced Algorithms',
    description: 'Sorting, searching, and optimization algorithms',
    status: 'locked',
    xpReward: 200,
    progress: 0,
    chapter: 6,
  },
];

export const leaderboard: Array<{
  rank: number;
  name: string;
  xp: number;
  avatar: string;
  isCurrentUser: boolean;
}> = [];

// Game state management
class GameStateManager {
  private user: User = { ...defaultUser };
  private listeners: ((user: User) => void)[] = [];

  getUser(): User {
    return { ...this.user };
  }

  setUserProfile(overrides: Partial<User>): void {
    this.user = { ...this.user, ...baseUserState, ...overrides };
    this.notifyListeners();
  }

  resetUserProfile(): void {
    this.user = { ...baseUserState };
    this.notifyListeners();
  }

  addXP(amount: number): boolean {
    this.user.xp += amount;
    let leveledUp = false;

    // Check for level up
    while (this.user.xp >= this.user.maxXp) {
      this.user.xp -= this.user.maxXp;
      this.user.level += 1;
      this.user.maxXp = Math.floor(this.user.maxXp * 1.5);
      leveledUp = true;
    }

    this.notifyListeners();
    return leveledUp;
  }

  completeMission(missionId: string): void {
    const mission = missions.find(m => m.id === missionId);
    if (mission && mission.status !== 'completed') {
      mission.status = 'completed';
      mission.progress = 100;
      this.addXP(mission.xpReward);
      
      // Unlock next mission
      const nextMission = missions.find(m => m.chapter === mission.chapter + 1);
      if (nextMission && nextMission.status === 'locked') {
        nextMission.status = 'active';
      }
    }
  }

  subscribe(listener: (user: User) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getUser()));
  }
}

export const gameState = new GameStateManager();

// Quiz questions
export const quizQuestions = {
  '1': [
    {
      question: 'What is an algorithm?',
      options: [
        'A programming language',
        'A step-by-step procedure to solve a problem',
        'A type of computer',
        'A software application'
      ],
      correct: 1
    },
    {
      question: 'Which of the following is a programming language?',
      options: ['HTML', 'CSS', 'Python', 'SQL'],
      correct: 2
    },
    {
      question: 'What does CPU stand for?',
      options: [
        'Computer Processing Unit',
        'Central Processing Unit',
        'Central Program Unit',
        'Computer Program Unit'
      ],
      correct: 1
    }
  ],
  '2': [
    {
      question: 'What is an array?',
      options: [
        'A collection of elements of the same type',
        'A programming language',
        'A type of loop',
        'A function'
      ],
      correct: 0
    },
    {
      question: 'Which operation is typically O(1) for arrays?',
      options: ['Searching', 'Sorting', 'Accessing by index', 'Inserting at beginning'],
      correct: 2
    }
  ]
};
