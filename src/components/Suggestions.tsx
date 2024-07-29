import React from "react";

interface SuggestionsProps {
  suggestedSteps: string[];
  handleStepSelect: (stepText: string) => void;
}

const Suggestions: React.FC<SuggestionsProps> = ({
  suggestedSteps,
  handleStepSelect,
}) => {
  return (
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
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Ok</button>
      </div>
    </div>
  );
};

export default Suggestions;
