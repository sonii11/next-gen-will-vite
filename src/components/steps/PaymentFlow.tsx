import React, { useState } from 'react';
import { CreditCard, Shield, Lock, RotateCcw, Star, CheckCircle, Zap } from 'lucide-react';

export function PaymentFlow() {
  const [selectedPlan, setSelectedPlan] = useState<'onetime' | 'annual'>('annual');
  const [formData, setFormData] = useState({
    email: '',
    agreeToTerms: false
  });

  const plans = {
    onetime: {
      price: 49,
      title: 'One-Time',
      description: 'Complete digital will creation',
      features: [
        'Complete digital will',
        'Secure encrypted storage',
        'Emergency access setup',
        'Crypto inheritance planning',
        '30-day money back guarantee'
      ],
      comparison: 'vs $1,500+ with lawyers'
    },
    annual: {
      price: 99,
      title: 'Annual Plan',
      description: 'Everything + ongoing updates',
      features: [
        'Everything in One-Time',
        'Annual will updates',
        'New features included',
        'Priority support',
        'Digital asset monitoring',
        '7-day free trial'
      ],
      comparison: 'Best for growing digital assets',
      recommended: true
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Secure Your Digital Will</h2>
        <p className="text-lg text-gray-600 mb-6">
          Choose your plan and complete your estate planning journey
        </p>
        
        {/* Value Reminder */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium">90% cheaper than lawyers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium">15 minutes vs weeks</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium">Crypto-native design</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Options */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* One-Time Plan */}
        <div 
          className={`bg-white rounded-xl shadow-lg p-6 border-2 cursor-pointer transition-all ${
            selectedPlan === 'onetime' 
              ? 'border-blue-500 ring-2 ring-blue-200' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setSelectedPlan('onetime')}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <input 
                type="radio" 
                name="plan" 
                checked={selectedPlan === 'onetime'}
                onChange={() => setSelectedPlan('onetime')}
                className="w-4 h-4 text-blue-600"
              />
              <h3 className="text-xl font-semibold">One-Time Payment</h3>
            </div>
            
            <div className="text-4xl font-bold text-blue-600 mb-2">${plans.onetime.price}</div>
            <p className="text-gray-600 mb-4">{plans.onetime.description}</p>
            
            <ul className="text-sm text-gray-600 space-y-2 mb-4 text-left">
              {plans.onetime.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="text-xs text-gray-500">{plans.onetime.comparison}</div>
          </div>
        </div>

        {/* Annual Plan */}
        <div 
          className={`bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white relative cursor-pointer transition-all ${
            selectedPlan === 'annual' ? 'ring-4 ring-yellow-300' : ''
          }`}
          onClick={() => setSelectedPlan('annual')}
        >
          <div className="absolute top-3 right-3 bg-yellow-400 text-black text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
            <Star className="w-3 h-3" />
            RECOMMENDED
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <input 
                type="radio" 
                name="plan" 
                checked={selectedPlan === 'annual'}
                onChange={() => setSelectedPlan('annual')}
                className="w-4 h-4 text-yellow-400"
              />
              <h3 className="text-xl font-semibold">Annual Plan</h3>
            </div>
            
            <div className="text-4xl font-bold mb-2">
              ${plans.annual.price}
              <span className="text-lg opacity-90">/year</span>
            </div>
            <p className="opacity-90 mb-4">{plans.annual.description}</p>
            
            <ul className="text-sm space-y-2 mb-4 opacity-90 text-left">
              {plans.annual.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-300 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="text-xs opacity-75">{plans.annual.comparison}</div>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          Payment Information
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input 
              type="email" 
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">We'll send your will and access instructions here</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Card Information</label>
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
              <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Secure payment powered by Stripe</span>
              </div>
              <p className="text-xs text-gray-400">Your payment information is encrypted and secure</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <input 
              type="checkbox" 
              id="terms"
              checked={formData.agreeToTerms}
              onChange={(e) => setFormData(prev => ({...prev, agreeToTerms: e.target.checked}))}
              className="w-4 h-4 text-blue-600 mt-0.5"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the{' '}
              <a href="#" className="text-blue-600 hover:underline font-medium">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-blue-600 hover:underline font-medium">Privacy Policy</a>. 
              I understand my will will be legally binding and stored securely.
            </label>
          </div>
        </div>

        <button 
          disabled={!formData.email || !formData.agreeToTerms}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all mt-6 font-semibold text-lg flex items-center justify-center gap-2"
        >
          <Zap className="w-5 h-5" />
          Complete Payment & Secure Will - ${plans[selectedPlan].price}
        </button>

        {/* Trust Signals */}
        <div className="text-center mt-4">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-1">
              <Lock className="w-4 h-4" />
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-1">
              <RotateCcw className="w-4 h-4" />
              <span>30-Day Guarantee</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-400">
            Payments processed securely. No card details stored on our servers.
          </p>
        </div>
      </div>

      {/* Final Trust Signals & Social Proof */}
      <div className="text-center space-y-4">
        <div className="text-sm text-gray-600">
          Trusted by <span className="font-semibold">10,000+ digital natives</span> worldwide
        </div>
        
        <div className="flex justify-center gap-8 items-center opacity-60 text-sm">
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            <span>SOC 2 Compliant</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>4.9/5 Rating</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Legal Team Approved</span>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Protected by 30-Day Money-Back Guarantee</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            If you're not completely satisfied, we'll refund your payment in full.
          </p>
        </div>
      </div>
    </div>
  );
}