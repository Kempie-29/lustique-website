import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import About from "@/pages/About";
import CatchAll from "@/pages/CatchAll";
import Contact from "@/pages/Contact";
import Faq from "@/pages/Faq";
import GuideDetail from "@/pages/GuideDetail";
import Guides from "@/pages/Guides";
import Index from "@/pages/Index";
import Journal from "@/pages/Journal";
import JournalDetail from "@/pages/JournalDetail";
import OfferTerms from "@/pages/OfferTerms";
import Portfolio from "@/pages/Portfolio";
import Pricing from "@/pages/Pricing";
import Privacy from "@/pages/Privacy";
import Quote from "@/pages/Quote";
import Services from "@/pages/Services";
import Team from "@/pages/Team";
import Terms from "@/pages/Terms";
import ThankYou from "@/pages/ThankYou";
import Vendors from "@/pages/Vendors";

const App = () => (
  <BrowserRouter>
    <Routes>
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

        <Route path="/offer-terms" element={<OfferTerms />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        <Route path="*" element={<CatchAll />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;