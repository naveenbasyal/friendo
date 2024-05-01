import Link from "next/link";

const SideNav = () => {
  return (
    <div className="space-y-4 flex flex-col">
      <Link href="/profile" className="hover:text-blue-500">
        Profile
      </Link>
      <Link href="/settings" className="hover:text-blue-500">
        Settings
      </Link>
    </div>
  );
};

export default SideNav;
