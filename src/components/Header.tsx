import {
  LogOut,
  Shield,
  Heart,
  History,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import SearchBar from "@/components/SearchBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const Header = () => {
  const { user, isAdmin, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            <nav className="hidden md:flex gap-6">
              <Link
                to="/"
                className="text-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                to="/series"
                className="text-foreground hover:text-primary transition-colors"
              >
                Series
              </Link>
              <Link
                to="/movies"
                className="text-foreground hover:text-primary transition-colors"
              >
                Movies
              </Link>
              <Link
                to="/manga"
                className="text-foreground hover:text-primary transition-colors"
              >
                Manga
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Admin Panel
                </Link>
              )}
            </nav>
          </div>

          {/* Search + User / Login + Mobile Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block flex-1">
              <SearchBar />
            </div>

            {/* User Dropdown */}
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

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="mt-3 flex flex-col gap-3 md:hidden bg-background border border-border rounded-xl p-4">
            <SearchBar />

            <Link
              to="/"
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/series"
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Series
            </Link>
            <Link
              to="/movies"
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Movies
            </Link>
            <Link
              to="/manga"
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Manga
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield className="h-4 w-4" />
                Admin Panel
              </Link>
            )}

            <DropdownMenuSeparator />

            {user ? (
              <>
                <Link
                  to="/watchlist"
                  className="flex items-center gap-2 text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart className="h-4 w-4" />
                  My Watchlist
                </Link>
                <Link
                  to="/history"
                  className="flex items-center gap-2 text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <History className="h-4 w-4" />
                  Watch History
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-foreground hover:text-primary"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 text-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;