'use client';

import React, { useState, useMemo } from 'react';
import { Flashcard as FlashcardType, FlashcardProgress, DifficultyLevel, TopicContent } from '@/types/content';
import { SpacedRepetitionEngine } from '@/lib/spaced-repetition';
import { flashcardGenerator, difficultyProgressionEngine, GeneratedFlashcard, FlashcardGenerationOptions } from '@/lib/flashcard-generator';
import CustomFlashcardCreator from './CustomFlashcardCreator';

interface FlashcardDashboardProps {
  flashcards: FlashcardType[];
  progress: FlashcardProgress[];
  topicContent?: TopicContent[]; // For generating flashcards from topics
  onStartSession: (filteredCards: FlashcardType[]) => void;
  onResetProgress?: (cardIds: string[]) => void;
  onCreateFlashcard?: (flashcard: Omit<FlashcardType, 'id'>) => void;
  onGenerateFromTopics?: (generatedCards: GeneratedFlashcard[]) => void;
  className?: string;
}

interface FilterOptions {
  categories: string[];
  difficulties: DifficultyLevel[];
  statuses: FlashcardProgress['status'][];
  tags: string[];
  dueOnly: boolean;
}

export default function FlashcardDashboard({
  flashcards,
  progress,
  topicContent = [],
  onStartSession,
  onResetProgress,
  onCreateFlashcard,
  onGenerateFromTopics,
  className = ''
}: FlashcardDashboardProps) {
  const [srEngine] = useState(() => new SpacedRepetitionEngine());
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    difficulties: [],
    statuses: [],
    tags: [],
    dueOnly: false
  });
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [showCustomCreator, setShowCustomCreator] = useState(false);
  const [showGenerationOptions, setShowGenerationOptions] = useState(false);
  const [generationOptions, setGenerationOptions] = useState<FlashcardGenerationOptions>({
    includeQuestions: true,
    includeCodeExamples: true,
    includeKeyPoints: true,
    includeDiagrams: true,
    maxCardsPerTopic: 15,
    difficultyFilter: undefined,
    categoryFilter: undefined
  });

  // Calculate statistics
  const stats = useMemo(() => {
    return srEngine.getStudyStats(progress);
  }, [progress, srEngine]);

  // Get available filter options
  const filterOptions = useMemo(() => {
    const categories = [...new Set(flashcards.map(card => card.category))].sort();
    const difficulties = [...new Set(flashcards.map(card => card.difficulty))].sort();
    const statuses: FlashcardProgress['status'][] = ['new', 'learning', 'review', 'mastered'];
    const tags = [...new Set(flashcards.flatMap(card => card.tags))].sort();

    return { categories, difficulties, statuses, tags };
  }, [flashcards]);

  // Get available topic categories for generation
  const topicCategories = useMemo(() => {
    return [...new Set(topicContent.map(topic => topic.category))].sort();
  }, [topicContent]);

  // Get recommended difficulty based on user progress
  const recommendedDifficulty = useMemo(() => {
    return difficultyProgressionEngine.getRecommendedDifficulty(progress);
  }, [progress]);

  // Filter flashcards based on current filters
  const filteredCards = useMemo(() => {
    let filtered = flashcards;

    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(card => filters.categories.includes(card.category));
    }

    // Apply difficulty filter
    if (filters.difficulties.length > 0) {
      filtered = filtered.filter(card => filters.difficulties.includes(card.difficulty));
    }

    // Apply tag filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(card => 
        card.tags.some(tag => filters.tags.includes(tag))
      );
    }

    // Apply status filter
    if (filters.statuses.length > 0) {
      const statusProgressMap = new Map(progress.map(p => [p.cardId, p]));
      filtered = filtered.filter(card => {
        const cardProgress = statusProgressMap.get(card.id);
        const status = cardProgress?.status || 'new';
        return filters.statuses.includes(status);
      });
    }

    // Apply due filter
    if (filters.dueOnly) {
      const progressMap = new Map(progress.map(p => [p.cardId, p]));
      const dueProgress = srEngine.getDueCards(progress);
      const dueCardIds = new Set(dueProgress.map(p => p.cardId));
      filtered = filtered.filter(card => dueCardIds.has(card.id));
    }

    return filtered;
  }, [flashcards, progress, filters, srEngine]);

  const handleFilterChange = (filterType: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleCardSelection = (cardId: string, selected: boolean) => {
    setSelectedCards(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(cardId);
      } else {
        newSet.delete(cardId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setSelectedCards(new Set(filteredCards.map(card => card.id)));
  };

  const handleDeselectAll = () => {
    setSelectedCards(new Set());
  };

  const handleStartSession = () => {
    const cardsToStudy = selectedCards.size > 0 
      ? flashcards.filter(card => selectedCards.has(card.id))
      : filteredCards;
    onStartSession(cardsToStudy);
  };

  const getProgressForCard = (cardId: string): FlashcardProgress | undefined => {
    return progress.find(p => p.cardId === cardId);
  };

  const handleGenerateFromTopics = () => {
    if (!onGenerateFromTopics || topicContent.length === 0) return;

    const generatedCards: GeneratedFlashcard[] = [];
    
    topicContent.forEach(topic => {
      const topicCards = flashcardGenerator.generateFromTopic(topic, generationOptions);
      generatedCards.push(...topicCards);
    });

    // Apply adaptive selection based on user progress
    const adaptiveCards = difficultyProgressionEngine.generateAdaptiveFlashcards(
      generatedCards,
      progress,
      generationOptions.maxCardsPerTopic * topicContent.length
    );

    onGenerateFromTopics(adaptiveCards);
    setShowGenerationOptions(false);
  };

  const handleCreateCustomFlashcard = (flashcardData: Omit<FlashcardType, 'id'>) => {
    if (!onCreateFlashcard) return;
    
    onCreateFlashcard(flashcardData);
    setShowCustomCreator(false);
  };

  const getStatusColor = (status: FlashcardProgress['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'learning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'review': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'mastered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Cards</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
          <div className="text-2xl font-bold text-blue-800">{stats.new}</div>
          <div className="text-sm text-blue-600">New</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-center">
          <div className="text-2xl font-bold text-yellow-800">{stats.learning}</div>
          <div className="text-sm text-yellow-600">Learning</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 text-center">
          <div className="text-2xl font-bold text-orange-800">{stats.review}</div>
          <div className="text-sm text-orange-600">Review</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
          <div className="text-2xl font-bold text-green-800">{stats.mastered}</div>
          <div className="text-sm text-green-600">Mastered</div>
        </div>
      </div>

      {/* Due Cards Alert */}
      {stats.due > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-blue-800">
                {stats.due} cards due for review
              </h3>
              {stats.overdue > 0 && (
                <p className="text-sm text-blue-600">
                  {stats.overdue} cards are overdue
                </p>
              )}
            </div>
            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, dueOnly: true }));
                const dueProgress = srEngine.getDueCards(progress);
                const dueCardIds = new Set(dueProgress.map(p => p.cardId));
                const dueCards = flashcards.filter(card => dueCardIds.has(card.id));
                onStartSession(dueCards);
              }}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Study Due Cards
            </button>
          </div>
        </div>
      )}

      {/* Difficulty Progression Alert */}
      {recommendedDifficulty !== 'beginner' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-green-800">
                Ready for {recommendedDifficulty} level flashcards!
              </h3>
              <p className="text-sm text-green-600">
                Your performance suggests you can handle more challenging content.
              </p>
            </div>
            <button
              onClick={() => {
                setGenerationOptions(prev => ({ 
                  ...prev, 
                  difficultyFilter: [recommendedDifficulty] 
                }));
                setShowGenerationOptions(true);
              }}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Generate {recommendedDifficulty} Cards
            </button>
          </div>
        </div>
      )}

      {/* Flashcard Management Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Flashcard Management</h3>
        <div className="flex flex-wrap gap-3">
          {onCreateFlashcard && (
            <button
              onClick={() => setShowCustomCreator(true)}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Create Custom Flashcard
            </button>
          )}
          
          {onGenerateFromTopics && topicContent.length > 0 && (
            <button
              onClick={() => setShowGenerationOptions(true)}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Generate from Topics ({topicContent.length})
            </button>
          )}
          
          <button
            onClick={() => {
              const adaptiveCards = difficultyProgressionEngine.generateAdaptiveFlashcards(
                flashcards as GeneratedFlashcard[],
                progress,
                20
              );
              onStartSession(adaptiveCards);
            }}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Adaptive Study Session
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-lg font-medium text-gray-800">Filters</h3>
            <span className="text-gray-500">
              {showFilters ? '−' : '+'}
            </span>
          </button>
        </div>
        
        {showFilters && (
          <div className="p-4 space-y-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {filterOptions.categories.map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={(e) => {
                        const newCategories = e.target.checked
                          ? [...filters.categories, category]
                          : filters.categories.filter(c => c !== category);
                        handleFilterChange('categories', newCategories);
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <div className="flex flex-wrap gap-2">
                {filterOptions.difficulties.map(difficulty => (
                  <label key={difficulty} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.difficulties.includes(difficulty)}
                      onChange={(e) => {
                        const newDifficulties = e.target.checked
                          ? [...filters.difficulties, difficulty]
                          : filters.difficulties.filter(d => d !== difficulty);
                        handleFilterChange('difficulties', newDifficulties);
                      }}
                      className="mr-2"
                    />
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(difficulty)}`}>
                      {difficulty}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {filterOptions.statuses.map(status => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.statuses.includes(status)}
                      onChange={(e) => {
                        const newStatuses = e.target.checked
                          ? [...filters.statuses, status]
                          : filters.statuses.filter(s => s !== status);
                        handleFilterChange('statuses', newStatuses);
                      }}
                      className="mr-2"
                    />
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(status)}`}>
                      {status}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Due Only Filter */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.dueOnly}
                  onChange={(e) => handleFilterChange('dueOnly', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Show only due cards
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Card List */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-800">
              Cards ({filteredCards.length})
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Select All
              </button>
              <button
                onClick={handleDeselectAll}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Deselect All
              </button>
            </div>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filteredCards.map(card => {
            const cardProgress = getProgressForCard(card.id);
            const status = cardProgress?.status || 'new';
            const isSelected = selectedCards.has(card.id);

            return (
              <div
                key={card.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                  isSelected ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => handleCardSelection(card.id, e.target.checked)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(status)}`}>
                        {status}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(card.difficulty)}`}>
                        {card.difficulty}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {card.category}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-1">
                      {card.question}
                    </p>
                    {cardProgress && (
                      <div className="text-xs text-gray-500">
                        Correct: {cardProgress.correctCount} | 
                        Incorrect: {cardProgress.incorrectCount} |
                        Last reviewed: {cardProgress.lastReviewed.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleStartSession}
          disabled={filteredCards.length === 0}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200"
        >
          Start Study Session
          {selectedCards.size > 0 && ` (${selectedCards.size} cards)`}
        </button>
        
        {onResetProgress && selectedCards.size > 0 && (
          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset progress for selected cards?')) {
                onResetProgress(Array.from(selectedCards));
                setSelectedCards(new Set());
              }
            }}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Reset Progress
          </button>
        )}
      </div>

      {/* Custom Flashcard Creator Modal */}
      {showCustomCreator && onCreateFlashcard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CustomFlashcardCreator
              onCreateFlashcard={handleCreateCustomFlashcard}
              onCancel={() => setShowCustomCreator(false)}
              categories={filterOptions.categories}
            />
          </div>
        </div>
      )}

      {/* Generation Options Modal */}
      {showGenerationOptions && onGenerateFromTopics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Generate Flashcards from Topics</h2>
                <button
                  onClick={() => setShowGenerationOptions(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Content Types */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Content Types to Include</h3>
                  <div className="space-y-2">
                    {[
                      { key: 'includeQuestions', label: 'Interview Questions', description: 'Generate cards from Q&A content' },
                      { key: 'includeCodeExamples', label: 'Code Examples', description: 'Create code reading and writing challenges' },
                      { key: 'includeKeyPoints', label: 'Key Points', description: 'Convert important concepts to flashcards' },
                      { key: 'includeDiagrams', label: 'Diagrams', description: 'Create explanation cards for visual content' }
                    ].map(option => (
                      <label key={option.key} className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={generationOptions[option.key as keyof FlashcardGenerationOptions] as boolean}
                          onChange={(e) => setGenerationOptions(prev => ({
                            ...prev,
                            [option.key]: e.target.checked
                          }))}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium text-gray-800">{option.label}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Filters */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Filters</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Difficulty Levels
                      </label>
                      <div className="space-y-1">
                        {(['beginner', 'intermediate', 'advanced', 'expert'] as DifficultyLevel[]).map(difficulty => (
                          <label key={difficulty} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={generationOptions.difficultyFilter?.includes(difficulty) || false}
                              onChange={(e) => {
                                const current = generationOptions.difficultyFilter || [];
                                const updated = e.target.checked
                                  ? [...current, difficulty]
                                  : current.filter(d => d !== difficulty);
                                setGenerationOptions(prev => ({
                                  ...prev,
                                  difficultyFilter: updated.length > 0 ? updated : undefined
                                }));
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm capitalize">{difficulty}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categories
                      </label>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {topicCategories.map(category => (
                          <label key={category} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={generationOptions.categoryFilter?.includes(category) || false}
                              onChange={(e) => {
                                const current = generationOptions.categoryFilter || [];
                                const updated = e.target.checked
                                  ? [...current, category]
                                  : current.filter(c => c !== category);
                                setGenerationOptions(prev => ({
                                  ...prev,
                                  categoryFilter: updated.length > 0 ? updated : undefined
                                }));
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm">{category}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Max Cards */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Cards per Topic
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={generationOptions.maxCardsPerTopic}
                    onChange={(e) => setGenerationOptions(prev => ({
                      ...prev,
                      maxCardsPerTopic: parseInt(e.target.value) || 15
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Higher quality cards will be prioritized
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowGenerationOptions(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 rounded-md transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateFromTopics}
                  className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md font-medium transition-colors duration-200"
                >
                  Generate Flashcards
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}