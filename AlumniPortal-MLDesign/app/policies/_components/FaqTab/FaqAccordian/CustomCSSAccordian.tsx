
import React from "react"
import "./faqAccordian.css"
export default function CustomCSSAccordian({ children }: { children: React.ReactNode }) {
    return (
        <div id={"alumniServicesAccordian"}>
            {children}
        </div>
    )
}