import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { 
  DollarSign, 
  Clock, 
  FileText, 
  Link as LinkIcon, 
  Users, 
  FileCheck, 
  Mail,
  ExternalLink,
  Plus,
  Edit,
  Upload,
  Eye
} from 'lucide-react';
import LogHoursModal from './LogHoursModal';
import EditClientModal from './EditClientModal';

interface HourEntry {
  id: number;
  hours: number;
  description: string;
  date: string;
  billed?: boolean;
}

interface ClientCardProps {
  client: any;
  onUpdateClient?: (clientId: number, updatedClient: any) => void;
  displayCurrency?: string;
  convertCurrency?: (amount: number, fromCurrency: string, toCurrency: string) => number;
  formatCurrency?: (amount: number, currency: string) => string;
}

const ClientCard = ({ 
  client, 
  onUpdateClient, 
  displayCurrency = 'USD',
  convertCurrency,
  formatCurrency
}: ClientCardProps) => {
  const [showLogHoursModal, setShowLogHoursModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [hourEntries, setHourEntries] = useState<HourEntry[]>(client.hourEntries || []);

  // Update hour entries when client data changes
  useEffect(() => {
    console.log('Client hour entries updated:', client.hourEntries);
    setHourEntries(client.hourEntries || []);
  }, [client.hourEntries]);
  
  const getPriceDisplay = () => {
    const typeMap = {
      hour: '/hr',
      day: '/day',
      week: '/week',
      month: '/month'
    };
    
    if (convertCurrency && formatCurrency) {
      const convertedPrice = convertCurrency(client.price, client.currency || 'USD', displayCurrency);
      return `${formatCurrency(convertedPrice, displayCurrency)}${typeMap[client.priceType] || ''}`;
    }
    
    // Fallback to original behavior
    return `$${client.price}${typeMap[client.priceType] || ''}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-primary text-primary-foreground';
      case 'inactive':
        return 'bg-muted text-muted-foreground';
      case 'pending':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleLogHours = (hours: number, description: string, date: string) => {
    const newEntry: HourEntry = {
      id: Date.now(),
      hours,
      description,
      date,
      billed: false
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

  const toggleBilledStatus = (entryId: number) => {
    const updatedEntries = hourEntries.map(entry =>
      entry.id === entryId ? { ...entry, billed: !entry.billed } : entry
    );
    setHourEntries(updatedEntries);
    
    const updatedClient = {
      ...client,
      hourEntries: updatedEntries
    };
    
    if (onUpdateClient) {
      onUpdateClient(client.id, updatedClient);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open sheet if clicking on buttons or interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="button"]')) {
      return;
    }
    setIsSheetOpen(true);
  };

  const totalInvoiceAmount = client.invoices?.reduce((sum: number, inv: any) => {
    if (convertCurrency) {
      return sum + convertCurrency(inv.amount, inv.currency || client.currency || 'USD', displayCurrency);
    }
    return sum + inv.amount;
  }, 0) || 0;
  const paidInvoices = client.invoices?.filter((inv: any) => inv.status === 'paid').length || 0;
  const totalInvoices = client.invoices?.length || 0;
  const totalHours = hourEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const billedHours = hourEntries.filter(entry => entry.billed).reduce((sum, entry) => sum + entry.hours, 0);
  const unbilledHours = totalHours - billedHours;

  const formatDisplayAmount = (amount: number) => {
    if (formatCurrency) {
      return formatCurrency(amount, displayCurrency);
    }
    return `$${amount.toLocaleString()}`;
  };

  return (
    <>
      <Card 
        className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary cursor-pointer"
        onClick={handleCardClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h3 className="text-xl font-semibold text-foreground">{client.name}</h3>
              <Badge className={getStatusColor(client.status)}>
                {client.status}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">{getPriceDisplay()}</div>
                <div className="text-sm text-muted-foreground">Rate</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditModal(true);
                }}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSheetOpen(true);
                }}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm">{totalHours} hours</span>
                {unbilledHours > 0 && (
                  <span className="text-xs text-destructive ml-1">({unbilledHours} unbilled)</span>
                )}
              </div>
              <div className="flex items-center text-muted-foreground">
                <FileCheck className="w-4 h-4 mr-1" />
                <span className="text-sm">{paidInvoices}/{totalInvoices} invoices paid</span>
              </div>
              <div className="flex items-center text-foreground">
                <DollarSign className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">{formatDisplayAmount(totalInvoiceAmount)}</span>
              </div>
            </div>
            <Button 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                setShowLogHoursModal(true);
              }}
            >
              <Plus className="w-3 h-3 mr-1" />
              Log Time
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[600px] sm:w-[800px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{client.name} - Details</SheetTitle>
            <SheetDescription>
              View and manage client information, logged hours, and project details.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            {/* Hour Entries */}
            {hourEntries.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Logged Hours ({hourEntries.length} entries) - {billedHours}h billed, {unbilledHours}h unbilled
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {hourEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between bg-muted p-3 rounded-lg">
                      <div>
                        <div className="font-medium text-foreground">{entry.hours} hours</div>
                        <div className="text-sm text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</div>
                        {entry.description && (
                          <div className="text-sm text-muted-foreground mt-1">{entry.description}</div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            {entry.billed ? 'Billed' : 'Unbilled'}
                          </span>
                          <Switch
                            checked={entry.billed || false}
                            onCheckedChange={() => toggleBilledStatus(entry.id)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {client.notes && (
              <div>
                <h4 className="font-medium text-foreground mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Notes
                </h4>
                <p className="text-muted-foreground text-sm bg-slate-50 p-3 rounded-lg">{client.notes}</p>
              </div>
            )}

            {/* People */}
            {client.people && client.people.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Team ({client.people.length})
                </h4>
                <div className="space-y-2">
                  {client.people.map((person: any, index: number) => (
                    <div key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                      <div>
                        <div className="font-medium text-foreground">{person.name}</div>
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
                <h4 className="font-medium text-foreground mb-3 flex items-center">
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
                <h4 className="font-medium text-foreground mb-3 flex items-center">
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
                <h4 className="font-medium text-foreground mb-3 flex items-center">
                  <FileCheck className="w-4 h-4 mr-2" />
                  Invoices ({client.invoices.length})
                </h4>
                <div className="space-y-2">
                  {client.invoices.map((invoice: any) => {
                    const displayAmount = convertCurrency && formatCurrency 
                      ? formatCurrency(convertCurrency(invoice.amount, invoice.currency || client.currency || 'USD', displayCurrency), displayCurrency)
                      : `$${invoice.amount.toLocaleString()}`;
                    
                    return (
                      <div key={invoice.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                        <div>
                          <div className="font-medium text-foreground">{displayAmount}</div>
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
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

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
