
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { format } from 'date-fns';
import { UserProfile } from '@/types/auth';
import { Client } from '@/types/client';
import { useCurrency } from '@/hooks/useCurrency';
import TableSkeleton from '@/components/skeletons/TableSkeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserTableProps {
  users: UserProfile[];
  loading: boolean;
  onEditUser: (user: UserProfile) => void;
  onRoleChange?: (user: UserProfile, role: 'admin' | 'standard' | 'client') => void;
  clients?: Client[];
  clientAssignments?: Record<string, number | null>;
  onClientChange?: (user: UserProfile, clientId: number | null) => void;
  onDeleteUser?: (user: UserProfile) => void;
}

const UserTable = ({
  users,
  loading,
  onEditUser,
  onRoleChange,
  clients = [],
  clientAssignments = {},
  onClientChange,
  onDeleteUser
}: UserTableProps) => {
  const { demoMode } = useCurrency();

  if (loading) {
    return (
      <TableSkeleton
        rows={5}
        cols={6}
        headers={["Name", "Email", "Role", "Client", "Joined", "Actions"]}
      />
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No users found
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Client</TableHead>
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
              <TableCell>{demoMode ? '—' : user.email}</TableCell>
              <TableCell>
                {onRoleChange ? (
                  <Select
                    value={user.role}
                    onValueChange={(value) => {
                      if (value !== user.role) {
                        onRoleChange(user, value as 'admin' | 'standard' | 'client');
                      }
                    }}
                  >
                    <SelectTrigger className="h-8 w-[140px] text-xs">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">admin</SelectItem>
                      <SelectItem value="standard">standard</SelectItem>
                      <SelectItem value="client">client</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-sm text-slate-700">{user.role}</span>
                )}
              </TableCell>
              <TableCell>
                {user.role === 'client' && onClientChange ? (
                  <Select
                    value={
                      clientAssignments[user.id] !== null &&
                      clientAssignments[user.id] !== undefined
                        ? String(clientAssignments[user.id])
                        : 'unassigned'
                    }
                    onValueChange={(value) => {
                      const clientId = value === 'unassigned' ? null : Number(value);
                      if (clientId !== clientAssignments[user.id]) {
                        onClientChange(user, clientId);
                      }
                    }}
                  >
                    <SelectTrigger className="h-8 w-[200px] text-xs">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={String(client.id)}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-sm text-slate-500">—</span>
                )}
              </TableCell>
              <TableCell>
                {format(new Date(user.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditUser(user)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                {onDeleteUser && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDeleteUser(user)}
                    className="ml-2"
                  >
                    Delete
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
