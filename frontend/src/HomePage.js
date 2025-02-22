import React from "react";
import { Upload, Trophy, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Example FeatureCard component
const FeatureCard = ({ icon, title, description }) => (
  <div className="p-4 bg-white rounded-lg shadow-sm">
    <div className="mb-2">{icon}</div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-green-800 mb-6">
          Welcome to EcoTracker
        </h1>
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-lg text-gray-700 mb-4">
              Join our community of eco-warriors making a difference! Track your recycling efforts,
              compete with others, and help create a sustainable future.
            </p>

            {/* Example grid of features */}
            <div className="grid md:grid-cols-3 gap-4">
              <FeatureCard
                icon={<Upload className="h-8 w-8 text-green-600" />}
                title="Track Progress"
                description="Upload your recycling reports and get instant feedback"
              />
              <FeatureCard
                icon={<Trophy className="h-8 w-8 text-green-600" />}
                title="Compete"
                description="Join the leaderboard and compete with other recyclers"
              />
              <FeatureCard
                icon={<ArrowRight className="h-8 w-8 text-green-600" />}
                title="Improve"
                description="Get personalized tips to enhance your recycling habits"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
