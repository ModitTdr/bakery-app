import MobileNavbar from "@/components/common/MobileNavbar";
import Navbar from "@/components/common/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      {children}
      <MobileNavbar />
    </div>
  );
}
