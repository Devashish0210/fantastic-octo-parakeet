"use client";

// import necessary modules and components
import React from 'react'
import Image from 'next/image'
import { SidebarToggle } from './SiderbarToggle'
import { useTheme } from "./ThemeContext";
import "../app/globals.css";

const STATIC_COPILOT_URL = process.env.NEXT_PUBLIC_BASE_PATH;

const AppTopNavbar = ({ isAuthenticated = true }: { isAuthenticated?: boolean }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="shrink-0 p-4 border-b border-zinc-800 bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isAuthenticated && <SidebarToggle />}
          {theme === "dark" ?
            <Image
              src={`${STATIC_COPILOT_URL}/images/newlogo.png`}
              alt="FPA Intelligeni Logo"
              width={300}
              height={300}
              className="-mt-1 h-6 w-20"
            /> : <Image
              src={`${STATIC_COPILOT_URL}/images/darklogo.png`}
              alt="FPA Intelligeni Logo"
              width={300}
              height={300}
              className="-mt-1 h-6 w-20"
            />
          }
          <span className="text-md px-2 py-0.5 rounded-md bg-zinc-700 text-[var(--color-text-light)]">FPA Chatbot</span>
        </div>
        <button
          onClick={toggleTheme}
          style={{
            marginLeft: "auto",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "1px solid #d1d5db",
            background: theme === "dark" ? "#333" : "#fff",
            color: theme === "dark" ? "#fff" : "#222",
            cursor: "pointer",
            transition: "background-color 0.2s ease, transform 0.1s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fecaca";
            e.currentTarget.style.color = "#dc2626";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = theme === "dark" ? "#333" : "#fff";
            e.currentTarget.style.color = theme === "dark" ? "#fff" : "#222",
            e.currentTarget.style.transform = "scale(1)";
          }}
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </header>
  )
}

export default AppTopNavbar;