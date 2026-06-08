import { ReactNode } from "react";
import Footer from "../Footer/Footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-elk-canvas">
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
