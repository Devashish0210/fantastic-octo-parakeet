import { useSidebar } from "./ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { SidebarOpen, SidebarClose } from "lucide-react";

export function SidebarToggle() {
    const { toggleSidebar, state } = useSidebar();
    const isOpen = state === "expanded";

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-md bg-neutral-800/50 text-[var(--color-text-light)] hover:text-[var(--color-text-highlight)] hover:bg-[var(--color-button-highlight)] transition-colors"
                    aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
                >
                    {isOpen ? (
                        <SidebarClose size={18} />
                    ) : (
                        <SidebarOpen size={18} />
                    )}
                </button>
            </TooltipTrigger>
            <TooltipContent
                align="end"
                className="bg-neutral-800 text-[var(--color-text-light)] border-neutral-700"
            >
                Toggle Sidebar
            </TooltipContent>
        </Tooltip>
    );
}