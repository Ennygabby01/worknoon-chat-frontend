import { AgentCasesPage } from "@/features/agent/AgentCasesPage";

export default function MyCasesRoute() {
  return (
    <div className="page-panel">
      <div>
        <h1 className="page-heading">My Cases</h1>
        <p className="page-subheading">Conversations you have claimed and are handling.</p>
      </div>
      <AgentCasesPage />
    </div>
  );
}
