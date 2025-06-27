
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Search className="w-4 h-4 text-muted-foreground" />
      <Input
        placeholder="Search templates and documents..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-md"
      />
    </div>
  );
};

export default SearchBar;
