"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { User, GraduationCap, Award, Loader2, CheckCircle2, ChevronRight, ChevronLeft, Check } from "lucide-react"
import Link from "next/link"

interface ApplicationFormData {
    // Step 1: Personal Info
    fullName: string
    dob: string
    gender: string
    nationality: string
    category: string
    email: string
    phone: string
    parentName: string
    parentPhone: string
    address: string

    // Step 2: Academic Info
    qualifyingExam: string
    entranceExam: string
    rollNumber: string
    rankScore: string
    tenthMarks: string
    twelfthMarks: string

    // Step 3: Branch Selection
    choiceActive: string
    choiceOption1: string
    choiceOption2: string
    dataAuthorization: boolean
}

const initialFormData: ApplicationFormData = {
    fullName: "",
    dob: "",
    gender: "",
    nationality: "Indian",
    category: "",
    email: "",
    phone: "",
    parentName: "",
    parentPhone: "",
    address: "",
    qualifyingExam: "10+2 / Intermediate",
    entranceExam: "EAPCET",
    rollNumber: "",
    rankScore: "",
    tenthMarks: "",
    twelfthMarks: "",
    choiceActive: "btech",
    choiceOption1: "",
    choiceOption2: "",
    dataAuthorization: false,
}

const BTECH_BRANCHES = [
    { id: "cse", name: "Computer Science & Engineering (CSE)", code: "CSE" },
    { id: "cse-aiml", name: "CSE (Artificial Intelligence & Machine Learning)", code: "CSE-AI&ML" },
    { id: "it", name: "Information Technology (IT)", code: "IT" },
    { id: "ece", name: "Electronics & Communication Engineering (ECE)", code: "ECE" },
    { id: "eee", name: "Electrical & Electronics Engineering (EEE)", code: "EEE" },
    { id: "mech", name: "Mechanical Engineering (ME)", code: "ME" },
    { id: "civil", name: "Civil Engineering (CE)", code: "CE" },
]

export default function ApplyPage() {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<ApplicationFormData>(initialFormData)
    const [errors, setErrors] = useState<Partial<Record<keyof ApplicationFormData, string>>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [registrationId, setRegistrationId] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value
        setFormData((prev) => ({ ...prev, [name]: val }))
        if (errors[name as keyof ApplicationFormData]) {
            setErrors((prev) => ({ ...prev, [name]: "" }))
        }
    }

    const validateStep = (currentStep: number): boolean => {
        const newErrors: Partial<Record<keyof ApplicationFormData, string>> = {}

        if (currentStep === 1) {
            if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required"
            if (!formData.dob) newErrors.dob = "Date of Birth is required"
            if (!formData.gender) newErrors.gender = "Gender is required"
            if (!formData.category) newErrors.category = "Category is required"
            if (!formData.email.trim()) {
                newErrors.email = "Email is required"
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = "Invalid email format"
            }
            if (!formData.phone.trim()) {
                newErrors.phone = "Phone number is required"
            } else if (!/^\+?[0-9]{10,12}$/.test(formData.phone.replace(/[\s-]/g, ""))) {
                newErrors.phone = "Please enter a valid 10-12 digit mobile number"
            }
            if (!formData.parentName.trim()) newErrors.parentName = "Parent's/Guardian's Name is required"
            if (!formData.parentPhone.trim()) newErrors.parentPhone = "Parent's Contact number is required"
            if (!formData.address.trim()) newErrors.address = "Address is required"
        }

        if (currentStep === 2) {
            if (!formData.rollNumber.trim()) newErrors.rollNumber = "Roll Number is required"
            if (!formData.rankScore.trim()) newErrors.rankScore = "Entrance Exam Rank/Score is required"
            if (!formData.tenthMarks.trim()) newErrors.tenthMarks = "10th Grade Marks/GPA scale is required"
            if (!formData.twelfthMarks.trim()) newErrors.twelfthMarks = "12th Grade / Intermediate Marks/GPA is required"
        }

        if (currentStep === 3) {
            if (!formData.choiceOption1) newErrors.choiceOption1 = "Primary branch preference is required"
            if (!formData.choiceOption2) newErrors.choiceOption2 = "Secondary branch preference is required"
            if (formData.choiceOption1 === formData.choiceOption2 && formData.choiceOption1) {
                newErrors.choiceOption2 = "Secondary choice cannot be identical to primary choice"
            }
            if (!formData.dataAuthorization) {
                newErrors.dataAuthorization = "You must authorize the data submission request"
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (validateStep(step)) {
            setStep((prev) => prev + 1)
            window.scrollTo(0, 0)
        }
    }

    const handlePrev = () => {
        setStep((prev) => prev - 1)
        window.scrollTo(0, 0)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateStep(3)) return

        setIsSubmitting(true)
        try {
            // Simulate API call to register applicant details
            await new Promise((resolve) => setTimeout(resolve, 2000))

            const randNum = Math.floor(10000 + Math.random() * 90000)
            setRegistrationId(`VITB2026-A${randNum}`)
            setIsSuccess(true)
        } catch (err) {
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header />

            <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 md:py-12">
                {/* Title Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#121212] tracking-tight uppercase">
                        Admission Registration Form
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm md:text-base font-medium">
                        Academic Year 2026-2027 • Vishnu Institute of Technology
                    </p>
                    <div className="w-16 h-1 bg-[#5ea21a] mx-auto mt-4 rounded-full"></div>
                </div>

                {/* Wizard Multi-Step Progress Tracker Bar */}
                {!isSuccess && (
                    <div className="mb-10 max-w-xl mx-auto flex items-center justify-between relative px-2">
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-250 -translate-y-1/2 z-0"></div>
                        <div
                            className="absolute top-1/2 left-0 h-0.5 bg-[#5ea21a] -translate-y-1/2 transition-all duration-300 z-0"
                            style={{ width: `${((step - 1) / 2) * 100}%` }}
                        ></div>

                        {/* Step 1 Circle */}
                        <div className="relative z-10 flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= 1 ? "bg-[#5ea21a] text-white ring-4 ring-green-100" : "bg-white border-2 border-gray-300 text-gray-400"
                                    }`}
                            >
                                {step > 1 ? <Check className="w-5 h-5" /> : <User className="w-5 h-5" />}
                            </div>
                            <span className={`text-xs mt-2 font-semibold ${step >= 1 ? "text-[#5ea21a]" : "text-gray-400"}`}>
                                Personal Info
                            </span>
                        </div>

                        {/* Step 2 Circle */}
                        <div className="relative z-10 flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= 2
                                        ? "bg-[#5ea21a] text-white ring-4 ring-green-100"
                                        : "bg-white border-2 border-gray-300 text-gray-400"
                                    }`}
                            >
                                {step > 2 ? <Check className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                            </div>
                            <span className={`text-xs mt-2 font-semibold ${step >= 2 ? "text-[#5ea21a]" : "text-gray-400"}`}>
                                Academics
                            </span>
                        </div>

                        {/* Step 3 Circle */}
                        <div className="relative z-10 flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step === 3
                                        ? "bg-[#eb8426] text-white ring-4 ring-orange-100"
                                        : "bg-white border-2 border-gray-300 text-gray-400"
                                    }`}
                            >
                                <Award className="w-5 h-5" />
                            </div>
                            <span className={`text-xs mt-2 font-semibold ${step === 3 ? "text-[#eb8426]" : "text-gray-400"}`}>
                                Preference
                            </span>
                        </div>
                    </div>
                )}

                {isSuccess ? (
                    /* SUCCESS SCREEN CARD */
                    <Card className="border-t-8 border-[#5ea21a] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 bg-white">
                        <CardContent className="pt-10 pb-8 text-center px-6">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#5ea21a]">
                                <CheckCircle2 className="w-14 h-14" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                                Application Submitted Successfully!
                            </h2>
                            <p className="text-gray-500 mt-2 max-w-md mx-auto text-sm md:text-base">
                                Your application has been received and registered under the admissions database of Vishnu Institute of Technology.
                            </p>

                            {/* Mock Application Ticket Display Box */}
                            <div className="my-8 bg-[#121212]/5 p-6 rounded-2xl border border-gray-250 max-w-md mx-auto text-left">
                                <div className="grid grid-cols-2 gap-y-4 text-sm">
                                    <div>
                                        <span className="text-gray-500 block text-xs uppercase tracking-wider font-semibold">Applicant Name</span>
                                        <span className="font-bold text-gray-900 text-base">{formData.fullName}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block text-xs uppercase tracking-wider font-semibold">Registration ID</span>
                                        <span className="font-mono font-bold text-[#eb8426] text-base">{registrationId}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block text-xs uppercase tracking-wider font-semibold">First Choice Branch</span>
                                        <span className="font-bold text-gray-900">
                                            {BTECH_BRANCHES.find((b) => b.id === formData.choiceOption1)?.code || "CSE"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block text-xs uppercase tracking-wider font-semibold">Entrance Exam Rank</span>
                                        <span className="font-bold text-gray-900">EAPCET Rank {formData.rankScore}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Steps Guidance Alerts */}
                            <div className="max-w-md mx-auto bg-green-50 border border-green-200 p-4 rounded-xl text-left text-sm text-green-800 mb-8 space-y-2">
                                <p className="font-bold">Next Steps for Verification:</p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>Our advisor agent will follow up with you via WhatsApp/Email within 24 hours.</li>
                                    <li>Please keep original certificates of 10th and Intermediate marks ready.</li>
                                    <li>Classroom orientation schedules will be dispatched post-seat assignment.</li>
                                </ul>
                            </div>

                            <div className="flex justify-center gap-4">
                                <Link href="/">
                                    <Button className="bg-[#5ea21a] hover:bg-[#4a8214] text-white font-bold px-6 py-2">
                                        RETURN TO HOME
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    /* FORM MULTI-STEP CARD */
                    <Card className="shadow-lg border-gray-200 bg-white">
                        <form onSubmit={handleSubmit}>
                            <CardHeader className="border-b border-gray-100 bg-gray-50/50 py-4 px-6">
                                <CardTitle className="text-lg md:text-xl font-bold text-gray-900">
                                    {step === 1 && "Personal & Contact Information"}
                                    {step === 2 && "Academic Records / Examination Credentials"}
                                    {step === 3 && "Course / Specialization Selection"}
                                </CardTitle>
                                <CardDescription className="text-xs md:text-sm">
                                    {step === 1 && "Enter details exactly as they appear on your identification cards."}
                                    {step === 2 && "Provided entrance exams rank/scores are cross-referenced during verification."}
                                    {step === 3 && "Review specialization combinations and give consent to submit."}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="p-6 md:p-8">
                                {/* STEP 1 FIELDS */}
                                {step === 1 && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                                                    Full Name (as per Certificates) <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border rounded-md text-sm outline-none transition-all ${errors.fullName ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-300 focus:border-[#5ea21a] focus:ring-1 focus:ring-[#5ea21a]"
                                                        }`}
                                                    placeholder="e.g. John Doe"
                                                />
                                                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                                                    Date of Birth <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    name="dob"
                                                    value={formData.dob}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border rounded-md text-sm outline-none transition-all ${errors.dob ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-300 focus:border-[#5ea21a] focus:ring-1 focus:ring-[#5ea21a]"
                                                        }`}
                                                />
                                                {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                                                    Gender <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border rounded-md text-sm outline-none bg-white transition-all ${errors.gender ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-300 focus:border-[#5ea21a] focus:ring-1 focus:ring-[#5ea21a]"
                                                        }`}
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                                                    Category <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border rounded-md text-sm outline-none bg-white transition-all ${errors.category ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-300 focus:border-[#5ea21a] focus:ring-1 focus:ring-[#5ea21a]"
                                                        }`}
                                                >
                                                    <option value="">Select Category</option>
                                                    <option value="OC">OC (Open Competition)</option>
                                                    <option value="BC-A">BC-A</option>
                                                    <option value="BC-B">BC-B</option>
                                                    <option value="BC-D">BC-D</option>
                                                    <option value="BC-E">BC-E</option>
                                                    <option value="SC">SC</option>
                                                    <option value="ST">ST</option>
                                                    <option value="EWS">EWS</option>
                                                </select>
                                                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                                                    Email Address <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border rounded-md text-sm outline-none transition-all ${errors.email ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-300 focus:border-[#5ea21a] focus:ring-1 focus:ring-[#5ea21a]"
                                                        }`}
                                                    placeholder="e.g. email@domain.com"
                                                />
                                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                                                    Mobile Number <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border rounded-md text-sm outline-none transition-all ${errors.phone ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-300 focus:border-[#5ea21a] focus:ring-1 focus:ring-[#5ea21a]"
                                                        }`}
                                                    placeholder="e.g. 9876543210"
                                                />
                                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                                                    Parent's/Guardian's Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="parentName"
                                                    value={formData.parentName}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border rounded-md text-sm outline-none transition-all ${errors.parentName ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-300 focus:border-[#5ea21a] focus:ring-1 focus:ring-[#5ea21a]"
                                                        }`}
                                                    placeholder="e.g. Robert Doe"
                                                />
                                                {errors.parentName && <p className="text-red-500 text-xs mt-1">{errors.parentName}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                                                    Parent's Mobile Number <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="parentPhone"
                                                    value={formData.parentPhone}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border rounded-md text-sm outline-none transition-all ${errors.parentPhone ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-300 focus:border-[#5ea21a] focus:ring-1 focus:ring-[#5ea21a]"
                                                        }`}
                                                    placeholder="e.g. 9876543211"
                                                />
                                                {errors.parentPhone && <p className="text-red-500 text-xs mt-1">{errors.parentPhone}</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                                                Permanent Address <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                rows={3}
                                                className={`w-full px-3 py-2 border rounded-md text-sm outline-none transition-all ${errors.address ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-300 focus:border-[#5ea21a] focus:ring-1 focus:ring-[#5ea21a]"
                                                    }`}
                                                placeholder="House No, Street name, City, State, ZIP code"
                                            />
                                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                        </div>
                                    </div>
                                )}

                                {/* STEP 2 FIELDS */}
                                {step === 2 && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                                                    Qualifying Examination <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    name="qualifyingExam"
                                                    value={formData.qualifyingExam}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none bg-white focus:border-[#5ea21a] focus:ring-1 focus:ring-[#5ea21a] transition-all"
                                                >
                                                    <option value="10+2 / Intermediate">10+2 / Intermediate</option>
                                                    <option value="CBSE Grade 12">CBSE Grade 12</option>
                                                    <option value="ICSE Grade 12">ICSE Grade 12</option>
                                                    <option value="Diploma (Polytechnic)">Diploma (Polytechnic) - Lateral Entry</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                                                    Entrance Exam Type <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    name="entranceExam"
                                                    value={formData.entranceExam}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none bg-white focus:border-[#5ea21a] focus:ring-1 focus:ring-[#5ea21a] transition-all"
                                                >
                                                    <option value="EAPCET">AP EAPCET</option>
                                                    <option value="JEE Main">JEE Main</option>
                                                    <option value="Management Quota">Management Quota (No Rank)</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                                                    Entrance Exam Roll / Hall-ticket No. <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="rollNumber"
                                                    value={formData.rollNumber}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border rounded-md text-sm outline-none transition-all ${errors.rollNumber ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-300 focus:border-[#5ea21a] focus:ring-1 focus:ring-[#5ea21a]"
                                                        }`}
                                                    placeholder="e.g. 261890372"
                                                />
                                                {errors.rollNumber && <p className="text-red-500 text-xs mt-1">{errors.rollNumber}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                                                    Entrance Rank / Percentile Score <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="rankScore"
                                                    value={formData.rankScore}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border rounded-md text-sm outline-none transition-all ${errors.rankScore ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-300 focus:border-[#5ea21a] focus:ring-1 focus:ring-[#5ea21a]"
                                                        }`}
                                                    placeholder="e.g. 15423"
                                                />
                                                {errors.rankScore && <p className="text-red-500 text-xs mt-1">{errors.rankScore}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                                                    10th Grade Marks/GPA Score <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="tenthMarks"
                                                    value={formData.tenthMarks}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border rounded-md text-sm outline-none transition-all ${errors.tenthMarks ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-300 focus:border-[#5ea21a] focus:ring-1 focus:ring-[#5ea21a]"
                                                        }`}
                                                    placeholder="e.g. 9.8 GPA or 95%"
                                                />
                                                {errors.tenthMarks && <p className="text-red-500 text-xs mt-1">{errors.tenthMarks}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                                                    12th Grade / Intermediate Marks/GPA <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="twelfthMarks"
                                                    value={formData.twelfthMarks}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border rounded-md text-sm outline-none transition-all ${errors.twelfthMarks ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-300 focus:border-[#5ea21a] focus:ring-1 focus:ring-[#5ea21a]"
                                                        }`}
                                                    placeholder="e.g. 962 / 1000 or 95%"
                                                />
                                                {errors.twelfthMarks && <p className="text-red-500 text-xs mt-1">{errors.twelfthMarks}</p>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3 FIELDS */}
                                {step === 3 && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                                                    Primary Course Choice <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    name="choiceOption1"
                                                    value={formData.choiceOption1}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border rounded-md text-sm outline-none bg-white transition-all ${errors.choiceOption1 ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-300 focus:border-[#5ea21a] focus:ring-1 focus:ring-[#5ea21a]"
                                                        }`}
                                                >
                                                    <option value="">Select First Choice</option>
                                                    {BTECH_BRANCHES.map((b) => (
                                                        <option key={b.id} value={b.id}>
                                                            {b.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.choiceOption1 && <p className="text-red-500 text-xs mt-1">{errors.choiceOption1}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                                                    Secondary Course Choice <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    name="choiceOption2"
                                                    value={formData.choiceOption2}
                                                    onChange={handleChange}
                                                    className={`w-full px-3 py-2 border rounded-md text-sm outline-none bg-white transition-all ${errors.choiceOption2 ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-300 focus:border-[#5ea21a] focus:ring-1 focus:ring-[#5ea21a]"
                                                        }`}
                                                >
                                                    <option value="">Select Second Choice</option>
                                                    {BTECH_BRANCHES.map((b) => (
                                                        <option key={b.id} value={b.id}>
                                                            {b.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.choiceOption2 && <p className="text-red-500 text-xs mt-1">{errors.choiceOption2}</p>}
                                            </div>
                                        </div>

                                        <div className="bg-[#121212]/5 p-4 rounded-xl text-gray-600 text-xs md:text-sm leading-relaxed border border-gray-200">
                                            <p className="font-semibold text-gray-800 mb-1">Declaration & Authorization:</p>
                                            I hereby declare that all the information supplied inside this registration catalog represents true copies of my academic credentials. I consent to let Vishnu Institute of Technology database verify and communicate registration notices back via phone calls and WhatsApp SMS triggers.
                                        </div>

                                        <div className="flex items-start gap-2.5">
                                            <input
                                                type="checkbox"
                                                id="dataAuthorization"
                                                name="dataAuthorization"
                                                checked={formData.dataAuthorization}
                                                onChange={handleChange}
                                                className="mt-1 accent-[#5ea21a]"
                                            />
                                            <label htmlFor="dataAuthorization" className="text-xs md:text-sm text-gray-600 select-none">
                                                I confirm and authorize my academic data submission. <span className="text-red-500">*</span>
                                            </label>
                                        </div>
                                        {errors.dataAuthorization && <p className="text-red-500 text-xs">{errors.dataAuthorization}</p>}
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter className="border-t border-gray-100 bg-gray-50/50 py-4 px-6 flex justify-between">
                                {step > 1 ? (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handlePrev}
                                        disabled={isSubmitting}
                                        className="border-[#5ea21a] text-[#5ea21a] hover:bg-[#5ea21a] hover:text-white"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-2" /> BACK
                                    </Button>
                                ) : (
                                    <div></div>
                                )}

                                {step < 3 ? (
                                    <Button
                                        type="button"
                                        onClick={handleNext}
                                        className="bg-[#5ea21a] hover:bg-[#4a8214] text-white"
                                    >
                                        NEXT <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-[#eb8426] hover:bg-[#d07119] text-white font-bold"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> SUBMITTING
                                            </>
                                        ) : (
                                            "SUBMIT APPLICATION"
                                        )}
                                    </Button>
                                )}
                            </CardFooter>
                        </form>
                    </Card>
                )}
            </main>
        </div>
    )
}
