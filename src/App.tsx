import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import { Placeholder } from "@/pages/Placeholder";
import Quote from "@/pages/Quote";
import ThankYou from "@/pages/ThankYou";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="/quote" element={<Quote />} />
        <Route path="/thank-you" element={<ThankYou />} />

        {/* Phase 2 — real routes, honest "in progress" content. */}
        <Route
          path="/about"
          element={
            <Placeholder
              eyebrow="About"
              title="Quiet artistry, from Pretoria."
              intro="The story behind Lustique Co., our studio in La Montagne, and the brides we look after."
              path="/about"
            />
          }
        />
        <Route
          path="/services"
          element={
            <Placeholder
              eyebrow="Services"
              title="Flawless. Elegant. Unforgettable."
              intro="Bridal makeup, bridal hair, and the whole party — with transparent, tiered pricing."
              path="/services"
            />
          }
        />
        <Route
          path="/team"
          element={
            <Placeholder
              eyebrow="The Team"
              title="One quiet morning at a time."
              intro="Meet the artists who will be beside you from your trial to your final touch-up."
              path="/team"
            />
          }
        />
        <Route
          path="/portfolio"
          element={
            <Placeholder
              eyebrow="Portfolio"
              title="Real brides, real mornings."
              intro="Photography from our weddings and editorials is on its way."
              path="/portfolio"
            />
          }
        />
        <Route
          path="/pricing"
          element={
            <Placeholder
              eyebrow="Pricing"
              title="Know your investment before you enquire."
              intro="Full pricing tables for brides, the party, events and travel."
              path="/pricing"
            />
          }
        />
        <Route
          path="/guides"
          element={
            <Placeholder
              eyebrow="Guides"
              title="Free guides, from us to you."
              intro="Practical planning guides for your skin, your hair and your wedding-morning timeline."
              path="/guides"
            />
          }
        />
        <Route
          path="/guides/:slug"
          element={
            <Placeholder
              eyebrow="Guides"
              title="This guide is on its way."
              intro="We're writing this one up now."
              path="/guides"
            />
          }
        />
        <Route
          path="/journal"
          element={
            <Placeholder
              eyebrow="Journal"
              title="Notes from the studio."
              intro="Slow mornings, supplier spotlights and the thinking behind what we do."
              path="/journal"
            />
          }
        />
        <Route
          path="/journal/:slug"
          element={
            <Placeholder
              eyebrow="Journal"
              title="This story is on its way."
              intro="We're writing this one up now."
              path="/journal"
            />
          }
        />
        <Route
          path="/faq"
          element={
            <Placeholder
              eyebrow="FAQ"
              title="Questions, answered."
              intro="The things brides most often ask us about trials, travel and timing."
              path="/faq"
            />
          }
        />
        <Route
          path="/contact"
          element={
            <Placeholder
              eyebrow="Contact"
              title="Say hello."
              intro="Our studio details, a map, and a way to reach us directly."
              path="/contact"
            />
          }
        />
        <Route
          path="/offer-terms"
          element={
            <Placeholder
              eyebrow="Offer terms"
              title="Full offer terms."
              intro="The terms behind our current invitation to brides."
              path="/offer-terms"
            />
          }
        />
        <Route
          path="/terms"
          element={
            <Placeholder
              eyebrow="Terms"
              title="Terms of service."
              intro="The terms that govern bookings with Lustique Co."
              path="/terms"
            />
          }
        />
        <Route
          path="/privacy"
          element={
            <Placeholder
              eyebrow="Privacy"
              title="Privacy notice."
              intro="How we handle your information under POPIA."
              path="/privacy"
            />
          }
        />
        <Route
          path="/vendors"
          element={
            <Placeholder
              eyebrow="Vendors"
              title="For our fellow suppliers."
              intro="How we work alongside planners, venues and photographers."
              path="/vendors"
            />
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;