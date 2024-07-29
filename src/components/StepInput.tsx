import React from "react";

interface StepInputProps {
  onClick: () => void;
}

const StepInput: React.FC<StepInputProps> = ({ onClick }) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-4">
      <input
        type="text"
        className="w-full p-2 text-xl text-gray-400 focus:outline-none"
        placeholder="Step"
        onClick={onClick}
      />
    </div>
  );
};

export default StepInput;
