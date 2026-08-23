"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";

import { allRoutes as pageTitles } from "@/utils/RouteDefinitions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const { logOut } = useAuth();
  const router = useRouter();

  const currentPage =
    pageTitles.find(
      (page) => pathname === page.href || pathname.startsWith(`${page.href}/`),
    )?.title ?? "Dashboard";

  return (
    <header className="flex h-14 shrink-0 items-center border-b w-full">
      <nav className="flex gap-5 justify-between w-full items-center">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger />
          <h1 className="font-mono text-3xl">Talli</h1>

          <Separator orientation="vertical" className="mr-2" />


          <h1 className="text-sm font-medium">{currentPage}</h1>
        </div>
        <div className="p-2 ml-1">
          <DropdownMenu>
            <DropdownMenuTrigger nativeButton={false} render={<Avatar />}>
              <AvatarImage src="" alt="profile image" />
              <AvatarFallback>
                <UserCircle />
              </AvatarFallback>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem render={<Link href="/dashboard/settings/profile" />}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
                Settings
              </DropdownMenuItem>
              <Separator className="my-2" />
              <DropdownMenuItem
                onClick={async () => {
                  await logOut();
                  router.replace("/login");
                }}
                variant="destructive"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
