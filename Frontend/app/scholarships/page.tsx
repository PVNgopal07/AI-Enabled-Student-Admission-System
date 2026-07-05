"use client"

import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { CheckSquare, Info, ShieldCheck, Check } from "lucide-react"

const newDocumentsList = [
    "Model Application",
    "SSC Mark List",
    "Inter Mark List",
    "Transfer Certificate",
    "Study Certificates for Last SEVEN Consecutive years of study",
    "Caste Certificate obtained from Meeseva (SC/ST/BC/BC-E/Minority Students only)",
    "Integrated Certificate (Prescribed format of COMMUNITY, NATIVITY & DATE OF BIRTH CERTIFICATE, issued after 02-06-2014 by Tahsildar through Mee Seva by the students belongs to EBC/OC students only)",
    "White Ration Card",
    "Income Certificate",
    "Aadhaar Card (Student, Father & Mother)",
    "Nationalized Bank Pass Book",
    "Allotment Order",
    "Bonafide Certificate",
    "Student Passport Size Photographs 2No.s",
]

const renewalDocumentsList = [
    "Model Application",
    "SSC Mark List",
    "Bank Pass Book",
    "Student Aadhaar Card",
    "Caste Certificate obtained from Meeseva (SC/ST/BC/BC-E/Minority Students only)",
    "Integrated Certificate (EBC-OC Students only)",
    "White Ration Card",
    "Allotment Order",
    "Bonafide Certificate - Should be signed by the Principal",
    "Previous year Passed/Promoted Memo.",
]

export default function ScholarshipsPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Header />

            <main className="flex-1 py-16 px-4 md:px-8 max-w-5xl mx-auto w-full mt-16">
                {/* Title Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center space-x-2 bg-[#5ea21a]/10 text-[#5ea21a] px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-[#5ea21a]/20">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Scholarship Policies</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                        SCHOLARSHIPS / REIMBURSEMENT <span className="text-[#5ea21a]">(JVD)</span>
                    </h1>
                    <p className="mt-2 text-sm md:text-base font-bold text-[#eb8426] tracking-widest uppercase">
                        Bachelor of Technology [B.Tech]
                    </p>
                </div>

                {/* Eligibility Section */}
                <Card className="border-0 shadow-md bg-white rounded-2xl overflow-hidden mb-10">
                    <div className="bg-[#5ea21a] py-4 px-6 md:px-8 text-white flex items-center space-x-3">
                        <Info className="w-6 h-6" />
                        <h2 className="text-xl font-bold tracking-wide">Eligibility</h2>
                    </div>
                    <CardContent className="p-6 md:p-8 space-y-4 text-gray-700 leading-relaxed">
                        <div className="flex items-start space-x-3">
                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mt-1 shrink-0">
                                <Check className="w-3 h-3" />
                            </div>
                            <p>
                                Students belonging to <strong className="text-gray-900">SC/ST</strong> with family income less than <strong className="text-gray-900">Rs.2.00 Lakhs per annum</strong>.
                            </p>
                        </div>
                        <div className="flex items-start space-x-3 border-t border-gray-100 pt-4">
                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mt-1 shrink-0">
                                <Check className="w-3 h-3" />
                            </div>
                            <p>
                                Students belonging to <strong className="text-gray-900">BC/EBC-OC/Disabled/Muslim Minority</strong> with family income less than <strong className="text-gray-900">Rs.1.00 Lakh per annum</strong>.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Required Documents Section */}
                <Card className="border-0 shadow-md bg-white rounded-2xl overflow-hidden mb-10">
                    <div className="bg-[#921c6b] py-5 px-6 md:px-8 text-white">
                        <h2 className="text-xl font-bold tracking-wide">Documents Required (New Candidates)</h2>
                        <p className="text-xs text-purple-200 mt-1 leading-snug">
                            Candidates should submit the following relative documents (Xerox copies attested by concerned Head of the Department) to the scholarship department before the stipulated date.
                        </p>
                    </div>
                    <CardContent className="p-6 md:p-8">
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {newDocumentsList.map((doc, idx) => (
                                <li key={idx} className="flex items-start space-x-3">
                                    <CheckSquare className="w-5 h-5 text-[#921c6b] shrink-0 mt-0.5" />
                                    <span className="text-sm text-gray-700 leading-snug">{doc}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Procedure for Renewal Section */}
                <Card className="border-0 shadow-md bg-white rounded-2xl overflow-hidden">
                    <div className="bg-[#eb8426] py-5 px-6 md:px-8 text-white">
                        <h2 className="text-xl font-bold tracking-wide">Procedure for Renewal</h2>
                        <p className="text-xs text-orange-100 mt-1 leading-snug">
                            Candidates should submit the following relative documents (Xerox copies attested by concerned Head of the Department) to the scholarship department before the stipulated date.
                        </p>
                    </div>
                    <CardContent className="p-6 md:p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center space-x-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#eb8426]"></span>
                            <span>Documents Required</span>
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renewalDocumentsList.map((doc, idx) => (
                                <li key={idx} className="flex items-start space-x-3">
                                    <CheckSquare className="w-5 h-5 text-[#eb8426] shrink-0 mt-0.5" />
                                    <span className="text-sm text-gray-700 leading-snug">{doc}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </main>

            {/* Footer */}
            <footer className="bg-[#121212] text-white py-8 mt-24 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 text-center space-y-2 text-sm text-gray-400">
                    <p>© 2026 Vishnu Institute of Technology (Autonomous). All Rights Reserved.</p>
                    <p>Bhimavaram, Andhra Pradesh, India.</p>
                </div>
            </footer>
        </div>
    )
}
