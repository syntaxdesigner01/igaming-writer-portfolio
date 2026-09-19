import "../../admin.css";

export const metadata = {
  title: "Michael. Content Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
