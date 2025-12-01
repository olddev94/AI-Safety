import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Typography from "./pages/Typography";
import Icons from "./pages/Icons";
import SelfReport from "./pages/SelfReport";
import Admin from "./pages/Admin";
import ApiDocs from "./pages/ApiDocs";
import CsvSubscription from "./pages/CsvSubscription";
import NewsDetail from "./pages/NewsDetail";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/typography" element={<Typography />} />
          <Route path="/icons" element={<Icons />} />
          <Route path="/self-report" element={<ProtectedRoute><SelfReport /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/api-docs" element={<ApiDocs />} />
          <Route path="/csv-subscription" element={<CsvSubscription />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
