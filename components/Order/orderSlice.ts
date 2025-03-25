import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const initialState: OrderState = {
  items: [],
  selectedItemId: null,
  totalCharge: 0,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addItem: (
      state,
      { payload: { customAmount, note, productVariantId } }: AddItemPayload
    ) => {
      if (productVariantId) {
      } else {
        if (customAmount) {
          state.items.push({ id: uuidv4(), note, customAmount });
        }
      }
      state.totalCharge = calculateTotalCharge(state.items);
    },
    removeItem: (state) => {
      if (state.selectedItemId) {
        const index = state.items.findIndex(
          (item) => item.id === state.selectedItemId
        );
        state.items.splice(index, 1);
        state.totalCharge = calculateTotalCharge(state.items);
      } else {
        state.items = [];
        state.totalCharge = 0;
      }
    },
  },
});

export const { addItem, removeItem } = orderSlice.actions;

export default orderSlice.reducer;

const calculateTotalCharge = (items: Item[]) => {
  const totalCharge = items.reduce(
    (accumulator, currentItem) =>
      accumulator + Number(currentItem.customAmount),
    0
  );
  return totalCharge;
};

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

type AddItemPayload = PayloadAction<{
  note?: string;
  customAmount?: string;
  productVariantId?: string;
}>;

type UpdateItemPayload = PayloadAction<{
  note?: string;
  customAmount?: string;
  productVariantId?: string;
}>;
