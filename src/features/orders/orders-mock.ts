export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type MockOrder = {
  id: string;
  product: string;
  imageId: number;
  seller: string;
  sellerRole: "merchant" | "designer";
  amount: number;
  status: OrderStatus;
  placedAt: string;
  conversationId?: string;
};

const d = (daysAgo: number) =>
  new Date(Date.now() - daysAgo * 86_400_000).toISOString();

export const MOCK_ORDERS: MockOrder[] = [
  {
    id: "WNC-1042",
    product: "Wireless Headphones",
    imageId: 374,
    seller: "TechStore",
    sellerRole: "merchant",
    amount: 89.99,
    status: "delivered",
    placedAt: d(18),
    conversationId: "conv-2",
  },
  {
    id: "WNC-1038",
    product: "Urban Jacket (Size L)",
    imageId: 429,
    seller: "Urban Shop",
    sellerRole: "merchant",
    amount: 145.0,
    status: "shipped",
    placedAt: d(9),
    conversationId: "conv-5",
  },
  {
    id: "WNC-1031",
    product: "Logo Design Package",
    imageId: 188,
    seller: "Alice Johnson",
    sellerRole: "designer",
    amount: 250.0,
    status: "delivered",
    placedAt: d(24),
    conversationId: "conv-1",
  },
  {
    id: "WNC-1027",
    product: "Brand Identity Kit",
    imageId: 244,
    seller: "Brandify Studio",
    sellerRole: "designer",
    amount: 450.0,
    status: "processing",
    placedAt: d(3),
    conversationId: "conv-4",
  },
  {
    id: "WNC-1019",
    product: "Minimalist Watch",
    imageId: 327,
    seller: "TechStore",
    sellerRole: "merchant",
    amount: 199.0,
    status: "cancelled",
    placedAt: d(31),
  },
  {
    id: "WNC-1011",
    product: "Custom Hoodie Print",
    imageId: 509,
    seller: "Urban Shop",
    sellerRole: "merchant",
    amount: 75.0,
    status: "returned",
    placedAt: d(45),
  },
  {
    id: "WNC-1007",
    product: "Leather Wallet",
    imageId: 117,
    seller: "Urban Shop",
    sellerRole: "merchant",
    amount: 55.0,
    status: "delivered",
    placedAt: d(60),
  },
  {
    id: "WNC-1003",
    product: "Social Media Kit",
    imageId: 291,
    seller: "Alice Johnson",
    sellerRole: "designer",
    amount: 120.0,
    status: "delivered",
    placedAt: d(72),
  },
  {
    id: "WNC-0998",
    product: "Bluetooth Speaker",
    imageId: 443,
    seller: "TechStore",
    sellerRole: "merchant",
    amount: 64.99,
    status: "delivered",
    placedAt: d(85),
  },
  {
    id: "WNC-0991",
    product: "Branding Consultation",
    imageId: 160,
    seller: "Brandify Studio",
    sellerRole: "designer",
    amount: 180.0,
    status: "delivered",
    placedAt: d(99),
  },
];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};
