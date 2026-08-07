import { useContext } from "react";

import { CartContext } from "./cart-context";
import type { CartContextType } from "./CartContext";

export function useCart(): CartContextType {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider.",
    );
  }

  return context;
}