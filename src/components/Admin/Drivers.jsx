import AdminApiWorkspace from "./AdminApiWorkspace";

export default function Drivers() {
  return (
    <AdminApiWorkspace
      title="Admin drivers"
      description="Read driver identity and operational facts. Approval and dispatchability are not inferred from these records."
      tags={["30 | Admin drivers"]}
    />
  );
}
