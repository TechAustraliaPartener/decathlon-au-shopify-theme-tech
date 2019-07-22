interface Window {
  productJSON: ProductJSON;
  realReplaceState: typeof window.history.replaceState;

  BISPopover: {
    show: (opts?: { variantId: number }) => void;
  };

  Shopify: {
    customer?: {
      email: string;
    };
  };
}

interface ProductJSON {
  id: number;
  title: string;
  handle: string;
  description: string;
  published_at: Date;
  created_at: Date;
  vendor: string;
  type: string;
  tags: string[];
  price: number;
  price_min: number;
  price_max: number;
  available: boolean;
  price_varies: boolean;
  compare_at_price: number | null;
  compare_at_price_min: number;
  compare_at_price_max: number;
  compare_at_price_varies: boolean;
  variants: Variant[];
  images: string[];
  featured_image: string;
  options: string[];
  content: string;
  rating: string;
}

interface Variant {
  id: number;
  title: string;
  option1: string;
  option2: string;
  option3: string;
  sku: string;
  requires_shipping: boolean;
  taxable: boolean;
  featured_image: FeaturedImage | null;
  available: boolean;
  name: string;
  public_title: string;
  options: string[];
  price: number;
  weight: number;
  compare_at_price: number | null;
  inventory_quantity: number;
  inventory_management: string;
  inventory_policy: string;
  barcode: string;
}

interface FeaturedImage {
  id: number;
  product_id: number;
  position: number;
  created_at: Date;
  updated_at: Date;
  alt: string | null;
  width: number;
  height: number;
  src: string;
  variant_ids: number[];
}

/**
 * Persistent Cart (Shopify) interfaces
 */

interface Customer {
  cart: Cart;
  customerID: string;
  cartID: string;
}

interface Cart {
  token: string;
  note: null;
  attributes: Attributes;
  original_total_price: number;
  total_price: number;
  total_discount: number;
  total_weight: number;
  item_count: number;
  items: Item[];
  requires_shipping: boolean;
  currency: string;
  items_subtotal_price: number;
  cart_level_discount_applications: any[];
}

interface Attributes {}

interface Item {
  id: number;
  properties: Attributes;
  quantity: number;
  variant_id: number;
  key: string;
  title: string;
  price: number;
  original_price: number;
  discounted_price: number;
  line_price: number;
  original_line_price: number;
  total_discount: number;
  discounts: any[];
  sku: string;
  grams: number;
  vendor: string;
  taxable: boolean;
  product_id: number;
  product_has_only_default_variant: boolean;
  gift_card: boolean;
  final_price: number;
  final_line_price: number;
  url: string;
  featured_image: FeaturedImage;
  image: string;
  handle: string;
  requires_shipping: boolean;
  product_type: string;
  product_title: string;
  product_description: string;
  variant_title: string;
  variant_options: string[];
  options_with_values: OptionsWithValue[];
  line_level_discount_allocations: any[];
}

interface FeaturedImage {
  url: string;
  aspect_ratio: number;
  alt: string;
}

interface OptionsWithValue {
  name: 'Color' | 'Model Code' | 'Size';
  value: string;
}
