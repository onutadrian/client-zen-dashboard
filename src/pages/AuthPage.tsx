
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PasswordInput } from '@/components/ui/password-input';
import { useUserInvites } from '@/hooks/useUserInvites';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, UserPlus } from 'lucide-react';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { validateInviteToken } = useUserInvites();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [inviteData, setInviteData] = useState<any>(null);
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(() => {
    const mode = searchParams.get('mode');
    return mode === 'signup' ? 'signup' : 'signin';
  });

  useEffect(() => {
    const token = searchParams.get('invite');
    if (token) {
      setInviteToken(token);
      validateInvite(token);
    }
  }, [searchParams]);

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (inviteData) {
      setActiveTab('signup');
      return;
    }
    if (mode === 'signup') {
      setActiveTab('signup');
    } else {
      setActiveTab('signin');
    }
  }, [searchParams, inviteData]);

  const validateInvite = async (token: string) => {
    try {
      const invite = await validateInviteToken(token);
      if (invite) {
        setInviteData(invite);
        setEmail(invite.email);
        toast({
          title: "Valid Invite",
          description: `You've been invited as a ${invite.role} user`,
        });
      } else {
        toast({
          title: "Invalid Invite",
          description: "This invite is invalid or has expired",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error validating invite:', error);
      toast({
        title: "Error",
        description: "Failed to validate invite",
        variant: "destructive",
      });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const signUpData: any = {
        email,
        password,
      };

      // Add invite token to user metadata if present
      if (inviteToken) {
        signUpData.options = {
          data: {
            invite_token: inviteToken,
            role: inviteData?.role || 'standard'
          }
        };
      }

      signUpData.options = {
        ...signUpData.options,
        emailRedirectTo: `${window.location.origin}/auth?mode=signup`
      };

      const { data, error } = await supabase.auth.signUp(signUpData);

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Success",
          description: "Please check your email to confirm your account",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Project Manager
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {inviteData ? 'Complete your invitation' : 'Sign in to your account or create a new one'}
          </p>
        </div>

        {inviteData && (
          <Alert>
            <UserPlus className="h-4 w-4" />
            <AlertDescription>
              You've been invited to join as a <strong>{inviteData.role}</strong> user. 
              Please create your account to continue.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>
              {inviteData ? 'Create your account' : 'Sign in or create an account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={inviteData ? "signup" : activeTab} onValueChange={(v) => setActiveTab(v as 'signin' | 'signup')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin" disabled={!!inviteData}>Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signin-password">Password</Label>
                    <PasswordInput
                      id="signin-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={!!inviteData}
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <PasswordInput
                      id="signup-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <PasswordInput
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
