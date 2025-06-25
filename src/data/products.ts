import { Product } from '@/types';

export const categories = [
  'All Products',
  'flour',
  'oil', 
  'rice',
  'beans',
  'soap',
  'canned_fish',
  'noodles'
];

export const products: Product[] = [
  {
    id: '1',
    name: 'MEGA ROLLER 10KG',
    category: 'flour',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
    description: 'Premium quality all-purpose flour perfect for baking bread, cakes, and pastries',
    sizes: [
      { size: '2KG', usdPrice: 4.50, zigPrice: 2250 },
      { size: '5KG', usdPrice: 10.25, zigPrice: 5125 },
      { size: '10KG', usdPrice: 18.50, zigPrice: 9250 }
    ],
    inStock: true
  },
  {
    id: '2',
    name: 'MEGA SELF RAISING 5KG',
    category: 'flour',
    image: 'https://images.unsplash.com/photo-1628449840934-58219a99476e?w=400&h=300&fit=crop',
    description: 'Self-raising flour with baking powder already mixed in for convenient baking',
    sizes: [
      { size: '2KG', usdPrice: 5.00, zigPrice: 2500 },
      { size: '5KG', usdPrice: 11.75, zigPrice: 5875 }
    ],
    inStock: true
  },
  {
    id: '3',
    name: 'DELTA COOKING OIL 2L',
    category: 'oil',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop',
    description: 'Pure sunflower cooking oil ideal for frying, baking, and salad dressing',
    sizes: [
      { size: '750ML', usdPrice: 4.25, zigPrice: 2125 },
      { size: '2L', usdPrice: 12.50, zigPrice: 6250 },
      { size: '5L', usdPrice: 28.00, zigPrice: 14000 }
    ],
    inStock: true
  },
  {
    id: '4',
    name: 'CAPRI RICE 10KG',
    category: 'rice',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
    description: 'Premium long grain white rice, perfect for everyday meals',
    sizes: [
      { size: '2KG', usdPrice: 5.50, zigPrice: 2750 },
      { size: '5KG', usdPrice: 12.75, zigPrice: 6375 },
      { size: '10KG', usdPrice: 22.00, zigPrice: 11000 }
    ],
    inStock: true
  },
  {
    id: '5',
    name: 'MEGA SUGAR BEANS 2KG',
    category: 'beans',
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop',
    description: 'High quality sugar beans, rich in protein and perfect for traditional meals',
    sizes: [
      { size: '1KG', usdPrice: 4.75, zigPrice: 2375 },
      { size: '2KG', usdPrice: 8.75, zigPrice: 4375 }
    ],
    inStock: false
  },
  {
    id: '6',
    name: 'SAFARI SOAP 800G',
    category: 'soap',
    image: 'https://images.unsplash.com/photo-1625772299848-391b64cd22db?w=400&h=300&fit=crop',
    description: 'Multi-purpose laundry soap bar for effective cleaning',
    sizes: [
      { size: '400G', usdPrice: 2.25, zigPrice: 1125 },
      { size: '800G', usdPrice: 4.00, zigPrice: 2000 }
    ],
    inStock: true
  },
  {
    id: '7',
    name: 'LUCKY STAR MACKEREL',
    category: 'canned_fish',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    description: 'Premium canned mackerel in tomato sauce, ready to eat',
    sizes: [
      { size: '400G', usdPrice: 3.25, zigPrice: 1625 }
    ],
    inStock: true
  },
  {
    id: '8',
    name: 'MEGA CAKE FLOUR 2KG',
    category: 'flour',
    sizes: [
      { size: '1KG', usdPrice: 3.50, zigPrice: 1750 },
      { size: '2KG', usdPrice: 6.75, zigPrice: 3375 }
    ],
    inStock: true
  },
  {
    id: '9',
    name: 'GOLDEN PILCHARDS 400G',
    category: 'canned_fish',
    sizes: [
      { size: '400G', usdPrice: 2.85, zigPrice: 1425 }
    ],
    inStock: true
  },
  {
    id: '10',
    name: 'MEGA NOODLES 500G',
    category: 'noodles',
    sizes: [
      { size: '500G', usdPrice: 4.50, zigPrice: 2250 }
    ],
    inStock: true
  }
];
