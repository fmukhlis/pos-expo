import "react-native-get-random-values";

import { v4 as uuidv4 } from "uuid";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Product } from "@/types/product";

export const resetOrder = createAction("order/resetOrder");

const initialState: OrderState = {
  items: [],
  selectedItem: null,
  totalCharge: 0,
  openModals: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addItem: (state, { payload }: AddItemPayload) => {
      if ("product" in payload) {
        const {
          note,
          product,
          discount,
          quantity,
          selectedVariantId,
          selectedModifierIds,
        } = payload;

        state.items.push({
          id: uuidv4(),
          note,
          product,
          discount,
          quantity,
          selectedVariantId,
          selectedModifierIds,
        } as StandardItem);
      } else {
        const { price, note, discount } = payload;

        state.items.push({
          id: uuidv4(),
          note,
          price,
          discount,
          quantity: "1",
        } as CustomItem);
      }
      state.totalCharge = calculateTotalCharge(state.items);
    },
    removeItem: (state) => {
      const index = state.items.findIndex(
        (item) => item.id === state.selectedItem?.id
      );
      if (index !== -1) {
        state.items.splice(index, 1);
        state.totalCharge = calculateTotalCharge(state.items);
      } else {
        state.items = [];
        state.totalCharge = 0;
      }
    },
    updateItem: (state, { payload }: UpdateItemPayload) => {
      const index = state.items.findIndex(
        (item) => item.id === state.selectedItem?.id
      );
      if (state.items[index]) {
        if ("product" in state.items[index]) {
          if ("product" in payload) {
            const {
              note,
              product,
              quantity,
              discount,
              selectedVariantId,
              selectedModifierIds,
            } = payload;

            state.items[index].note = note;
            state.items[index].product = product;
            state.items[index].quantity = quantity;
            state.items[index].discount = discount;
            state.items[index].selectedVariantId = selectedVariantId;
            state.items[index].selectedModifierIds = selectedModifierIds;
          }
        } else {
          if (!("product" in payload)) {
            const { price, quantity, note, discount } = payload;

            state.items[index].note = note;
            state.items[index].price = price;
            state.items[index].quantity = quantity;
            state.items[index].discount = discount;
          }
        }
        state.totalCharge = calculateTotalCharge(state.items);
      }
    },
    setDiscountGlobally: (state, { payload }: PayloadAction<string>) => {
      state.items.forEach((item) => {
        item.discount = payload;
      });
      state.totalCharge = calculateTotalCharge(state.items);
    },
    setSelectedItem: (state, { payload }: PayloadAction<Item | null>) => {
      state.selectedItem = payload;
    },
    openModal: (state, { payload }: PayloadAction<string>) => {
      state.openModals.push(payload);
    },
    closeModal: (state, { payload }: PayloadAction<string>) => {
      state.openModals = state.openModals.filter(
        (modalName) => modalName !== payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetOrder, () => initialState);
  },
});

export const {
  addItem,
  removeItem,
  setSelectedItem,
  updateItem,
  setDiscountGlobally,
  closeModal,
  openModal,
} = orderSlice.actions;

export default orderSlice.reducer;

const calculateTotalCharge = (items: Item[]) => {
  const totalCharge = items.reduce((accumulator, currentItem) => {
    const price =
      "product" in currentItem
        ? currentItem.product.availableVariants.find(
            (variant) => `${variant.id}` === currentItem.selectedVariantId
          )!.price
        : currentItem.price;

    return (
      accumulator +
      (currentItem.discount
        ? Number(price) * Number(currentItem.quantity) -
          Number(price) *
            Number(currentItem.quantity) *
            (Number(currentItem.discount) / 100)
        : Number(price) * Number(currentItem.quantity))
    );
  }, 0);
  return totalCharge;
};

interface OrderState {
  items: Item[];
  selectedItem: Item | null;
  totalCharge: number;
  openModals: string[];
}

export type Item = CustomItem | StandardItem;

export interface CustomItem {
  id: string;
  note: string;
  price: string;
  discount: string;
  quantity: string;
}

export interface StandardItem extends Omit<CustomItem, "price"> {
  product: Product;
  selectedVariantId: string;
  selectedModifierIds: string[];
}

type AddItemPayload = PayloadAction<
  Omit<CustomItem, "id" | "quantity"> | Omit<StandardItem, "id">
>;

type UpdateItemPayload = PayloadAction<
  Omit<CustomItem, "id"> | Omit<StandardItem, "id">
>;
