"use client"

import React from "react"

export function VishnuIcon({ className = "w-12 h-12" }: { className?: string }) {
    // Renders the interlocking icon of the official logo by using CSS overflow-hidden
    // to crop out the "VISHNU UNIVERSAL LEARNING" text at the bottom dynamically.
    return (
        <div className={`${className} relative overflow-hidden rounded-full flex-shrink-0`}>
            <img
                src="/logo-vishnu.png"
                alt="Vishnu Icon Outline"
                className="absolute top-0 left-0 w-full h-[142%] object-cover object-top"
            />
        </div>
    )
}

export function VishnuLogo() {
    return (
        <div className="flex items-center gap-4 select-none">
            {/* Left Column: Full image asset containing the interlocking icon and sub-labels */}
            <img
                src="/logo-vishnu.png"
                alt="Vishnu Institutional Logo"
                className="w-[54px] h-[54px] object-contain flex-shrink-0"
            />

            {/* Right Column: Title and Subscript (No divider line as requested) */}
            <div className="flex flex-col leading-none">
                <span className="text-2xl md:text-3xl font-black tracking-wider text-black font-sans uppercase">
                    VISHNU
                </span>
                <span className="text-[11px] md:text-xs font-bold italic text-[#ff7043] tracking-wide mt-1 font-sans">
                    Institute of Technology
                </span>
            </div>
        </div>
    )
}
