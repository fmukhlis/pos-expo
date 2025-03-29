import "react-native-get-random-values";

import { v4 as uuidv4 } from "uuid";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
          state.items.push({ id: uuidv4(), quantity: "1", note, customAmount });
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
    updateItem: (
      state,
      { payload: { customAmount, note, quantity } }: UpdateItemPayload
    ) => {
      if (state.selectedItemId) {
        const index = state.items.findIndex(
          (item) => item.id === state.selectedItemId
        );
        if (customAmount !== undefined)
          state.items[index].customAmount = customAmount;
        if (note !== undefined) state.items[index].note = note;
        if (quantity !== undefined) state.items[index].quantity = quantity;

        state.totalCharge = calculateTotalCharge(state.items);
      }
    },
    setSelectedItemId: (state, { payload }: PayloadAction<string | null>) => {
      state.selectedItemId = payload;
    },
  },
});

export const { addItem, removeItem, setSelectedItemId, updateItem } =
  orderSlice.actions;

export default orderSlice.reducer;

const calculateTotalCharge = (items: Item[]) => {
  const totalCharge = items.reduce(
    (accumulator, currentItem) =>
      accumulator +
      Number(currentItem.customAmount) * Number(currentItem.quantity),
    0
  );
  return totalCharge;
};

interface OrderState {
  items: Item[];
  selectedItemId: string | null;
  totalCharge: number;
}

export interface Item {
  id: string;
  note?: string;
  quantity: string;
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
  quantity?: string;
  customAmount?: string;
}>;
