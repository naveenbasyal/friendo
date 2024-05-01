import SideNav from "@/components/SideNav";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex  gap-x-14 my-5">
      <SideNav />
      <div className="w-4/5">{children}</div>
    </div>
  );
}
