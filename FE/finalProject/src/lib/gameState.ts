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

// Default game data
export const defaultUser: User = {
  id: '1',
  username: 'explorer_andi',
  name: 'Andi Pratama',
  level: 3,
  xp: 150,
  maxXp: 200,
  badges: ['first_mission', 'quiz_master'],
  avatar: '👨‍🚀'
};

export const missions: Mission[] = [
  {
    id: '1',
    title: 'Introduction to Programming',
    description: 'Learn the basics of programming and algorithms',
    status: 'completed',
    xpReward: 50,
    progress: 100,
    chapter: 1
  },
  {
    id: '2',
    title: 'Data Structures',
    description: 'Explore arrays, lists, and basic data structures',
    status: 'completed',
    xpReward: 75,
    progress: 100,
    chapter: 2
  },
  {
    id: '3',
    title: 'Object-Oriented Programming',
    description: 'Master classes, objects, and OOP principles',
    status: 'active',
    xpReward: 100,
    progress: 60,
    chapter: 3
  },
  {
    id: '4',
    title: 'Web Development Basics',
    description: 'HTML, CSS, and JavaScript fundamentals',
    status: 'locked',
    xpReward: 125,
    progress: 0,
    chapter: 4
  },
  {
    id: '5',
    title: 'Database Systems',
    description: 'Learn SQL and database design principles',
    status: 'locked',
    xpReward: 150,
    progress: 0,
    chapter: 5
  },
  {
    id: '6',
    title: 'Advanced Algorithms',
    description: 'Sorting, searching, and optimization algorithms',
    status: 'locked',
    xpReward: 200,
    progress: 0,
    chapter: 6
  }
];

export const leaderboard = [
  { rank: 1, name: 'Sarah Cosmic', xp: 2450, avatar: '👩‍🚀', isCurrentUser: false },
  { rank: 2, name: 'David Stellar', xp: 2380, avatar: '👨‍💻', isCurrentUser: false },
  { rank: 3, name: 'Andi Pratama', xp: 2150, avatar: '👨‍🚀', isCurrentUser: true },
  { rank: 4, name: 'Maya Galaxy', xp: 2050, avatar: '👩‍💻', isCurrentUser: false },
  { rank: 5, name: 'Rio Nebula', xp: 1980, avatar: '👨‍🎓', isCurrentUser: false },
  { rank: 6, name: 'Siti Nova', xp: 1920, avatar: '👩‍🎓', isCurrentUser: false },
  { rank: 7, name: 'Budi Comet', xp: 1850, avatar: '👨‍🚀', isCurrentUser: false },
  { rank: 8, name: 'Rina Pulsar', xp: 1780, avatar: '👩‍💻', isCurrentUser: false }
];

// Game state management
class GameStateManager {
  private user: User = { ...defaultUser };
  private listeners: ((user: User) => void)[] = [];

  getUser(): User {
    return { ...this.user };
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