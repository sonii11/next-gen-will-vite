import React, { useState } from 'react';
import { Wallet, Link, Database, Edit, Key, ArrowRight, AlertTriangle, Shield, Lightbulb } from 'lucide-react';
import { AIAssistant } from '../ui/AIAssistant';

interface CryptoSetupProps {
  onNext: () => void;
}

export function CryptoSetup({ onNext }: CryptoSetupProps) {
  const [cryptoType, setCryptoType] = useState('');
  const [walletType, setWalletType] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [instructions, setInstructions] = useState({
    recoveryPhrase: '',
    hardwareAccess: '',
    exchangeDetails: '',
    specialInstructions: ''
  });

  const handleInstructionChange = (field: string, value: string) => {
    setInstructions(prev => ({ ...prev, [field]: value }));
  };

  const handleAISuggestion = (suggestion: string) => {
    console.log('💡 [CRYPTO_SETUP] AI suggestion clicked:', suggestion);
    // Handle AI suggestions for crypto setup
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Warning Banner */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-800">Critical: ~20% of Bitcoin is lost forever</h4>
                <p className="text-red-700 text-sm mt-1">
                  Without proper planning, your crypto could be inaccessible to your family. Let's prevent that.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Wallet Detection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Wallet className="w-6 h-6 text-orange-600" />
                Wallet Detection
              </h3>
              <div className="space-y-4">
                <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all group">
                  <Link className="w-8 h-8 text-gray-400 group-hover:text-orange-500 mx-auto mb-2 transition-colors" />
                  <div className="text-sm font-medium">Connect MetaMask Wallet</div>
                  <div className="text-xs text-gray-500">Automatically detect your holdings</div>
                </button>
                
                <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group">
                  <Database className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2 transition-colors" />
                  <div className="text-sm font-medium">Connect Coinbase Account</div>
                  <div className="text-xs text-gray-500">Import exchange holdings</div>
                </button>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    We never store your private keys or passwords
                  </p>
                </div>
              </div>
            </div>

            {/* Manual Entry */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Edit className="w-6 h-6 text-blue-600" />
                Manual Entry
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cryptocurrency Type</label>
                  <select 
                    value={cryptoType}
                    onChange={(e) => setCryptoType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select cryptocurrency</option>
                    <option value="bitcoin">Bitcoin (BTC)</option>
                    <option value="ethereum">Ethereum (ETH)</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Type</label>
                  <select 
                    value={walletType}
                    onChange={(e) => setWalletType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select wallet type</option>
                    <option value="hardware">Hardware Wallet (Ledger, Trezor)</option>
                    <option value="software">Software Wallet</option>
                    <option value="exchange">Exchange Account</option>
                    <option value="paper">Paper Wallet</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Value (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="$0"
                    value={estimatedValue}
                    onChange={(e) => setEstimatedValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Access Instructions */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Key className="w-6 h-6 text-purple-600" />
              Access Instructions for Your Family
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Where are your recovery phrases stored?</label>
                <textarea 
                  placeholder="Example: Hardware wallet recovery sheet in safe deposit box at Chase Bank, box #1234"
                  value={instructions.recoveryPhrase}
                  onChange={(e) => handleInstructionChange('recoveryPhrase', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg h-20 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">How should they access your hardware wallet?</label>
                <textarea 
                  placeholder="Example: Ledger device in bedroom safe, PIN is birth year + marriage year"
                  value={instructions.hardwareAccess}
                  onChange={(e) => handleInstructionChange('hardwareAccess', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg h-20 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exchange account details</label>
                <textarea 
                  placeholder="Example: Coinbase account login saved in 1Password, 2FA backup codes in safe"
                  value={instructions.exchangeDetails}
                  onChange={(e) => handleInstructionChange('exchangeDetails', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg h-20 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special instructions</label>
                <textarea 
                  placeholder="Example: Contact my friend John Doe (crypto expert) at john@email.com for technical help"
                  value={instructions.specialInstructions}
                  onChange={(e) => handleInstructionChange('specialInstructions', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg h-20 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Pro Tips */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Pro Tips for Crypto Inheritance:
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Test your recovery process with small amounts</li>
                <li>• Store backup information in multiple secure locations</li>
                <li>• Consider multi-signature wallets for large amounts</li>
                <li>• Appoint a tech-savvy digital executor</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={onNext}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all inline-flex items-center gap-2"
            >
              Continue to Beneficiaries <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI Assistant Sidebar */}
        <div className="lg:col-span-1">
          <AIAssistant 
            currentStep={3}
            onSuggestionClick={handleAISuggestion}
            className="sticky top-4"
          />
        </div>
      </div>
    </div>
  );
}