"use client"

import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Award, BookOpen, Building, CheckCircle2, ChevronRight, GraduationCap, MapPin, Users } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <main className="max-w-7xl mx-auto px-4 py-12 md:py-16">
                {/* Page Title */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#121212] tracking-tight">
                        ABOUT US
                    </h1>
                    <div className="w-20 h-1 bg-[#5ea21a] mt-4"></div>
                </div>

                {/* Top Section - SVES */}
                <div className="grid lg:grid-cols-12 gap-12 items-start mb-20">
                    <div className="lg:col-span-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#eb8426] mb-6">
                            SRI VISHNU EDUCATIONAL SOCIETY
                        </h2>
                        <p className="text-gray-700 text-lg leading-relaxed mb-6">
                            The Society strives for continuous improvement in the field of education and is committed to delivering
                            world-class education across diverse disciplines to students from all sections of society. Our Founder
                            Chairman, Late Padma Bhushan Dr. B. V. Raju, with his exceptional vision and foresight, established several
                            premier educational institutions offering programs in Engineering, Dental Sciences, Pharmacy, B.Sc., MCA,
                            Polytechnic, and K-12 education. These institutions continue to play a vital role in shaping and nurturing
                            the future of thousands of students year after year.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-6 mt-8">
                            <div className="flex gap-4">
                                <CheckCircle2 className="w-6 h-6 text-[#5ea21a] flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-[#121212]">Academic Rigor</h4>
                                    <p className="text-sm text-gray-600 mt-1">Curriculums designed to foster standard excellence and practical skills.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <CheckCircle2 className="w-6 h-6 text-[#5ea21a] flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-[#121212]">Human Values</h4>
                                    <p className="text-sm text-gray-600 mt-1">Nurturing holistic development with strong moral pillars.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SVES Quick Stats Card */}
                    <div className="lg:col-span-4 bg-[#121212] text-white p-8 rounded-2xl shadow-xl flex flex-col justify-between min-h-[350px]">
                        <div>
                            <h3 className="text-xl font-bold border-b border-white/10 pb-4 mb-6">
                                SVES at a Glance
                            </h3>
                            <ul className="space-y-6">
                                <li className="flex items-center gap-4">
                                    <MapPin className="text-[#eb8426] w-6 h-6 flex-shrink-0" />
                                    <div>
                                        <span className="block text-2xl font-bold">2 States</span>
                                    </div>
                                </li>
                                <li className="flex items-center gap-4">
                                    <Building className="text-[#eb8426] w-6 h-6 flex-shrink-0" />
                                    <div>
                                        <span className="block text-2xl font-bold">4 Campuses</span>
                                    </div>
                                </li>
                                <li className="flex items-center gap-4">
                                    <GraduationCap className="text-[#eb8426] w-6 h-6 flex-shrink-0" />
                                    <div>
                                        <span className="block text-2xl font-bold">9 Constituent Colleges</span>
                                    </div>
                                </li>
                                <li className="flex items-center gap-4">
                                    <Users className="text-[#eb8426] w-6 h-6 flex-shrink-0" />
                                    <div>
                                        <span className="block text-2xl font-bold">20,000+ Students</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Section - VIT Info */}
                <div className="border-t border-gray-200 pt-16 grid lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-5 relative">
                        <div className="overflow-hidden rounded-2xl shadow-2xl relative">
                            <img
                                src="/img-vishnu-sec-1.webp"
                                alt="Vishnu Institute of Technology Campus"
                                className="w-full h-auto object-cover"
                            />
                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-semibold tracking-wider">
                                VISHNU INSTITUTE OF TECHNOLOGY
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <h3 className="text-2xl font-bold text-[#121212] mb-6">
                            Vishnu Institute of Technology (Autonomous), Bhimavaram
                        </h3>
                        <p className="text-gray-700 text-lg leading-relaxed mb-8">
                            is one of the leading engineering colleges in Andhra Pradesh offering B.Tech, M.Tech and Ph.D. programs.
                            The institute is known for academic excellence, research, innovation and outstanding placement opportunities.
                        </p>

                        {/* Stats badges */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                            <div className="border-l-4 border-[#5ea21a] pl-4">
                                <span className="block text-sm text-gray-500">Established</span>
                                <span className="text-xl font-bold text-[#121212]">Est. 2008</span>
                                <span className="block text-xs text-gray-600">18 Years Of Excellence</span>
                            </div>
                            <div className="border-l-4 border-[#5ea21a] pl-4">
                                <span className="block text-sm text-gray-500">Affiliation</span>
                                <span className="text-xl font-bold text-[#121212]">JNTUK</span>
                                <span className="block text-xs text-gray-600">Permanently Affiliated</span>
                            </div>
                            <div className="border-l-4 border-[#5ea21a] pl-4">
                                <span className="block text-sm text-gray-500">Status</span>
                                <span className="text-xl font-bold text-[#121212]">Autonomous</span>
                                <span className="block text-xs text-gray-600">From Year 2019-'20</span>
                            </div>
                            <div className="border-l-4 border-[#eb8426] pl-4">
                                <span className="block text-sm text-gray-500">Accreditation</span>
                                <span className="text-xl font-bold text-[#121212]">NAAC 'A+'</span>
                                <span className="block text-xs text-gray-600">With 3.51 CGPA</span>
                            </div>
                            <div className="border-l-4 border-[#eb8426] pl-4">
                                <span className="block text-sm text-gray-500">NBA Status</span>
                                <span className="text-xl font-bold text-[#121212]">Approved</span>
                                <span className="block text-xs text-gray-600">NBA Accredited Courses</span>
                            </div>
                            <div className="border-l-4 border-[#eb8426] pl-4">
                                <span className="block text-sm text-gray-500">Atal Ranking</span>
                                <span className="text-xl font-bold text-[#121212]">ARIIA</span>
                                <span className="block text-xs text-gray-600">Top Innovation Achievements</span>
                            </div>
                        </div>

                        <p className="text-gray-700 italic text-lg border-t border-gray-150 pt-6">
                            "At VISHNU, you will experience a dynamic learning environment that empowers you to grow, explore, and realize your full potential."
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#121212] text-white py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Vishnu Institute of Technology. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
