export type BotPhase = "chat" | "escalation" | "handoff";

export type BotHistoryItem = {
  role: "bot" | "user";
  text: string;
  timestamp: string;
};

export type BotChoice = {
  label: string;
  nextStep: string;
  action?: "handoff" | "marketplace";
};

export type BotStep = {
  id: string;
  message: string;
  choices: BotChoice[] | null;
  autoHandoff?: boolean;
};

export type BotState = {
  phase: BotPhase;
  stepId: string;
  history: BotHistoryItem[];
  botTyping: boolean;
  capturedText: string;
};
