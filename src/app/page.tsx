import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Products from '@/components/Products'
import Services from '@/components/Services'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-[1920px] mx-auto">
        <Navbar />
        <Hero />
        <Products />
        <Services />
        <Contact />
        <Footer />
      </div>
    </main>
  )
}