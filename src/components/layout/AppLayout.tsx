import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)", fontFamily: "var(--font-ui)" }}>
      {/* Desktop sidebar — always visible on lg+ */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={
                prefersReduced
                  ? { type: "tween", duration: 0.01 }
                  : { type: "spring", stiffness: 400, damping: 35 }
              }
              className="fixed top-0 left-0 h-full z-40 lg:hidden"
            >
              <Sidebar onClose={() => setDrawerOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 lg:ml-60 min-h-screen">
        <Topbar onMenuClick={() => setDrawerOpen(true)} />

        <div className="mx-auto w-full px-4 pt-6 pb-16 sm:px-8 sm:pt-7" style={{ maxWidth: 1180 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
