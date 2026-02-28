// eBay Browse API type definitions

export interface EbayTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface EbaySearchResponse {
  href: string;
  total: number;
  next?: string;
  limit: number;
  offset: number;
  itemSummaries?: EbayItemSummary[];
}

export interface EbayItemSummary {
  itemId: string;
  title: string;
  leafCategoryIds?: string[];
  categories?: { categoryId: string; categoryName: string }[];
  image?: { imageUrl: string };
  price: {
    value: string;
    currency: string;
  };
  itemHref: string;
  seller: {
    username: string;
    feedbackPercentage: string;
    feedbackScore: number;
  };
  condition?: string;
  conditionId?: string;
  thumbnailImages?: { imageUrl: string }[];
  shippingOptions?: {
    shippingCostType: string;
    shippingCost?: {
      value: string;
      currency: string;
    };
    minEstimatedDeliveryDate?: string;
    maxEstimatedDeliveryDate?: string;
  }[];
  buyingOptions?: string[];
  itemWebUrl: string;
  itemLocation?: {
    postalCode?: string;
    country: string;
    stateOrProvince?: string;
    city?: string;
  };
  adultOnly?: boolean;
  currentBidPrice?: {
    value: string;
    currency: string;
  };
  itemEndDate?: string;
}
