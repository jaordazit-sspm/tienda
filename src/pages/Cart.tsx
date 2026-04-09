import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para realizar un pedido");
      return;
    }
    setSubmitting(true);
    try {
      const orderItems = items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity }));
      const { error } = await supabase.from("orders").insert({
        user_id: user.id,
        items: orderItems,
        total,
      });
      if (error) throw error;
      clearCart();
      toast.success("¡Pedido realizado con éxito!");
    } catch {
      toast.error("Error al realizar el pedido");
    } finally {
      setSubmitting(false);
    }
  };

  if (!items.length) {
    return (
      <div className="container mx-auto flex flex-col items-center px-4 py-20 text-center">
        <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/40" />
        <h2 className="text-2xl font-bold text-foreground">Tu carrito está vacío</h2>
        <p className="mt-2 text-muted-foreground">Agrega productos desde el catálogo</p>
        <Button asChild className="mt-6">
          <Link to="/">Ver Catálogo</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-foreground">Carrito de Compras</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <Card key={item.id} className="flex items-center gap-4 p-4">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">📦</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} c/u</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <span className="w-20 text-right font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeItem(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>

        <Card className="h-fit p-6">
          <h2 className="text-xl font-bold text-foreground">Resumen</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Productos ({items.length})</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-4 border-t border-border pt-4">
            <div className="flex justify-between text-lg font-bold text-foreground">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <Button className="mt-6 w-full" size="lg" onClick={handleCheckout} disabled={submitting}>
            {submitting ? "Procesando..." : "Confirmar Pedido"}
          </Button>
          {!user && <p className="mt-2 text-center text-xs text-muted-foreground">Inicia sesión para completar tu pedido</p>}
        </Card>
      </div>
    </div>
  );
};

export default Cart;
