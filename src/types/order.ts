// src/types/order.ts

export interface OrderAddress {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postcode: string;
  country: string;
  company?: string;
}

export interface OrderLineItem {
  productId: number;
  quantity: number;
  variationId?: number;
  metaData?: Array<{
    key: string;
    value: string;
  }>;
}

export interface CreateOrderInput {
  clientMutationId: string;
  billing: OrderAddress;
  shipping?: OrderAddress;
  lineItems: OrderLineItem[];
  shippingLines?: Array<{
    methodId: string;
    methodTitle: string;
    total: string;
  }>;
  paymentMethod: string;
  paymentMethodTitle: string;
  setPaid?: boolean;
  status?: string;
  customerNote?: string;
}

export interface Order {
  id: string;
  databaseId: number;
  orderNumber: string;
  status: string;
  total: string;
  date: string;
  billing: OrderAddress;
  shipping: OrderAddress;
  lineItems: {
    nodes: Array<{
      productId: number;
      quantity: number;
      total: string;
      product: {
        node: {
          id: string;
          name: string;
        };
      };
    }>;
  };
  shippingLines: {
    nodes: Array<{
      methodTitle: string;
      total: string;
    }>;
  };
  paymentMethod: string;
  paymentMethodTitle: string;
}

export interface CreateOrderResponse {
  createOrder: {
    clientMutationId: string;
    order: Order;
  };
}