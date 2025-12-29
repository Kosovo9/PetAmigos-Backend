import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import PetDiscovery from "./pages/PetDiscovery";
import Marketplace from "./pages/Marketplace";
import ChatPage from "./pages/ChatPage";
import DNAMatching from "./pages/DNAMatching";
import PetSocialFeed from "./pages/PetSocialFeed";
import PetReels from "./pages/PetReels";
import CreatorDashboard from "./pages/CreatorDashboard";
import VideoUpload from "./pages/VideoUpload";
import DatingPage from "./pages/DatingPage";
import CommunitiesPage from "./pages/CommunitiesPage";
import About from "./pages/About";

import { HelmetProvider } from "react-helmet-async";
import Faq from "./pages/Faq";

import ModerationPanel from "./pages/ModerationPanel";
import Stories from "./pages/Stories";
import EventsMap from "./pages/EventsMap";
import SecurityDashboard from "./pages/SecurityDashboard";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/discovery"} component={PetDiscovery} />
      <Route path={"/marketplace"} component={Marketplace} />
      <Route path={"/chat"} component={ChatPage} />
      <Route path={"/dna"} component={DNAMatching} />
      <Route path={"/feed"} component={PetSocialFeed} />
      <Route path={"/reels"} component={PetReels} />
      <Route path={"/creator"} component={CreatorDashboard} />
      <Route path={"/upload-reel"} component={VideoUpload} />
      <Route path={"/dating"} component={DatingPage} />
      <Route path={"/communities"} component={CommunitiesPage} />
      <Route path={"/faq"} component={Faq} />
      <Route path={"/about"} component={About} />

      {/* 🚀 NUEVAS RUTAS FINAL PUSH */}
      <Route path="/moderation" component={ModerationPanel} />
      <Route path="/stories" component={Stories} />
      <Route path="/events" component={EventsMap} />
      <Route path="/security" component={SecurityDashboard} />

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
        defaultTheme="light"
      // switchable
      >
        <HelmetProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </HelmetProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
