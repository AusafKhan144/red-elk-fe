import { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-elk-canvas">{children}</div>;
}
