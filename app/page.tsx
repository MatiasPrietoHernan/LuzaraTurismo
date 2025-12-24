"use client"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { PromotionsSection } from "@/components/promotions-section"
import { PackagesSection } from "@/components/packages-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <PromotionsSection />
      <PackagesSection />
      <Footer />
    </main>
  )
}
