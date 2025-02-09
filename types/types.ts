export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
};

export type OrderItem = {
  id: number;
  menuItem: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  totalPrice: number;
};

export type Order = {
  id: number;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
};

export type PageProps = {
  params: { id: string };
};
