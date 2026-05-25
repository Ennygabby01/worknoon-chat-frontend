"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { createSupportConversation } from "@/lib/api/conversations";
import { BotThread } from "./BotThread";
import { BotChoiceBar } from "./BotChoiceBar";
import { BotComposer } from "./BotComposer";
import { BotEscalationCard } from "./BotEscalationCard";
import { AgentHandoffPanel } from "./AgentHandoffPanel";
import { BOT_SCRIPT } from "./support-bot-script";
import type { BotChoice, BotHistoryItem, BotPhase } from "./support-bot-types";

type SupportBotViewProps = {
  onClose: () => void;
};

function clientId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function SupportBotView({ onClose }: SupportBotViewProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<BotPhase>("chat");
  const [stepId, setStepId] = useState("start");
  const [history, setHistory] = useState<BotHistoryItem[]>([]);
  const [botTyping, setBotTyping] = useState(false);
  const initialized = useRef(false);
  const autoHandoffTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function appendBot(text: string) {
    setHistory((prev) => [...prev, { role: "bot", text, timestamp: new Date().toISOString() }]);
  }

  function appendUser(text: string) {
    setHistory((prev) => [...prev, { role: "user", text, timestamp: new Date().toISOString() }]);
  }

  function deliverBotStep(nextStepId: string, delay = 900) {
    const nextStep = BOT_SCRIPT[nextStepId];
    if (!nextStep) return;
    setBotTyping(true);
    setTimeout(() => {
      setBotTyping(false);
      appendBot(nextStep.message);
      setStepId(nextStepId);
      if (nextStep.autoHandoff) {
        autoHandoffTimer.current = setTimeout(() => setPhase("handoff"), 1400);
      }
    }, delay);
  }

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    deliverBotStep("start", 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChoice(choice: BotChoice) {
    if (botTyping) return;
    if (choice.action === "marketplace") {
      router.push("/marketplace");
      return;
    }
    if (choice.action === "handoff") {
      appendUser(choice.label);
      setPhase("handoff");
      return;
    }
    appendUser(choice.label);
    deliverBotStep(choice.nextStep);
  }

  function handleDeviation() {
    setPhase("escalation");
  }

  function handleFreeTextSubmit(text: string) {
    appendUser(text);
    setPhase("handoff");
  }

  function handleEscalateConnect() {
    setPhase("handoff");
  }

  function handleEscalateMarketplace() {
    router.push("/marketplace");
  }

  async function handleHandoffSend(message: string) {
    const conversation = await createSupportConversation(
      { openingMessage: message, clientMessageId: clientId(), topic: "Support request" }
    );
    onClose();
    router.push(`/inbox/${conversation.id}`);
  }

  const currentStep = BOT_SCRIPT[stepId];
  const expectsText = !!(currentStep && !currentStep.choices && !currentStep.autoHandoff);

  return (
    <div className="chat-area panel-active">
      <div className="chat-main">
        <div className="chat-header">
          <button className="chat-header-back" onClick={onClose} aria-label="Back to inbox">
            <BackIcon />
          </button>
          <Avatar name="Worknoon Support" size="md" />
          <div className="chat-header-info">
            <span className="chat-header-name-btn" style={{ cursor: "default" }}>
              Worknoon Support
            </span>
            <div className="chat-header-sub">
              <span className="presence-text presence-text--online">Assistant</span>
            </div>
          </div>
        </div>

        <BotThread history={history} botTyping={botTyping} />

        <div className="bot-footer">
          {phase === "chat" && currentStep?.choices && !currentStep.autoHandoff && (
            <BotChoiceBar
              choices={currentStep.choices}
              onChoose={handleChoice}
              disabled={botTyping}
            />
          )}
          {phase === "chat" && (
            <BotComposer
              expectsText={expectsText}
              onSubmit={handleFreeTextSubmit}
              onDeviation={handleDeviation}
              disabled={botTyping}
            />
          )}
          {phase === "escalation" && (
            <BotEscalationCard
              onConnect={handleEscalateConnect}
              onMarketplace={handleEscalateMarketplace}
            />
          )}
          {phase === "handoff" && (
            <AgentHandoffPanel onSend={handleHandoffSend} />
          )}
        </div>
      </div>
    </div>
  );
}

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
