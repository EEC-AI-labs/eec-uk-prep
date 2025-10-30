import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NotFound from "./pages/NotFound";
import PrepTool from "./pages/PrepTool";
import Index from "./pages/Index";

// Create React Query client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Toast systems */}
        <Toaster />
        <Sonner />

        {/* App routes */}
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/prep" element={<PrepTool />} />
            {/* Add any additional routes ABOVE this catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
