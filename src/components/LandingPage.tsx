import React from 'react';
import { CheckCircle, Brain, Bitcoin, ShieldCheck, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center text-white mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Estate Planning That Actually
            <br />
            <span className="text-yellow-300">Gets Your Digital Life</span>
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto mb-8 leading-relaxed">
            Finally, a will that understands crypto wallets, cloud storage, and digital assets. 
            Built for the generation that lives online.
          </p>
          
          {/* Value Props */}
          <div className="flex flex-col md:flex-row gap-6 justify-center text-lg mb-12 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0" />
              <span className="font-medium">90% Cheaper: $49 vs $1,500+ lawyer fees</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0" />
              <span className="font-medium">95% Faster: 15 minutes vs weeks</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0" />
              <span className="font-medium">100% Digital: Crypto, cloud, social covered</span>
            </div>
          </div>
          
          <button 
            onClick={onGetStarted}
            className="bg-yellow-400 text-black px-8 py-4 text-xl font-semibold rounded-xl hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg inline-flex items-center gap-3 group"
          >
            Create Your Digital Will in 15 Minutes
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-sm opacity-75 mt-4">Join 10,000+ digital natives who've taken control</p>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 text-white max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/15 transition-all">
            <Brain className="w-12 h-12 text-yellow-300 mb-6" />
            <h3 className="text-2xl font-semibold mb-4">AI-Powered Guidance</h3>
            <p className="opacity-90 text-lg leading-relaxed">
              Conversational AI explains legal concepts in plain English, no confusing jargon. 
              Like having a tech-savvy lawyer who actually gets your lifestyle.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/15 transition-all">
            <Bitcoin className="w-12 h-12 text-yellow-300 mb-6" />
            <h3 className="text-2xl font-semibold mb-4">Crypto Native</h3>
            <p className="opacity-90 text-lg leading-relaxed">
              Built-in support for Bitcoin, Ethereum, NFTs, and hardware wallets. 
              We speak DeFi, not just traditional finance.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/15 transition-all">
            <ShieldCheck className="w-12 h-12 text-yellow-300 mb-6" />
            <h3 className="text-2xl font-semibold mb-4">Bank-Level Security</h3>
            <p className="opacity-90 text-lg leading-relaxed">
              AES-256 encryption with emergency access protocols for your family. 
              Your digital legacy is safe with us.
            </p>
          </div>
        </div>

        {/* Social Proof Section */}
        <div className="text-center mt-20 text-white">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold mb-6">Why Digital Natives Choose NextGenWill</h3>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-yellow-300 mb-2">10,000+</div>
                <div className="text-lg opacity-90">Wills Created</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-yellow-300 mb-2">$50M+</div>
                <div className="text-lg opacity-90">Digital Assets Protected</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-yellow-300 mb-2">4.9★</div>
                <div className="text-lg opacity-90">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}