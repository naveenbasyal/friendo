import type { Metadata } from "next";
import { Redressed } from "next/font/google";

export const metadata: Metadata = {
  title: "Authentication",
};
const redressed = Redressed({
  subsets: ["latin"],
  weight: ["400"],
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full min-h-screen flex justify-center">
      <div className="w-full md:w-[60%] lg:w-[35%] ">
        <div className="mb-5 bg-white dark:bg-inherit">
          <h1
            className={`text-start text-yellow-500  text-7xl font-extrabold mt-5 ${redressed.className} `}
          >
            Friendo
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Connecting people with their furry friends
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
