"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, Mail, MessageSquare, Phone, ShieldQuestion, UserCheck } from "lucide-react"
import Link from "next/link"

export default function GetHelpPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
                {/* Page Title */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#121212] tracking-tight">
                        GET HELP & SUPPORT
                    </h1>
                    <p className="text-gray-500 text-lg mt-3">
                        Have questions about admissions, forms, or technical support? Choose an option below.
                    </p>
                    <div className="w-20 h-1 bg-[#5ea21a] mx-auto mt-4"></div>
                </div>

                {/* Support Grid Options */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {/* AI Admissions Agent */}
                    <Card className="border border-gray-150 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
                        <CardHeader className="bg-[#5ea21a]/5 pb-6">
                            <div className="w-12 h-12 rounded-xl bg-[#5ea21a]/10 flex items-center justify-center text-[#5ea21a] mb-4">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <CardTitle className="text-xl font-bold text-[#121212]">
                                Chat with Admissions AI
                            </CardTitle>
                            <CardDescription className="text-gray-500 mt-1">
                                Get instant answers about courses, fee structures, admissions process or campus facilities.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <Link href="/?chat=true">
                                <Button className="w-full bg-[#5ea21a] hover:bg-[#4a8214] text-white py-6 rounded-xl font-bold text-base">
                                    START CHAT NOW
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Inquiry Application Form */}
                    <Card className="border border-gray-150 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
                        <CardHeader className="bg-[#eb8426]/5 pb-6">
                            <div className="w-12 h-12 rounded-xl bg-[#eb8426]/10 flex items-center justify-center text-[#eb8426] mb-4">
                                <UserCheck className="w-6 h-6" />
                            </div>
                            <CardTitle className="text-xl font-bold text-[#121212]">
                                Start Inquiry Form
                            </CardTitle>
                            <CardDescription className="text-gray-500 mt-1">
                                Found your program? Fill in your basic details to start your registration and connect with a counselor.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <Link href="/?apply=true">
                                <Button className="w-full bg-[#eb8426] hover:bg-[#d07119] text-white py-6 rounded-xl font-bold text-base">
                                    APPLY / REGISTER NOW
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Contact Info Details Card */}
                <Card className="border border-gray-150 bg-white shadow-lg overflow-hidden rounded-2xl mb-16">
                    <div className="bg-[#121212] py-6 px-8 text-white flex items-center gap-3">
                        <ShieldQuestion className="w-6 h-6 text-[#eb8426]" />
                        <h3 className="text-xl font-bold">Contact Our Admissions Office</h3>
                    </div>
                    <CardContent className="p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-[#5ea21a] flex-shrink-0">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-[#121212] text-sm uppercase tracking-wider">Admissions Hotline</h5>
                                        <p className="text-gray-700 font-semibold mt-1">+91 (8816) 251333</p>
                                        <p className="text-gray-500 text-xs mt-0.5">Monday – Saturday: 9:00 AM – 5:00 PM</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-[#5ea21a] flex-shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-[#121212] text-sm uppercase tracking-wider">Email Admissions</h5>
                                        <p className="text-gray-700 font-semibold mt-1">admissions@vishnu.edu.in</p>
                                        <p className="text-gray-500 text-xs mt-0.5">Expect a response within 24 working hours.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                                <h4 className="font-bold text-[#121212] text-md">Need Technical Desk Assist?</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    If you are experiencing issues submitting forms, loaded assets, or logging in, contact our portal support directly:
                                </p>
                                <div className="flex gap-2 items-center text-sm text-[#5ea21a] font-semibold">
                                    <Mail className="w-4 h-4" />
                                    <span>support-portal@vishnu.edu.in</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
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
