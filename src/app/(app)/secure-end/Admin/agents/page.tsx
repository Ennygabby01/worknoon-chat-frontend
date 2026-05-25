import { AdminAgentsPage } from "@/features/admin/AdminAgentsPage";

export default function AdminAgentsRoute() {
  return (
    <div className="page-panel">
      <div>
        <h1 className="page-heading">Agents</h1>
        <p className="page-subheading">Manage support agents and their access.</p>
      </div>
      <AdminAgentsPage />
    </div>
  );
}
