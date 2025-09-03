// Basic product type (you might already have this)
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: string;
  regularPrice: string;
  salePrice?: string;
  onSale: boolean;
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_BACKORDER';
  stockQuantity?: number;
  sku: string;
  weight?: string;
  dimensions?: {
    length?: string;
    width?: string;
    height?: string;
  };
  image?: {
    sourceUrl: string;
    altText: string;
  };
  galleryImages?: {
    nodes: Array<{
      sourceUrl: string;
      altText: string;
    }>;
  };
  productCategories?: {
    nodes: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  };
  productTags?: {
    nodes: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  };
  attributes?: {
    nodes: Array<{
      name: string;
      options: string[];
      variation: boolean;
    }>;
  };
  variations?: {
    nodes: Array<{
      id: string;
      name: string;
      price: string;
      stockStatus: string;
      attributes: {
        nodes: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
  reviews?: {
    averageRating: number;
    reviewCount: number;
  };
  related?: {
    nodes: Product[];
  };
}

// Response type for single product
export interface ProductDetailData {
  product: Product;
}

// Response type for related products
export interface RelatedProductsData {
  products: {
    nodes: Product[];
  };
}