export interface PaymentMethodPayload {
  name: string;
  destination: string;
}

export interface PaymentMethod extends PaymentMethodPayload {
  id: number;
}

export interface DetailedPaymentMethod extends PaymentMethod {}
