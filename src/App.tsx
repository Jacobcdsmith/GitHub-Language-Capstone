import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AnalysisDataProvider } from "./contexts/AnalysisDataContext";
import LiveDataGate from "./components/LiveDataGate";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

function Router() {
  return (
    <Switch>
      <Route path={"/"}>
        <LiveDataGate>
          <Home />
        </LiveDataGate>
      </Route>
      <Route path={"/dashboard"}>
        <LiveDataGate>
          <Dashboard />
        </LiveDataGate>
      </Route>
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <AnalysisDataProvider>
            <Router />
          </AnalysisDataProvider>
          <Analytics />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
