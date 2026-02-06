
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
import { useToast } from '@/hooks/use-toast';

const UsersPage = () => {
  const {
    users,
    loading: usersLoading,
    refreshUsers,
    updateUserRole,
    deleteUser
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
    clients,
    updateClient
  } = useClients();
  const {
    isAdmin
  } = useAuth();
  const { toast } = useToast();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  if (!isAdmin) {
    return (
      <DashboardContainer>
        <div className="w-full flex items-center justify-center">
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

  const handleRoleChange = async (user: UserProfile, role: 'admin' | 'standard' | 'client') => {
    await updateUserRole(user.id, role);
    if (role !== 'client') {
      await handleClientLink(user, null);
    }
  };

  const normalizeEmail = (email?: string | null) => (email || '').trim().toLowerCase();

  const handleClientLink = async (user: UserProfile, clientId: number | null) => {
    if (!user.email) {
      toast({
        title: "Missing email",
        description: "User must have an email to link to a client.",
        variant: "destructive",
      });
      return;
    }

    const email = normalizeEmail(user.email);
    const clientsWithEmail = clients.filter((client) =>
      (client.people || []).some((person) => normalizeEmail(person.email) === email)
    );

    // Remove from all existing clients first
    for (const client of clientsWithEmail) {
      const updatedPeople = (client.people || []).filter(
        (person) => normalizeEmail(person.email) !== email
      );
      await updateClient(client.id, { ...client, people: updatedPeople });
    }

    if (clientId === null) {
      return;
    }

    const targetClient = clients.find((client) => client.id === clientId);
    if (!targetClient) {
      toast({
        title: "Client not found",
        description: "Unable to link user to the selected client.",
        variant: "destructive",
      });
      return;
    }

    const updatedPeople = [...(targetClient.people || [])];
    if (!updatedPeople.some((person) => normalizeEmail(person.email) === email)) {
      updatedPeople.push({
        name: user.full_name || user.email || 'Client User',
        email: user.email,
        title: 'Client'
      });
    }

    await updateClient(targetClient.id, { ...targetClient, people: updatedPeople });
  };

  const handleDeleteUser = async (user: UserProfile) => {
    if (!confirm(`Delete user ${user.email || user.full_name || user.id}? This cannot be undone.`)) {
      return;
    }
    await deleteUser(user.id);
  };

  const activeInvites = invites.filter(invite => !invite.used && new Date(invite.expires_at) > new Date());
  const expiredOrUsedInvites = invites.filter(invite => invite.used || new Date(invite.expires_at) <= new Date());
  const clientAssignments = users.reduce<Record<string, number | null>>((acc, user) => {
    if (!user.email) {
      acc[user.id] = null;
      return acc;
    }

    const email = normalizeEmail(user.email);
    const linkedClient = clients.find((client) =>
      (client.people || []).some((person) => normalizeEmail(person.email) === email)
    );

    acc[user.id] = linkedClient ? linkedClient.id : null;
    return acc;
  }, {});

  return (
    <DashboardContainer>
      <div className="w-full">
        <div className="w-full space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-slate-800 flex items-center">
                <Users className="w-8 h-8 mr-3" />
                User Management
              </h1>
            </div>
            <Button variant="primary" onClick={() => setShowInviteModal(true)}>
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
                  <UserTable
                    users={users}
                    loading={usersLoading}
                    onEditUser={handleEditUser}
                    onRoleChange={handleRoleChange}
                    clients={clients}
                    clientAssignments={clientAssignments}
                    onClientChange={handleClientLink}
                    onDeleteUser={handleDeleteUser}
                  />
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
