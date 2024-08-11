import SideNav from "@/components/SideNav";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid grid-cols-12 gap-x-14 my-5">
      <div className="lg:col-span-4 md:col-span-3 flex justify-center">
        <SideNav />
      </div>
      <div className="md:col-span-6 lg:col-span-7">{children}</div>
    </div>
  );
}
