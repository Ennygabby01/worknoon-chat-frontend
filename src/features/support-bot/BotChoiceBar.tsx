import type { BotChoice } from "./support-bot-types";

type BotChoiceBarProps = {
  choices: BotChoice[];
  onChoose: (choice: BotChoice) => void;
  disabled?: boolean;
};

export function BotChoiceBar({ choices, onChoose, disabled = false }: BotChoiceBarProps) {
  return (
    <div className="bot-choice-bar" role="group" aria-label="Choose a response">
      {choices.map((choice) => (
        <button
          key={choice.label}
          type="button"
          className="bot-chip"
          onClick={() => onChoose(choice)}
          disabled={disabled}
        >
          {choice.label}
        </button>
      ))}
    </div>
  );
}
