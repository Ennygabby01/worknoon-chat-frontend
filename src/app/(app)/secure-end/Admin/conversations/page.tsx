import { AdminConversationsPage } from "@/features/admin/AdminConversationsPage";

export default function AdminConversationsRoute() {
  return (
    <div className="page-panel">
      <div>
        <h1 className="page-heading">Conversations</h1>
        <p className="page-subheading">All platform conversations across user types.</p>
      </div>
      <AdminConversationsPage />
    </div>
  );
}
