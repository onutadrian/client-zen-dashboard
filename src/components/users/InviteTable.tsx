
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, CheckCircle, XCircle, Mail, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useCurrency } from '@/hooks/useCurrency';

interface InviteTableProps {
  invites: any[];
  onDeleteInvite: (inviteId: string) => void;
  showActions?: boolean;
}

const InviteTable = ({ invites, onDeleteInvite, showActions = true }: InviteTableProps) => {
  const { demoMode } = useCurrency();

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

  if (invites.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No invites found
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>{showActions ? 'Expires' : 'Date'}</TableHead>
            {showActions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {invites.map((invite) => (
            <TableRow key={invite.id} className={!showActions ? 'opacity-60' : ''}>
              <TableCell className="font-medium">{demoMode ? '—' : invite.email}</TableCell>
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
                {format(new Date(showActions ? invite.expires_at : (invite.used ? invite.used_at! : invite.expires_at)), 'MMM d, yyyy HH:mm')}
              </TableCell>
              {showActions && (
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteInvite(invite.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InviteTable;
