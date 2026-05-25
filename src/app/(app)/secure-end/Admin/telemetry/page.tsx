import { AdminTelemetryPage } from "@/features/admin/AdminTelemetryPage";

export default function AdminTelemetryRoute() {
  return (
    <div className="page-panel">
      <div>
        <h1 className="page-heading">Telemetry</h1>
        <p className="page-subheading">Platform activity, response times, and usage trends.</p>
      </div>
      <AdminTelemetryPage />
    </div>
  );
}
