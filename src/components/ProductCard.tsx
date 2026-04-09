import { Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
}

const ProductCard = ({ id, name, description, price, stock, image_url }: ProductCardProps) => {
  const { addItem, items } = useCart();
  const inCart = items.find((i) => i.id === id)?.quantity ?? 0;
  const canAdd = inCart < stock;

  const handleAdd = () => {
    if (!canAdd) {
      toast.error("Stock insuficiente");
      return;
    }
    addItem({ id, name, price, image_url, stock });
    toast.success(`${name} agregado al carrito`);
  };

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <div className="aspect-square overflow-hidden bg-muted">
        {image_url ? (
          <img src={image_url} alt={name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-16 w-16 text-muted-foreground/40" />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-1">{name}</h3>
        {description && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{description}</p>}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">${price.toFixed(2)}</span>
          <Badge variant={stock > 0 ? "secondary" : "destructive"} className="text-xs">
            {stock > 0 ? `${stock} en stock` : "Agotado"}
          </Badge>
        </div>
        <Button onClick={handleAdd} disabled={stock === 0 || !canAdd} className="mt-3 w-full" size="sm">
          <Plus className="mr-1 h-4 w-4" />
          Agregar
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
