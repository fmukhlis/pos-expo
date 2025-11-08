import { PaymentMethod } from "./payment-method";
import { Product, ProductModifier, ProductVariant } from "./product";
import { User } from "./user";

export interface Item {
  id: number;
  name: string;
  note: string;
  price: string;
  options: string[];
  quantity: string;
  discount: string;
  modifiers: string[];
  totalPrice: string;
}

export interface Order {
  id: number;
  createdAt: string;
  cashAmount: string;
  totalAmount: string;
  processedBy: { name: string; email: string };
  paymentMethod: PaymentMethod;
  orderedProducts: Item[];
}

export interface DetailedOrder extends Order {
  refunds: {
    products: Item[];
    refundedAt: string;
    totalAmount: string;
    processedBy: { name: string; email: string };
    refundReason: string;
  }[];
  refundableProducts: Item[];
}

export type ItemPayload = CustomItemPayload | StandardItemPayload;

export interface CustomItemPayload {
  note: string;
  discount: string;
  quantity: string;
  customAmount: string;
}

export interface StandardItemPayload
  extends Omit<CustomItemPayload, "customAmount"> {
  variantId: string;
  modifierIds: string[];
}

export interface OrderPayload {
  cashAmount: string;
  paymentMethodId: number;
  orderedProducts: ItemPayload[];
}

export interface IssueRefundPayload {
  reason: string;
  authorizationCode: string;
  orderProductVariantIds: string[];
}

export interface SalesSummary {
  from: string;
  to: string;
  totalTransactions: string;
  totalRevenue: string;
  averageOrderValue: string;
  byPaymentMethods: Record<string, string>[];
}
