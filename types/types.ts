export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image?: string; 
}

export interface OrderItem {
  id: number;
  menuItem: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
}