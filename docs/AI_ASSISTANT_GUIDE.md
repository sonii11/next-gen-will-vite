# NextGenWill AI Assistant Functionality Guide

This document provides a comprehensive overview of the AI Assistant implementation in the NextGenWill application, detailing how it functions at each step of the onboarding process and how to ensure proper context-aware responses to user questions.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Key Components](#key-components)
3. [AI Assistant Workflow](#ai-assistant-workflow)
4. [Step-by-Step AI Guidance](#step-by-step-ai-guidance)
5. [Context Management](#context-management)
6. [Common Issues and Solutions](#common-issues-and-solutions)
7. [Testing and Validation](#testing-and-validation)

## Architecture Overview

The AI Assistant in NextGenWill is designed to provide contextual guidance throughout the digital will creation process. It's implemented as a sidebar component that maintains its own state while also accessing the global will data store.

The system consists of three main parts:

1. **UI Components**: The `AIAssistant` React component that renders the chat interface
2. **AI Service**: The `aiService` that handles communication with the AI backend (Claude API)
3. **State Management**: The `willStore` that maintains the current step and will data

### Technical Flow

```
User Input → AIAssistant Component → aiService → AI Model (Claude) → Response Processing → UI Update
```

## Key Components

### 1. AIAssistant Component (`src/components/ui/AIAssistant.tsx`)

This component:

- Renders the chat interface sidebar
- Maintains chat history in local state
- Displays current guidance, suggestions, warnings, and next steps
- Handles user input and processes AI responses
- Scrolls to the latest message automatically
- Provides suggestion buttons for quick interactions

### 2. AI Service (`src/services/aiService.ts`)

This service:

- Manages communication with the Claude API
- Provides methods for different AI interactions:
  - `chat()`: Processes user messages
  - `getStepGuidance()`: Gets initial guidance for a step
  - `validateStep()`: Validates current step data
  - `reviewWill()`: Reviews the complete will
- Contains fallback mock responses when API isn't available
- Parses AI responses into structured format

### 3. Will Store (`src/store/willStore.ts`)

This global store:

- Maintains the current step and all will data
- Provides methods to update and validate each section
- Handles data persistence to local storage or database
- Tracks the user's progress through the steps

## AI Assistant Workflow

### Initialization

1. When a step loads, the `AIAssistant` component mounts
2. The `loadStepGuidance()` method is called
3. The AI service provides initial guidance for the current step
4. Guidance is displayed to the user along with suggestions

### User Interaction

1. User types a question or selects a suggestion
2. The message is sent to the AI service
3. The AI service builds an appropriate context based on:
   - The current step
   - Current will data
   - User's state (for legal requirements)
   - Recent conversation history
4. A response is generated (via API or mock)
5. The response is parsed and displayed to the user
6. The guidance panel is updated with the latest information

### Step Validation

1. User can click "Validate Current Step"
2. The AI service checks if all required data is present
3. Feedback and suggestions are provided to the user

## Step-by-Step AI Guidance

The AI Assistant provides different guidance based on the current step in the onboarding process:

### Step 1: Personal Information

- **Initial Guidance**: Requests full legal name and state of residence
- **Context-Aware Information**: Explains why this information is needed for legal compliance
- **Common Questions**: Legal requirements, data privacy, name format
- **Validation**: Ensures name and state are provided

### Step 2: Digital Assets Discovery

- **Initial Guidance**: Explains the concept of digital assets and their importance
- **Context-Aware Information**: Helps identify different categories of digital assets
- **Common Questions**: "What counts as a digital asset?", "Do I need to include everything?"
- **Validation**: Ensures at least one asset category is selected

### Step 3: Crypto Inheritance Setup

- **Initial Guidance**: Explains the importance of crypto inheritance planning
- **Context-Aware Information**: Provides guidance on secure wallet access documentation
- **Common Questions**: "I don't have crypto, can I skip this?", "How secure is this?"
- **Key Issue**: Must properly handle "I don't have crypto" responses

### Step 4: Beneficiaries & Executors

- **Initial Guidance**: Explains the role of beneficiaries and digital executors
- **Context-Aware Information**: Helps with percentage allocation and executor selection
- **Common Questions**: "Can I have multiple executors?", "How do I split percentages?"
- **Validation**: Ensures beneficiaries are properly set up and percentages total 100%

### Step 5: Will Review

- **Initial Guidance**: Explains the review process and its importance
- **Context-Aware Information**: Highlights any potential issues or missing information
- **Common Questions**: "Is my will legally valid?", "What if I need to make changes?"
- **Validation**: Performs a comprehensive legal review of the will

### Step 6: Payment

- **Initial Guidance**: Explains pricing options and what's included
- **Context-Aware Information**: Provides information on updates and access
- **Common Questions**: "What's included in each plan?", "Is my data secure?"

## Context Management

The AI Assistant maintains context in several ways to ensure responses are relevant:

### Conversation History

- Recent messages are stored in the component's state
- The most recent messages are included in API requests
- This allows the AI to reference previous questions

### Current Step Awareness

- The `currentStep` is passed to the AI service
- Different prompt templates are used based on the step
- Suggestions and guidance are step-specific

### Will Data Integration

- The current will data is included in the AI context
- This allows the AI to reference specific user inputs
- Responses can be tailored to the user's specific situation

### State-Specific Legal Knowledge

- The user's state is used to provide relevant legal information
- The `legalKnowledgeBase` contains state-specific requirements
- Responses include applicable state laws and requirements

## Common Issues and Solutions

### Issue 1: AI Response Doesn't Match the Current Step

**Cause**: The context may not be properly reset when switching steps.
**Solution**:

```javascript
// Ensure this code is present in AIAssistant.tsx
useEffect(() => {
  console.log(
    "🔄 [AI_ASSISTANT] Step changed, clearing messages and loading new guidance"
  );
  setMessages([]); // Clear previous conversation
  setCurrentGuidance(null); // Clear previous guidance
  setLastUserMessage(""); // Clear last user message
  loadStepGuidance();
}, [currentStep]);
```

### Issue 2: AI Doesn't Properly Handle "I Don't Have Crypto" Questions

**Cause**: The AI may not have clear priority handling for negative case questions.
**Solution**: Ensure the mock responses and prompts specifically handle these cases:

```javascript
// In aiService.ts, ensure these checks have high priority
if (
  lowerMessage.includes("don't have") &&
  (lowerMessage.includes("crypto") || lowerMessage.includes("bitcoin"))
) {
  console.log(
    '🎯 [AI_SERVICE] ✅ MATCHED: "don\'t have crypto" question - PRIORITY 1'
  );
  return {
    message:
      "Absolutely! It's perfectly fine if you don't have any cryptocurrency...",
    // ...
  };
}
```

### Issue 3: Guidance Panel Doesn't Update After AI Response

**Cause**: The guidance may not be updated with the latest response.
**Solution**: Ensure the guidance is updated after each response:

```javascript
// In the sendMessage function in AIAssistant.tsx, add:
console.log(
  "🔄 [AI_ASSISTANT] FORCE UPDATING current guidance with new response"
);
setCurrentGuidance({
  ...response,
  message: response.message, // Ensure the message is properly set
});
```

### Issue 4: AI Responses Are Too Generic

**Cause**: The context provided to the AI may not be specific enough.
**Solution**: Enhance the system and user prompts:

```javascript
// In buildSystemPrompt and buildUserPrompt, include more specific context
private buildSystemPrompt(context: AIContext): string {
  // Include step-specific guidance
  // Include state-specific legal requirements
  // Include clear instructions for response format
}
```

## Testing and Validation

To ensure the AI Assistant functions correctly throughout the onboarding process:

### 1. Step Transition Testing

- Test navigation between steps and verify the AI context resets
- Confirm initial guidance appears for each step
- Verify previous conversation doesn't affect new step guidance

### 2. Common Question Testing

For each step, test these common question types:

- "What information do you need?"
- "Is this required?"
- "I don't have [X], can I skip this?"
- "What are the legal requirements?"
- "What if I make a mistake?"

### 3. Edge Case Testing

- Test with empty will data
- Test with partially completed will data
- Test with invalid input (e.g., percentages that don't add up to 100%)

### 4. Prompt Validation

- Review system prompts for clarity and specificity
- Ensure user prompts include relevant context
- Verify response parsing extracts structured data correctly

### 5. Mock Response Testing

When API is unavailable:

- Verify mock responses are contextual and helpful
- Test priority matching for different question types
- Ensure suggestions are relevant to the current step

## Conclusion

The NextGenWill AI Assistant is designed to provide contextual, helpful guidance throughout the digital will creation process. By maintaining proper context, handling common questions effectively, and providing structured responses, it simplifies the estate planning process for users.

To ensure the AI responds appropriately to questions at each step, maintain the context management logic, implement proper priority handling for common questions, and thoroughly test the system with a variety of inputs and scenarios.
