import React from 'react';

const TailwindTest = () => {
  return (
    <div className="mx-auto max-w-2xl my-8">
      <h1 className="text-3xl font-bold text-center mb-4">Tailwind CSS Test</h1>
      
      {/* Color Tests */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-red-500 h-16 rounded-lg"></div>
        <div className="bg-blue-500 h-16 rounded-lg"></div>
        <div className="bg-green-500 h-16 rounded-lg"></div>
        <div className="bg-yellow-500 h-16 rounded-lg"></div>
      </div>
      
      {/* Typography Tests */}
      <div className="space-y-2 mb-8">
        <h2 className="text-2xl font-bold">Typography Test</h2>
        <p className="text-lg text-gray-700">This is a large paragraph with gray text.</p>
        <p className="text-sm italic text-blue-600">This is small italic blue text.</p>
      </div>
      
      {/* Layout Tests */}
      <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg mb-8">
        <div className="bg-white p-4 rounded shadow">Box 1</div>
        <div className="bg-white p-4 rounded shadow">Box 2</div>
        <div className="bg-white p-4 rounded shadow">Box 3</div>
      </div>
      
      {/* Button Tests */}
      <div className="flex space-x-4 justify-center">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Blue Button
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Green Button
        </button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Red Button
        </button>
      </div>
    </div>
  );
};

export default TailwindTest;
