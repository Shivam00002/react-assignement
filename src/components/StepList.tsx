import React from "react";

interface Step {
  id: number;
  parts: {
    text: string;
    type: "static" | "editable" | "variable" | string;
    style?: string;
  }[];
}

interface StepListProps {
  steps: Step[];
  editingStepIndex: number | null;
  editingPartIndex: number | null;
  editText: string;
  handlePartClick: (stepIndex: number, partIndex: number) => void;
  handlePartDoubleClick: (stepIndex: number, partIndex: number) => void;
  handleEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditSubmit: () => void;
  removeItem: (index: number) => void;
}

const StepList: React.FC<StepListProps> = ({
  steps,
  editingStepIndex,
  editingPartIndex,
  editText,
  handlePartClick,
  handlePartDoubleClick,
  handleEditChange,
  handleEditSubmit,
  removeItem,
}) => {
  return (
    <>
      {steps.map((step, stepIndex) => (
        <div
          key={step.id}
          className="flex items-center mb-2 animate-smooth-bounce"
        >
          <div className="bg-green-200 rounded-full p-2 mr-2">@</div>
          <div className="flex-grow p-2 border border-gray-300 rounded-lg flex items-center">
            {step.parts.map((part, partIndex) => (
              <span
                key={partIndex}
                className={`mx-1 ${
                  part.type === "variable"
                    ? "bg-purple-200"
                    : part.type === "editable"
                    ? editingStepIndex === stepIndex &&
                      editingPartIndex === partIndex
                      ? "text-orange-500"
                      : part.style === "edited"
                      ? "text-green-500"
                      : "text-orange-500 cursor-pointer"
                    : ""
                }`}
                onClick={() =>
                  part.type === "editable" &&
                  handlePartClick(stepIndex, partIndex)
                }
                onDoubleClick={() =>
                  part.type === "editable" &&
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
    </>
  );
};

export default StepList;
