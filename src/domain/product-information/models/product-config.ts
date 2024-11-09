export interface ProductConfig {
  baseProductId: string;
  parentVendorCode: string;
  ean: string;
  sku: string;
  pimId: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  contentSize: string;
  dimensions: ProductDimensionsConfig;
  tags: string[];
}

export interface ProductDimensionsConfig {
  length: string;
  width: string;
  height: string;
  nettoWeight: string;
  bruttoWeight: string;
}

export interface ProductConfigurations {
  products: {
    [key: string]: ProductConfig & { inheritsFrom?: string };
  };
}
