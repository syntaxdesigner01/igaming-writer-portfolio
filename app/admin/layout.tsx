import "../../admin.css";

export const metadata = {
  title: "D1. Content Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
