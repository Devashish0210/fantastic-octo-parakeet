import React from "react";
import { FeedbackModal } from "./messages/FeedbackModal";

interface HeaderProps {
    onClearChat: () => void;
    sessionId: string;
}

export const Header = ({ onClearChat, sessionId }: HeaderProps) => {
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = React.useState(false);
    return (
        <header
            className="p-4 flex items-center justify-between border-b border-gray-300"
            style={{
                backgroundColor: "black",
                fontFamily: "Proxima Nova, sans-serif",
            }}
        >
            <div className="flex items-center space-x-2">
                <img
                    src='./ml-mia-chatbot-logo.png'
                    alt="AI Assistant"
                    className="h-10 w-8"
                />
                <span className="text-white text-lg font-semibold">Ask MIA</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => setIsFeedbackModalOpen(true)}
                    className="text-white text-sm font-semibold hover:text-gray-300 transition-all"
                >
                    Chat Feedback
                </button>
                <button
                    onClick={onClearChat}
                    className="text-white text-sm font-semibold hover:text-red-500 transition-all"
                >
                    New Conversation
                </button>
            </div>

            {/* Feedback Modal */}
            <FeedbackModal
                isOpen={isFeedbackModalOpen}
                onClose={() => setIsFeedbackModalOpen(false)}
                sessionId={sessionId}
            />
        </header>
    );
};