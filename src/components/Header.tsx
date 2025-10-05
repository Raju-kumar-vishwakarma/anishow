import { LogOut, Shield, Heart } from "lucide-react";
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

const Header = () => {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link to="/">
              <h1 className="text-2xl font-bold  from-primary via-electric to-hotpink bg-clip-text text-white cursor-pointer">
                AniShow
              </h1>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link to="/" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Shield className="h-4 w-4" />
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
                  <Button variant="outline">{user.email?.split("@")[0]}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/watchlist" className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      My Watchlist
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
                  <DropdownMenuItem onClick={signOut} className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link to="/auth">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
