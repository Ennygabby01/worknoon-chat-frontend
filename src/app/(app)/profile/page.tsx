import { SettingsPage } from "@/features/profile/SettingsPage";

export default function ProfilePage() {
  return (
    <div className="page-panel">
      <div>
        <h1 className="page-heading">Settings</h1>
        <p className="page-subheading">Manage your profile, preferences, and security.</p>
      </div>
      <SettingsPage />
    </div>
  );
}
