import React from 'react';
import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">
        Welcome to JnU Day Frame Generator 2024!
      </h1>

      <div className="flex justify-center space-x-8 mb-12">
        <div className="text-center">
          <img
            src="/frame0.png"
            alt="Frame 0"
            className="w-48 h-48 object-contain mb-2"
          />
          <p>Sajid Frame</p>
        </div>
        <div className="text-center">
          <img
            src="/frame1.png"
            alt="Frame 1"
            className="w-48 h-48 object-contain mb-2"
          />
          <p>Classic Frame</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">How to Generate:</h2>
        <ol className="list-decimal list-inside text-left space-y-2">
          <li>Click on "Create Frame" in the navigation bar</li>
          <li>Upload your photo</li>
          <li>Crop and adjust your photo as needed</li>
          <li>Choose between the Sajid and Classsic frames</li>
          <li>Download your framed photo</li>
        </ol>
      </div>

      <Link
        to="/editor"
        className="inline-block mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Camera className="inline-block mr-2" />
        Start Generating Now!
      </Link>
    </div>
  );
};

export default HomePage;
