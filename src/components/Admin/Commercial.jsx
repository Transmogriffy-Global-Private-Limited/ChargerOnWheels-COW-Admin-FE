import AdminApiWorkspace from "./AdminApiWorkspace";

export default function Commercial() {
  return (
    <AdminApiWorkspace
      title="Commercial configuration"
      description="Manage reusable tariff versions, GST profiles, pricing groups, assignments, Zone-channel readiness, and nonbinding commercial previews."
      tags={[
        "24 | Admin commercial tariffs",
        "25 | Admin commercial GST",
        "26 | Admin commercial groups",
        "27 | Admin commercial assignments",
        "28 | Admin commercial preview",
      ]}
    />
  );
}
