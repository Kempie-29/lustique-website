# Tech Stack

- You are building a React application.
- Use TypeScript.
- Use React Router. KEEP the routes in src/App.tsx
- Always put source code in the src folder.
- Put pages into src/pages/
- Put components into src/components/
- The main page (default page) is src/pages/Index.tsx
- UPDATE the main page to include the new components. OTHERWISE, the user can NOT see any components!
- ALWAYS try to use the shadcn/ui library.
- Tailwind CSS: always use Tailwind CSS for styling components. Utilize Tailwind classes extensively for layout, spacing, colors, and other design aspects.

Available packages and libraries:

- The lucide-react package is installed for icons.
- You ALREADY have ALL the shadcn/ui components and their dependencies installed. So you don't need to install them again.
- You have ALL the necessary Radix UI components installed.
- Use prebuilt components from the shadcn/ui library after importing them. Note that these files shouldn't be edited, so make new components if you need to change them.

## Lustique Co. — app-specific conventions (read before editing)

This app is a bespoke, quiet-luxury bridal site. It deliberately does NOT use Tailwind or shadcn styling.

- **Styling:** plain CSS with custom properties. Import order is set in `src/main.tsx`: `styles/tokens.css` → `styles/base.css` → `styles/components.css`. Add new styles to those files. Do not re-enable `src/globals.css` / Tailwind.
- **Components:** our own primitives live in `src/components/primitives/` (Button, Card, Field, Accordion, StarRow). The shadcn files in `src/components/ui/` are untouched and unused — do not import them.
  - ⚠️ This filesystem is case-insensitive. Never create files in `src/components/ui/` whose names differ from an existing shadcn file only by case (e.g. `Button.tsx` vs `button.tsx`) — it will overwrite the shadcn file.
- **Routing:** all routes are registered in `src/App.tsx` inside a single `<SiteLayout>` layout route.
- **Content integrity:** every price, count, promotion and photo comes from `src/content/*.ts`. Nothing is hard-coded in markup. Roster/gallery/testimonials are data-driven; when an array is empty the related section hides. Never fabricate photos, reviews or facts — use the `Monogram` placeholder instead.
- **Engines:** `src/lib/pricing.ts`, `promo.ts`, `distance.ts` are pure and unit-tested (`*.test.ts`, run with `npm test`). Keep them pure.
- **Env vars:** documented in `.env.example` (`VITE_MAPS_API_KEY`, `VITE_ENQUIRY_ENDPOINT`). Both are optional; without them the UI degrades gracefully.
