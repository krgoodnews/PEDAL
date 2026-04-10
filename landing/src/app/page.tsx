import { Hero } from "@/components/sections/Hero";
import { WhatIsPedal } from "@/components/sections/WhatIsPedal";
import { WorkflowFlow } from "@/components/sections/WorkflowFlow";
import { Features } from "@/components/sections/Features";
import { GetStarted } from "@/components/sections/GetStarted";
import { Footer } from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <WhatIsPedal />
      <WorkflowFlow />
      <Features />
      <GetStarted />
      <Footer />
    </main>
  );
}
