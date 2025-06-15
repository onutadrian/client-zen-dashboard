
import React, { useState } from 'react';
import { Users, CreditCard, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ClientCard from '@/components/ClientCard';
import SubscriptionCard from '@/components/SubscriptionCard';
import AnalyticsSection from '@/components/AnalyticsSection';
import TasksSection from '@/components/TasksSection';
import DashboardHeader from '@/components/DashboardHeader';
import ModalsContainer from '@/components/ModalsContainer';
import { useClients } from '@/hooks/useClients';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useTasks } from '@/hooks/useTasks';
import { useAnalytics } from '@/hooks/useAnalytics';
import { convertCurrency, formatCurrency } from '@/lib/currency';

const Index = () => {
  const [displayCurrency, setDisplayCurrency] = useState('USD');
  
  // Use custom hooks for state management
  const { clients, addClient, updateClient } = useClients();
  const { subscriptions, addSubscription, updateSubscription } = useSubscriptions();
  const { tasks, addTask, updateTask } = useTasks();
  
  // Modal states
  const [showClientModal, setShowClientModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showEditSubscriptionModal, setShowEditSubscriptionModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  // Get analytics data
  const analytics = useAnalytics(clients, subscriptions, displayCurrency);

  const handleEditSubscription = (subscription: any) => {
    setSelectedSubscription(subscription);
    setShowEditSubscriptionModal(true);
  };

  const handleTaskUpdate = (taskId: number, status: any, actualHours?: number) => {
    const result = updateTask(taskId, status, actualHours);
    
    // If task was completed and has hours, log them to the client
    if (result && result.hoursToLog) {
      const { task, hoursToLog } = result;
      const client = clients.find(c => c.id === task.clientId);
      
      if (client) {
        const newHourEntry = {
          id: Date.now(),
          hours: hoursToLog,
          description: `Completed task: ${task.title}`,
          date: new Date().toISOString(),
          billed: false
        };
        
        const updatedHourEntries = [...(client.hourEntries || []), newHourEntry];
        
        const updatedClient = {
          ...client,
          totalHours: updatedHourEntries.reduce((sum, entry) => sum + entry.hours, 0),
          hourEntries: updatedHourEntries
        };
        
        updateClient(client.id, updatedClient);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <DashboardHeader 
          displayCurrency={displayCurrency}
          onCurrencyChange={setDisplayCurrency}
          onAddClient={() => setShowClientModal(true)}
          onAddSubscription={() => setShowSubscriptionModal(true)}
        />

        {/* Analytics Overview */}
        <AnalyticsSection 
          totalClients={analytics.totalClients}
          activeClients={analytics.activeClients}
          totalHours={analytics.totalHours}
          totalRevenue={analytics.totalRevenue}
          monthlySubscriptionCost={analytics.monthlySubscriptionCost}
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
          onUpdateTask={handleTaskUpdate}
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
              <Badge variant="secondary">{analytics.activeClients} Active</Badge>
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
                {formatCurrency(analytics.monthlySubscriptionCost, displayCurrency)}/mo
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
        <ModalsContainer 
          showClientModal={showClientModal}
          onCloseClientModal={() => setShowClientModal(false)}
          onAddClient={addClient}
          showSubscriptionModal={showSubscriptionModal}
          onCloseSubscriptionModal={() => setShowSubscriptionModal(false)}
          onAddSubscription={addSubscription}
          showEditSubscriptionModal={showEditSubscriptionModal}
          onCloseEditSubscriptionModal={() => {
            setShowEditSubscriptionModal(false);
            setSelectedSubscription(null);
          }}
          selectedSubscription={selectedSubscription}
          onUpdateSubscription={updateSubscription}
        />
      </div>
    </div>
  );
};

export default Index;
