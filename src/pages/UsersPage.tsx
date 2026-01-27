
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, Users, Mail } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { useUserInvites } from '@/hooks/useUserInvites';
import { useProjects } from '@/hooks/useProjects';
import { useClients } from '@/hooks/useClients';
import { useAuth } from '@/hooks/useAuth';
import InviteUserModal from '@/components/InviteUserModal';
import EditUserModal from '@/components/EditUserModal';
import UserTable from '@/components/users/UserTable';
import InviteTable from '@/components/users/InviteTable';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { SecurityAuditDashboard } from '@/components/security/SecurityAuditDashboard';
import { UserProfile } from '@/types/auth';

const UsersPage = () => {
  const {
    users,
    loading: usersLoading,
    refreshUsers
  } = useUsers();
  const {
    invites,
    loading: invitesLoading,
    createInvite,
    deleteInvite
  } = useUserInvites();
  const {
    projects
  } = useProjects();
  const {
    clients
  } = useClients();
  const {
    isAdmin
  } = useAuth();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  if (!isAdmin) {
    return (
      <DashboardContainer>
        <div className="min-h-screen p-6 flex items-center justify-center" style={{
          backgroundColor: '#F3F3F2'
        }}>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Access Denied</h1>
            <p className="text-slate-600">You don't have permission to access this page.</p>
          </div>
        </div>
      </DashboardContainer>
    );
  }

  const handleInviteUser = async (email: string, role: 'admin' | 'standard') => {
    await createInvite(email, role);
  };

  const handleEditUser = (user: UserProfile) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUserUpdate = (updatedUser: UserProfile) => {
    // Refresh the users list to reflect the updated display name
    refreshUsers();
  };

  const activeInvites = invites.filter(invite => !invite.used && new Date(invite.expires_at) > new Date());
  const expiredOrUsedInvites = invites.filter(invite => invite.used || new Date(invite.expires_at) <= new Date());

  return (
    <DashboardContainer>
      <div className="min-h-screen p-6" style={{
        backgroundColor: '#F3F3F2'
      }}>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-slate-800 flex items-center">
                <Users className="w-8 h-8 mr-3" />
                User Management
              </h1>
            </div>
            <Button onClick={() => setShowInviteModal(true)} className="bg-yellow-500 hover:bg-neutral-950 text-neutral-950 hover:text-yellow-500 rounded-sm transition-colors">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite User
            </Button>
          </div>

          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
              <TabsTrigger value="invites">Invites ({activeInvites.length})</TabsTrigger>
              <TabsTrigger value="security">Security Audit</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Registered Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <UserTable users={users} loading={usersLoading} onEditUser={handleEditUser} />
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
                      // Simple skeleton table for invites
                      <div className="rounded-md border">
                        <div className="p-4 space-y-3">
                          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-4 w-full bg-muted animate-pulse rounded" />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <InviteTable invites={activeInvites} onDeleteInvite={deleteInvite} showActions={true} />
                    )}
                  </CardContent>
                </Card>

                {expiredOrUsedInvites.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Expired/Used Invites</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {invitesLoading ? (
                        <div className="rounded-md border">
                          <div className="p-4 space-y-3">
                            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                            {Array.from({ length: 3 }).map((_, i) => (
                              <div key={i} className="h-4 w-full bg-muted animate-pulse rounded" />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <InviteTable invites={expiredOrUsedInvites} onDeleteInvite={deleteInvite} showActions={false} />
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="security">
              <SecurityAuditDashboard />
            </TabsContent>
          </Tabs>

          <InviteUserModal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} onInvite={handleInviteUser} />

          <EditUserModal 
            isOpen={showEditModal} 
            onClose={() => setShowEditModal(false)} 
            user={selectedUser} 
            projects={projects} 
            clients={clients}
            onUserUpdate={handleUserUpdate}
          />
        </div>
      </div>
    </DashboardContainer>
  );
};

export default UsersPage;
