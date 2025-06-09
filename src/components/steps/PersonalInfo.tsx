import { useState } from "react";
import { Bot, ArrowRight, TrendingUp, Clock } from "lucide-react";
import { US_STATES_AND_TERRITORIES } from "../../types/states";
import { useWillStore } from "../../store/willStore";
import { AIAssistant } from "../ui/AIAssistant";
import { useDebouncedInput, sanitizeString } from "../../hooks/useDebounce";

interface PersonalInfoProps {
  onNext: () => void;
}

export function PersonalInfo({ onNext }: PersonalInfoProps) {
  const { willData, updatePersonalInfo } = useWillStore();
  const [showNextMessage, setShowNextMessage] = useState(false);

  // Use the debounced input hook for the full name field
  const { value: fullName, setValue: setFullName } = useDebouncedInput(
    willData.personalInfo?.fullName || "",
    (debouncedValue) => {
      console.log(
        `🔄 [PERSONAL_INFO] Field "fullName" debounced update:`,
        debouncedValue
      );
      updatePersonalInfo({ fullName: debouncedValue });
    },
    500, // 500ms debounce delay
    sanitizeString // Apply sanitization
  );

  // Use the debounced input hook for the state field
  const { value: state, setValue: setState } = useDebouncedInput(
    willData.personalInfo?.state || "",
    (debouncedValue) => {
      console.log(
        `🔄 [PERSONAL_INFO] Field "state" debounced update:`,
        debouncedValue
      );
      updatePersonalInfo({ state: debouncedValue });
    },
    500, // 500ms debounce delay
    sanitizeString // Apply sanitization
  );

  const handleInputChange = (field: string, value: string) => {
    console.log(`🔄 [PERSONAL_INFO] Field "${field}" changed to:`, value);

    if (field === "fullName") {
      setFullName(value);
    } else if (field === "state") {
      setState(value);
    }
  };

  const handleContinue = () => {
    console.log("🚀 [PERSONAL_INFO] Continue button clicked with data:", {
      fullName,
      state,
    });

    if (fullName && state) {
      console.log("✅ [PERSONAL_INFO] Form data valid, showing next message");
      setShowNextMessage(true);
      setTimeout(() => {
        console.log("🎯 [PERSONAL_INFO] Proceeding to next step");
        onNext();
      }, 2000);
    } else {
      console.log("❌ [PERSONAL_INFO] Form data incomplete");
    }
  };

  const handleAISuggestion = (suggestion: string) => {
    console.log("💡 [PERSONAL_INFO] AI suggestion clicked:", suggestion);
    // Handle AI suggestions - could auto-fill fields or provide guidance
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="space-y-6">
              {/* AI Assistant Messages */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="bg-blue-50 rounded-xl p-4 mb-4">
                    <p className="text-gray-800">
                      Hi! I'm your AI estate planning assistant powered by
                      Claude Sonnet. I'm here to make this process as simple as
                      possible. Let's start with the basics.
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-gray-800">
                      What's your name, and what state do you live in? This
                      helps me understand which laws apply to your will and
                      ensure everything is legally compliant.
                    </p>
                  </div>
                </div>
              </div>

              {/* User Input Form */}
              <div className="ml-16 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full legal name as it appears on official documents"
                    value={fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use your name exactly as it appears on your driver's license
                    or passport
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State of Residence
                  </label>
                  <select
                    value={state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select your state or territory</option>
                    {US_STATES_AND_TERRITORIES.map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    This determines which state laws apply to your will
                  </p>
                </div>
              </div>

              {/* AI Response Message */}
              {showNextMessage && (
                <div className="flex items-start gap-4 animate-fade-in">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-gray-800">
                        Perfect! Now let's discover your digital assets. Most
                        people have more than they realize. Let's make sure we
                        don't miss anything important for your digital legacy.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Continue Button */}
              <div className="ml-16">
                <button
                  onClick={handleContinue}
                  disabled={!fullName || !state}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all inline-flex items-center gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>

                {(!fullName || !state) && (
                  <p className="text-sm text-gray-500 mt-2">
                    Please complete both fields to continue
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-blue-600">15 min</div>
              <div className="text-sm text-gray-600">
                Average completion time
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-2xl font-bold text-green-600">$49</div>
              <div className="text-sm text-gray-600">
                vs $1,500+ with lawyers
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-purple-600">50+</div>
              <div className="text-sm text-gray-600">
                Digital asset types supported
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant Sidebar */}
        <div className="lg:col-span-1">
          <AIAssistant
            currentStep={1}
            onSuggestionClick={handleAISuggestion}
            className="sticky top-4"
          />
        </div>
      </div>
    </div>
  );
}
