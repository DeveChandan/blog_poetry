"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"

interface DropdownItem {
    href: string
    label: string
    description: string
    icon: React.ReactNode
}

interface NavigationDropdownProps {
    trigger: string
    items: DropdownItem[]
    featured?: DropdownItem
}

export function NavigationDropdown({ trigger, items, featured }: NavigationDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
            return () => document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen])

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onMouseEnter={() => setIsOpen(true)}
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex h-9 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 outline-none transition-colors"
                suppressHydrationWarning
            >
                {trigger}
                <svg
                    className={`ml-1 h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {isOpen && (
                <div
                    onMouseLeave={() => setIsOpen(false)}
                    className="absolute left-0 top-full z-50 mt-1.5 animate-in fade-in-0 zoom-in-95 duration-150"
                >
                    <div className="w-[400px] lg:w-[500px] rounded-md border bg-popover text-popover-foreground shadow-lg p-4">
                        <div className={`grid gap-3 ${featured ? "lg:grid-cols-[.75fr_1fr]" : "md:grid-cols-2"}`}>
                            {featured && (
                                <Link
                                    href={featured.href}
                                    className="row-span-3 flex flex-col justify-end rounded-md bg-gradient-to-b from-muted to-muted/50 p-6 no-underline outline-none hover:shadow-md transition-shadow"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {featured.icon}
                                    <div className="mb-2 mt-4 text-lg font-medium text-foreground">{featured.label}</div>
                                    <p className="text-sm leading-tight text-muted-foreground">{featured.description}</p>
                                </Link>
                            )}
                            {items.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="flex items-center gap-2 text-sm font-medium leading-none text-foreground">
                                        {item.icon} {item.label}
                                    </div>
                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{item.description}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
