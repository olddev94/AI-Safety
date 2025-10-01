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
import NotFound from "./pages/NotFound";

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
          <Route path="/self-report" element={<SelfReport />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/api-docs" element={<ApiDocs />} />
          <Route path="/csv-subscription" element={<CsvSubscription />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
