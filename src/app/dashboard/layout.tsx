import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/shared/AppSidebar";
import Navbar from "@/components/shared/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <Navbar />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
