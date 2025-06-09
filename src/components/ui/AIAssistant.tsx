import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Loader, AlertCircle, CheckCircle, Lightbulb, ArrowRight } from 'lucide-react';
import { aiService, AIResponse, AIContext, AIMessage } from '../../services/aiService';
import { useWillStore } from '../../store/willStore';

interface AIAssistantProps {
  currentStep: number;
  className?: string;
  onSuggestionClick?: (suggestion: string) => void;
}

export function AIAssistant({ currentStep, className = '', onSuggestionClick }: AIAssistantProps) {
  const { willData } = useWillStore();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentGuidance, setCurrentGuidance] = useState<AIResponse | null>(null);
  const [lastUserMessage, setLastUserMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load step guidance when component mounts or step changes
  useEffect(() => {
    console.log('🔄 [AI_ASSISTANT] Step changed to:', currentStep, 'Loading guidance...');
    loadStepGuidance();
  }, [currentStep]);

  // Clear messages when step changes to avoid confusion
  useEffect(() => {
    console.log('🔄 [AI_ASSISTANT] Step changed, clearing messages and loading new guidance');
    setMessages([]); // Clear previous conversation
    setCurrentGuidance(null); // Clear previous guidance
    setLastUserMessage(''); // Clear last user message
    loadStepGuidance();
  }, [currentStep]);

  const loadStepGuidance = async () => {
    console.log('🤖 [AI_ASSISTANT] Loading guidance for step:', currentStep);
    
    setIsLoading(true);
    try {
      const context: AIContext = {
        currentStep,
        willData,
        userState: willData.personalInfo?.state,
        conversationHistory: []
      };

      const guidance = await aiService.getStepGuidance(context);
      console.log('📋 [AI_ASSISTANT] Received initial guidance:', guidance);
      
      setCurrentGuidance(guidance);
      
      // Add initial AI message
      const aiMessage: AIMessage = {
        role: 'assistant',
        content: guidance.message,
        timestamp: new Date()
      };
      setMessages([aiMessage]);
      console.log('✅ [AI_ASSISTANT] Initial guidance message added to chat');
    } catch (error) {
      console.error('❌ [AI_ASSISTANT] Error loading step guidance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) {
      console.log('⚠️ [AI_ASSISTANT] Cannot send message - empty or loading');
      return;
    }

    console.log('💬 [AI_ASSISTANT] Sending message:', inputMessage);

    const userMessage: AIMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    const messageToSend = inputMessage;
    setLastUserMessage(messageToSend); // Store the user's message
    setInputMessage(''); // Clear input immediately
    setIsLoading(true);

    try {
      const context: AIContext = {
        currentStep,
        willData,
        userState: willData.personalInfo?.state,
        conversationHistory: updatedMessages
      };

      console.log('🤖 [AI_ASSISTANT] Calling AI service with context:', {
        message: messageToSend,
        step: currentStep,
        historyLength: updatedMessages.length
      });

      const response = await aiService.chat(messageToSend, context);
      console.log('📨 [AI_ASSISTANT] Received AI response:', response);
      
      const aiMessage: AIMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      };

      console.log('📝 [AI_ASSISTANT] Adding AI response to messages');
      setMessages(prev => {
        const newMessages = [...prev, aiMessage];
        console.log('📋 [AI_ASSISTANT] Updated messages array length:', newMessages.length);
        return newMessages;
      });
      
      // THIS IS THE KEY FIX: Force update the guidance panel
      console.log('🔄 [AI_ASSISTANT] FORCE UPDATING current guidance with new response');
      console.log('🔍 [AI_ASSISTANT] New guidance will be:', response.message);
      setCurrentGuidance({
        ...response,
        message: response.message // Ensure the message is properly set
      });
      
    } catch (error) {
      console.error('❌ [AI_ASSISTANT] Error sending message:', error);
      
      const errorMessage: AIMessage = {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again or continue with your will creation.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      console.log('🏁 [AI_ASSISTANT] Message sending completed');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    console.log('💡 [AI_ASSISTANT] Suggestion clicked:', suggestion);
    onSuggestionClick?.(suggestion);
    
    // Also send the suggestion as a message to get AI response
    setInputMessage(suggestion);
    setTimeout(() => sendMessage(), 100);
  };

  const validateCurrentStep = async () => {
    console.log('✅ [AI_ASSISTANT] Validating current step');
    
    setIsLoading(true);
    try {
      const context: AIContext = {
        currentStep,
        willData,
        userState: willData.personalInfo?.state,
        conversationHistory: messages
      };

      const validation = await aiService.validateStep(context);
      
      const aiMessage: AIMessage = {
        role: 'assistant',
        content: validation.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setCurrentGuidance(validation);
    } catch (error) {
      console.error('❌ [AI_ASSISTANT] Error validating step:', error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log('🔍 [AI_ASSISTANT] Current component state:', {
    currentStep,
    messagesCount: messages.length,
    hasGuidance: !!currentGuidance,
    guidanceMessage: currentGuidance?.message?.substring(0, 100) + '...',
    isLoading,
    lastUserMessage,
    inputMessage: inputMessage.substring(0, 50) + (inputMessage.length > 50 ? '...' : '')
  });

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Bot className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">AI Estate Planning Assistant</h3>
          <p className="text-sm text-gray-600">Powered by Claude Sonnet • Step {currentStep}/6</p>
        </div>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading && (
          <div className="text-center text-gray-500 py-8">
            <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>AI Assistant is loading...</p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2">
              <Loader className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-sm text-gray-600">AI is thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Current Guidance Panel - THIS IS THE KEY SECTION */}
      {currentGuidance && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          {/* Main Guidance Message - PROMINENTLY DISPLAYED */}
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Bot className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  Current AI Guidance
                  {lastUserMessage && (
                    <span className="text-xs font-normal text-blue-600 bg-blue-200 px-2 py-1 rounded">
                      Responding to: "{lastUserMessage.substring(0, 30)}..."
                    </span>
                  )}
                </h4>
                <p className="text-sm text-blue-700 leading-relaxed font-medium">
                  {currentGuidance.message}
                </p>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          {currentGuidance.suggestions && currentGuidance.suggestions.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">Suggestions</span>
              </div>
              <div className="space-y-1">
                {currentGuidance.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="block w-full text-left text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"
                  >
                    • {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {currentGuidance.warnings && currentGuidance.warnings.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-gray-700">Important Notes</span>
              </div>
              <div className="space-y-1">
                {currentGuidance.warnings.map((warning, index) => (
                  <p key={index} className="text-xs text-red-700 bg-red-50 p-2 rounded">
                    • {warning}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Next Steps */}
          {currentGuidance.nextSteps && currentGuidance.nextSteps.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Next Steps</span>
              </div>
              <div className="space-y-1">
                {currentGuidance.nextSteps.map((step, index) => (
                  <p key={index} className="text-xs text-green-700 bg-green-50 p-2 rounded">
                    • {step}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Validate Button */}
          <button
            onClick={validateCurrentStep}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Validate Current Step
          </button>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your digital will..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send • AI responses are for guidance only
        </p>
      </div>
    </div>
  );
}