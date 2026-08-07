import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "./useAuth";
import type { ApiProduct } from "../services/product.service";
import { CartContext } from "./cart-context";
export type CartPricingType = "RETAIL" | "WHOLESALE";

export type CartItem = ApiProduct & {
  quantity: number;
  selectedSize: string;
  unitPrice: number;
  pricingType: CartPricingType;
  minimumQuantity: number;
};

type ProductId = ApiProduct["id"];

export type CartContextType = {
  cartItems: CartItem[];
  cartCount: number;
  subtotal: number;
  addToCart: (
    product: ApiProduct,
    quantity?: number,
    selectedSize?: string,
  ) => void;
  increaseQuantity: (
    productId: ProductId,
    selectedSize: string,
  ) => void;
  decreaseQuantity: (
    productId: ProductId,
    selectedSize: string,
  ) => void;
  removeFromCart: (
    productId: ProductId,
    selectedSize: string,
  ) => void;
  clearCart: () => void;
};

type CartProviderProps = {
  children: ReactNode;
};

const CART_STORAGE_KEY = "mf-chikankari-cart";


function getWholesalePrice(product: ApiProduct) {
  if (product.wholesalePrice === null) {
    return null;
  }

  const value = Number(product.wholesalePrice);

  return Number.isFinite(value) ? value : null;
}

function getRetailPrice(product: ApiProduct) {
  const value = Number(product.price);

  return Number.isFinite(value) ? value : 0;
}

export function CartProvider({
  children,
}: CartProviderProps) {
  const { user } = useAuth();

  const isWholesaleUser =
    user?.role === "wholesale";

  const [cartItems, setCartItems] = useState<
    CartItem[]
  >(() => {
    try {
      const savedCart =
        localStorage.getItem(CART_STORAGE_KEY);

      if (!savedCart) {
        return [];
      }

      const parsedCart: unknown =
        JSON.parse(savedCart);

      return Array.isArray(parsedCart)
        ? (parsedCart as CartItem[])
        : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cartItems),
    );
  }, [cartItems]);

  const getPricingDetails = useCallback(
    (product: ApiProduct) => {
      const wholesalePrice =
        getWholesalePrice(product);

      const useWholesalePrice =
        isWholesaleUser &&
        wholesalePrice !== null;

      const minimumQuantity =
        useWholesalePrice
          ? Math.max(
              product.minimumWholesaleQuantity ?? 1,
              1,
            )
          : 1;

      return {
        unitPrice: useWholesalePrice
          ? wholesalePrice
          : getRetailPrice(product),

        pricingType: useWholesalePrice
          ? ("WHOLESALE" as const)
          : ("RETAIL" as const),

        minimumQuantity,
      };
    },
    [isWholesaleUser],
  );

  const addToCart = useCallback(
    (
      product: ApiProduct,
      quantity = 1,
      selectedSize = "",
    ) => {
      if (product.stock < 1) {
        return;
      }

      const pricing =
        getPricingDetails(product);

      if (
        pricing.minimumQuantity >
        product.stock
      ) {
        return;
      }

      const requestedQuantity = Math.max(
        quantity,
        pricing.minimumQuantity,
      );

      setCartItems((currentItems) => {
        const existingItem =
          currentItems.find(
            (item) =>
              item.id === product.id &&
              item.selectedSize ===
                selectedSize,
          );

        if (existingItem) {
          return currentItems.map((item) =>
            item.id === product.id &&
            item.selectedSize === selectedSize
              ? {
                  ...item,
                  ...pricing,
                  quantity: Math.min(
                    item.quantity +
                      requestedQuantity,
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
            ...pricing,
            quantity: Math.min(
              requestedQuantity,
              product.stock,
            ),
            selectedSize,
          },
        ];
      });
    },
    [getPricingDetails],
  );

  const increaseQuantity = useCallback(
    (
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
    },
    [],
  );

  const decreaseQuantity = useCallback(
    (
      productId: ProductId,
      selectedSize: string,
    ) => {
      setCartItems((currentItems) =>
        currentItems.map((item) => {
          if (
            item.id !== productId ||
            item.selectedSize !== selectedSize
          ) {
            return item;
          }

          return {
            ...item,
            quantity: Math.max(
              item.quantity - 1,
              item.minimumQuantity,
            ),
          };
        }),
      );
    },
    [],
  );

  const removeFromCart = useCallback(
    (
      productId: ProductId,
      selectedSize: string,
    ) => {
      setCartItems((currentItems) =>
        currentItems.filter(
          (item) =>
            !(
              item.id === productId &&
              item.selectedSize ===
                selectedSize
            ),
        ),
      );
    },
    [],
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total + item.quantity,
        0,
      ),
    [cartItems],
  );

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total +
          item.unitPrice * item.quantity,
        0,
      ),
    [cartItems],
  );

  const value = useMemo<CartContextType>(
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
    [
      cartItems,
      cartCount,
      subtotal,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      clearCart,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

