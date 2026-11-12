import AdminApiWorkspace from "./AdminApiWorkspace";

export default function Zones() {
  return (
    <AdminApiWorkspace
      title="Zones & service coverage"
      description="Manage versioned Zone drafts and lifecycle, assignments, GST decisions, legacy composite tariffs, and nonbinding simulation."
      tags={[
        "17 | Admin Zones",
        "18 | Admin Zone assignments",
        "19 | Admin Zone GST",
        "20 | Admin Zone tariffs",
        "21 | Admin Zone simulation",
      ]}
    />
  );
}
