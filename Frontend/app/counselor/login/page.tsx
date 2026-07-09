"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, User, Sparkles, AlertCircle } from "lucide-react"

import { config } from "@/lib/config"

export default function CounselorLogin() {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const baseUrl = config.formSubmissionApi?.replace(/\/$/, "") || ""
            const res = await fetch(`${baseUrl}/api/counselor/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            })

            const data = await res.json()
            if (res.ok && data.success && data.token) {
                // Clear any old auth storage
                sessionStorage.removeItem("counselor_auth")
                // Store new JWT token
                sessionStorage.setItem("counselor_auth", data.token)
                router.push("/counselor/dashboard")
            } else {
                setError(data.error || "Invalid username or password credentials.")
                setIsLoading(false)
            }
        } catch (err) {
            console.error("[AUTH] Login call failed:", err)
            setError("Cannot connect to authorization server. Please make sure the backend mock is running.")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header />

            <main className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md border border-gray-250 shadow-md bg-white rounded-xl overflow-hidden">
                    <CardHeader className="bg-[#121212] text-white py-6 border-b-4 border-[#5ea21a] text-center">
                        <div className="flex justify-center items-center gap-1.5 text-xs text-[#5ea21a] font-bold uppercase tracking-wider mb-2">
                            <Sparkles className="w-4 h-4 animate-pulse" /> VIT Admissions Portal
                        </div>
                        <CardTitle className="text-xl md:text-2xl font-black tracking-tight">
                            Counselor Secure Login
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-400 mt-1">
                            Restricted access for authorized advisors and management only.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-6">
                        <form onSubmit={handleLogin} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                                    Username
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4.5 w-4.5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="counselor"
                                        required
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-[#5ea21a] focus:ring-1 focus:ring-[#5ea21a] transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-gray-400" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        required
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm outline-none focus:border-[#5ea21a] focus:ring-1 focus:ring-[#5ea21a] transition-all"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#5ea21a] hover:bg-[#4d8614] text-white font-bold text-sm tracking-wide mt-2"
                            >
                                {isLoading ? "Authenticating..." : "SECURE SIGN IN"}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="bg-gray-50 border-t border-gray-200 py-3 px-6 text-center text-[10px] text-gray-400 font-semibold select-none flex flex-col gap-1">
                        <div>Default local credentials:</div>
                        <div className="font-mono text-gray-500">counselor / counselor@vit</div>
                    </CardFooter>
                </Card>
            </main>
        </div>
    )
}
