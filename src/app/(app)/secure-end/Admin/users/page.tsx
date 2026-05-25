import { AdminUsersPage } from "@/features/admin/AdminUsersPage";

export default function AdminUsersRoute() {
  return (
    <div className="page-panel">
      <div>
        <h1 className="page-heading">Users</h1>
        <p className="page-subheading">All registered platform users.</p>
      </div>
      <AdminUsersPage />
    </div>
  );
}
