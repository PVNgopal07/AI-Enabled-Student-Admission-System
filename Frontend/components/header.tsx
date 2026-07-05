"use client"

import { Button } from "@/components/ui/button"
import { VishnuLogo } from "./logo-vishnu"
import Link from "next/link"

interface HeaderProps {
    onInquireNow?: () => void
}

export function Header({ onInquireNow }: HeaderProps) {
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/">
                    <VishnuLogo />
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/get-help">
                        <Button variant="outline" className="border-[#5ea21a] text-[#5ea21a] hover:bg-[#5ea21a] hover:text-white">
                            GET HELP
                        </Button>
                    </Link>
                    <Link href="/apply">
                        <Button className="bg-[#eb8426] hover:bg-[#d07119] font-bold text-white">
                            APPLY NOW
                        </Button>
                    </Link>
                    <button className="p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                    <button className="p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    )
}
