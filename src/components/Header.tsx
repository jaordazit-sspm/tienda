import { ShoppingCart, User, LogOut, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const { itemCount } = useCart();
  const { user, isAdmin, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold tracking-tight text-foreground">
          🛍️ MiTienda
        </Link>

        <nav className="flex items-center gap-2">
          {isAdmin && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin">
                <Shield className="mr-1 h-4 w-4" />
                Admin
              </Link>
            </Button>
          )}

          <Button variant="ghost" size="sm" asChild className="relative">
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
                  {itemCount}
                </Badge>
              )}
            </Link>
          </Button>

          {user ? (
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="mr-1 h-4 w-4" />
              Salir
            </Button>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">
                <User className="mr-1 h-4 w-4" />
                Entrar
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
