import React from "react";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { cn } from "@/lib/utils";
const Mainlayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className={cn("max-md:hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0 left-0")}>
        <NavigationSidebar/>
      </div>
      <main className="md:pl-[72px] h-full">

      {children}
      </main>

    </div>
  );
};

export default Mainlayout;
