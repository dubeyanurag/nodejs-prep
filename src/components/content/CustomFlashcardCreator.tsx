'use client';

import React, { useState, useRef } from 'react';
import { Flashcard, DifficultyLevel } from '@/types/content';

interface CustomFlashcardCreatorProps {
  onCreateFlashcard: (flashcard: Omit<Flashcard, 'id'>) => void;
  onCancel: () => void;
  categories: string[];
  className?: string;
}

interface FlashcardFormData {
  question: string;
  answer: string;
  category: string;
  difficulty: DifficultyLevel;
  tags: string[];
}

const DIFFICULTY_OPTIONS: { value: DifficultyLevel; label: string; description: string }[] = [
  { value: 'beginner', label: 'Beginner', description: 'Basic concepts and definitions' },
  { value: 'intermediate', label: 'Intermediate', description: 'Practical application and understanding' },
  { value: 'advanced', label: 'Advanced', description: 'Complex scenarios and optimization' },
  { value: 'expert', label: 'Expert', description: 'Architecture decisions and trade-offs' }
];

export default function CustomFlashcardCreator({
  onCreateFlashcard,
  onCancel,
  categories,
  className = ''
}: CustomFlashcardCreatorProps) {
  const [formData, setFormData] = useState<FlashcardFormData>({
    question: '',
    answer: '',
    category: categories[0] || '',
    difficulty: 'intermediate',
    tags: []
  });
  
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof FlashcardFormData, string>>>({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  const questionTextareaRef = useRef<HTMLTextAreaElement>(null);
  const answerTextareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (field: keyof FlashcardFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      handleInputChange('tags', [...formData.tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FlashcardFormData, string>> = {};

    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    } else if (formData.question.trim().length < 10) {
      newErrors.question = 'Question should be at least 10 characters long';
    }

    if (!formData.answer.trim()) {
      newErrors.answer = 'Answer is required';
    } else if (formData.answer.trim().length < 10) {
      newErrors.answer = 'Answer should be at least 10 characters long';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onCreateFlashcard({
      question: formData.question.trim(),
      answer: formData.answer.trim(),
      category: formData.category,
      difficulty: formData.difficulty,
      tags: formData.tags
    });
  };

  const handleReset = () => {
    setFormData({
      question: '',
      answer: '',
      category: categories[0] || '',
      difficulty: 'intermediate',
      tags: []
    });
    setErrors({});
    setIsPreviewMode(false);
  };

  const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'expert': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Create Custom Flashcard</h2>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200"
            >
              {isPreviewMode ? 'Edit' : 'Preview'}
            </button>
          </div>
        </div>

        {isPreviewMode ? (
          // Preview Mode
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(formData.difficulty)}`}>
                    {formData.difficulty}
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {formData.category}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Question:</h3>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <p className="text-gray-800 whitespace-pre-wrap">{formData.question || 'No question entered'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Answer:</h3>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <p className="text-gray-800 whitespace-pre-wrap">{formData.answer || 'No answer entered'}</p>
                </div>
              </div>

              {formData.tags.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Edit Mode
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Field */}
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                Question *
              </label>
              <textarea
                ref={questionTextareaRef}
                id="question"
                value={formData.question}
                onChange={(e) => {
                  handleInputChange('question', e.target.value);
                  autoResizeTextarea(e.target);
                }}
                placeholder="Enter your flashcard question here..."
                className={`w-full px-3 py-2 border rounded-md resize-none overflow-hidden min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.question ? 'border-red-300' : 'border-gray-300'
                }`}
                rows={3}
              />
              {errors.question && (
                <p className="mt-1 text-sm text-red-600">{errors.question}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Tip: Make questions specific and clear. Use code blocks with ``` for code examples.
              </p>
            </div>

            {/* Answer Field */}
            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                Answer *
              </label>
              <textarea
                ref={answerTextareaRef}
                id="answer"
                value={formData.answer}
                onChange={(e) => {
                  handleInputChange('answer', e.target.value);
                  autoResizeTextarea(e.target);
                }}
                placeholder="Enter the detailed answer here..."
                className={`w-full px-3 py-2 border rounded-md resize-none overflow-hidden min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.answer ? 'border-red-300' : 'border-gray-300'
                }`}
                rows={5}
              />
              {errors.answer && (
                <p className="mt-1 text-sm text-red-600">{errors.answer}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Provide comprehensive answers with examples, code snippets, and explanations.
              </p>
            </div>

            {/* Category and Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value as DifficultyLevel)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {DIFFICULTY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label} - {option.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md transition-colors duration-200"
                >
                  Add
                </button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Add relevant tags to help categorize and find this flashcard later.
              </p>
            </div>
          </form>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 rounded-md transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 rounded-md transition-colors duration-200"
            >
              Reset
            </button>
          </div>
          
          <div className="flex space-x-2">
            {!isPreviewMode && (
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={!formData.question.trim() || !formData.answer.trim()}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md font-medium transition-colors duration-200"
              >
                Create Flashcard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}