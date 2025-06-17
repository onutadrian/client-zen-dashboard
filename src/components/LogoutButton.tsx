
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const LogoutButton = () => {
  const { signOut } = useAuth();

  return (
    <Button 
      onClick={signOut} 
      variant="outline" 
      size="sm"
      className="flex items-center space-x-2"
    >
      <LogOut className="w-4 h-4" />
      <span>Sign Out</span>
    </Button>
  );
};

export default LogoutButton;
