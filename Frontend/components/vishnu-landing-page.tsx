"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, BookOpen, GraduationCap, Award, ShieldCheck, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import { Header } from "./header"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface VishnuLandingPageProps {
  onInquireNow: () => void
}

const programs = [
  {
    title: "U.G. Programmes",
    description: "Begin your journey with our world-class undergraduate programs.",
    image: "/images/undergrad.jpg",
    bgClass: "bg-[#5ea21a]",
    icon: BookOpen,
    link: "/programmes/ug",
  },
  {
    title: "P.G. Programmes",
    description: "Advanced degrees for career advancement and specialized expertise.",
    image: "/images/graduate.jpg",
    bgClass: "bg-[#eb8426]",
    icon: GraduationCap,
    link: "/programmes/pg",
  },
  {
    title: "Ph.D. Programmes",
    description: "Engage in cutting-edge research and doctoral studies.",
    image: "/images/phd.jpg",
    bgClass: "bg-[#921c6b]",
    icon: Award,
    link: "/programmes/phd",
  },
  {
    title: "Scholarship Policies",
    description: "Explore institutional scholarships and financial support opportunities.",
    image: "/images/scholarship.jpg",
    bgClass: "bg-gray-800",
    icon: ShieldCheck,
    link: "/scholarships",
  },
]

let hasDismissedBanner = false;

export function VishnuLandingPage({ onInquireNow }: VishnuLandingPageProps) {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedDegree, setSelectedDegree] = useState("")
  const [selectedArea, setSelectedArea] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [showBanner, setShowBanner] = useState(!hasDismissedBanner)

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % 2)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + 2) % 2)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 2)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const handleFindYourProgram = () => {
    if (selectedDegree === "undergraduate") {
      router.push("/programmes/ug")
    } else if (selectedDegree === "graduate") {
      router.push("/programmes/pg")
    } else if (selectedDegree === "phd") {
      router.push("/programmes/phd")
    } else {
      onInquireNow()
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Announcement Banner */}
      {showBanner && (
        <div className="bg-[#121212] text-white py-3 px-4 relative">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <p className="text-sm text-center flex-1">
              The A.Y. 2026-2027 online enrollment for incoming college freshmen is now open. Click here to begin!
            </p>
            <button
              onClick={() => {
                hasDismissedBanner = true;
                setShowBanner(false);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header/Navigation */}
      <Header onInquireNow={onInquireNow} />

      {/* Hero & Info Cards Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Hero Carousel (Left Side) */}
          <div className="lg:col-span-3 relative bg-gray-900 rounded-2xl overflow-hidden shadow-lg h-[350px] md:h-[450px]">
            {/* EAPCET Ribbons/Tag */}
            <div className="absolute top-4 left-0 z-20 bg-[#5ea21a] text-white text-xs font-bold px-3 py-1.5 uppercase rounded-r-md shadow-md border-y border-r border-[#4a8214]">
              EAPCET - VITB
            </div>

            <div className="relative h-full">
              {/* Slide 1 */}
              <div
                className={`absolute inset-0 transition-opacity duration-505 flex flex-col justify-center ${currentSlide === 0 ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                style={{
                  backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/hero-enrollment.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="px-8 md:px-12 text-white max-w-2xl">
                  <h1 className="text-2xl md:text-4xl font-extrabold mb-3 leading-tight tracking-tight">
                    UNDERGRADUATE<br />
                    ENROLLMENT NOW OPEN
                  </h1>
                  <p className="text-sm md:text-base text-gray-250 mb-5 leading-relaxed">
                    Gain a college education at a top institution that builds learners for
                    academic and career success. Online enrollment for incoming college freshmen this A.Y. 2026-2027 is now open!
                  </p>
                  <Link href="/apply">
                    <Button className="bg-[#5ea21a] hover:bg-[#4a8214] text-white px-5 py-2 text-xs md:px-6 md:py-3 md:text-sm rounded-md font-semibold">
                      ENROLL NOW →
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Slide 2 */}
              <div
                className={`absolute inset-0 transition-opacity duration-505 flex flex-col justify-center ${currentSlide === 1 ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                style={{
                  backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/hero-online.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="px-8 md:px-12 text-white max-w-2xl">
                  <h1 className="text-2xl md:text-4xl font-extrabold mb-3 leading-tight tracking-tight">
                    ACCESS WORLD-CLASS<br />
                    EDUCATION
                  </h1>
                  <p className="text-sm md:text-base text-gray-250 mb-5 leading-relaxed">
                    Experience flexible learning with our comprehensive programs designed for your success.
                  </p>
                  <Button className="bg-[#5ea21a] hover:bg-[#4a8214] text-white px-5 py-2 text-xs md:px-6 md:py-3 md:text-sm rounded-md font-semibold" onClick={onInquireNow}>
                    LEARN MORE →
                  </Button>
                </div>
              </div>
            </div>


          </div>

          {/* Sidebar Stats Cards (Right Side) */}
          <div className="lg:col-span-1 flex flex-col justify-between gap-4 h-[350px] md:h-[450px]">
            {/* Academics Card */}
            <div className="flex-1 bg-[#5ea21a] text-white px-5 py-4 rounded-xl flex flex-col justify-center transition-all duration-300 hover:shadow-lg">
              <h3 className="text-base font-bold mb-2 uppercase tracking-wider">Academics</h3>
              <div className="space-y-1 text-xs text-emerald-50">
                <Link href="/programmes/ug" className="block hover:text-white transition-colors">
                  <span className="font-extrabold text-[#eb8426] bg-white px-1 py-0.5 rounded text-[10px] mr-1.5 align-middle">09</span>
                  <span className="align-middle hover:underline">UG Programmes</span>
                </Link>
                <Link href="/programmes/pg" className="block hover:text-white transition-colors">
                  <span className="font-extrabold text-[#eb8426] bg-white px-1 py-0.5 rounded text-[10px] mr-1.5 align-middle">05</span>
                  <span className="align-middle hover:underline">PG Programmes</span>
                </Link>
                <div>
                  <span className="font-bold text-sm mr-1">250+</span> Trained Faculty
                </div>
              </div>
            </div>

            {/* Placements Card */}
            <div className="flex-1 bg-[#eb8426] text-white px-5 py-4 rounded-xl flex flex-col justify-center transition-all duration-300 hover:shadow-lg">
              <h3 className="text-base font-bold mb-2 uppercase tracking-wider">Placements</h3>
              <div className="space-y-1 text-xs text-orange-50">
                <div>
                  <span className="font-bold text-sm mr-1">1000+</span> Placements
                </div>
                <div>
                  <span className="font-bold text-sm mr-1">100+</span> Recruiters
                </div>
                <div>
                  <span className="font-bold text-sm mr-1">44 LPA</span> Highest Package
                </div>
              </div>
            </div>

            {/* Research Card */}
            <div className="flex-1 bg-[#921c6b] text-white px-5 py-4 rounded-xl flex flex-col justify-center transition-all duration-300 hover:shadow-lg">
              <h3 className="text-base font-bold mb-2 uppercase tracking-wider">Research</h3>
              <div className="space-y-1 text-xs text-purple-100">
                <div>
                  <span className="font-bold text-sm mr-1">1000+</span> Publications
                </div>
                <div>
                  <span className="font-bold text-sm mr-1">230+</span> Patents
                </div>
                <div>
                  <span className="font-bold text-sm mr-1">4500+</span> Citations
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Program Finder Section */}
      <div className="bg-white border-b border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] text-center mb-12">
            BE BUILT FOR THE WORLD AND FIND THE<br />RIGHT PROGRAM FOR YOU
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="relative">
              <select
                value={selectedDegree}
                onChange={(e) => setSelectedDegree(e.target.value)}
                className="w-full px-6 py-4 rounded-md text-gray-700 bg-white border-2 border-gray-300 focus:border-[#5ea21a] focus:outline-none appearance-none pr-10"
              >
                <option value="">Select Degree</option>
                <option value="undergraduate">B.Tech (Undergraduate)</option>
                <option value="graduate">M.Tech / MBA (Postgraduate)</option>
                <option value="phd">Doctor of Philosophy (Ph.D)</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5" />
            </div>

            <div className="relative">
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full px-6 py-4 rounded-md text-gray-700 bg-white border-2 border-gray-300 focus:border-[#5ea21a] focus:outline-none appearance-none pr-10"
              >
                <option value="">Area of Study</option>
                <option value="engineering">Engineering</option>
                <option value="it">Computer Applications & IT</option>
                <option value="business">Management / Business</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5" />
            </div>

            <div className="relative">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-6 py-4 rounded-md text-gray-700 bg-white border-2 border-gray-300 focus:border-[#5ea21a] focus:outline-none appearance-none pr-10"
              >
                <option value="">Select Location</option>
                <option value="bhimavaram">Bhimavaram (Main Campus)</option>
                <option value="others">Other SVES Campuses</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5" />
            </div>
          </div>

          <div className="text-center">
            <Button
              className="bg-[#eb8426] hover:bg-[#d07119] text-white px-12 py-6 text-lg rounded-md font-bold"
              onClick={handleFindYourProgram}
            >
              FIND YOUR PROGRAM
            </Button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#1e293b] mb-6">
                IGNITING EXCELLENCE AS A PREMIER<br />TECHNICAL INSTITUTE
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Vishnu Institute of Technology, established in 2008 in Bhimavaram, Andhra Pradesh, is a premier autonomous higher education institution dedicated to
                providing a learning environment rooted in discipline, academic excellence, commitment, and research advancement. Affiliated with JNTUK and certified as one of the top choices for tech studies, our academic stronghold provides a
                diverse array of programs grounded in engineering, computer science, artificial intelligence, information technology, business administration, and management.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                Our goal is to foster an atmosphere that promotes academic rigor and practical expertise, enabling students to excel in the industry.
                With strong moral pillars and robust student support, graduates are empowered to make a lasting and meaningful impact.
              </p>
              <div className="flex gap-4">
                <Button onClick={onInquireNow} className="bg-[#5ea21a] hover:bg-[#4a8214] text-white px-8 py-3 rounded-md">
                  INQUIRE NOW
                </Button>
                <Link href="/about">
                  <Button variant="outline" className="border-[#5ea21a] text-[#5ea21a] hover:bg-[#5ea21a] hover:text-white px-8 py-3 rounded-md">
                    ABOUT US →
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="/img-vishnu-sec-1.jpg"
                alt="Vishnu Students"
                className="rounded-lg shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Program Categories */}
      <div className="bg-slate-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] text-center mb-16">
            BE A PART OF THE GROUNDBREAKING<br />ACADEMIC SUCCESS
          </h2>

          <p className="text-gray-600 text-center text-lg mb-16 max-w-4xl mx-auto leading-relaxed">
            Highly regarded as an engineering and technological institution, Vishnu Institute of Technology provides a comprehensive curriculum for undergraduate B.Tech studies,
            postgraduates (M.Tech), and management courses (MBA).
          </p>

          <p className="text-gray-600 text-center text-lg mb-16 max-w-4xl mx-auto leading-relaxed">
            A world-class education is at the heart of every degree and program, ensuring students are well-prepared to compete on a global scale. The institution's rigorous academic
            program emphasizes practical skills and character development to position students for industry leadership and engineering excellence. Explore your options today and join
            one of the many programs offered by Vishnu Institute of Technology.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program) => {
              const CardContentElement = (
                <Card className="overflow-hidden h-full border border-gray-150 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group bg-white">
                  <div className={`relative h-40 ${program.bgClass} flex flex-col justify-between p-6 transition-all duration-300`}>
                    <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center text-white">
                      <program.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white leading-tight">{program.title}</h3>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-600 text-sm leading-relaxed">{program.description}</p>
                  </CardContent>
                </Card>
              );

              return program.link ? (
                <Link key={program.title} href={program.link} className="block h-full">
                  {CardContentElement}
                </Link>
              ) : (
                <div key={program.title} className="h-full">
                  {CardContentElement}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#1e293b] mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-gray-700 text-lg mb-8">
            Have questions about admissions, programs, or campus life? Our team is here to help you every step of the way.
          </p>
          <Button
            onClick={onInquireNow}
            className="bg-[#5ea21a] hover:bg-[#4a8214] text-white px-12 py-6 text-xl rounded-md font-bold"
          >
            INQUIRE NOW
          </Button>
        </div>
      </div>
    </div>
  )
}
