import { ProfileForm } from "@/features/profile/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="page-panel">
      <div>
        <h1 className="page-heading">Profile</h1>
        <p className="page-subheading">Manage your display name and avatar.</p>
      </div>
      <ProfileForm />
    </div>
  );
}
