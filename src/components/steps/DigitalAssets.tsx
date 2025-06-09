import React, { useEffect } from "react";
import {
  Bitcoin,
  Cloud,
  Users,
  Briefcase,
  ArrowRight,
  Info,
  TrendingUp,
} from "lucide-react";
import { useWillStore } from "../../store/willStore";
import { AIAssistant } from "../ui/AIAssistant";
import { useDebouncedInput } from "../../hooks/useDebounce";

interface DigitalAssetsProps {
  onNext: () => void;
}

export function DigitalAssets({ onNext }: DigitalAssetsProps) {
  const { willData, updateDigitalAssets } = useWillStore();

  // Use the debounced input hook for selected assets
  const { value: selectedAssets, setValue: setSelectedAssetsImmediate } =
    useDebouncedInput<string[]>(
      willData.digitalAssets?.selectedCategories || [],
      (debouncedValue) => {
        console.log(
          "🔄 [DIGITAL_ASSETS] Debounced update of selected assets:",
          debouncedValue
        );
        updateDigitalAssets({ selectedCategories: debouncedValue });
      },
      500 // 500ms debounce delay
    );

  const toggleAsset = (assetId: string) => {
    console.log("🔄 [DIGITAL_ASSETS] Toggling asset:", assetId);

    const newSelectedAssets = selectedAssets.includes(assetId)
      ? selectedAssets.filter((id) => id !== assetId)
      : [...selectedAssets, assetId];

    console.log("📝 [DIGITAL_ASSETS] New selected assets:", newSelectedAssets);

    setSelectedAssetsImmediate(newSelectedAssets);
  };

  const handleAISuggestion = (suggestion: string) => {
    console.log("💡 [DIGITAL_ASSETS] AI suggestion clicked:", suggestion);
    // Handle AI suggestions - could auto-select relevant assets or provide guidance
  };

  const assetCategories = [
    {
      id: "crypto",
      title: "Cryptocurrency",
      icon: Bitcoin,
      color: "orange",
      assets: [
        { id: "bitcoin", label: "Bitcoin (BTC)" },
        { id: "ethereum", label: "Ethereum (ETH)" },
        { id: "other-crypto", label: "Other cryptocurrencies" },
      ],
      description: "Hardware wallets, exchange accounts, DeFi positions",
    },
    {
      id: "cloud",
      title: "Cloud Storage",
      icon: Cloud,
      color: "blue",
      assets: [
        { id: "google-drive", label: "Google Drive" },
        { id: "dropbox", label: "Dropbox" },
        { id: "icloud", label: "iCloud" },
        { id: "onedrive", label: "OneDrive" },
      ],
      description: "Photos, documents, backup files",
    },
    {
      id: "social",
      title: "Social Media",
      icon: Users,
      color: "pink",
      assets: [
        { id: "facebook", label: "Facebook / Meta" },
        { id: "instagram", label: "Instagram" },
        { id: "twitter", label: "Twitter / X" },
        { id: "linkedin", label: "LinkedIn" },
      ],
      description: "Digital memories and professional profiles",
    },
    {
      id: "business",
      title: "Digital Business",
      icon: Briefcase,
      color: "green",
      assets: [
        { id: "domains", label: "Domain names" },
        { id: "ecommerce", label: "Online store / ecommerce" },
        { id: "saas", label: "SaaS products" },
        { id: "subscriptions", label: "Digital subscriptions" },
      ],
      description: "Revenue-generating digital assets",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      orange:
        "bg-orange-100 text-orange-600 border-orange-200 hover:bg-orange-200",
      blue: "bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200",
      pink: "bg-pink-100 text-pink-600 border-pink-200 hover:bg-pink-200",
      green: "bg-green-100 text-green-600 border-green-200 hover:bg-green-200",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const handleContinue = () => {
    console.log(
      "🚀 [DIGITAL_ASSETS] Continue button clicked, selected assets:",
      selectedAssets
    );

    if (selectedAssets.length > 0) {
      console.log(
        "✅ [DIGITAL_ASSETS] Assets selected, proceeding to next step"
      );
      onNext();
    } else {
      console.log(
        "❌ [DIGITAL_ASSETS] No assets selected, staying on current step"
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="text-center mb-8">
            <p className="text-lg text-gray-600 mb-6">
              Most people have more digital assets than they realize. Let's make
              sure we don't miss anything important.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {assetCategories.map((category) => {
              const IconComponent = category.icon;

              return (
                <div
                  key={category.id}
                  className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200 hover:border-gray-300 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(
                        category.color
                      )}`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {category.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {category.assets.map((asset) => (
                      <label
                        key={asset.id}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={(e) => {
                          // Prevent event bubbling to parent elements
                          e.stopPropagation();
                        }}
                      >
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          checked={selectedAssets.includes(asset.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            console.log(
                              `📋 [DIGITAL_ASSETS] Checkbox changed for ${asset.id}:`,
                              e.target.checked
                            );
                            toggleAsset(asset.id);
                          }}
                        />
                        <span className="text-gray-700">{asset.label}</span>
                      </label>
                    ))}

                    {category.id === "crypto" && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700 flex items-start gap-2">
                          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>
                            <strong>Critical:</strong> ~20% of Bitcoin is lost
                            forever due to poor inheritance planning
                          </span>
                        </p>
                      </div>
                    )}

                    {category.id === "business" && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700 flex items-start gap-2">
                          <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>
                            Digital businesses can be worth significant value
                            and generate ongoing revenue
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary and Continue */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Selected Digital Assets
                </h3>
                <p className="text-gray-600">
                  {selectedAssets.length > 0
                    ? `${selectedAssets.length} assets selected`
                    : "Select the digital assets you own"}
                </p>
                {selectedAssets.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedAssets.map((assetId) => {
                      // Find the asset label from all categories
                      let assetLabel = "";
                      assetCategories.forEach((category) => {
                        const asset = category.assets.find(
                          (a) => a.id === assetId
                        );
                        if (asset) {
                          assetLabel = asset.label;
                        }
                      });

                      return (
                        <span
                          key={assetId}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {assetLabel}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
              <button
                onClick={handleContinue}
                disabled={selectedAssets.length === 0}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all inline-flex items-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* AI Assistant Sidebar */}
        <div className="lg:col-span-1">
          <AIAssistant
            currentStep={2}
            onSuggestionClick={handleAISuggestion}
            className="sticky top-4"
          />
        </div>
      </div>
    </div>
  );
}
