
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  DollarSign, 
  Clock, 
  FileText, 
  Link as LinkIcon, 
  Users, 
  FileCheck, 
  ChevronDown,
  ChevronUp,
  Mail,
  ExternalLink,
  Plus,
  Edit,
  Upload
} from 'lucide-react';
import LogHoursModal from './LogHoursModal';
import EditClientModal from './EditClientModal';

interface HourEntry {
  id: number;
  hours: number;
  description: string;
  date: string;
}

interface ClientCardProps {
  client: any;
  onUpdateClient?: (clientId: number, updatedClient: any) => void;
}

const ClientCard = ({ client, onUpdateClient }: ClientCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLogHoursModal, setShowLogHoursModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [hourEntries, setHourEntries] = useState<HourEntry[]>(client.hourEntries || []);
  
  const getPriceDisplay = () => {
    const typeMap = {
      hour: '/hr',
      day: '/day',
      week: '/week',
      month: '/month'
    };
    return `$${client.price}${typeMap[client.priceType] || ''}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleLogHours = (hours: number, description: string, date: string) => {
    const newEntry: HourEntry = {
      id: Date.now(),
      hours,
      description,
      date
    };
    
    const updatedEntries = [...hourEntries, newEntry];
    setHourEntries(updatedEntries);
    
    // Update the client's total hours
    const totalHours = updatedEntries.reduce((sum, entry) => sum + entry.hours, 0);
    const updatedClient = {
      ...client,
      totalHours,
      hourEntries: updatedEntries
    };
    
    if (onUpdateClient) {
      onUpdateClient(client.id, updatedClient);
    }
  };

  const handleEditClient = (updatedClient: any) => {
    if (onUpdateClient) {
      onUpdateClient(client.id, updatedClient);
    }
  };

  const totalInvoiceAmount = client.invoices?.reduce((sum: number, inv: any) => sum + inv.amount, 0) || 0;
  const paidInvoices = client.invoices?.filter((inv: any) => inv.status === 'paid').length || 0;
  const totalInvoices = client.invoices?.length || 0;
  const totalHours = hourEntries.reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h3 className="text-xl font-semibold text-slate-800">{client.name}</h3>
              <Badge className={getStatusColor(client.status)}>
                {client.status}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{getPriceDisplay()}</div>
                <div className="text-sm text-slate-500">Rate</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditModal(true)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-slate-600">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm">{totalHours} hours</span>
              </div>
              <div className="flex items-center text-slate-600">
                <FileCheck className="w-4 h-4 mr-1" />
                <span className="text-sm">{paidInvoices}/{totalInvoices} invoices paid</span>
              </div>
              <div className="flex items-center text-green-600">
                <DollarSign className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">${totalInvoiceAmount.toLocaleString()}</span>
              </div>
            </div>
            <Button 
              size="sm" 
              onClick={() => setShowLogHoursModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-3 h-3 mr-1" />
              Log Time
            </Button>
          </div>
        </CardHeader>

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-6">
              {/* Hour Entries */}
              {hourEntries.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-700 mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Logged Hours ({hourEntries.length} entries)
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {hourEntries.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                        <div>
                          <div className="font-medium text-slate-800">{entry.hours} hours</div>
                          <div className="text-sm text-slate-600">{new Date(entry.date).toLocaleDateString()}</div>
                          {entry.description && (
                            <div className="text-sm text-slate-500 mt-1">{entry.description}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {client.notes && (
                <div>
                  <h4 className="font-medium text-slate-700 mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Notes
                  </h4>
                  <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg">{client.notes}</p>
                </div>
              )}

              {/* People */}
              {client.people && client.people.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-700 mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Team ({client.people.length})
                  </h4>
                  <div className="space-y-2">
                    {client.people.map((person: any, index: number) => (
                      <div key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                        <div>
                          <div className="font-medium text-slate-800">{person.name}</div>
                          <div className="text-sm text-slate-600">{person.title}</div>
                        </div>
                        <div className="flex items-center text-slate-500">
                          <Mail className="w-4 h-4 mr-1" />
                          <span className="text-sm">{person.email}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              {client.documents && client.documents.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-700 mb-3 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Documents ({client.documents.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {client.documents.map((doc: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded text-sm">
                        <div className="flex items-center">
                          {doc.type === 'upload' ? <Upload className="w-4 h-4 mr-2 text-slate-500" /> : <LinkIcon className="w-4 h-4 mr-2 text-slate-500" />}
                          <span className="truncate">{doc.name || doc}</span>
                        </div>
                        {doc.url && (
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {client.links && client.links.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-700 mb-3 flex items-center">
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Relevant Links ({client.links.length})
                  </h4>
                  <div className="space-y-2">
                    {client.links.map((link: string, index: number) => (
                      <a 
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-2 bg-slate-50 rounded text-sm hover:bg-slate-100 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-2 text-slate-500" />
                        <span className="text-blue-600 hover:text-blue-800">{link}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Invoices */}
              {client.invoices && client.invoices.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-700 mb-3 flex items-center">
                    <FileCheck className="w-4 h-4 mr-2" />
                    Invoices ({client.invoices.length})
                  </h4>
                  <div className="space-y-2">
                    {client.invoices.map((invoice: any) => (
                      <div key={invoice.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                        <div>
                          <div className="font-medium text-slate-800">${invoice.amount.toLocaleString()}</div>
                          <div className="text-sm text-slate-600">{new Date(invoice.date).toLocaleDateString()}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {invoice.status}
                          </Badge>
                          {invoice.url && (
                            <a href={invoice.url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <LogHoursModal
        isOpen={showLogHoursModal}
        onClose={() => setShowLogHoursModal(false)}
        onLogHours={handleLogHours}
        clientName={client.name}
        priceType={client.priceType}
      />

      <EditClientModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        client={client}
        onSave={handleEditClient}
      />
    </>
  );
};

export default ClientCard;
