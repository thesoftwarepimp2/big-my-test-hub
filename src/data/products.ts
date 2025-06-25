
import { Product } from '@/types';

export const categories = [
  'All Products',
  'flour',
  'oil', 
  'rice',
  'beans',
  'soap',
  'canned_fish',
  'noodles',
  'milk',
  'margarine',
  'potatoes'
];

export const products: Product[] = [
  {
    id: '1',
    name: 'MEGA ROLLER FLOUR 10KG',
    category: 'flour',
    image: '/lovable-uploads/50ac899e-bf20-4786-be08-712026aa8f35.png',
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
    name: 'MEGA SELF RAISING FLOUR 5KG',
    category: 'flour',
    image: '/lovable-uploads/7ba6c1bf-d328-4983-898a-4299ab38d252.png',
    description: 'Self-raising flour with baking powder already mixed in for convenient baking',
    sizes: [
      { size: '2KG', usdPrice: 5.00, zigPrice: 2500 },
      { size: '5KG', usdPrice: 11.75, zigPrice: 5875 }
    ],
    inStock: true
  },
  {
    id: '3',
    name: 'BUTTERCUP MARGARINE',
    category: 'margarine',
    image: '/lovable-uploads/b7f3f2f0-e928-4629-9632-8db9b173d025.png',
    description: 'Premium margarine for baking and cooking',
    sizes: [
      { size: '500G', usdPrice: 3.25, zigPrice: 1625 },
      { size: '1KG', usdPrice: 6.50, zigPrice: 3250 }
    ],
    inStock: true
  },
  {
    id: '4',
    name: 'CHIMOMBE FULL CREAM MILK 1L',
    category: 'milk',
    image: '/lovable-uploads/7fff88c9-3af3-45fc-be84-9c9e87de1377.png',
    description: 'Fresh full cream milk, long life',
    sizes: [
      { size: '500ML', usdPrice: 2.25, zigPrice: 1125 },
      { size: '1L', usdPrice: 4.25, zigPrice: 2125 }
    ],
    inStock: true
  },
  {
    id: '5',
    name: 'MEGA SUGAR BEANS 2KG',
    category: 'beans',
    image: '/lovable-uploads/ef78ce99-0223-4377-ad39-2352f61a281e.png',
    description: 'High quality sugar beans, rich in protein and perfect for traditional meals',
    sizes: [
      { size: '1KG', usdPrice: 4.75, zigPrice: 2375 },
      { size: '2KG', usdPrice: 8.75, zigPrice: 4375 }
    ],
    inStock: false
  },
  {
    id: '6',
    name: 'KOO BAKED BEANS 410G',
    category: 'beans',
    image: '/lovable-uploads/dae9e62f-8fa7-4997-8a0b-84c8c7f202be.png',
    description: 'Baked beans in tomato sauce, ready to eat',
    sizes: [
      { size: '410G', usdPrice: 2.85, zigPrice: 1425 }
    ],
    inStock: true
  },
  {
    id: '7',
    name: 'POTATOES 10KG',
    category: 'potatoes',
    image: '/lovable-uploads/be0e8735-437a-426c-9cc1-fecba4b739d4.png',
    description: 'Fresh potatoes, perfect for cooking and frying',
    sizes: [
      { size: '5KG', usdPrice: 3.50, zigPrice: 1750 },
      { size: '10KG', usdPrice: 6.75, zigPrice: 3375 }
    ],
    inStock: true
  },
  {
    id: '8',
    name: 'WILLARDS NIKNAKS',
    category: 'noodles',
    image: '/lovable-uploads/c1baf6b1-44a5-4624-8f19-9c8c16186d1c.png',
    description: 'Crispy corn snacks with spicy flavor',
    sizes: [
      { size: '150G', usdPrice: 1.85, zigPrice: 925 }
    ],
    inStock: true
  }
];
