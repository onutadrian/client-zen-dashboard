
import React, { useState } from 'react';
import { Plus, Users, CreditCard, DollarSign, Clock, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ClientCard from '@/components/ClientCard';
import SubscriptionCard from '@/components/SubscriptionCard';
import AddClientModal from '@/components/AddClientModal';
import AddSubscriptionModal from '@/components/AddSubscriptionModal';
import AnalyticsSection from '@/components/AnalyticsSection';
import EditSubscriptionModal from '@/components/EditSubscriptionModal';
import TasksSection from '@/components/TasksSection';

interface Task {
  id: number;
  title: string;
  description: string;
  clientId: number;
  clientName: string;
  estimatedHours?: number;
  actualHours?: number;
  status: 'pending' | 'in-progress' | 'completed';
  notes: string;
  assets: string[];
  createdDate: string;
  completedDate?: string;
}

const Index = () => {
  const [displayCurrency, setDisplayCurrency] = useState('USD');
  
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
      ],
      hourEntries: [],
      currency: "USD"
    }
  ]);

  const [subscriptions, setSubscriptions] = useState([
    {
      id: 1,
      name: "Adobe Creative Suite",
      price: 52.99,
      seats: 2,
      billingDate: "2024-06-15",
      loginEmail: "work@example.com",
      password: "••••••••",
      category: "Design",
      totalPaid: 1200,
      status: "active",
      currency: "USD"
    },
    {
      id: 2,
      name: "Figma Pro",
      price: 12.00,
      seats: 3,
      billingDate: "2024-06-20",
      loginEmail: "work@example.com",
      password: "••••••••",
      category: "Design",
      totalPaid: 600,
      status: "active",
      currency: "USD"
    }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Website Redesign",
      description: "Complete overhaul of the company website with modern design",
      clientId: 1,
      clientName: "Acme Corporation",
      estimatedHours: 40,
      status: "in-progress",
      notes: "Focus on mobile responsiveness and SEO optimization",
      assets: ["https://figma.com/design-file", "Brand guidelines.pdf"],
      createdDate: "2024-06-01",
    }
  ]);

  const [showClientModal, setShowClientModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showEditSubscriptionModal, setShowEditSubscriptionModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const exchangeRates = {
    USD: { USD: 1, EUR: 0.85, RON: 4.5 },
    EUR: { USD: 1.18, EUR: 1, RON: 5.3 },
    RON: { USD: 0.22, EUR: 0.19, RON: 1 }
  };

  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return amount;
    return amount * exchangeRates[fromCurrency][toCurrency];
  };

  const formatCurrency = (amount, currency) => {
    const symbols = { USD: '$', EUR: '€', RON: 'RON ' };
    const symbol = symbols[currency] || '$';
    return currency === 'RON' ? `${symbol}${amount.toFixed(2)}` : `${symbol}${amount.toFixed(2)}`;
  };

  const addClient = (newClient: any) => {
    setClients([...clients, { ...newClient, id: Date.now(), hourEntries: [] }]);
  };

  const addSubscription = (newSubscription: any) => {
    setSubscriptions([...subscriptions, { ...newSubscription, id: Date.now(), seats: newSubscription.seats || 1, totalPaid: 0 }]);
  };

  const updateClient = (clientId: number, updatedClient: any) => {
    setClients(clients.map(client => 
      client.id === clientId ? updatedClient : client
    ));
  };

  const updateSubscription = (subscriptionId: number, updatedSubscription: any) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === subscriptionId ? updatedSubscription : sub
    ));
  };

  const handleEditSubscription = (subscription: any) => {
    setSelectedSubscription(subscription);
    setShowEditSubscriptionModal(true);
  };

  const addTask = (newTask: Omit<Task, 'id' | 'status' | 'createdDate' | 'completedDate'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now(),
      status: 'pending',
      createdDate: new Date().toISOString(),
    };
    setTasks([...tasks, task]);
  };

  const updateTask = (taskId: number, status: Task['status'], actualHours?: number) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, status };
        
        if (status === 'completed') {
          updatedTask.completedDate = new Date().toISOString();
          if (actualHours) {
            updatedTask.actualHours = actualHours;
            
            // If it's an hourly client, add the hours to the client
            const client = clients.find(c => c.id === task.clientId);
            if (client && client.priceType === 'hour') {
              const newHourEntry = {
                id: Date.now(),
                hours: actualHours,
                description: `Completed task: ${task.title}`,
                date: new Date().toISOString(),
              };
              
              const updatedClient = {
                ...client,
                totalHours: (client.totalHours || 0) + actualHours,
                hourEntries: [...(client.hourEntries || []), newHourEntry]
              };
              
              updateClient(client.id, updatedClient);
            }
          }
        }
        
        return updatedTask;
      }
      return task;
    }));
  };

  // Calculate analytics with currency conversion
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const totalHours = clients.reduce((sum, client) => sum + (client.totalHours || 0), 0);
  
  const totalRevenue = clients.reduce((sum, client) => {
    const clientRevenue = (client.invoices || []).reduce((invoiceSum, invoice) => {
      if (invoice.status === 'paid') {
        const convertedAmount = convertCurrency(invoice.amount, client.currency || 'USD', displayCurrency);
        return invoiceSum + convertedAmount;
      }
      return invoiceSum;
    }, 0);
    return sum + clientRevenue;
  }, 0);
  
  const monthlySubscriptionCost = subscriptions.reduce((sum, sub) => {
    const convertedPrice = convertCurrency(sub.price * (sub.seats || 1), sub.currency || 'USD', displayCurrency);
    return sum + convertedPrice;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Client Dashboard</h1>
            <p className="text-slate-600">Manage your clients, track work, and monitor revenue</p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Currency:</span>
              <Select value={displayCurrency} onValueChange={setDisplayCurrency}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">US Dollar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="RON">Romanian Lei (RON)</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
          clients={clients}
          displayCurrency={displayCurrency}
          convertCurrency={convertCurrency}
          formatCurrency={formatCurrency}
        />

        {/* Tasks Section */}
        <TasksSection 
          tasks={tasks}
          clients={clients}
          onAddTask={addTask}
          onUpdateTask={updateTask}
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
                <ClientCard 
                  key={client.id} 
                  client={client} 
                  onUpdateClient={updateClient}
                  displayCurrency={displayCurrency}
                  convertCurrency={convertCurrency}
                  formatCurrency={formatCurrency}
                />
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
                {formatCurrency(monthlySubscriptionCost, displayCurrency)}/mo
              </Badge>
            </div>
            
            <div className="space-y-3">
              {subscriptions.map((subscription) => (
                <SubscriptionCard 
                  key={subscription.id} 
                  subscription={subscription} 
                  onEdit={handleEditSubscription}
                />
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
        
        <EditSubscriptionModal 
          subscription={selectedSubscription}
          isOpen={showEditSubscriptionModal}
          onClose={() => {
            setShowEditSubscriptionModal(false);
            setSelectedSubscription(null);
          }}
          onUpdate={updateSubscription}
        />
      </div>
    </div>
  );
};

export default Index;
