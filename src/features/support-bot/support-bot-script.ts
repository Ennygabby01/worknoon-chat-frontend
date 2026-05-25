import type { BotStep } from "./support-bot-types";

export const BOT_SCRIPT: Record<string, BotStep> = {
  start: {
    id: "start",
    message: "Hi there! I am the Worknoon support assistant. What can I help you with today?",
    choices: [
      { label: "My order", nextStep: "order-root" },
      { label: "Returns and refunds", nextStep: "returns-root" },
      { label: "Product question", nextStep: "product-root" },
      { label: "Something else", nextStep: "something-else" },
    ],
  },
  "order-root": {
    id: "order-root",
    message: "What is going on with your order?",
    choices: [
      { label: "I have not received it", nextStep: "order-not-received" },
      { label: "I want to cancel it", nextStep: "order-cancel" },
      { label: "Wrong item delivered", nextStep: "order-wrong-item" },
    ],
  },
  "order-not-received": {
    id: "order-not-received",
    message: "I am sorry to hear that. Let me connect you with a support agent who can look up your order.",
    choices: null,
    autoHandoff: true,
  },
  "order-cancel": {
    id: "order-cancel",
    message: "Cancellations need to be handled by our support team directly. Connecting you now.",
    choices: null,
    autoHandoff: true,
  },
  "order-wrong-item": {
    id: "order-wrong-item",
    message: "I am sorry about that. A support agent will resolve this for you right away.",
    choices: null,
    autoHandoff: true,
  },
  "returns-root": {
    id: "returns-root",
    message: "What do you need help with?",
    choices: [
      { label: "Start a return", nextStep: "returns-start" },
      { label: "Check return status", nextStep: "returns-status" },
    ],
  },
  "returns-start": {
    id: "returns-start",
    message: "To start a return, a support agent will need to verify your order details. Shall I connect you now?",
    choices: [
      { label: "Yes, connect me", nextStep: "returns-start", action: "handoff" },
      { label: "I have a question first", nextStep: "returns-question" },
    ],
  },
  "returns-status": {
    id: "returns-status",
    message: "Return status checks need your order details. Connecting you with a support agent.",
    choices: null,
    autoHandoff: true,
  },
  "returns-question": {
    id: "returns-question",
    message: "Go ahead, what would you like to know? I will pass this to the agent.",
    choices: null,
    autoHandoff: true,
  },
  "product-root": {
    id: "product-root",
    message: "Is this about a product you already purchased, or one you are considering buying?",
    choices: [
      { label: "Already purchased", nextStep: "product-purchased" },
      { label: "Considering buying", nextStep: "product-marketplace" },
    ],
  },
  "product-purchased": {
    id: "product-purchased",
    message: "What is the issue with your purchase?",
    choices: [
      { label: "It arrived damaged", nextStep: "product-damaged" },
      { label: "It is not as described", nextStep: "product-mismatch" },
      { label: "Something else", nextStep: "something-else" },
    ],
  },
  "product-damaged": {
    id: "product-damaged",
    message: "I am really sorry to hear that. Our team will prioritise this for you.",
    choices: null,
    autoHandoff: true,
  },
  "product-mismatch": {
    id: "product-mismatch",
    message: "Let me connect you with a support agent who can review your order and resolve this.",
    choices: null,
    autoHandoff: true,
  },
  "product-marketplace": {
    id: "product-marketplace",
    message: "For product browsing and pre-purchase questions, our marketplace is the best place. Would you like to go there?",
    choices: [
      { label: "Take me to marketplace", nextStep: "product-marketplace", action: "marketplace" },
      { label: "I need support instead", nextStep: "something-else" },
    ],
  },
  "something-else": {
    id: "something-else",
    message: "No problem. Briefly describe what you need and an agent will be with you shortly.",
    choices: null,
    autoHandoff: true,
  },
};

export const ESCALATION_MESSAGE =
  "It looks like you started typing. Would you like me to connect you with a human support agent, or would you prefer to browse the marketplace instead?";
