
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import { AppSidebar } from '@/components/AppSidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Index from '@/pages/Index';
import ProjectsPage from '@/pages/ProjectsPage';
import ProjectDetailsPage from '@/pages/ProjectDetailsPage';
import ClientsPage from '@/pages/ClientsPage';
import SubscriptionsPage from '@/pages/SubscriptionsPage';
import AuthPage from '@/pages/AuthPage';
import NotFound from '@/pages/NotFound';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <SidebarProvider defaultOpen={true}>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <SidebarInset className="flex-1">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/projects" element={<ProjectsPage />} />
                      <Route path="/projects/:id" element={<ProjectDetailsPage />} />
                      <Route path="/clients" element={<ClientsPage />} />
                      <Route path="/subscriptions" element={<SubscriptionsPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </SidebarInset>
                </div>
              </SidebarProvider>
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
