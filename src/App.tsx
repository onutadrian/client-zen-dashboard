
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/hooks/useAuth';
import { CurrencyProvider } from '@/hooks/useCurrency';
import AuthPage from '@/pages/AuthPage';
import Index from '@/pages/Index';
import ProjectsPage from '@/pages/ProjectsPage';
import ProjectDetailsPage from '@/pages/ProjectDetailsPage';
import ClientsPage from '@/pages/ClientsPage';
import ClientDetailsPage from '@/pages/ClientDetailsPage';
import SubscriptionsPage from '@/pages/SubscriptionsPage';
import UsersPage from '@/pages/UsersPage';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';
import ContractTemplatesPage from '@/pages/ContractTemplatesPage';
import ClientDashboardPage from '@/pages/ClientDashboardPage';
import ClientProjectsPage from '@/pages/ClientProjectsPage';
import ClientProjectDetailsPage from '@/pages/ClientProjectDetailsPage';


function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CurrencyProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <div className="min-h-screen bg-background">
              <Router>
                <Routes>
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  } />
                  <Route path="/projects" element={
                    <ProtectedRoute>
                      <ProjectsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/projects/:id" element={
                    <ProtectedRoute>
                      <ProjectDetailsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/clients" element={
                    <ProtectedRoute>
                      <ClientsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/clients/:id" element={
                    <ProtectedRoute>
                      <ClientDetailsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/subscriptions" element={
                    <ProtectedRoute>
                      <SubscriptionsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/users" element={
                    <ProtectedRoute>
                      <UsersPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/client" element={
                    <ProtectedRoute>
                      <ClientDashboardPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/client/projects" element={
                    <ProtectedRoute>
                      <ClientProjectsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/client/projects/:id" element={
                    <ProtectedRoute>
                      <ClientProjectDetailsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/contracts" element={
                    <ProtectedRoute>
                      <ContractTemplatesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Router>
              
            </div>
            <Toaster />
          </ThemeProvider>
        </CurrencyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
