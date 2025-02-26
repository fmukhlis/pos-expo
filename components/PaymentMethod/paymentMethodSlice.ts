import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: PaymentMethodState = {
  selectedPaymentMethodId: null,
};

const paymentMethodSlice = createSlice({
  name: "paymentMethod",
  initialState,
  reducers: {
    setSelectedPaymentMethodId: (
      state,
      action: PayloadAction<number | null>
    ) => {
      state.selectedPaymentMethodId = action.payload;
    },
  },
  extraReducers: (build) => {},
});

export const { setSelectedPaymentMethodId } = paymentMethodSlice.actions;

export default paymentMethodSlice.reducer;

interface PaymentMethodState {
  selectedPaymentMethodId: number | null;
}
