
import React, { useState } from 'react';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, Loader2, Trash2, Users, Mail } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { useUserInvites } from '@/hooks/useUserInvites';
import { useAuth } from '@/hooks/useAuth';
import InviteUserModal from '@/components/InviteUserModal';
import { format } from 'date-fns';

const UsersPage = () => {
  const { isMobile } = useSidebar();
  const { users, loading: usersLoading } = useUsers();
  const { invites, loading: invitesLoading, createInvite, deleteInvite } = useUserInvites();
  const { isAdmin } = useAuth();
  const [showInviteModal, setShowInviteModal] = useState(false);

  if (!isAdmin) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center" style={{ backgroundColor: '#F3F3F2' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Access Denied</h1>
          <p className="text-slate-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const handleInviteUser = async (email: string, role: 'admin' | 'standard') => {
    await createInvite(email, role);
  };

  const activeInvites = invites.filter(invite => !invite.used && new Date(invite.expires_at) > new Date());
  const expiredOrUsedInvites = invites.filter(invite => invite.used || new Date(invite.expires_at) <= new Date());

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F3F3F2' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isMobile && <SidebarTrigger />}
            <h1 className="text-3xl font-bold text-slate-800 flex items-center">
              <Users className="w-8 h-8 mr-3" />
              User Management
            </h1>
          </div>
          <Button onClick={() => setShowInviteModal(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite User
          </Button>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
            <TabsTrigger value="invites">Invites ({activeInvites.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    No users found
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Joined</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              {user.full_name || 'N/A'}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge className={user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {format(new Date(user.created_at), 'MMM d, yyyy')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invites" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Active Invites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {invitesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                    </div>
                  ) : activeInvites.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      No active invites found
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Expires</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activeInvites.map((invite) => (
                            <TableRow key={invite.id}>
                              <TableCell className="font-medium">{invite.email}</TableCell>
                              <TableCell>
                                <Badge className={invite.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                                  {invite.role}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {format(new Date(invite.expires_at), 'MMM d, yyyy HH:mm')}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteInvite(invite.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {expiredOrUsedInvites.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Expired/Used Invites</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {expiredOrUsedInvites.map((invite) => (
                            <TableRow key={invite.id} className="opacity-60">
                              <TableCell className="font-medium">{invite.email}</TableCell>
                              <TableCell>
                                <Badge className={invite.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                                  {invite.role}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {invite.used ? (
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
                                {format(new Date(invite.used ? invite.used_at! : invite.expires_at), 'MMM d, yyyy')}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <InviteUserModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          onInvite={handleInviteUser}
        />
      </div>
    </div>
  );
};

export default UsersPage;
