import { WillData } from '../types/will';
import { getStateByCode } from '../types/states';

interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIContext {
  currentStep: number;
  willData: Partial<WillData>;
  userState?: string;
  conversationHistory: AIMessage[];
}

interface AIResponse {
  message: string;
  suggestions?: string[];
  warnings?: string[];
  nextSteps?: string[];
  confidence: number;
}

interface LegalRequirement {
  state: string;
  requirements: string[];
  warnings: string[];
  recommendations: string[];
}

class AIService {
  private apiKey: string;
  private baseUrl = 'https://api.anthropic.com/v1/messages';
  private model = 'claude-3-5-sonnet-20241022';
  
  // Legal knowledge base for state-specific requirements
  private legalKnowledgeBase: Record<string, LegalRequirement> = {
    'CA': {
      state: 'California',
      requirements: [
        'Will must be signed by testator in presence of two witnesses',
        'Witnesses must sign in presence of testator and each other',
        'Digital assets require specific authorization language',
        'Executor must be explicitly granted digital asset access rights'
      ],
      warnings: [
        'California has specific rules for cryptocurrency inheritance',
        'Social media accounts may require additional documentation',
        'Cloud storage access may be limited by terms of service'
      ],
      recommendations: [
        'Consider creating a separate digital asset inventory',
        'Appoint a tech-savvy digital executor',
        'Include specific language for cryptocurrency wallets'
      ]
    },
    'NY': {
      state: 'New York',
      requirements: [
        'Will must be signed by testator and two witnesses',
        'Digital assets covered under RUFADAA (Revised Uniform Fiduciary Access to Digital Assets Act)',
        'Executor needs explicit authorization for digital accounts',
        'Cryptocurrency requires specific handling instructions'
      ],
      warnings: [
        'New York has strict requirements for digital asset access',
        'Some platforms may not honor executor requests without court orders',
        'Cryptocurrency exchanges may have additional verification requirements'
      ],
      recommendations: [
        'Include detailed access instructions for each digital platform',
        'Consider using a digital estate planning service',
        'Document all cryptocurrency wallet locations and access methods'
      ]
    },
    // Add more states as needed
    'DEFAULT': {
      state: 'General',
      requirements: [
        'Will must be properly signed and witnessed according to state law',
        'Digital assets should be explicitly mentioned',
        'Executor should have clear authority over digital property',
        'Access instructions should be stored securely'
      ],
      warnings: [
        'State laws vary significantly for digital asset inheritance',
        'Platform terms of service may restrict access',
        'Cryptocurrency requires special handling'
      ],
      recommendations: [
        'Consult with a local estate planning attorney',
        'Keep digital asset inventory updated',
        'Ensure executor has technical knowledge'
      ]
    }
  };

  constructor() {
    this.apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('⚠️ [AI_SERVICE] Anthropic API key not found. AI features will use mock responses.');
    }
  }

  // Main AI chat interface
  async chat(message: string, context: AIContext): Promise<AIResponse> {
    console.log('🤖 [AI_SERVICE] Processing chat message:', { message, step: context.currentStep });

    try {
      if (!this.apiKey) {
        console.log('🎭 [AI_SERVICE] No API key, using mock response');
        return this.getContextualMockResponse(message, context);
      }

      const systemPrompt = this.buildSystemPrompt(context);
      const userPrompt = this.buildUserPrompt(message, context);

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 1000,
          messages: [
            { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = data.content[0].text;

      console.log('✅ [AI_SERVICE] AI response received');
      
      return this.parseAIResponse(aiMessage, context);
    } catch (error) {
      console.error('❌ [AI_SERVICE] Error in chat:', error);
      return this.getContextualMockResponse(message, context);
    }
  }

  // Get contextual guidance for current step
  async getStepGuidance(context: AIContext): Promise<AIResponse> {
    console.log('📋 [AI_SERVICE] Getting step guidance for step:', context.currentStep);

    const stepMessages = {
      1: "Let's start with your basic information. I need your full legal name and state of residence to ensure your will complies with local laws.",
      2: "Now let's discover your digital assets. Most people have more than they realize - from crypto wallets to cloud storage and social media accounts.",
      3: "Cryptocurrency requires special handling in estate planning. Let's set up proper access instructions for your digital wallets.",
      4: "Time to designate your beneficiaries and digital executor. This person will handle your digital assets according to your wishes.",
      5: "Let's review your complete will to ensure everything is accurate and legally compliant.",
      6: "Almost done! Let's secure your digital will with payment and final setup."
    };

    const message = stepMessages[context.currentStep as keyof typeof stepMessages] || "Let's continue with your digital will.";
    
    return {
      message,
      suggestions: await this.getStepSuggestions(context),
      warnings: await this.getStepWarnings(context),
      nextSteps: await this.getNextSteps(context),
      confidence: 0.95
    };
  }

  // Validate current step data
  async validateStep(context: AIContext): Promise<AIResponse> {
    console.log('✅ [AI_SERVICE] Validating step:', context.currentStep);

    const validation = await this.performStepValidation(context);
    
    return {
      message: validation.isValid 
        ? "Great! Your information looks complete and accurate. Ready to continue?"
        : "I noticed a few things that need attention before we proceed.",
      suggestions: validation.suggestions,
      warnings: validation.warnings,
      nextSteps: validation.isValid ? ["Continue to next step"] : validation.fixes,
      confidence: validation.confidence
    };
  }

  // Review complete will for legal compliance
  async reviewWill(willData: Partial<WillData>): Promise<AIResponse> {
    console.log('⚖️ [AI_SERVICE] Reviewing complete will for legal compliance');

    const review = await this.performLegalReview(willData);
    
    return {
      message: review.overallAssessment,
      suggestions: review.improvements,
      warnings: review.legalIssues,
      nextSteps: review.recommendations,
      confidence: review.confidence
    };
  }

  // Get state-specific legal requirements
  getStateLegalRequirements(stateCode: string): LegalRequirement {
    console.log('📜 [AI_SERVICE] Getting legal requirements for state:', stateCode);
    
    const state = getStateByCode(stateCode as any);
    const stateName = state?.name || 'Unknown';
    
    return this.legalKnowledgeBase[stateCode] || {
      ...this.legalKnowledgeBase.DEFAULT,
      state: stateName
    };
  }

  // Private helper methods
  private buildSystemPrompt(context: AIContext): string {
    const stateInfo = context.userState ? this.getStateLegalRequirements(context.userState) : null;
    
    return `You are an expert AI estate planning assistant specializing in digital asset inheritance. You help users create legally compliant digital wills.

Current Context:
- Step: ${context.currentStep}/6
- User State: ${stateInfo?.state || 'Not specified'}
- Digital Assets: ${Object.keys(context.willData.digitalAssets?.selectedCategories || []).length} categories selected

Your Role:
- Provide clear, helpful guidance in plain English
- Ensure legal compliance with state laws
- Explain complex concepts simply
- Identify potential issues early
- Be encouraging and supportive
- Answer specific questions directly and contextually

${stateInfo ? `
State-Specific Requirements for ${stateInfo.state}:
${stateInfo.requirements.map(req => `- ${req}`).join('\n')}

Warnings:
${stateInfo.warnings.map(warn => `- ${warn}`).join('\n')}
` : ''}

Keep responses concise, helpful, and encouraging. Focus on the user's immediate needs and answer their specific questions.`;
  }

  private buildUserPrompt(message: string, context: AIContext): string {
    const recentHistory = context.conversationHistory.slice(-3).map(msg => 
      `${msg.role}: ${msg.content}`
    ).join('\n');

    return `User message: "${message}"

Recent conversation:
${recentHistory}

Current will data: ${JSON.stringify(context.willData, null, 2)}

Please provide a helpful, contextual response to their specific question or message. Do not repeat generic guidance unless specifically asked.`;
  }

  private parseAIResponse(aiMessage: string, context: AIContext): AIResponse {
    // Parse the AI response and extract structured information
    // This is a simplified parser - in production, you'd want more sophisticated parsing
    
    const lines = aiMessage.split('\n').filter(line => line.trim());
    const message = lines[0] || aiMessage;
    
    const suggestions: string[] = [];
    const warnings: string[] = [];
    const nextSteps: string[] = [];
    
    // Extract structured information from AI response
    lines.forEach(line => {
      if (line.toLowerCase().includes('suggest') || line.toLowerCase().includes('recommend')) {
        suggestions.push(line.replace(/^[•\-\*]\s*/, ''));
      } else if (line.toLowerCase().includes('warning') || line.toLowerCase().includes('caution')) {
        warnings.push(line.replace(/^[•\-\*]\s*/, ''));
      } else if (line.toLowerCase().includes('next') || line.toLowerCase().includes('step')) {
        nextSteps.push(line.replace(/^[•\-\*]\s*/, ''));
      }
    });

    return {
      message,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
      nextSteps: nextSteps.length > 0 ? nextSteps : undefined,
      confidence: 0.9
    };
  }

  private async getStepSuggestions(context: AIContext): Promise<string[]> {
    const suggestions: Record<number, string[]> = {
      1: [
        "Use your full legal name exactly as it appears on official documents",
        "Double-check your state selection for accurate legal compliance",
        "Consider any recent moves that might affect your legal residence"
      ],
      2: [
        "Think about all your online accounts, not just the obvious ones",
        "Include subscription services and digital subscriptions",
        "Don't forget about NFTs, domain names, or online businesses"
      ],
      3: [
        "Store recovery phrases in multiple secure locations",
        "Consider using a hardware wallet for large amounts",
        "Document exchange account details and 2FA backup codes"
      ],
      4: [
        "Choose a tech-savvy person as your digital executor",
        "Consider splitting percentages based on beneficiaries' needs",
        "Set up emergency access with appropriate waiting periods"
      ],
      5: [
        "Review all sections carefully for accuracy",
        "Ensure beneficiary percentages add up to 100%",
        "Verify all contact information is current"
      ],
      6: [
        "Choose the plan that best fits your digital asset complexity",
        "Consider annual updates for growing digital portfolios",
        "Review the money-back guarantee terms"
      ]
    };

    return suggestions[context.currentStep] || [];
  }

  private async getStepWarnings(context: AIContext): Promise<string[]> {
    const warnings: Record<number, string[]> = {
      1: [],
      2: [
        "Forgetting digital assets is the #1 cause of lost inheritance",
        "Some platforms may delete inactive accounts"
      ],
      3: [
        "~20% of Bitcoin is lost forever due to poor inheritance planning",
        "Never share private keys or recovery phrases online"
      ],
      4: [
        "Choose someone you trust completely as your digital executor",
        "Ensure your executor understands cryptocurrency if you have any"
      ],
      5: [
        "This will becomes legally binding once completed",
        "Review state-specific requirements carefully"
      ],
      6: []
    };

    return warnings[context.currentStep] || [];
  }

  private async getNextSteps(context: AIContext): Promise<string[]> {
    const nextSteps: Record<number, string[]> = {
      1: ["Complete your personal information", "Proceed to digital asset discovery"],
      2: ["Select all relevant digital asset categories", "Move to cryptocurrency setup"],
      3: ["Document crypto access instructions", "Continue to beneficiary selection"],
      4: ["Designate primary and secondary beneficiaries", "Review your complete will"],
      5: ["Verify all information is accurate", "Proceed to secure payment"],
      6: ["Complete payment to finalize your will", "Download and store your documents"]
    };

    return nextSteps[context.currentStep] || [];
  }

  private async performStepValidation(context: AIContext): Promise<{
    isValid: boolean;
    suggestions: string[];
    warnings: string[];
    fixes: string[];
    confidence: number;
  }> {
    const { currentStep, willData } = context;
    
    switch (currentStep) {
      case 1:
        const hasName = willData.personalInfo?.fullName && willData.personalInfo.fullName.length >= 2;
        const hasState = willData.personalInfo?.state;
        return {
          isValid: !!(hasName && hasState),
          suggestions: hasName && hasState ? ["Information looks complete!"] : [],
          warnings: [],
          fixes: [
            ...(!hasName ? ["Enter your full legal name"] : []),
            ...(!hasState ? ["Select your state of residence"] : [])
          ],
          confidence: 0.95
        };
        
      case 2:
        const hasAssets = willData.digitalAssets?.selectedCategories && willData.digitalAssets.selectedCategories.length > 0;
        return {
          isValid: !!hasAssets,
          suggestions: hasAssets ? ["Good selection of digital assets!"] : [],
          warnings: !hasAssets ? ["Select at least one digital asset category"] : [],
          fixes: !hasAssets ? ["Choose the digital assets you own"] : [],
          confidence: 0.9
        };
        
      case 4:
        const hasPrimary = willData.beneficiaries?.primaryBeneficiary?.name && willData.beneficiaries?.primaryBeneficiary?.email;
        const percentageValid = (willData.beneficiaries?.primaryBeneficiary?.percentage || 0) + 
                               (willData.beneficiaries?.secondaryBeneficiary?.percentage || 0) === 100;
        return {
          isValid: !!(hasPrimary && percentageValid),
          suggestions: hasPrimary && percentageValid ? ["Beneficiary setup looks complete!"] : [],
          warnings: [],
          fixes: [
            ...(!hasPrimary ? ["Complete primary beneficiary information"] : []),
            ...(!percentageValid ? ["Ensure percentages add up to 100%"] : [])
          ],
          confidence: 0.95
        };
        
      default:
        return {
          isValid: true,
          suggestions: ["Step validation not implemented yet"],
          warnings: [],
          fixes: [],
          confidence: 0.8
        };
    }
  }

  private async performLegalReview(willData: Partial<WillData>): Promise<{
    overallAssessment: string;
    improvements: string[];
    legalIssues: string[];
    recommendations: string[];
    confidence: number;
  }> {
    const stateCode = willData.personalInfo?.state;
    const stateReqs = stateCode ? this.getStateLegalRequirements(stateCode) : this.legalKnowledgeBase.DEFAULT;
    
    const issues: string[] = [];
    const improvements: string[] = [];
    const recommendations: string[] = [];
    
    // Check basic requirements
    if (!willData.personalInfo?.fullName) {
      issues.push("Missing testator name");
    }
    
    if (!willData.beneficiaries?.primaryBeneficiary?.name) {
      issues.push("Missing primary beneficiary");
    }
    
    // Check digital asset coverage
    const hasDigitalAssets = willData.digitalAssets?.selectedCategories && willData.digitalAssets.selectedCategories.length > 0;
    if (!hasDigitalAssets) {
      improvements.push("Consider adding digital asset categories");
    }
    
    // Check crypto-specific requirements
    const hasCrypto = willData.digitalAssets?.selectedCategories?.some(cat => 
      ['bitcoin', 'ethereum', 'other-crypto'].includes(cat)
    );
    if (hasCrypto && !willData.cryptoSetup) {
      improvements.push("Add detailed cryptocurrency access instructions");
    }
    
    // Add state-specific recommendations
    recommendations.push(...stateReqs.recommendations);
    
    const overallScore = issues.length === 0 ? (improvements.length === 0 ? 1.0 : 0.8) : 0.6;
    
    return {
      overallAssessment: issues.length === 0 
        ? "Your will meets all basic legal requirements and follows best practices for digital asset inheritance."
        : "Your will has some areas that need attention before it can be considered legally complete.",
      improvements,
      legalIssues: issues,
      recommendations,
      confidence: overallScore
    };
  }

  private getContextualMockResponse(message: string, context: AIContext): AIResponse {
    console.log('🎭 [AI_SERVICE] Using contextual mock response for message:', message);
    console.log('🔍 [AI_SERVICE] Context step:', context.currentStep);
    
    const lowerMessage = message.toLowerCase();
    console.log('🔍 [AI_SERVICE] Lowercase message:', lowerMessage);
    
    // 🎯 HIGHEST PRIORITY: Handle "don't have crypto" or "no crypto" questions FIRST
    // This must be checked BEFORE any general crypto questions
    if (lowerMessage.includes("don't have") && (lowerMessage.includes("crypto") || lowerMessage.includes("bitcoin") || lowerMessage.includes("ethereum"))) {
      console.log('🎯 [AI_SERVICE] ✅ MATCHED: "don\'t have crypto" question - PRIORITY 1');
      return {
        message: "Absolutely! It's perfectly fine if you don't have any cryptocurrency. You can skip the crypto categories entirely. This step is about identifying ALL your digital assets - crypto is just one type. Focus on what you do have: cloud storage, social media accounts, digital subscriptions, or online businesses.",
        suggestions: [
          "Skip crypto categories if you don't have any",
          "Focus on cloud storage and social media accounts",
          "Consider digital subscriptions and online services",
          "Only select what you actually own"
        ],
        confidence: 0.95
      };
    }

    // Handle "no crypto" variations
    if ((lowerMessage.includes("no crypto") || lowerMessage.includes("leave blank")) && 
        (lowerMessage.includes("crypto") || lowerMessage.includes("bitcoin") || lowerMessage.includes("ethereum"))) {
      console.log('🎯 [AI_SERVICE] ✅ MATCHED: "no crypto/leave blank" question - PRIORITY 1B');
      return {
        message: "Yes, absolutely! If you don't have cryptocurrency, just skip those options. This step is about cataloging what you DO have, not what you don't have. Focus on selecting the digital assets you actually own - like cloud storage, social media, or digital subscriptions.",
        suggestions: [
          "Skip any categories you don't have",
          "Only select what applies to you",
          "Focus on cloud storage and social accounts"
        ],
        confidence: 0.95
      };
    }

    // Handle "ok to" questions about crypto
    if (lowerMessage.includes("ok to") && (lowerMessage.includes("crypto") || lowerMessage.includes("bitcoin"))) {
      console.log('🎯 [AI_SERVICE] ✅ MATCHED: "ok to" crypto question - PRIORITY 1C');
      return {
        message: "Yes, it's completely okay! You only need to select the digital assets you actually have. If you don't have cryptocurrency, don't select those options. This step is about identifying your real digital property, not forcing you to have things you don't own.",
        suggestions: [
          "Only select what you actually own",
          "Skip categories that don't apply",
          "Focus on your real digital assets"
        ],
        confidence: 0.95
      };
    }
    
    // PRIORITY 2: Handle questions about what information is needed
    if (lowerMessage.includes('what information') || lowerMessage.includes('what do you need')) {
      console.log('🎯 [AI_SERVICE] ✅ MATCHED: "what information" question');
      if (context.currentStep === 2) {
        return {
          message: "For digital assets, I need to know what types of online accounts and digital property you have. This includes cloud storage (Google Drive, Dropbox), social media accounts, cryptocurrency (if any), and digital businesses. Don't worry if you don't have everything - just select what applies to you.",
          suggestions: [
            "Select only the categories that apply to you",
            "Think about all your online accounts",
            "It's okay to skip categories you don't have"
          ],
          confidence: 0.9
        };
      }
      return {
        message: "I need your full legal name and the state where you live. This helps me ensure your will follows the correct laws for your location. Your name should match what's on your official documents like your driver's license.",
        suggestions: ["Enter your name exactly as it appears on official documents", "Select your current state of residence"],
        confidence: 0.9
      };
    }
    
    // PRIORITY 3: Handle questions about requirements or what's needed
    if (lowerMessage.includes('required') || lowerMessage.includes('mandatory') || lowerMessage.includes('must have')) {
      console.log('🎯 [AI_SERVICE] ✅ MATCHED: "required" question');
      if (context.currentStep === 2) {
        return {
          message: "Nothing is strictly required on this step - it depends on what you actually own. If you don't have cryptocurrency, don't select it. If you don't use social media, skip those options. Only select the digital assets you actually have.",
          suggestions: [
            "Only select what you actually own",
            "Skip categories that don't apply to you",
            "You can always add more later"
          ],
          confidence: 0.9
        };
      }
    }
    
    // PRIORITY 4: Handle state law questions
    if (lowerMessage.includes('state law') || lowerMessage.includes('legal requirement')) {
      console.log('🎯 [AI_SERVICE] ✅ MATCHED: "state law" question');
      const stateName = context.willData.personalInfo?.state ? 
        getStateByCode(context.willData.personalInfo.state as any)?.name || context.willData.personalInfo.state : 
        'your state';
      
      return {
        message: `${stateName} has specific requirements for wills, including how they must be signed and witnessed. For digital assets, ${stateName} follows modern laws that allow executors to access your online accounts and cryptocurrency with proper authorization.`,
        suggestions: [`Learn more about ${stateName} estate planning laws`, "Ensure your executor has proper digital asset authority"],
        confidence: 0.85
      };
    }
    
    // PRIORITY 5: Handle mistake/error concerns
    if (lowerMessage.includes('mistake') || lowerMessage.includes('wrong') || lowerMessage.includes('error')) {
      console.log('🎯 [AI_SERVICE] ✅ MATCHED: "mistake" question');
      return {
        message: "Don't worry! You can edit any information at any time before finalizing your will. I'll help you review everything to make sure it's accurate. Most mistakes can be easily corrected, and I'll flag any issues I notice.",
        suggestions: ["Review each section carefully", "Ask me if you're unsure about anything"],
        confidence: 0.9
      };
    }
    
    // PRIORITY 6: Handle digital asset questions
    if (lowerMessage.includes('digital asset') || lowerMessage.includes('online account')) {
      console.log('🎯 [AI_SERVICE] ✅ MATCHED: "digital asset" question');
      return {
        message: "Digital assets include everything from social media accounts to cloud storage, cryptocurrency, and online businesses. Many people forget about subscription services, domain names, or digital photos. I'll help you identify all your digital property.",
        suggestions: ["Think beyond just social media", "Include subscription services and cloud storage", "Don't forget about digital business assets"],
        confidence: 0.85
      };
    }
    
    // PRIORITY 7: Handle crypto questions (but ONLY if they're asking about having crypto, not about not having it)
    // This check is AFTER the "don't have crypto" checks above
    if ((lowerMessage.includes('crypto') || lowerMessage.includes('bitcoin') || lowerMessage.includes('ethereum')) && 
        !lowerMessage.includes("don't have") && !lowerMessage.includes("no crypto") && !lowerMessage.includes("leave blank") && !lowerMessage.includes("ok to")) {
      console.log('🎯 [AI_SERVICE] ✅ MATCHED: general crypto question (not "no crypto"), providing crypto guidance');
      return {
        message: "Cryptocurrency inheritance is critical to get right. About 20% of Bitcoin is lost forever due to poor planning. I'll help you document how your family can access your crypto wallets, exchange accounts, and recovery phrases safely.",
        warnings: ["Never share private keys online", "Store recovery phrases in multiple secure locations"],
        suggestions: ["Document all wallet locations", "Consider hardware wallets for large amounts"],
        confidence: 0.9
      };
    }
    
    console.log('🎯 [AI_SERVICE] ❌ NO SPECIFIC MATCH, using default step response');
    
    // Default contextual responses based on current step
    const stepResponses: Record<number, AIResponse> = {
      1: {
        message: "I'm here to help you create a legally compliant digital will. Right now, I need your basic information to get started. What specific questions do you have about the personal information section?",
        suggestions: ["Enter your full legal name", "Select your state of residence"],
        confidence: 0.8
      },
      2: {
        message: "Great question! Digital assets are often overlooked in traditional estate planning. I can help you identify all your digital property, from cryptocurrency to cloud storage. What types of digital accounts are you thinking about?",
        suggestions: ["Consider cryptocurrency wallets", "Think about cloud storage accounts", "Include social media profiles"],
        confidence: 0.85
      },
      3: {
        message: "Cryptocurrency requires special handling in wills. I can help you create secure access instructions for your family without compromising your current security. What type of crypto assets do you have?",
        warnings: ["Never share private keys online"],
        suggestions: ["Document wallet locations securely", "Include exchange account details"],
        confidence: 0.9
      },
      4: {
        message: "Choosing the right beneficiaries and digital executor is crucial. Your digital executor should be tech-savvy and trustworthy. What questions do you have about setting up your beneficiaries?",
        suggestions: ["Choose a tech-savvy digital executor", "Consider percentage splits carefully"],
        confidence: 0.9
      },
      5: {
        message: "I'm reviewing your will to ensure it's legally compliant and complete. Everything looks good so far! What would you like me to double-check for you?",
        suggestions: ["Review all contact information", "Verify beneficiary percentages"],
        confidence: 0.95
      },
      6: {
        message: "You're almost done! Your digital will is ready to be secured. The payment process is secure and you're protected by our money-back guarantee. Any questions about the final steps?",
        suggestions: ["Review the plan options", "Consider annual updates"],
        confidence: 0.9
      }
    };

    const defaultResponse = stepResponses[context.currentStep] || {
      message: "I'm here to help you with your digital will. Could you be more specific about what you'd like to know?",
      confidence: 0.7
    };
    
    console.log('🎯 [AI_SERVICE] Using default response:', defaultResponse.message);
    return defaultResponse;
  }
}

export const aiService = new AIService();
export type { AIResponse, AIContext, AIMessage };