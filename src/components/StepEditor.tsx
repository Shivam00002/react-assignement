import React, { useState, useRef, useEffect } from 'react';

interface SelectedWord {
  word: string;
  index: number;
}

const StepEditor: React.FC = () => {
  const [step, setStep] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [showGlobalData, setShowGlobalData] = useState<boolean>(false);
  const [selectedWord, setSelectedWord] = useState<SelectedWord | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const suggestions: string[] = [
    'Click on "Text"',
    'Click on "Text" after "Text"',
    'Click on "Text" for "Text"'
  ];

  const globalData: string[] = ['test', 'test67'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editorRef.current && !editorRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setShowGlobalData(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStepClick = () => setShowSuggestions(true);

  const handleSuggestionClick = (suggestion: string) => {
    setStep(suggestion);
    setShowSuggestions(false);
  };

  const handleWordDoubleClick = (word: string, index: number) => {
    setSelectedWord({ word, index });
    if (word === 'Text' && index === getSecondTextIndex()) {
      setShowGlobalData(true);
    } else {
      setShowGlobalData(false);
    }
  };

  const handleGlobalDataClick = (data: string) => {
    if (selectedWord) {
      const words = step.split(' ');
      words[selectedWord.index] = data;
      setStep(words.join(' '));
      setShowGlobalData(false);
      setSelectedWord(null);
    }
  };

  const handleWordChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const words = step.split(' ');
    words[index] = e.target.value;
    setStep(words.join(' '));
  };

  const getSecondTextIndex = (): number => {
    const words = step.split(' ');
    return words.indexOf('Text', words.indexOf('Text') + 1);
  };

  const renderColorCodedStep = () => {
    if (!step) return null;

    return step.split(' ').map((word, index) => {
      const colorClass =
        word === 'Text'
          ? 'text-orange-500'
          : word !== '"' && word !== 'on' && word !== 'for' && word !== 'after'
          ? 'text-green-500'
          : 'text-black';

      if (globalData.includes(word)) {
        return (
          <span
            key={index}
            className="bg-purple-200 px-1 rounded cursor-pointer"
            onDoubleClick={() => handleWordDoubleClick(word, index)}
          >
            {word}
          </span>
        );
      }

      return (
        <span
          key={index}
          className={`${colorClass} cursor-pointer`}
          onDoubleClick={() => handleWordDoubleClick(word, index)}
        >
          {selectedWord && selectedWord.index === index ? (
            <input
              value={word}
              onChange={(e) => handleWordChange(e, index)}
              onBlur={() => setSelectedWord(null)}
              className="border-b border-gray-300 focus:outline-none focus:border-blue-500"
              autoFocus
            />
          ) : (
            word
          )}{' '}
        </span>
      );
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-4" ref={editorRef}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Step
        </label>
        <div
          className="border rounded p-2 cursor-text min-h-[40px]"
          onClick={handleStepClick}
        >
          {step ? renderColorCodedStep() : 'Click to add a step'}
        </div>
      </div>

      {showSuggestions && (
        <div className="border rounded shadow-lg p-2 mb-4">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="cursor-pointer hover:bg-gray-100 p-1"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <span className="text-green-500 mr-2">@</span>
              {suggestion}
            </div>
          ))}
        </div>
      )}

      {showGlobalData && (
        <div className="border rounded shadow-lg p-2">
          <div className="flex justify-between items-center mb-2">
            <input
              type="text"
              placeholder="Search global data"
              className="border rounded p-1 flex-grow mr-2"
            />
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded"
              onClick={() => setShowGlobalData(false)}
            >
              Ok
            </button>
          </div>
          {globalData.map((data, index) => (
            <div
              key={index}
              className="cursor-pointer hover:bg-gray-100 p-1"
              onClick={() => handleGlobalDataClick(data)}
            >
              <span className="bg-purple-200 px-1 rounded mr-2">G</span>
              {data}
            </div>
          ))}
        </div>
      )}

      {step && (
        <div className="flex justify-end mt-2">
          <button
            className="bg-red-500 text-white p-1 rounded w-6 h-6 flex items-center justify-center"
            onClick={() => setStep('')}
          >
            <span className="text-sm font-bold">×</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default StepEditor;
