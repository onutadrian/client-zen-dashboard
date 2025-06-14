
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
  ExternalLink
} from 'lucide-react';

const ClientCard = ({ client }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getPriceDisplay = () => {
    const typeMap = {
      hour: '/hr',
      day: '/day',
      week: '/week',
      month: '/month'
    };
    return `$${client.price}${typeMap[client.priceType] || ''}`;
  };

  const getStatusColor = (status) => {
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

  const totalInvoiceAmount = client.invoices?.reduce((sum, inv) => sum + inv.amount, 0) || 0;
  const paidInvoices = client.invoices?.filter(inv => inv.status === 'paid').length || 0;
  const totalInvoices = client.invoices?.length || 0;

  return (
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
        <div className="flex items-center space-x-6 pt-2">
          <div className="flex items-center text-slate-600">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">{client.totalHours || 0} hours</span>
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
      </CardHeader>

      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-6">
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
                  {client.people.map((person, index) => (
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
                  {client.documents.map((doc, index) => (
                    <div key={index} className="flex items-center p-2 bg-slate-50 rounded text-sm">
                      <FileText className="w-4 h-4 mr-2 text-slate-500" />
                      <span className="truncate">{doc}</span>
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
                  {client.links.map((link, index) => (
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
                  {client.invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                      <div>
                        <div className="font-medium text-slate-800">${invoice.amount.toLocaleString()}</div>
                        <div className="text-sm text-slate-600">{new Date(invoice.date).toLocaleDateString()}</div>
                      </div>
                      <Badge className={invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {invoice.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ClientCard;
