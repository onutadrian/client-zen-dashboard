import React, { useState, useEffect } from 'react';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Copy, Trash2, Calendar, UserPlus, Loader2 } from 'lucide-react';
import { useInviteCodes } from '@/hooks/useInviteCodes';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';
import { format } from 'date-fns';

const InviteManagerPage = () => {
  const { inviteCodes, loading, createInviteCode, deleteInviteCode, refreshInviteCodes } = useInviteCodes();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const { isMobile } = useSidebar();
  const [selectedRole, setSelectedRole] = useState<UserRole>('standard');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    if (!isAdmin) {
      window.location.href = '/';
    }
  }, [isAdmin]);

  useEffect(() => {
    refreshInviteCodes();
  }, []);

  const handleCreateInvite = async () => {
    setIsCreating(true);
    try {
      const expiresAt = expiryDate ? new Date(expiryDate) : undefined;
      const inviteCode = await createInviteCode(selectedRole, expiresAt);
      if (inviteCode) {
        setSelectedRole('standard');
        setExpiryDate('');
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyInviteLink = (code: string) => {
    const baseUrl = window.location.origin;
    const inviteLink = `${baseUrl}/auth?invite_code=${code}`;
    
    navigator.clipboard.writeText(inviteLink).then(() => {
      toast({
        title: "Copied!",
        description: "Invite link copied to clipboard",
      });
    }).catch(err => {
      console.error('Failed to copy:', err);
      toast({
        title: "Error",
        description: "Failed to copy invite link",
        variant: "destructive",
      });
    });
  };

  const handleDelete = async (id: string) => {
    await deleteInviteCode(id);
  };

  const activeInvites = inviteCodes.filter(code => !code.is_used && (!code.expires_at || new Date(code.expires_at) > new Date()));
  const usedOrExpiredInvites = inviteCodes.filter(code => code.is_used || (code.expires_at && new Date(code.expires_at) <= new Date()));

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F3F3F2' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isMobile && <SidebarTrigger />}
            <h1 className="text-3xl font-bold text-slate-800">Invite Manager</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Create Invite Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="w-5 h-5 mr-2" />
                Create Invite
              </CardTitle>
              <CardDescription>
                Generate invite links for new users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="role">User Role</Label>
                <Select 
                  value={selectedRole} 
                  onValueChange={(value: UserRole) => setSelectedRole(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard User</SelectItem>
                    <SelectItem value="admin">Admin User</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedRole === 'admin' 
                    ? 'Admin users have full access to all features' 
                    : 'Standard users can only add tasks and view non-financial data'}
                </p>
              </div>

              <div>
                <Label htmlFor="expiry">Expiry Date (Optional)</Label>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <Input
                    id="expiry"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Leave blank for no expiration
                </p>
              </div>

              <Button 
                onClick={handleCreateInvite} 
                className="w-full" 
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Generate Invite Link
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Invite Codes List */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Invite Codes</CardTitle>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="used">Used/Expired</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <TabsContent value="active" className="mt-0">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                  </div>
                ) : activeInvites.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    No active invite codes found
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Expires</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeInvites.map((invite) => (
                          <TableRow key={invite.id}>
                            <TableCell className="font-medium">{invite.code}</TableCell>
                            <TableCell>
                              <Badge className={invite.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                                {invite.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {invite.expires_at 
                                ? format(new Date(invite.expires_at), 'MMM d, yyyy')
                                : 'Never'}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopyInviteLink(invite.code)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(invite.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="used" className="mt-0">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                  </div>
                ) : usedOrExpiredInvites.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    No used or expired invite codes found
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Used By</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {usedOrExpiredInvites.map((invite) => (
                          <TableRow key={invite.id} className="opacity-60">
                            <TableCell className="font-medium">{invite.code}</TableCell>
                            <TableCell>
                              <Badge className={invite.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                                {invite.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {invite.is_used ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  Used
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                  Expired
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {invite.used_by ? (
                                <span className="text-sm text-slate-600">
                                  {invite.used_by.substring(0, 8)}...
                                </span>
                              ) : (
                                <span className="text-sm text-slate-400">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InviteManagerPage;