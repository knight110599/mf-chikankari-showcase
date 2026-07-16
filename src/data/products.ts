export type Product = {
  id: number;
  name: string;
  slug: string;
  category: "Kurtis" | "Suits" | "Dupattas" | "Co-ord Sets";
  price: number;
  wholesalePrice: number;
  image: string;
  fabric: string;
  sizes: string[];
  featured: boolean;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Blue Cotton Chikankari Kurti",
    slug: "blue-cotton-chikankari-kurti",
    category: "Kurtis",
    price: 1499,
    wholesalePrice: 899,
    image: "/src/assets/images/kurtis.jpg",
    fabric: "Cotton",
    sizes: ["S", "M", "L", "XL"],
    featured: true,
  },
  {
    id: 2,
    name: "Ivory Chikankari Suit Set",
    slug: "ivory-chikankari-suit-set",
    category: "Suits",
    price: 2599,
    wholesalePrice: 1699,
    image: "/src/assets/images/suits.jpg",
    fabric: "Modal",
    sizes: ["M", "L", "XL", "XXL"],
    featured: true,
  },
  {
    id: 3,
    name: "White Embroidered Dupatta",
    slug: "white-embroidered-dupatta",
    category: "Dupattas",
    price: 999,
    wholesalePrice: 599,
    image: "/src/assets/images/dupattas.jpg",
    fabric: "Cotton Voile",
    sizes: ["Free Size"],
    featured: false,
  },
];