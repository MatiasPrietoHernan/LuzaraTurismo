"use client"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { PromotionsSection } from "@/components/promotions-section"
import { PackagesSection } from "@/components/packages-section"
import { NewsletterSection } from "@/components/newsletter-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <PromotionsSection />
      <PackagesSection />
      <NewsletterSection />
      <Footer />
    </main>
  )
}
