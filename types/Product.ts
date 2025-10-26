// TypeScript interfaces voor Product model
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: Array<{
    url: string;
    alt: string;
  }>;
  category: 'electronics' | 'fashion' | 'home' | 'sports' | 'beauty' | 'other';
  subcategory?: string;
  brand?: string;
  sku?: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  tags?: string[];
  specifications?: Map<string, string>;
  shipping?: {
    weight?: number;
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
    };
    freeShipping: boolean;
  };
  supplier?: {
    name?: string;
    contact?: string;
    email?: string;
  };
  reviews: Array<{
    userId: string;
    rating: number;
    comment?: string;
    createdAt: Date;
  }>;
  averageRating: number;
  totalReviews: number;
  sales: number;
  shopifyId?: string;
  shopifyVariantId?: string;
  trendingScore: number;
  isTrending: boolean;
  lastUpdated: Date;
  aliexpressUrl?: string;
  costPrice?: number;
  profitMargin?: number;
  // Timestamps (automatisch toegevoegd door Mongoose)
  createdAt: Date;
  updatedAt: Date;
  // Virtual fields
  discountPercentage: number;
}
