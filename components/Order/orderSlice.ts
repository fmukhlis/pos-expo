import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: OrderState = {
  items: [],
  selectedItemId: null,
  totalCharge: 0,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
});

export default orderSlice.reducer;

interface OrderState {
  items: Item[];
  selectedItemId: string | null;
  totalCharge: number;
}

interface Item {
  id: string;
  note?: string;
  customAmount?: string;
  productVariantId?: string;
}
