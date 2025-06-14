
import React, { useState } from 'react';
import { Plus, Users, CreditCard, DollarSign, Clock, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ClientCard from '@/components/ClientCard';
import SubscriptionCard from '@/components/SubscriptionCard';
import AddClientModal from '@/components/AddClientModal';
import AddSubscriptionModal from '@/components/AddSubscriptionModal';
import AnalyticsSection from '@/components/AnalyticsSection';

const Index = () => {
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "Acme Corporation",
      price: 150,
      priceType: "hour",
      status: "active",
      totalHours: 45,
      documents: ["Contract.pdf", "Project Brief.docx"],
      links: ["https://acme.com", "https://acme-staging.com"],
      notes: "Primary contact prefers email communication. Weekly standups on Mondays.",
      people: [
        { name: "John Smith", email: "john@acme.com", title: "Project Manager" },
        { name: "Sarah Wilson", email: "sarah@acme.com", title: "Technical Lead" }
      ],
      invoices: [
        { id: 1, amount: 6750, date: "2024-06-01", status: "paid" },
        { id: 2, amount: 4500, date: "2024-05-01", status: "pending" }
      ]
    }
  ]);

  const [subscriptions, setSubscriptions] = useState([
    {
      id: 1,
      name: "Adobe Creative Suite",
      price: 52.99,
      billingDate: "2024-06-15",
      loginEmail: "work@example.com",
      password: "••••••••",
      category: "Design"
    },
    {
      id: 2,
      name: "Figma Pro",
      price: 12.00,
      billingDate: "2024-06-20",
      loginEmail: "work@example.com",
      password: "••••••••",
      category: "Design"
    }
  ]);

  const [showClientModal, setShowClientModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const addClient = (newClient) => {
    setClients([...clients, { ...newClient, id: Date.now() }]);
  };

  const addSubscription = (newSubscription) => {
    setSubscriptions([...subscriptions, { ...newSubscription, id: Date.now() }]);
  };

  // Calculate analytics
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const totalHours = clients.reduce((sum, client) => sum + (client.totalHours || 0), 0);
  const totalRevenue = clients.reduce((sum, client) => {
    return sum + (client.invoices || []).reduce((invoiceSum, invoice) => {
      return invoice.status === 'paid' ? invoiceSum + invoice.amount : invoiceSum;
    }, 0);
  }, 0);
  const monthlySubscriptionCost = subscriptions.reduce((sum, sub) => sum + sub.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Client Dashboard</h1>
            <p className="text-slate-600">Manage your clients, track work, and monitor revenue</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowClientModal(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
            <Button onClick={() => setShowSubscriptionModal(true)} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Subscription
            </Button>
          </div>
        </div>

        {/* Analytics Overview */}
        <AnalyticsSection 
          totalClients={totalClients}
          activeClients={activeClients}
          totalHours={totalHours}
          totalRevenue={totalRevenue}
          monthlySubscriptionCost={monthlySubscriptionCost}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Clients Section */}
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-800 flex items-center">
                <Users className="w-6 h-6 mr-2 text-blue-600" />
                Clients ({clients.length})
              </h2>
              <Badge variant="secondary">{activeClients} Active</Badge>
            </div>
            
            <div className="space-y-4">
              {clients.map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
              
              {clients.length === 0 && (
                <Card className="border-dashed border-2 border-slate-300">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Users className="w-12 h-12 text-slate-400 mb-4" />
                    <h3 className="text-lg font-medium text-slate-600 mb-2">No clients yet</h3>
                    <p className="text-slate-500 text-center mb-4">Add your first client to get started with project management</p>
                    <Button onClick={() => setShowClientModal(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Client
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Subscriptions Sidebar */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-800 flex items-center">
                <CreditCard className="w-6 h-6 mr-2 text-green-600" />
                Subscriptions
              </h2>
              <Badge variant="secondary" className="text-green-700 bg-green-100">
                ${monthlySubscriptionCost.toFixed(2)}/mo
              </Badge>
            </div>
            
            <div className="space-y-3">
              {subscriptions.map((subscription) => (
                <SubscriptionCard key={subscription.id} subscription={subscription} />
              ))}
              
              {subscriptions.length === 0 && (
                <Card className="border-dashed border-2 border-slate-300">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <CreditCard className="w-8 h-8 text-slate-400 mb-3" />
                    <p className="text-slate-500 text-center text-sm mb-3">No subscriptions tracked</p>
                    <Button 
                      onClick={() => setShowSubscriptionModal(true)} 
                      size="sm" 
                      variant="outline"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Subscription
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <AddClientModal 
          isOpen={showClientModal}
          onClose={() => setShowClientModal(false)}
          onAdd={addClient}
        />
        
        <AddSubscriptionModal 
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          onAdd={addSubscription}
        />
      </div>
    </div>
  );
};

export default Index;
