
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PlannerProvider } from "./hooks/usePlanner";
import { AppShell } from "./components/layout/AppShell";
import { DailyPlannerPanel } from "./components/planner/DailyPlannerPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PlannerProvider>
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <AppShell>
                  <DailyPlannerPanel />
                </AppShell>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PlannerProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
