import { AdminOverviewPage } from "@/features/admin/AdminOverviewPage";

export default function AdminPage() {
  return (
    <div className="page-panel">
      <div>
        <h1 className="page-heading">Admin</h1>
        <p className="page-subheading">User overview and platform metrics.</p>
      </div>
      <AdminOverviewPage />
    </div>
  );
}
