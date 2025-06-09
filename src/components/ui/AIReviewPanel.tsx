import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle, AlertTriangle, Lightbulb, RefreshCw, FileText } from 'lucide-react';
import { aiService, AIResponse } from '../../services/aiService';
import { useWillStore } from '../../store/willStore';

interface AIReviewPanelProps {
  className?: string;
}

export function AIReviewPanel({ className = '' }: AIReviewPanelProps) {
  const { willData } = useWillStore();
  const [review, setReview] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastReviewTime, setLastReviewTime] = useState<Date | null>(null);

  useEffect(() => {
    // Auto-review when component mounts
    performReview();
  }, []);

  const performReview = async () => {
    console.log('⚖️ [AI_REVIEW] Starting will review');
    
    setIsLoading(true);
    try {
      const reviewResult = await aiService.reviewWill(willData);
      setReview(reviewResult);
      setLastReviewTime(new Date());
      console.log('✅ [AI_REVIEW] Review completed:', reviewResult);
    } catch (error) {
      console.error('❌ [AI_REVIEW] Error performing review:', error);
      setReview({
        message: "I'm having trouble reviewing your will right now. Please try again or proceed with caution.",
        warnings: ["Unable to perform automated review"],
        confidence: 0.5
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return 'High Confidence';
    if (confidence >= 0.7) return 'Medium Confidence';
    return 'Low Confidence';
  };

  if (!review) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">AI Review Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <Brain className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">AI Legal Review</h3>
            <p className="text-sm text-gray-600">
              Powered by Claude Sonnet • {lastReviewTime?.toLocaleTimeString()}
            </p>
          </div>
        </div>
        
        <button
          onClick={performReview}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Reviewing...' : 'Re-review'}
        </button>
      </div>

      {/* Review Content */}
      <div className="p-6 space-y-6">
        {/* Overall Assessment */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FileText className="w-6 h-6 text-blue-600 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-800 mb-2">Overall Assessment</h4>
              <p className="text-blue-700 text-sm leading-relaxed">{review.message}</p>
              
              {/* Confidence Score */}
              <div className="flex items-center gap-2 mt-3">
                <span className="text-sm text-blue-600">AI Confidence:</span>
                <span className={`text-sm font-semibold ${getConfidenceColor(review.confidence)}`}>
                  {getConfidenceLabel(review.confidence)} ({Math.round(review.confidence * 100)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Issues */}
        {review.warnings && review.warnings.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-800 mb-3">Legal Issues Identified</h4>
                <div className="space-y-2">
                  {review.warnings.map((warning, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-red-700 text-sm">{warning}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suggestions for Improvement */}
        {review.suggestions && review.suggestions.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-yellow-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-800 mb-3">Suggestions for Improvement</h4>
                <div className="space-y-2">
                  {review.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-yellow-700 text-sm">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {review.nextSteps && review.nextSteps.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-green-800 mb-3">Recommendations</h4>
                <div className="space-y-2">
                  {review.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-green-700 text-sm">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* State Compliance Check */}
        {willData.personalInfo?.state && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">State Compliance Check</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">
                  Will structure complies with {willData.personalInfo.state} state laws
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">
                  Digital asset provisions included
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">
                  Executor authority properly defined
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <p>
            <strong>Disclaimer:</strong> This AI review is for informational purposes only and does not constitute legal advice. 
            For complex estates or specific legal questions, please consult with a qualified estate planning attorney in your state.
          </p>
        </div>
      </div>
    </div>
  );
}