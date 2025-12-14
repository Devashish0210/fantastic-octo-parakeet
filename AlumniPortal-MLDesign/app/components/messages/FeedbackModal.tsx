"use client";
import React, { useState, useEffect } from "react";
import { submitChatFeedback } from "./feedback-actions";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    sessionId: string; // Added sessionId prop
}

export const FeedbackModal = ({ isOpen, onClose, sessionId }: FeedbackModalProps) => {
    const [rating, setRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [comments, setComments] = useState<string>("");
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const maxCharacters = 500;

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isSubmitted) {
            const timer = setTimeout(() => {
                handleClose();
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [isSubmitted]);

    const handleClose = () => {
        onClose();
        // Reset form after modal closes
        setTimeout(() => {
            setRating(0);
            setComments("");
            setIsSubmitted(false);
            setIsSubmitting(false);
        }, 300);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const result = await submitChatFeedback(sessionId, rating, comments);
            
            if (result.success) {
                console.log("Feedback Submitted Successfully");
                setIsSubmitted(true);
            } else {
                console.error("Feedback submission failed:", result.error);
                alert("Failed to submit feedback. Please try again.");
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("An error occurred. Please try again.");
            setIsSubmitting(false);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleBackdropClick}
        >
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
                style={{ fontFamily: "Proxima Nova, sans-serif" }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Chat Feedback
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {!isSubmitted ? (
                        <>
                            {/* Star Rating */}
                            <div className="flex justify-center space-x-2 mb-6">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                        disabled={isSubmitting}
                                    >
                                        <svg
                                            width="40"
                                            height="40"
                                            viewBox="0 0 24 24"
                                            fill={
                                                star <= (hoveredRating || rating)
                                                    ? "#FFD700"
                                                    : "none"
                                            }
                                            stroke="#FFD700"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                    </button>
                                ))}
                            </div>

                            {/* Comments Section */}
                            <div className="mb-4">
                                <label
                                    htmlFor="comments"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Comments
                                </label>
                                <textarea
                                    id="comments"
                                    value={comments}
                                    onChange={(e) => {
                                        if (e.target.value.length <= maxCharacters) {
                                            setComments(e.target.value);
                                        }
                                    }}
                                    placeholder="Share your experience..."
                                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
                                    style={{ fontFamily: "Proxima Nova, sans-serif" }}
                                    disabled={isSubmitting}
                                />
                                <div className="text-right text-sm text-gray-500 mt-1">
                                    {comments.length}/{maxCharacters}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={rating === 0 || isSubmitting}
                                className="w-full py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 flex justify-center items-center"
                                style={{
                                    backgroundColor: "rgb(227, 6, 19)",
                                }}
                            >
                                {isSubmitting ? "Submitting..." : "Submit Feedback"}
                            </button>
                        </>
                    ) : (
                        /* Success Message */
                        <div className="text-center py-8">
                            <div className="mb-4">
                                <svg
                                    className="mx-auto"
                                    width="64"
                                    height="64"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="rgb(34, 197, 94)"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Feedback Submitted Successfully
                            </h3>
                            <p className="text-gray-600">Thank you for your feedback!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};