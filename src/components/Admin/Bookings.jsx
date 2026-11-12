import AdminApiWorkspace from "./AdminApiWorkspace";

export default function Bookings() {
  return (
    <AdminApiWorkspace
      title="Admin jobs & charging"
      description="Read dispatch jobs and submit charging-start requests. An accepted HAL request does not mean charging physically started."
      tags={["11 | Admin jobs & charging"]}
    />
  );
}
