// src/components/Header.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LogOut,
  Shield,
  Heart,
  History,
  Menu,
  X,
  Search as SearchIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import SearchBar from "@/components/SearchBar";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const CONTAINER_ID = "app-root"; // change this if your scroll container has another id

const Header: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // preserve ref to handler so add/removeEventListener removes the same function
  const handlerRef = useRef<(ev?: Event) => void>();

  const getScrollContainer = (): (Window | HTMLElement) => {
    const el = document.getElementById(CONTAINER_ID);
    if (el) return el;
    // fallback to window / document.scrollingElement
    return window;
  };

  useEffect(() => {
    // create handler
    handlerRef.current = () => {
      try {
        const container = getScrollContainer();
        let scrolled = false;
        if (container === window) {
          scrolled = window.scrollY > 20;
        } else {
          scrolled = (container as HTMLElement).scrollTop > 20;
        }
        setIsScrolled(scrolled);
      } catch (e) {
        // fail-safe: use window
        setIsScrolled(window.scrollY > 20);
      }
    };

    const container = getScrollContainer();
    const handler = handlerRef.current;

    // attach listener
    if (container === window) {
      window.addEventListener("scroll", handler!, { passive: true });
    } else {
      (container as HTMLElement).addEventListener("scroll", handler!, { passive: true });
    }

    // run once to set initial state (handles loading mid-scroll)
    handler!();

    // cleanup
    return () => {
      if (container === window) {
        window.removeEventListener("scroll", handler!);
      } else {
        (container as HTMLElement).removeEventListener("scroll", handler!);
      }
    };
    // We do not include handlerRef or getScrollContainer in deps intentionally:
    // - container detection only needs to run once on mount
    // - if your app swaps the scroll container dynamically, you can reload / adjust
  }, []);

  const navItems = useMemo(
    () => [
      { label: "Home", to: "/" },
      { label: "Series", to: "/series" },
      { label: "Movies", to: "/movies" },
      { label: "Manga", to: "/manga" },
    ],
    []
  );

  const isActive = (to: string) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname === to || location.pathname.startsWith(to + "/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo + Nav */}
          <div className="flex items-center gap-4">
            <Link to="/">
              <h1 className="text-2xl font-bold bg-clip-text text-white cursor-pointer">
                AniShow
              </h1>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-6 ">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`text-foreground hover:text-primary transition-colors px-1 py-1 rounded ${
                    isActive(item.to)
                      ? "text-primary font-semibold underline-offset-4"
                      : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {isAdmin && (
                <Link
                  to="/admin"
                  className={`text-foreground hover:text-primary transition-colors flex items-center gap-2 px-1 py-1 rounded ${
                    isActive("/admin") ? "text-primary font-semibold" : ""
                  }`}
                >
                  Admin Panel
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block flex-1">
              <SearchBar />
            </div>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="hidden sm:flex">
                    {user.email?.split("@")[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/watchlist" className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      My Watchlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/history" className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Watch History
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={signOut}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="hidden sm:flex">
                <Link to="/auth">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-2">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 font-black" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[320px] sm:w-[420px]">
                <div className="relative">
                  <div className="mt-10 px-4">
                    <SearchBar />

                    <nav className="flex flex-col gap-3 mt-6">
                      {navItems.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setMobileOpen(false)}
                          className={`px-4 py-3 rounded-lg text-lg text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-colors ${
                            isActive(item.to) ? "text-primary font-semibold" : ""
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setMobileOpen(false)}
                          className={`px-4 py-3 rounded-lg text-lg text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-colors flex items-center gap-2 ${
                            isActive("/admin") ? "text-primary font-semibold" : ""
                          }`}
                        >
                          <Shield className="h-4 w-4" /> Admin Panel
                        </Link>
                      )}
                    </nav>

                    <div className="mt-6 border-t border-border pt-4 flex flex-col gap-3">
                      {user ? (
                        <>
                          <Link
                            to="/watchlist"
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent/20"
                          >
                            <Heart className="h-4 w-4" /> My Watchlist
                          </Link>
                          <Link
                            to="/history"
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent/20"
                          >
                            <History className="h-4 w-4" /> Watch History
                          </Link>
                          <button
                            onClick={() => {
                              signOut();
                              setMobileOpen(false);
                            }}
                            className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent/20 text-left"
                          >
                            <LogOut className="h-4 w-4" /> Sign Out
                          </button>
                        </>
                      ) : (
                        <Link
                          to="/auth"
                          onClick={() => setMobileOpen(false)}
                          className="px-4 py-3 rounded-lg text-lg text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-colors"
                        >
                          Login
                        </Link>
                      )}
                    </div>

                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
