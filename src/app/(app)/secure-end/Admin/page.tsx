import { AdminOverviewPage } from "@/features/admin/AdminOverviewPage";

export default function AdminDashboardRoute() {
  return (
    <div className="page-panel">
      <div>
        <h1 className="page-heading">Dashboard</h1>
        <p className="page-subheading">Platform overview and activity metrics.</p>
      </div>
      <AdminOverviewPage />
    </div>
  );
}
