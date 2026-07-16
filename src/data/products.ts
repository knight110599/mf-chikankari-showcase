import kurtis from "../assets/images/kurtis.jpg";
import suits from "../assets/images/suits.jpg";
import dupattas from "../assets/images/dupattas.jpg";

export type Product = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  category: "Kurtis" | "Suits" | "Dupattas" | "Co-ord Sets";
  price: number;
  wholesalePrice: number;
  image: string;
  images: string[];
  fabric: string;
  sizes: string[];
  featured: boolean;
  stock: number;
  description: string;
  details: string[];
  care: string[];
};

export const products: Product[] = [
  {
    id: 1,
    name: "Blue Cotton Chikankari Kurti",
    slug: "blue-cotton-chikankari-kurti",
    sku: "MF-KUR-001",
    category: "Kurtis",
    price: 1499,
    wholesalePrice: 899,
    image: kurtis,
    images: [kurtis, kurtis, kurtis],
    fabric: "Premium Cotton",
    sizes: ["S", "M", "L", "XL"],
    featured: true,
    stock: 24,
    description:
      "A graceful blue cotton kurti featuring traditional Lucknowi Chikankari embroidery. Designed for comfortable everyday wear as well as elegant festive styling.",
    details: [
      "Authentic Lucknowi Chikankari embroidery",
      "Soft and breathable premium cotton",
      "Comfortable straight-fit silhouette",
      "Suitable for everyday and festive wear",
      "Handcrafted by skilled artisans",
    ],
    care: [
      "Gentle hand wash separately",
      "Use mild detergent",
      "Do not bleach",
      "Dry in shade",
      "Iron on low heat from the reverse side",
    ],
  },
  {
    id: 2,
    name: "Ivory Chikankari Suit Set",
    slug: "ivory-chikankari-suit-set",
    sku: "MF-SUIT-001",
    category: "Suits",
    price: 2599,
    wholesalePrice: 1699,
    image: suits,
    images: [suits, suits, suits],
    fabric: "Premium Modal",
    sizes: ["M", "L", "XL", "XXL"],
    featured: true,
    stock: 16,
    description:
      "An elegant ivory Chikankari suit set crafted from soft modal fabric. Its refined embroidery and comfortable silhouette make it ideal for festive occasions and sophisticated daily wear.",
    details: [
      "Premium handcrafted suit set",
      "Traditional Lucknowi embroidery",
      "Soft and lightweight modal fabric",
      "Elegant and comfortable silhouette",
      "Suitable for festive and formal occasions",
    ],
    care: [
      "Dry clean recommended",
      "Gentle hand wash if required",
      "Do not bleach",
      "Dry in shade",
      "Iron on low heat",
    ],
  },
  {
    id: 3,
    name: "White Embroidered Dupatta",
    slug: "white-embroidered-dupatta",
    sku: "MF-DUP-001",
    category: "Dupattas",
    price: 999,
    wholesalePrice: 599,
    image: dupattas,
    images: [dupattas, dupattas, dupattas],
    fabric: "Cotton Voile",
    sizes: ["Free Size"],
    featured: false,
    stock: 30,
    description:
      "A lightweight white cotton voile dupatta decorated with fine handcrafted embroidery. It pairs beautifully with kurtis, suits and festive ethnic outfits.",
    details: [
      "Fine handcrafted Chikankari embroidery",
      "Lightweight cotton voile fabric",
      "Soft and breathable finish",
      "Elegant traditional design",
      "Free-size styling",
    ],
    care: [
      "Gentle hand wash separately",
      "Use cold water",
      "Do not wring",
      "Dry in shade",
      "Iron on low heat",
    ],
  },
];