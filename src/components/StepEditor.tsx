import React, { useState, useRef, useEffect } from "react";
import "animate.css";
import StepInput from "./StepInput";
import StepList from "./StepList";
import Suggestions from "./Suggestions";
import GlobalVariableList from "./GlobalVariableList";

interface Step {
  id: number;
  parts: {
    text: string;
    type: "static" | "editable" | "variable" | string;
    style?: string;
  }[];
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
  const [editText, setEditText] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const editorRef = useRef<HTMLDivElement>(null);

  const suggestedSteps: string[] = [
    'Click on "Text"',
    'Click on "Text" after "Text"',
    'Click on "Text" for "Text"',
  ];

  const globalVariables: GlobalVariable[] = [
    { id: 1, name: "test" },
    { id: 2, name: "mahadev" },
    { id: 3, name: "shivam" },
    { id: 4, name: "dubey" },
    { id: 5, name: "front-end" },
    { id: 6, name: "back-end" },
    { id: 7, name: "Mern-Stack" },
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
          handleEditSubmit();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [steps, editText, editingStepIndex, editingPartIndex]);

  const handleStepClick = () => {
    setShowSuggestions(true);
  };

  const handleStepSelect = (stepText: string) => {
    const parts = stepText.split(/([""])/g).map((part) => ({
      text: part,
      type:
        part === '"'
          ? "static"
          : part.toLowerCase() === "text"
          ? "editable"
          : "static",
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
                j === editingPartIndex ? { ...part, text: variable.name } : part
              ),
            }
          : step
      );
      setSteps(updatedSteps);
      setShowGlobalVariables(false);
      resetEditingState();
    }
  };

  const handlePartDoubleClick = (stepIndex: number, partIndex: number) => {
    const part = steps[stepIndex].parts[partIndex];
    if (part.type === "editable") {
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
                  ? { ...part, text: editText, style: "edited" }
                  : part
              ),
            }
          : step
      );
      setSteps(updatedSteps);
      // resetEditingState();
    }
  };

  const resetEditingState = () => {
    setEditingStepIndex(null);
    setEditingPartIndex(null);
    setEditText("");
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
      const aIncludes = a.name
        .toLowerCase()
        .startsWith(searchInput.toLowerCase())
        ? -1
        : 1;
      const bIncludes = b.name
        .toLowerCase()
        .startsWith(searchInput.toLowerCase())
        ? -1
        : 1;
      return aIncludes - bIncludes;
    });

  return (
    <div className="w-full max-w-md mx-auto p-4" ref={editorRef}>
      <StepInput onClick={handleStepClick} />
      <StepList
        steps={steps}
        editingStepIndex={editingStepIndex}
        editingPartIndex={editingPartIndex}
        editText={editText}
        handlePartClick={handlePartClick}
        handlePartDoubleClick={handlePartDoubleClick}
        handleEditChange={handleEditChange}
        handleEditSubmit={handleEditSubmit}
        removeItem={removeItem}
      />
      {showSuggestions && (
        <Suggestions
          suggestedSteps={suggestedSteps}
          handleStepSelect={handleStepSelect}
        />
      )}

      {showGlobalVariables && (
        <GlobalVariableList
          searchInput={searchInput}
          filteredGlobalVariables={filteredGlobalVariables}
          handleSearchChange={handleSearchChange}
          handleGlobalVariableSelect={handleGlobalVariableSelect}
          onClose={() => setShowGlobalVariables(false)}
        />
      )}
    </div>
  );
};

export default StepEditor;
