import React, { useState } from 'react';
import { Leaf, Trophy, Upload } from 'lucide-react';
import HomePage from './HomePage';
import Leaderboard from './Leaderboard';
import FileUpload from './FileUpload';

type View = 'home' | 'leaderboard' | 'upload';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'upload':
        return <FileUpload />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-green-50 to-eco-green-100">
      <nav className="bg-white/90 backdrop-blur-sm border-b border-eco-green-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentView('home')}
                className={`inline-flex items-center px-4 py-2 hover:text-eco-green-600 transition-all duration-200 ${
                  currentView === 'home' 
                    ? 'text-eco-green-500 border-b-2 border-eco-green-500 font-medium' 
                    : 'text-gray-600'
                }`}
              >
                <Leaf className="w-5 h-5 mr-2" />
                Home
              </button>
              <button
                onClick={() => setCurrentView('leaderboard')}
                className={`inline-flex items-center px-4 py-2 hover:text-eco-green-600 transition-all duration-200 ${
                  currentView === 'leaderboard' 
                    ? 'text-eco-green-500 border-b-2 border-eco-green-500 font-medium' 
                    : 'text-gray-600'
                }`}
              >
                <Trophy className="w-5 h-5 mr-2" />
                Leaderboard
              </button>
              <button
                onClick={() => setCurrentView('upload')}
                className={`inline-flex items-center px-4 py-2 hover:text-eco-green-600 transition-all duration-200 ${
                  currentView === 'upload' 
                    ? 'text-eco-green-500 border-b-2 border-eco-green-500 font-medium' 
                    : 'text-gray-600'
                }`}
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Image
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>
    </div>
  );
}

export default App;