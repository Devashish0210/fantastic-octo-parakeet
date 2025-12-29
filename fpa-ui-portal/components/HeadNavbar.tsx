"use client";

// import necessary modules and components
import React from 'react'
import Image from 'next/image'
import { SidebarToggle } from './SiderbarToggle'
import "../app/globals.css";

const STATIC_COPILOT_URL = process.env.NEXT_PUBLIC_BASE_PATH;

const AppTopNavbar = ({ isAuthenticated = true }: { isAuthenticated?: boolean }) => {

  return (
    <header className="shrink-0 border-b border-zinc-800 bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isAuthenticated}
          <Image
              src={`${STATIC_COPILOT_URL}/images/mia.png`}
              alt="FPA Intelligeni Logo"
              width={140}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          <span className="text-md px-2 py-0.5 rounded-md bg-zinc-700 text-[var(--color-text-light)]">Finance</span>
        </div>
      </div>
    </header>
  )
}

export default AppTopNavbar;