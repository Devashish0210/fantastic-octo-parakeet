"use client";
import { useState } from "react";
import { ThumbsUp, ThumbsDown, CheckCircle } from "lucide-react";
import { submitMessageFeedback } from "./feedback-actions";

interface FeedbackButtonsProps {
  message: any;
  index: number;
  requestId: string;
  sessionId: string;
}

export const FeedbackButtons = ({
  message,
  index,
  requestId,
  sessionId,
}: FeedbackButtonsProps) => {
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<"like" | "dislike" | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedbackButtonClick = async (type: "like" | "dislike") => {
    setIsSubmittingFeedback(true);
    setFeedbackType(type);
    
    try {
      // Use the Server Action instead of fetch
      const result = await submitMessageFeedback(sessionId, requestId, type);

      if (!result.success) {
        throw new Error(result.error || "Unknown error during feedback submission");
      }

      setFeedbackSubmitted(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Only show for assistant messages
  if (message.role !== "assistant") {
    return null;
  }

  return (
    <div className="flex items-center gap-2 mt-4 ml-4">
      {feedbackSubmitted ? (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle size={16} />
          <span>Feedback submitted successfully</span>
        </div>
      ) : (
        <>
          <button
            onClick={() => handleFeedbackButtonClick("like")}
            disabled={isSubmittingFeedback}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors group disabled:opacity-50"
            aria-label="Like"
          >
            <ThumbsUp 
              size={20} 
              className={`transition-colors ${
                 feedbackType === 'like' ? 'text-green-600' : 'text-gray-500 group-hover:text-green-600'
              }`}
            />
          </button>

          <button
            onClick={() => handleFeedbackButtonClick("dislike")}
            disabled={isSubmittingFeedback}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors group disabled:opacity-50"
            aria-label="Dislike"
          >
            <ThumbsDown 
              size={20} 
              className={`transition-colors ${
                 feedbackType === 'dislike' ? 'text-red-600' : 'text-gray-500 group-hover:text-red-600'
              }`}
            />
          </button>

          {isSubmittingFeedback && (
            <span className="text-sm text-gray-500 ml-2">Submitting...</span>
          )}
        </>
      )}
    </div>
  );
};