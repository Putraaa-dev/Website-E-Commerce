export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'Web' | 'Android' | 'UI/UX' | 'Machine Learning' | 'Data Science';
  thumbnail: string;
  techSpecs: {
    language: string;
    database?: string;
    framework?: string;
    version?: string;
  };
  features?: string[];
  demoUrl?: string;
  downloads: number;
}

export const categories = [
  { id: 'web', name: 'Web', icon: 'Globe' },
  { id: 'android', name: 'Android', icon: 'Smartphone' },
  { id: 'uiux', name: 'UI/UX', icon: 'Palette' },
  { id: 'ml', name: 'Machine Learning', icon: 'Brain' },
  { id: 'data-science', name: 'Data Science', icon: 'BarChart3' },
];

// Empty mock products array - all products are now fetched from the backend API
export const mockProducts: Product[] = [];
