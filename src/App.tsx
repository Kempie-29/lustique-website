import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { RequireAuth, RequireRole } from "@/components/auth/RequireRole";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AuthProvider } from "@/lib/auth/auth";
import About from "@/pages/About";
import CatchAll from "@/pages/CatchAll";
import Contact from "@/pages/Contact";
import Faq from "@/pages/Faq";
import GuideDetail from "@/pages/GuideDetail";
import Guides from "@/pages/Guides";
import Index from "@/pages/Index";
import Journal from "@/pages/Journal";
import JournalDetail from "@/pages/JournalDetail";
import Portfolio from "@/pages/Portfolio";
import Pricing from "@/pages/Pricing";
import Privacy from "@/pages/Privacy";
import Quote from "@/pages/Quote";
import Services from "@/pages/Services";
import SignIn from "@/pages/SignIn";
import Team from "@/pages/Team";
import Terms from "@/pages/Terms";
import ThankYou from "@/pages/ThankYou";
import Vendors from "@/pages/Vendors";
import ArtistsPage from "@/pages/dashboard/ArtistsPage";
import AvailabilityPage from "@/pages/dashboard/AvailabilityPage";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import MessagesPage from "@/pages/dashboard/MessagesPage";
import RequestsPage from "@/pages/dashboard/RequestsPage";
import Portal from "@/pages/portal/Portal";

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* Public marketing site */}
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/thank-you" element={<ThankYou />} />

          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/team" element={<Team />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/pricing" element={<Pricing />} />

          <Route path="/guides" element={<Guides />} />
          <Route path="/guides/:slug" element={<GuideDetail />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/:slug" element={<JournalDetail />} />

          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/vendors" element={<Vendors />} />

          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          <Route path="*" element={<CatchAll />} />
        </Route>

        {/* Accounts & private areas — noindex, disallowed in robots.txt */}
        <Route path="/signin" element={<SignIn />} />

        <Route
          path="/portal"
          element={
            <RequireAuth>
              <Portal />
            </RequireAuth>
          }
        />

        <Route
          path="/dashboard"
          element={
            <RequireRole roles={["admin", "artist"]}>
              <DashboardLayout />
            </RequireRole>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="availability" element={<AvailabilityPage />} />
          <Route
            path="artists"
            element={
              <RequireRole roles={["admin"]}>
                <ArtistsPage />
              </RequireRole>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;