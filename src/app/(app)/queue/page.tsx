import { AgentQueuePage } from "@/features/agent/AgentQueuePage";

export default function QueueRoute() {
  return (
    <div className="page-panel">
      <div>
        <h1 className="page-heading">Queue</h1>
        <p className="page-subheading">Escalated conversations waiting to be claimed.</p>
      </div>
      <AgentQueuePage />
    </div>
  );
}
