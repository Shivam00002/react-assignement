import React, { useState, useRef, useEffect } from 'react';

interface Step {
  id: number;
  parts: { text: string; type: 'static' | 'editable' | 'variable' | string; style?: string }[];
}

interface GlobalVariable {
  id: number;
  name: string;
}

const StepEditor: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showGlobalVariables, setShowGlobalVariables] = useState(false);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [editingPartIndex, setEditingPartIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>(''); // Add search input state
  const editorRef = useRef<HTMLDivElement>(null);

  const suggestedSteps: string[] = [
    'Click on "Text"',
    'Click on "Text" after "Text"',
    'Click on "Text" for "Text"',
  ];

  const globalVariables: GlobalVariable[] = [
    { id: 1, name: 'test' },
    { id: 2, name: 'test67' },
    { id: 3, name: 'example' },
    { id: 4, name: 'sample' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editorRef.current &&
        !editorRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setShowGlobalVariables(false);
        if (editingStepIndex !== null && editingPartIndex !== null) {
          handleEditSubmit(); // Submit the edit if clicking outside
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [steps, editText, editingStepIndex, editingPartIndex]); // Add dependencies

  const handleStepClick = () => {
    setShowSuggestions(true);
  };

  const handleStepSelect = (stepText: string) => {
    const parts = stepText.split(/([""])/g).map((part) => ({
      text: part,
      type:
        part === '"'
          ? 'static'
          : part.toLowerCase() === 'text'
          ? 'editable'
          : 'static',
    }));

    const newStep: Step = {
      id: Date.now(),
      parts: parts,
    };
    setSteps([...steps, newStep]);
    setShowSuggestions(false);
  };

  const handlePartClick = (stepIndex: number, partIndex: number) => {
    setEditingStepIndex(stepIndex);
    setEditingPartIndex(partIndex);
    setShowGlobalVariables(true);
  };

  const handleGlobalVariableSelect = (variable: GlobalVariable) => {
    if (editingStepIndex !== null && editingPartIndex !== null) {
      const updatedSteps = steps.map((step, i) =>
        i === editingStepIndex
          ? {
              ...step,
              parts: step.parts.map((part, j) =>
                j === editingPartIndex
                  ? { ...part, text: variable.name } // Directly update the part text
                  : part
              ),
            }
          : step
      );
      setSteps(updatedSteps);
      setShowGlobalVariables(false);
      setEditingStepIndex(null);
      setEditingPartIndex(null);
      setEditText(''); // Clear edit text when a global variable is selected
    }
  };

  const handlePartDoubleClick = (stepIndex: number, partIndex: number) => {
    const part = steps[stepIndex].parts[partIndex];
    if (part.type === 'editable') {
      setEditText(part.text);
      setEditingStepIndex(stepIndex);
      setEditingPartIndex(partIndex);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const handleEditSubmit = () => {
    if (editingStepIndex !== null && editingPartIndex !== null) {
      const updatedSteps = steps.map((step, i) =>
        i === editingStepIndex
          ? {
              ...step,
              parts: step.parts.map((part, j) =>
                j === editingPartIndex
                  ? { ...part, text: editText, style: 'edited' }
                  : part
              ),
            }
          : step
      );
      setSteps(updatedSteps);
     //setEditingStepIndex(null);
      //setEditingPartIndex(null);
     // setEditText('');

    }
  };

  const removeItem = (index: number) => {
    const updatedSteps = steps.filter((_, stepIndex) => stepIndex !== index);
    setSteps(updatedSteps);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const filteredGlobalVariables = globalVariables
    .filter((variable) =>
      variable.name.toLowerCase().includes(searchInput.toLowerCase())
    )
    .sort((a, b) => {
      const aIncludes = a.name.toLowerCase().startsWith(searchInput.toLowerCase()) ? -1 : 1;
      const bIncludes = b.name.toLowerCase().startsWith(searchInput.toLowerCase()) ? -1 : 1;
      return aIncludes - bIncludes;
    });

  return (
    <div className="w-full max-w-md mx-auto p-4" ref={editorRef}>
      <div className="border border-gray-300 rounded-lg p-4 mb-4">
        <input
          type="text"
          className="w-full p-2 text-xl text-gray-400 focus:outline-none"
          placeholder="Step"
          onClick={handleStepClick}
        />
      </div>

      {steps.map((step, stepIndex) => (
        <div key={step.id} className="flex items-center mb-2">
          <div className="bg-green-200 rounded-full p-2 mr-2">@</div>
          <div className="flex-grow p-2 border border-gray-300 rounded-lg flex items-center">
            {step.parts.map((part, partIndex) => (
              <span
                key={partIndex}
                className={`mx-1 ${
                  part.type === 'variable'
                    ? 'bg-purple-200'
                    : part.type === 'editable'
                    ? editingStepIndex === stepIndex &&
                      editingPartIndex === partIndex
                      ? 'text-orange-500'
                      : part.style === 'edited'
                      ? 'text-green-500'
                      : 'text-orange-500 cursor-pointer'
                    : ''
                }`}
                onClick={() =>
                  part.type === 'editable' &&
                  handlePartClick(stepIndex, partIndex)
                }
                onDoubleClick={() =>
                  part.type === 'editable' &&
                  handlePartDoubleClick(stepIndex, partIndex)
                }
              >
                {editingStepIndex === stepIndex &&
                editingPartIndex === partIndex ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={handleEditChange}
                    onBlur={handleEditSubmit}
                    className="text-orange-500"
                    autoFocus
                  />
                ) : (
                  part.text
                )}
              </span>
            ))}
          </div>
          <button
            onClick={() => removeItem(stepIndex)}
            className="ml-2 text-red-500"
          >
            &times;
          </button>
        </div>
      ))}

      {showSuggestions && (
        <div className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
          {suggestedSteps.map((step, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => handleStepSelect(step)}
            >
              <div className="bg-green-200 rounded-full p-2 mr-2">@</div>
              {step}
            </div>
          ))}
          <div className="flex justify-end p-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Ok
            </button>
          </div>
        </div>
      )}

      {showGlobalVariables && (
        <div className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          <input
            type="text"
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            placeholder="Search global data"
            value={searchInput}
            onChange={handleSearchChange}
          />
          {filteredGlobalVariables.map((variable) => (
            <div
              key={variable.id}
              className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => handleGlobalVariableSelect(variable)}
            >
              <div className="bg-purple-200 rounded-full p-2 mr-2">G</div>
              {variable.name}
            </div>
          ))}
          <div className="flex justify-end mt-2">
            <button
              className="bg-gray-200 text-red-400  font-semibold px-4 py-2 rounded mr-2"
              onClick={() => setShowGlobalVariables(false)}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded font-semibold"
              onClick={() => setShowGlobalVariables(false)}
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepEditor;
