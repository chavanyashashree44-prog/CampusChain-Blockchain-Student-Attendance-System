import Navbar from '../../components/common/Navbar'
import Hero from '../../components/common/Hero'
import About from '../../components/common/About'
import Features from '../../components/common/Features'
import HowItWorks from '../../components/common/HowItWorks'
import Footer from '../../components/common/Footer'

function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </>
  )
}

export default Home