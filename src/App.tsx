
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CurrencyProvider } from "@/hooks/useCurrency";
import ProtectedRoute from "@/components/ProtectedRoute";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import Index from "./pages/Index";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import ClientsPage from "./pages/ClientsPage";
import ClientDetailsPage from "./pages/ClientDetailsPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import AuthPage from "./pages/AuthPage";
import UsersPage from "./pages/UsersPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CurrencyProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen w-full">
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/*" element={
                  <ProtectedRoute>
                    <AuthenticatedLayout>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/projects" element={<ProjectsPage />} />
                        <Route path="/projects/:id" element={<ProjectDetailsPage />} />
                        <Route path="/clients" element={<ClientsPage />} />
                        <Route path="/clients/:id" element={<ClientDetailsPage />} />
                        <Route path="/subscriptions" element={<SubscriptionsPage />} />
                        <Route path="/users" element={<UsersPage />} />
                      </Routes>
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </CurrencyProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
