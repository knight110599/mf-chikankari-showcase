import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ApiProduct } from "../services/product.service";

export type CartItem = ApiProduct & {
  quantity: number;
  selectedSize: string;
};

type ProductId = ApiProduct["id"];

type CartContextType = {
  cartItems: CartItem[];
  cartCount: number;
  subtotal: number;
  addToCart: (
    product: ApiProduct,
    quantity?: number,
    selectedSize?: string,
  ) => void;
  increaseQuantity: (productId: ProductId, selectedSize: string) => void;
  decreaseQuantity: (productId: ProductId, selectedSize: string) => void;
  removeFromCart: (productId: ProductId, selectedSize: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "mf-chikankari-cart";

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (!savedCart) {
        return [];
      }

      const parsedCart: unknown = JSON.parse(savedCart);

      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (
    product: ApiProduct,
    quantity = 1,
    selectedSize = "",
  ) => {
    if (quantity < 1 || product.stock < 1) {
      return;
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) =>
          item.id === product.id &&
          item.selectedSize === selectedSize,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id &&
          item.selectedSize === selectedSize
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + quantity,
                  product.stock,
                ),
              }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity: Math.min(quantity, product.stock),
          selectedSize,
        },
      ];
    });
  };

  const increaseQuantity = (
    productId: ProductId,
    selectedSize: string,
  ) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId &&
        item.selectedSize === selectedSize
          ? {
              ...item,
              quantity: Math.min(
                item.quantity + 1,
                item.stock,
              ),
            }
          : item,
      ),
    );
  };

  const decreaseQuantity = (
    productId: ProductId,
    selectedSize: string,
  ) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId &&
          item.selectedSize === selectedSize
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (
    productId: ProductId,
    selectedSize: string,
  ) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(
            item.id === productId &&
            item.selectedSize === selectedSize
          ),
      ),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.quantity,
        0,
      ),
    [cartItems],
  );

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total + Number(item.price) * item.quantity,
        0,
      ),
    [cartItems],
  );

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      subtotal,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      clearCart,
    }),
    [cartItems, cartCount, subtotal],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider.",
    );
  }

  return context;
}