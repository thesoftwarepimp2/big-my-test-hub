
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
    image: '/lovable-uploads/a482987a-a345-4e6b-9eab-cb6d18176549.png',
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
    image: '/lovable-uploads/87a386fc-72ae-45da-bce8-173bc5498a72.png',
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
    image: '/lovable-uploads/9fef6675-5097-40ac-9110-e5b7968e0f84.png',
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
    image: '/lovable-uploads/012ea675-7eaa-4ff1-a9e7-b57d4ef0a5e3.png',
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
    image: '/lovable-uploads/2ed906fe-a9f4-46ed-a5cb-0e7a98fb0654.png',
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
    image: '/lovable-uploads/d6d51239-dfcb-456c-a486-332108a7d290.png',
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
    image: '/lovable-uploads/36576d91-5be2-451a-8fbb-287796a51139.png',
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
    image: '/lovable-uploads/6b48b696-f25e-4f4d-83fb-416e5751eb90.png',
    description: 'Crispy corn snacks with spicy flavor',
    sizes: [
      { size: '150G', usdPrice: 1.85, zigPrice: 925 }
    ],
    inStock: true
  }
];
