import { useState } from 'react';
import { BookOpen, Play, CheckCircle, Lock, Clock, Zap } from 'lucide-react';
import { missions, gameState } from '@/lib/gameState';
import XPToast from '@/components/XPToast';

const Materials = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [showXPToast, setShowXPToast] = useState<number | null>(null);

  const materials = [
    {
      id: '1',
      title: 'Introduction to Programming',
      status: missions[0].status,
      duration: '15 min read',
      content: `
        # Welcome to Programming!
        
        Programming is the art and science of creating instructions for computers to follow. Think of it as giving directions to a very literal friend who follows instructions exactly as written.
        
        ## What is an Algorithm?
        An algorithm is a step-by-step procedure for solving a problem. Just like a recipe for cooking, algorithms provide clear instructions to achieve a desired outcome.
        
        ## Basic Programming Concepts:
        
        ### Variables
        Variables are like containers that store data. They have names and can hold different types of information like numbers, text, or true/false values.
        
        ### Control Structures
        - **Loops**: Repeat actions multiple times
        - **Conditions**: Make decisions based on different scenarios
        - **Functions**: Reusable blocks of code
        
        ## Your First Steps
        Every programmer starts with simple concepts and builds up to more complex ideas. The key is practice and patience!
        
        Remember: Every expert was once a beginner. Keep exploring, keep learning!
      `
    },
    {
      id: '2',
      title: 'Data Structures',
      status: missions[1].status,
      duration: '20 min read',
      content: `
        # Understanding Data Structures
        
        Data structures are ways of organizing and storing data in a computer so that it can be accessed and modified efficiently.
        
        ## Arrays
        Arrays are collections of elements stored in contiguous memory locations. Think of them as a row of mailboxes, each with a specific address.
        
        ### Key Properties:
        - Fixed size (in most languages)
        - Elements of the same type
        - Zero-based indexing
        
        ## Lists
        Lists are dynamic arrays that can grow and shrink during runtime. They're more flexible than arrays but may use more memory.
        
        ## Stacks and Queues
        - **Stack**: Last In, First Out (LIFO) - like a stack of plates
        - **Queue**: First In, First Out (FIFO) - like a line at a store
        
        ## Time Complexity
        Understanding how long operations take is crucial:
        - Accessing by index: O(1)
        - Searching: O(n)
        - Insertion/Deletion: varies by structure
        
        Practice with these structures to build your programming foundation!
      `
    },
    {
      id: '3',
      title: 'Object-Oriented Programming',
      status: missions[2].status,
      duration: '25 min read',
      content: `
        # Object-Oriented Programming (OOP)
        
        OOP is a programming paradigm that organizes code around objects rather than functions and logic.
        
        ## Core Principles
        
        ### 1. Encapsulation
        Bundling data and methods that work on that data within one unit (class). Think of it as a capsule that contains everything needed.
        
        ### 2. Inheritance
        Creating new classes based on existing classes. Like how a sports car inherits basic car properties but adds its own features.
        
        ### 3. Polymorphism
        Objects can take multiple forms. A shape can be a circle, square, or triangle, but all can calculate area differently.
        
        ### 4. Abstraction
        Hiding complex implementation details while showing only essential features. Like driving a car without knowing how the engine works internally.
        
        ## Classes and Objects
        - **Class**: A blueprint for creating objects
        - **Object**: An instance of a class
        
        ## Benefits of OOP
        - Code reusability
        - Better organization
        - Easier maintenance
        - Real-world modeling
        
        OOP helps create more maintainable and scalable software systems!
      `
    }
  ];

  const handleMarkComplete = (materialId: string) => {
    const material = materials.find(m => m.id === materialId);
    if (material && material.status !== 'completed') {
      // Mark mission as completed and gain XP
      gameState.completeMission(materialId);
      setShowXPToast(10);
      setSelectedMaterial(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-mission-completed" />;
      case 'active':
        return <Play className="w-5 h-5 text-mission-active" />;
      default:
        return <Lock className="w-5 h-5 text-mission-locked" />;
    }
  };

  if (selectedMaterial) {
    const material = materials.find(m => m.id === selectedMaterial);
    if (!material) return null;

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedMaterial(null)}
              className="btn-cosmic px-4 py-2"
            >
              ← Back to Materials
            </button>
            
            {material.status !== 'completed' && (
              <button
                onClick={() => handleMarkComplete(material.id)}
                className="btn-neon px-6 py-2 flex items-center space-x-2"
                disabled={material.status === 'locked'}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mark as Completed (+10 XP)</span>
              </button>
            )}
          </div>

          {/* Content */}
          <div className="mission-card p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">{material.title}</h1>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{material.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(material.status)}
                  <span className="capitalize">{material.status}</span>
                </div>
              </div>
            </div>

            {/* Material Content */}
            <div className="prose prose-invert max-w-none">
              <div className="text-foreground leading-relaxed whitespace-pre-line">
                {material.content}
              </div>
            </div>

            {/* Bottom Action */}
            {material.status !== 'completed' && (
              <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-neon-cyan/10 to-neon-magenta/10 border border-neon-cyan/30">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Ready to Continue Your Journey?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Mark this material as completed to gain XP and unlock new adventures!
                  </p>
                  <button
                    onClick={() => handleMarkComplete(material.id)}
                    className="btn-neon px-8 py-3 flex items-center space-x-2 mx-auto"
                    disabled={material.status === 'locked'}
                  >
                    <Zap className="w-5 h-5" />
                    <span>Complete & Gain 10 XP</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* XP Toast */}
        {showXPToast && (
          <XPToast
            amount={showXPToast}
            onComplete={() => setShowXPToast(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-cyan to-neon-magenta bg-clip-text text-transparent mb-2">
            Learning Materials
          </h1>
          <p className="text-muted-foreground">
            Explore the cosmic knowledge base and advance your programming skills
          </p>
        </div>

        {/* Materials Grid */}
        <div className="grid gap-6">
          {materials.map((material) => (
            <div
              key={material.id}
              className={`mission-card cursor-pointer ${material.status}`}
              onClick={() => material.status !== 'locked' && setSelectedMaterial(material.id)}
            >
              <div className="flex items-center space-x-6">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                  material.status === 'completed' ? 'bg-mission-completed/20' :
                  material.status === 'active' ? 'bg-mission-active/20' :
                  'bg-mission-locked/20'
                }`}>
                  <BookOpen className={`w-8 h-8 ${
                    material.status === 'completed' ? 'text-mission-completed' :
                    material.status === 'active' ? 'text-mission-active' :
                    'text-mission-locked'
                  }`} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      {material.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(material.status)}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{material.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap className="w-4 h-4 text-neon-cyan" />
                      <span className="text-neon-cyan">+10 XP on completion</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      material.status === 'completed' ? 'bg-mission-completed/20 text-mission-completed' :
                      material.status === 'active' ? 'bg-mission-active/20 text-mission-active' :
                      'bg-mission-locked/20 text-mission-locked'
                    }`}>
                      {material.status === 'completed' ? 'Completed' :
                       material.status === 'active' ? 'Available' :
                       'Locked'}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                {material.status !== 'locked' && (
                  <div className="text-muted-foreground">
                    <Play className="w-5 h-5 rotate-0" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Study Tips */}
        <div className="mt-12 mission-card p-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
            <Zap className="w-5 h-5 text-neon-cyan mr-2" />
            Study Tips for Space Explorers
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="text-foreground font-medium">📚 Active Reading</p>
              <p className="text-muted-foreground">Take notes and ask questions while reading</p>
            </div>
            <div className="space-y-2">
              <p className="text-foreground font-medium">🔄 Practice Regularly</p>
              <p className="text-muted-foreground">Apply concepts through coding exercises</p>
            </div>
            <div className="space-y-2">
              <p className="text-foreground font-medium">🤝 Join Discussions</p>
              <p className="text-muted-foreground">Share knowledge with fellow explorers</p>
            </div>
            <div className="space-y-2">
              <p className="text-foreground font-medium">🎯 Set Goals</p>
              <p className="text-muted-foreground">Complete one material per day for consistency</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Materials;