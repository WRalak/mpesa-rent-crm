export type StkPushPayload = {
  amount: number;
  phone: string;
  accountReference: string;
  transactionDesc: string;
};

export type StkPushResponse = {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
};
