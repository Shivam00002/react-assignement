import React from "react";

interface GlobalVariable {
  id: number;
  name: string;
}

interface GlobalVariableListProps {
  searchInput: string;
  filteredGlobalVariables: GlobalVariable[];
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGlobalVariableSelect: (variable: GlobalVariable) => void;
  onClose: () => void;
}

const GlobalVariableList: React.FC<GlobalVariableListProps> = ({
  searchInput,
  filteredGlobalVariables,
  handleSearchChange,
  handleGlobalVariableSelect,
  onClose,
}) => {
  return (
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
          className="bg-gray-200 text-red-400 font-semibold px-4 py-2 rounded mr-2"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded font-semibold"
          onClick={onClose}
        >
          Ok
        </button>
      </div>
    </div>
  );
};

export default GlobalVariableList;
