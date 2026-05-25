import { DirectoryPage } from "@/features/directory/DirectoryPage";

export default function Directory() {
  return (
    <div className="page-panel">
      <div>
        <h1 className="page-heading">Directory</h1>
        <p className="page-subheading">Browse merchants and designers on the platform.</p>
      </div>
      <DirectoryPage />
    </div>
  );
}
