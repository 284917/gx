import { Faq, FinalCta, Footer, Sources } from "./components/Closing";
import { Hero } from "./components/Hero";
import { Mechanism } from "./components/Mechanism";
import { Nav } from "./components/Nav";
import { Promises } from "./components/Promises";
import { Proposal } from "./components/Proposal";
import { Reserves } from "./components/Reserves";
import { Simulator } from "./components/Simulator";
import { TaglineReveal } from "./components/TaglineReveal";
import { Theory } from "./components/Theory";
import { Timeline } from "./components/Timeline";
import { TrustGame } from "./components/TrustGame";
import { Year2026 } from "./components/Year2026";

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="button-sm sr-only z-50 rounded-lg bg-fg px-3 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Перейти к содержанию
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Mechanism />
        <Timeline />
        <TaglineReveal />
        <Promises />
        <Year2026 />
        <Reserves />
        <Simulator />
        <TrustGame />
        <Theory />
        <Proposal />
        <Faq />
        <FinalCta />
        <Sources />
      </main>
      <Footer />
    </>
  );
}
