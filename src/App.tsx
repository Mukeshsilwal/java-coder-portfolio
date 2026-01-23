
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import AppRoutes from "./routes/AppRoutes";
// PWA components disabled
// import { InstallPrompt } from "./components/pwa/InstallPrompt";
// import { OfflineBanner } from "./components/pwa/OfflineBanner";
// import { UpdatePrompt } from "./components/pwa/UpdatePrompt";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* PWA Components - All Disabled */}
          {/* <OfflineBanner /> */}
          {/* <InstallPrompt /> */}
          {/* <UpdatePrompt /> */}

          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
