"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background h-16 fixed w-full z-10 top-0">
      <div className="container h-full mx-auto flex items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          Event Manager
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className={`hover:text-primary transition-colors ${
                    pathname === "/dashboard" ? "text-primary font-medium" : ""
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/events"
                  className={`hover:text-primary transition-colors ${
                    pathname === "/events" ? "text-primary font-medium" : ""
                  }`}
                >
                  All Events
                </Link>
                <Link
                  href="/my-events"
                  className={`hover:text-primary transition-colors ${
                    pathname === "/my-events" ? "text-primary font-medium" : ""
                  }`}
                >
                  My Events
                </Link>
                <Link
                  href="/participating"
                  className={`hover:text-primary transition-colors ${
                    pathname === "/participating"
                      ? "text-primary font-medium"
                      : ""
                  }`}
                >
                  Participating
                </Link>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-4 cursor-pointer">
                    {user?.name || "Account"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full cursor-pointer">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive cursor-pointer"
                    onClick={logout}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="cursor-pointer">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="cursor-pointer">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
