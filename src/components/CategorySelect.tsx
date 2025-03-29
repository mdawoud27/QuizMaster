import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import {
  Brain,
  Globe,
  Book,
  Music,
  Film,
  Trophy,
  Cpu,
  Landmark,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  flask: <Brain className="w-6 h-6" />,
  globe: <Globe className="w-6 h-6" />,
  "book-open": <Book className="w-6 h-6" />,
  music: <Music className="w-6 h-6" />,
  film: <Film className="w-6 h-6" />,
  trophy: <Trophy className="w-6 h-6" />,
  cpu: <Cpu className="w-6 h-6" />,
  landmark: <Landmark className="w-6 h-6" />,
};

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface CategorySelectProps {
  onSelect: (category: Category) => void;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({ onSelect }) => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) throw error;
      return data as Category[];
    },
  });

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories?.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category)}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="text-indigo-600">{iconMap[category.icon]}</div>
            <div className="text-left">
              <h3 className="text-lg font-semibold">{category.name}</h3>
              <p className="text-sm text-gray-600">{category.description}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
