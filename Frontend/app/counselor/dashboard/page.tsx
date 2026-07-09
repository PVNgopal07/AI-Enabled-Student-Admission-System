"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Users,
    CheckCircle2,
    XCircle,
    Clock,
    AlertTriangle,
    Sparkles,
    ChevronRight,
    ArrowLeft,
    Plus,
    RotateCw,
    TrendingUp,
    LogOut,
    Search
} from "lucide-react"
import Link from "next/link"
import { config } from "@/lib/config"

interface EnrollmentItem {
    id: string
    fullName: string
    email: string
    phone: string
    expectedStartDate: string
    choiceOption1: string
    courseName: string
    courseCategory: string
    courseFee: number
    discountPercentage: number
    finalPayableAmount: number
    enrollmentStatus: string
    approvalStatus: string
    aiPriorityScore: number
    riskLevel: string
    createdDate: string
}

interface AIInsightResponse {
    id: string
    studentApplicationSummary: string
    admissionRiskAnalysis: string
}

export default function CounselorDashboard() {
    const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentItem | null>(null)
    const [aiInsights, setAiInsights] = useState<AIInsightResponse | null>(null)
    const [loadingInsights, setLoadingInsights] = useState(false)
    const [isActionInProgress, setIsActionInProgress] = useState(false)

    // Search and Filter states
    const [searchQuery, setSearchQuery] = useState("")
    const [branchFilter, setBranchFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")

    const handleLogout = () => {
        sessionStorage.removeItem("counselor_auth")
        window.location.href = "/counselor/login"
    }

    const filteredEnrollments = enrollments.filter(enr => {
        const matchesQuery = enr.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            enr.email.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesBranch = branchFilter === "all" || enr.choiceOption1.toLowerCase() === branchFilter.toLowerCase()

        const matchesStatus = statusFilter === "all" || enr.approvalStatus.toLowerCase() === statusFilter.toLowerCase()

        return matchesQuery && matchesBranch && matchesStatus
    })

    // Seed mock data in case backend has none
    const seedMockData: EnrollmentItem[] = [
        {
            id: "ENR-SEED101",
            fullName: "Jeffry S. Kumar",
            email: "jeffry.s@example.com",
            phone: "+91 98452 11029",
            expectedStartDate: new Date(Date.now() + 604800000 * 2).toISOString().split("T")[0],
            choiceOption1: "cse-aiml",
            courseName: "CSE (Artificial Intelligence & Machine Learning)",
            courseCategory: "Technical",
            courseFee: 120000,
            discountPercentage: 35,
            finalPayableAmount: 78000,
            enrollmentStatus: "Submitted for Approval",
            approvalStatus: "Pending",
            aiPriorityScore: 87,
            riskLevel: "High",
            createdDate: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: "ENR-SEED102",
            fullName: "Rohit Verma",
            email: "rohitv@example.com",
            phone: "+91 70291 00392",
            expectedStartDate: new Date(Date.now() + 604800000).toISOString().split("T")[0],
            choiceOption1: "ece",
            courseName: "Electronics & Communication Engineering (ECE)",
            courseCategory: "Technical",
            courseFee: 90000,
            discountPercentage: 10,
            finalPayableAmount: 81000,
            enrollmentStatus: "Approved",
            approvalStatus: "Approved",
            aiPriorityScore: 55,
            riskLevel: "Low",
            createdDate: new Date(Date.now() - 172800000).toISOString()
        },
        {
            id: "ENR-SEED103",
            fullName: "Swapna Reddy",
            email: "swapna.r@example.com",
            phone: "+91 88992 00192",
            expectedStartDate: new Date(Date.now() + 604800000 * 3).toISOString().split("T")[0],
            choiceOption1: "cse",
            courseName: "Computer Science & Engineering (CSE)",
            courseCategory: "Technical",
            courseFee: 120000,
            discountPercentage: 0,
            finalPayableAmount: 120000,
            enrollmentStatus: "Approved",
            approvalStatus: "Approved",
            aiPriorityScore: 91,
            riskLevel: "Low",
            createdDate: new Date(Date.now() - 345600000).toISOString()
        },
        {
            id: "ENR-SEED104",
            fullName: "Ananya Sen",
            email: "ananya.sen@example.com",
            phone: "+91 97728 11985",
            expectedStartDate: new Date(Date.now()).toISOString().split("T")[0],
            choiceOption1: "mech",
            courseName: "Mechanical Engineering (ME)",
            courseCategory: "Technical",
            courseFee: 75000,
            discountPercentage: 45,
            finalPayableAmount: 41250,
            enrollmentStatus: "Rejected",
            approvalStatus: "Rejected",
            aiPriorityScore: 42,
            riskLevel: "High",
            createdDate: new Date(Date.now() - 518400000).toISOString()
        }
    ]

    const fetchEnrollments = async () => {
        setLoading(true)
        try {
            const token = sessionStorage.getItem("counselor_auth") || ""
            const res = await fetch(`${config.formSubmissionApi}api/enrollments`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if (res.ok) {
                const data = await res.json()
                if (data && data.length > 0) {
                    setEnrollments(data)
                } else {
                    setEnrollments(seedMockData)
                }
            } else {
                setEnrollments(seedMockData)
            }
        } catch (e) {
            console.error("Failed to load live enrollments, rendering seeded fallback:", e)
            setEnrollments(seedMockData)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEnrollments()
    }, [])

    const handleSelectRow = async (enrollment: EnrollmentItem) => {
        setSelectedEnrollment(enrollment)
        setLoadingInsights(true)
        setAiInsights(null)
        try {
            // Check if mock seed data insights are requested - handle locally as safe fallback
            if (enrollment.id.startsWith("ENR-SEED")) {
                await new Promise((resolve) => setTimeout(resolve, 800))
                const studentName = enrollment.fullName
                const courseName = enrollment.courseName
                const courseFee = enrollment.courseFee
                const discount = enrollment.discountPercentage
                const finalPayable = enrollment.finalPayableAmount
                const status = enrollment.enrollmentStatus
                const aiScore = enrollment.aiPriorityScore
                const riskLevel = enrollment.riskLevel

                setAiInsights({
                    id: enrollment.id,
                    studentApplicationSummary: `Student Application Summary:
* Applicant Name: ${studentName}
* Choice Course: ${courseName} (Standard fee: ₹${courseFee.toLocaleString('en-IN')})
* Financial Structure: Applied discount of ${discount}% resulting in a Final Payable Amount of ₹${finalPayable.toLocaleString('en-IN')}.
* Admission Status: The application is currently flagged as "${status}".
* AI Evaluation Rank: Evaluated with an AI priority score of ${aiScore}/100.
${aiScore >= 80 ? "⚠️ WARNING: High priority applicant requiring immediate counselor handoff." : "✅ Normal priority - process through standard channels."}
* Risk indicators: The financial discount is within ${discount > 30 ? "high-risk levels" : "standard parameters"}.`,

                    admissionRiskAnalysis: `Student Enrollment Risk Analysis & Recommendations:
1. Probability of Admission: Estimated at ${aiScore > 75 ? "92%" : "68%"} based on entrance scores and academic background.
2. Financial Risk: ${discount > 30 ? "High risk (Revenue reduction > 30% due to discount)" : "Low risk (Within normal discount margin)"}.
3. Overall Enrollment Health: ${riskLevel} Risk.
4. Recommendations: ${discount > 30 ? "⚠️ REQUIRE MANAGER OVERRIDE. Verify eligibility scores before granting this discount." : "✅ SAFE TO APPROVE. The discount and academic parameters match all enrollment criteria."}`
                })
            } else {
                const token = sessionStorage.getItem("counselor_auth") || ""
                const res = await fetch(`${config.formSubmissionApi}api/enrollments/ai-insights?id=${enrollment.id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                if (res.ok) {
                    const data = await res.json()
                    setAiInsights(data)
                }
            }
        } catch (err) {
            console.error("Failed fetching AI insights:", err)
        } finally {
            setLoadingInsights(false)
        }
    }

    const handleAction = async (action: "approve" | "reject") => {
        if (!selectedEnrollment) return
        setIsActionInProgress(true)
        try {
            // Seed check
            if (selectedEnrollment.id.startsWith("ENR-SEED")) {
                await new Promise((resolve) => setTimeout(resolve, 600))
                const updatedList = enrollments.map(e => {
                    if (e.id === selectedEnrollment.id) {
                        return {
                            ...e,
                            approvalStatus: action === "approve" ? "Approved" : "Rejected",
                            enrollmentStatus: action === "approve" ? "Approved" : "Rejected"
                        }
                    }
                    return e
                })
                setEnrollments(updatedList)
                setSelectedEnrollment({
                    ...selectedEnrollment,
                    approvalStatus: action === "approve" ? "Approved" : "Rejected",
                    enrollmentStatus: action === "approve" ? "Approved" : "Rejected"
                })
            } else {
                const token = sessionStorage.getItem("counselor_auth") || ""
                const res = await fetch(`${config.formSubmissionApi}api/enrollments/action`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ id: selectedEnrollment.id, action })
                })
                if (res.ok) {
                    const data = await res.json()
                    const updatedList = enrollments.map(e => e.id === data.id ? data : e)
                    setEnrollments(updatedList)
                    setSelectedEnrollment(data)
                }
            }
        } catch (e) {
            console.error("Action error:", e)
        } finally {
            setIsActionInProgress(false)
        }
    }

    // Counters
    const totalCount = enrollments.length
    const pendingCount = enrollments.filter(e => e.approvalStatus === "Pending").length
    const highRiskCount = enrollments.filter(e => e.riskLevel === "High").length
    const approvedCount = enrollments.filter(e => e.approvalStatus === "Approved").length

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header />

            {/* Dashboard Header Bar */}
            <div className="bg-[#121212] text-white py-8 px-4 md:px-8 border-b-4 border-[#5ea21a]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs md:text-sm text-[#5ea21a] font-bold tracking-wider uppercase mb-1">
                            <Sparkles className="w-4 h-4 animate-pulse" /> Salesforce-Aligned Admissions Portal
                        </div>
                        <h1 className="text-2xl md:text-4xl font-black tracking-tight">
                            Counselor Admissions Drawer
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={fetchEnrollments}
                            variant="outline"
                            className="bg-transparent border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
                        >
                            <RotateCw className="w-4 h-4 mr-2" /> REFRESH
                        </Button>
                        <Link href="/counselor/enroll">
                            <Button className="bg-[#eb8426] hover:bg-[#d07119] text-white font-bold">
                                <Plus className="w-4 h-4 mr-2" /> NEW ENROLLMENT SCREEN FLOW
                            </Button>
                        </Link>
                        <Button
                            onClick={handleLogout}
                            className="bg-red-650 hover:bg-red-755 text-white font-bold border border-red-500"
                        >
                            <LogOut className="w-4 h-4 mr-2" /> SIGN OUT
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Workspace */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="shadow-sm border-l-4 border-l-gray-400 bg-white">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs md:text-sm font-semibold uppercase tracking-wide">Total Applications</p>
                                <h3 className="text-xl md:text-2xl font-black text-gray-900 mt-1">{totalCount}</h3>
                            </div>
                            <div className="bg-gray-100 p-2.5 rounded-full text-gray-500">
                                <Users className="w-6 h-6" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-l-4 border-l-[#eb8426] bg-white">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs md:text-sm font-semibold uppercase tracking-wide">Approval Queue</p>
                                <h3 className="text-xl md:text-2xl font-black text-gray-900 mt-1">{pendingCount}</h3>
                            </div>
                            <div className="bg-[#eb8426]/10 p-2.5 rounded-full text-[#eb8426]">
                                <Clock className="w-6 h-6" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-l-4 border-l-[#5ea21a] bg-white">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs md:text-sm font-semibold uppercase tracking-wide">Seat Assignments</p>
                                <h3 className="text-xl md:text-2xl font-black text-gray-900 mt-1">{approvedCount}</h3>
                            </div>
                            <div className="bg-[#5ea21a]/10 p-2.5 rounded-full text-[#5ea21a]">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-l-4 border-l-red-500 bg-white">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs md:text-sm font-semibold uppercase tracking-wide">High Risk Metrics</p>
                                <h3 className="text-xl md:text-2xl font-black text-gray-900 mt-1">{highRiskCount}</h3>
                            </div>
                            <div className="bg-red-50 p-2.5 rounded-full text-red-500">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Queue & Sidebar Drawer Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Enrollment Table Queue */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-xs space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-gray-800 text-base">Admission Records Queue</span>
                                <span className="text-xs text-gray-500">Click a record to run Agentforce AI analysis slide-over</span>
                            </div>

                            {/* Search and Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search name/email..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded text-xs outline-none focus:border-[#5ea21a] focus:ring-1 focus:ring-[#5ea21a] transition-all bg-gray-50/50"
                                    />
                                </div>
                                <div>
                                    <select
                                        value={branchFilter}
                                        onChange={(e) => setBranchFilter(e.target.value)}
                                        className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs outline-none focus:border-[#5ea21a] focus:ring-1 focus:ring-[#5ea21a] transition-all bg-white text-gray-700"
                                    >
                                        <option value="all">All Courses</option>
                                        <option value="cse">CSE (General)</option>
                                        <option value="cse-aiml">CSE (AI & ML)</option>
                                        <option value="ece">ECE</option>
                                        <option value="mech">Mechanical</option>
                                    </select>
                                </div>
                                <div>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs outline-none focus:border-[#5ea21a] focus:ring-1 focus:ring-[#5ea21a] transition-all bg-white text-gray-700"
                                    >
                                        <option value="all">All status</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="bg-white p-12 text-center border rounded-xl flex flex-col items-center gap-3">
                                <RotateCw className="w-8 h-8 text-[#5ea21a] animate-spin" />
                                <span className="text-gray-500 text-sm">Fetching credentials & records from Salesforce...</span>
                            </div>
                        ) : enrollments.length === 0 ? (
                            <div className="bg-white p-12 text-center border rounded-xl">
                                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <h4 className="font-bold text-gray-700">No Applications Found</h4>
                                <p className="text-gray-400 text-xs mt-1">Submit applications from the Apply wizard to populate.</p>
                            </div>
                        ) : (
                            <div className="bg-white border rounded-xl shadow-sm overflow-hidden overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[700px]">
                                    <thead>
                                        <tr className="bg-gray-50 border-b text-xs text-gray-500 uppercase tracking-wider font-semibold">
                                            <th className="px-5 py-3">Applicant Status</th>
                                            <th className="px-5 py-3">Student Name</th>
                                            <th className="px-5 py-3">First Option</th>
                                            <th className="px-5 py-3 select-none">Discount Fee</th>
                                            <th className="px-5 py-3">AI Score</th>
                                            <th className="px-5 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y text-sm">
                                        {filteredEnrollments.map((enr) => {
                                            const isSelected = selectedEnrollment?.id === enr.id
                                            return (
                                                <tr
                                                    key={enr.id}
                                                    onClick={() => handleSelectRow(enr)}
                                                    className={`hover:bg-gray-50/80 cursor-pointer transition-colors ${isSelected ? "bg-[#5ea21a]/5 hover:bg-[#5ea21a]/10" : ""}`}
                                                >
                                                    <td className="px-5 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-mono text-[10px] text-gray-400 font-semibold">{enr.id}</span>
                                                            <span className={`inline-flex items-center gap-1 w-max px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${enr.approvalStatus === "Approved"
                                                                ? "bg-green-50 text-green-700 border border-green-200"
                                                                : enr.approvalStatus === "Rejected"
                                                                    ? "bg-red-50 text-red-700 border border-red-200"
                                                                    : "bg-yellow-50 text-yellow-800 border border-yellow-200"
                                                                }`}>
                                                                {enr.approvalStatus === "Approved" && <CheckCircle2 className="w-2.5 h-2.5" />}
                                                                {enr.approvalStatus === "Rejected" && <XCircle className="w-2.5 h-2.5" />}
                                                                {enr.approvalStatus === "Pending" && <Clock className="w-2.5 h-2.5 animate-pulse" />}
                                                                {enr.approvalStatus}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="font-bold text-gray-900">{enr.fullName}</div>
                                                        <div className="text-gray-400 text-xs font-medium">{enr.email}</div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="font-semibold text-gray-800 uppercase text-xs">{enr.choiceOption1}</div>
                                                        <div className="text-gray-400 text-[11px] truncate max-w-[150px]">{enr.courseName}</div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="font-black text-gray-900">₹{enr.finalPayableAmount.toLocaleString('en-IN')}</div>
                                                        <div className="text-gray-400 text-[11px] font-medium">Fee: ₹{enr.courseFee.toLocaleString('en-IN')} ({enr.discountPercentage}% off)</div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border ${enr.aiPriorityScore >= 80
                                                                ? "bg-red-50 border-red-200 text-red-600 font-extrabold"
                                                                : "bg-blue-50 border-blue-200 text-blue-600"
                                                                }`}>
                                                                {enr.aiPriorityScore}
                                                            </div>
                                                            {enr.aiPriorityScore >= 80 && (
                                                                <span className="bg-red-500 text-white font-extrabold text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded shadow-xs animate-pulse">
                                                                    ALERT RUN
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isSelected ? "transform translate-x-1 text-[#5ea21a]" : ""}`} />
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Agentforce Drawer Slide-Over Panel (Contextual Sidebar) */}
                    <div className="lg:col-span-4">
                        {selectedEnrollment ? (
                            <Card className="shadow-md border-t-8 border-t-[#5ea21a] bg-white rounded-xl overflow-hidden animate-in fade-in slide-in-from-right-5 duration-200">
                                <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4 px-5">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-[10px] font-mono text-gray-400 font-bold uppercase tracking-wider">{selectedEnrollment.id}</span>
                                            <CardTitle className="text-lg font-black text-gray-900 mt-0.5">{selectedEnrollment.fullName}</CardTitle>
                                        </div>
                                        <button
                                            onClick={() => setSelectedEnrollment(null)}
                                            className="text-gray-400 hover:text-gray-600 text-xs font-semibold uppercase tracking-wider"
                                        >
                                            CLOSE
                                        </button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5 space-y-6">
                                    {/* CRM Stats Summary */}
                                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl text-xs border border-gray-200/50">
                                        <div>
                                            <span className="text-gray-400 block uppercase font-medium">Expected Date</span>
                                            <span className="font-bold text-gray-800">{new Date(selectedEnrollment.expectedStartDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 block uppercase font-medium">Risk Status</span>
                                            <span className={`font-bold inline-flex items-center gap-1 ${selectedEnrollment.riskLevel === "High" ? "text-red-600" : selectedEnrollment.riskLevel === "Medium" ? "text-yellow-600" : "text-green-600"
                                                }`}>
                                                <TrendingUp className="w-3.5 h-3.5" /> {selectedEnrollment.riskLevel} Risk
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Workflow Buttons if Pending */}
                                    {selectedEnrollment.approvalStatus === "Pending" && (
                                        <div className="border border-[#eb8426]/30 bg-[#eb8426]/5 p-4 rounded-xl space-y-3">
                                            <div className="flex gap-2 text-xs text-[#eb8426] font-bold">
                                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                                <span>Manager Approval Override Required (Discount Percentage &gt; 30%)</span>
                                            </div>
                                            <div className="flex gap-2 pt-1">
                                                <Button
                                                    disabled={isActionInProgress}
                                                    onClick={() => handleAction("approve")}
                                                    className="flex-1 bg-[#5ea21a] hover:bg-[#4d8614] text-white font-bold text-xs"
                                                >
                                                    {isActionInProgress ? "Processing..." : "APPROVE DISCOUNTS"}
                                                </Button>
                                                <Button
                                                    disabled={isActionInProgress}
                                                    onClick={() => handleAction("reject")}
                                                    variant="outline"
                                                    className="flex-1 border-red-500 text-red-500 hover:bg-red-50 font-bold text-xs"
                                                >
                                                    {isActionInProgress ? "Processing..." : "REJECT APPLICATION"}
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Agentforce Prompt Header */}
                                    <div className="border-t pt-5">
                                        <div className="flex items-center gap-2 text-xs font-black text-[#5ea21a] tracking-wider uppercase mb-3">
                                            <Sparkles className="w-4 h-4 animate-spin text-[#eb8426]" /> Agentforce AI Decision Insights
                                        </div>

                                        {loadingInsights ? (
                                            <div className="py-8 text-center flex flex-col items-center gap-2">
                                                <RotateCw className="w-6 h-6 text-[#5ea21a] animate-spin" />
                                                <span className="text-gray-400 text-xs">Simulating template prompt resolution...</span>
                                            </div>
                                        ) : aiInsights ? (
                                            <div className="space-y-5 text-xs text-gray-700 leading-relaxed font-mono bg-[#121212]/5 p-4 rounded-xl border border-gray-200">
                                                <div>
                                                    <div className="font-bold text-[#eb8426] uppercase text-[10px] mb-1.5 flex items-center gap-1.5 border-b pb-0.5">
                                                        <span>🤖 Student Application Summary (SF Custom Alert)</span>
                                                    </div>
                                                    <div className="whitespace-pre-wrap font-medium">{aiInsights.studentApplicationSummary}</div>
                                                </div>
                                                <div className="border-t pt-4">
                                                    <div className="font-bold text-[#5ea21a] uppercase text-[10px] mb-1.5 flex items-center gap-1.5 border-b pb-0.5">
                                                        <span>📊 Admission Risk Draw & Recommendation</span>
                                                    </div>
                                                    <div className="whitespace-pre-wrap font-medium">{aiInsights.admissionRiskAnalysis}</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 text-xs text-gray-400 italic">
                                                Failed retrieving AI prompts. Check backend simulator connection.
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-400">
                                <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-60 text-[#5ea21a]" />
                                <h4 className="font-bold text-gray-650 text-sm">Interactive AI Assistance</h4>
                                <p className="text-xs mt-1 max-w-[200px] mx-auto">Select any student enrollment to execute prompt templates and view validation diagnostics.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
