import React, { useState } from 'react';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, Loader2, Trash2, Users, Mail, CheckCircle, XCircle, Clock, Edit } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { useUserInvites } from '@/hooks/useUserInvites';
import { useProjects } from '@/hooks/useProjects';
import { useAuth } from '@/hooks/useAuth';
import InviteUserModal from '@/components/InviteUserModal';
import EditUserModal from '@/components/EditUserModal';
import { format } from 'date-fns';
import { UserProfile } from '@/types/auth';

const UsersPage = () => {
  const { isMobile } = useSidebar();
  const { users, loading: usersLoading } = useUsers();
  const { invites, loading: invitesLoading, createInvite, deleteInvite } = useUserInvites();
  const { projects } = useProjects();
  const { isAdmin } = useAuth();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  if (!isAdmin) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center" style={{ backgroundColor: '#F3F3F2' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Access Denied</h1>
          <p className="text-slate-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  };

  const handleInviteUser = async (email: string, role: 'admin' | 'standard') => {
    await createInvite(email, role);
  };

  const handleEditUser = (user: UserProfile) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const activeInvites = invites.filter(invite => !invite.used && new Date(invite.expires_at) > new Date());
  const expiredOrUsedInvites = invites.filter(invite => invite.used || new Date(invite.expires_at) <= new Date());

  const getInviteStatusIcon = (invite: any) => {
    if (invite.used) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    if (new Date(invite.expires_at) <= new Date()) {
      return <XCircle className="h-4 w-4 text-red-600" />;
    }
    if (invite.email_sent) {
      return <Mail className="h-4 w-4 text-blue-600" />;
    }
    return <Clock className="h-4 w-4 text-yellow-600" />;
  };

  const getInviteStatusText = (invite: any) => {
    if (invite.used) return 'Used';
    if (new Date(invite.expires_at) <= new Date()) return 'Expired';
    if (invite.email_sent) return 'Sent';
    return 'Pending';
  };

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
                          <TableHead className="text-right">Actions</TableHead>
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
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditUser(user)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Edit className="h-4 w-4" />
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
                            <TableHead>Status</TableHead>
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
                                <div className="flex items-center space-x-2">
                                  {getInviteStatusIcon(invite)}
                                  <span className="text-sm">{getInviteStatusText(invite)}</span>
                                </div>
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
                                <div className="flex items-center space-x-2">
                                  {getInviteStatusIcon(invite)}
                                  <span className="text-sm">{getInviteStatusText(invite)}</span>
                                </div>
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

        <EditUserModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          user={selectedUser}
          projects={projects}
        />
      </div>
    </div>
  );
};

export default UsersPage;
