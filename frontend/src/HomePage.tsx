import React from 'react';
import { Leaf, Image, Award, Trophy } from 'lucide-react';

function HomePage() {
  return (
    <div className="space-y-8">
      <div className="eco-card p-8">
        <h1 className="text-4xl font-bold text-eco-green-800 mb-4 flex items-center">
          <Leaf className="w-8 h-8 mr-3 text-eco-green-500" />
          Welcome to RecyclEye
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Join our eco-conscious community in exploring and identifying images through
          the power of AI. Help us build a more sustainable future by contributing to
          our growing database of environmental observations.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="eco-card p-6">
          <div className="flex items-center mb-4">
            <Image className="w-6 h-6 text-eco-green-500 mr-2" />
            <h2 className="text-xl font-semibold text-eco-green-700">Upload Images</h2>
          </div>
          <p className="text-gray-600">
            Share your environmental observations and let our AI help identify them.
          </p>
        </div>

        <div className="eco-card p-6">
          <div className="flex items-center mb-4">
            <Award className="w-6 h-6 text-eco-green-500 mr-2" />
            <h2 className="text-xl font-semibold text-eco-green-700">Earn Points</h2>
          </div>
          <p className="text-gray-600">
            Contribute to our database and earn points for each classification.
          </p>
        </div>

        <div className="eco-card p-6">
          <div className="flex items-center mb-4">
            <Trophy className="w-6 h-6 text-eco-green-500 mr-2" />
            <h2 className="text-xl font-semibold text-eco-green-700">Compete</h2>
          </div>
          <p className="text-gray-600">
            Join the leaderboard and compete with other environmental enthusiasts.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;