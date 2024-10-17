import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import PhotoEditor from './components/PhotoEditor';

const App: React.FC = () => {
  const [selectedFrame, setSelectedFrame] = useState<string>('/frame0.png');

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <header className="bg-blue-600 text-white p-4">
          <nav className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">
              JnU Day Frame Generator!
            </Link>
            <Link
              to="/editor"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Generate Frame
            </Link>
          </nav>
        </header>

        <main className="flex-grow container mx-auto p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/editor"
              element={
                <PhotoEditor
                  selectedFrame={selectedFrame}
                  setSelectedFrame={setSelectedFrame}
                />
              }
            />
          </Routes>
        </main>

        <footer className="bg-gray-200 text-center p-4">
          <p>&copy; 2024 jhm69 </p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
