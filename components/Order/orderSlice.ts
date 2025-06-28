import "react-native-get-random-values";

import { v4 as uuidv4 } from "uuid";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Product } from "@/types/product";
import {
  DetailedOrder,
  CustomItemPayload,
  IssueRefundPayload,
  StandardItemPayload,
} from "@/types/order";

export const resetOrder = createAction("order/resetOrder");

const initialState: OrderState = {
  items: [],
  openModals: [],
  refreshKey: 0,
  totalCharge: 0,
  selectedItem: null,
  selectedOrder: null,
  refundPayload: {
    reason: "",
    authorizationCode: "",
    orderProductVariantIds: [],
  },
  selectedProduct: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addItem: (state, { payload }: AddItemPayload) => {
      if ("variantId" in payload) {
        const {
          name,
          note,
          price,
          discount,
          quantity,
          variantId,
          modifierIds,
          optionNames,
        } = payload;

        state.items.push({
          id: uuidv4(),
          name,
          note,
          price,
          discount,
          quantity,
          variantId,
          modifierIds,
          optionNames,
        } as StandardItem);
      } else {
        const { customAmount, note, discount } = payload;

        state.items.push({
          id: uuidv4(),
          note,
          name: "Custom amount",
          discount,
          quantity: "1",
          customAmount,
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
        if ("variantId" in state.items[index]) {
          if ("variantId" in payload) {
            const {
              name,
              note,
              price,
              quantity,
              discount,
              variantId,
              modifierIds,
              optionNames,
            } = payload;

            state.items[index].name = name;
            state.items[index].note = note;
            state.items[index].price = price;
            state.items[index].quantity = quantity;
            state.items[index].discount = discount;
            state.items[index].variantId = variantId;
            state.items[index].modifierIds = modifierIds;
            state.items[index].optionNames = optionNames;
          }
        } else {
          if (!("variantId" in payload)) {
            const { customAmount, quantity, note, discount } = payload;

            state.items[index].note = note;
            state.items[index].quantity = quantity;
            state.items[index].discount = discount;
            state.items[index].customAmount = customAmount;
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
    setSelectedProduct: (state, { payload }: PayloadAction<Product | null>) => {
      state.selectedProduct = payload;
    },
    openModal: (state, { payload }: PayloadAction<string>) => {
      state.openModals.push(payload);
    },
    closeModal: (state, { payload }: PayloadAction<string>) => {
      state.openModals = state.openModals.filter(
        (modalName) => modalName !== payload
      );
    },
    regenerateRefreshKey: (state) => {
      state.refreshKey = Date.now();
    },
    setRefundPayload: (
      state,
      { payload }: PayloadAction<IssueRefundPayload>
    ) => {
      state.refundPayload = payload;
    },
    selectOrder: (state, { payload }: PayloadAction<DetailedOrder | null>) => {
      state.selectedOrder = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetOrder, () => initialState);
  },
});

export const {
  addItem,
  openModal,
  closeModal,
  removeItem,
  updateItem,
  selectOrder,
  setSelectedItem,
  setRefundPayload,
  setSelectedProduct,
  setDiscountGlobally,
  regenerateRefreshKey,
} = orderSlice.actions;

export default orderSlice.reducer;

const calculateTotalCharge = (items: Item[]) => {
  const totalCharge = items.reduce((accumulator, currentItem) => {
    const price =
      "variantId" in currentItem ? currentItem.price : currentItem.customAmount;

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
  openModals: string[];
  refreshKey: number;
  totalCharge: number;
  selectedItem: Item | null;
  selectedOrder: DetailedOrder | null;
  refundPayload: IssueRefundPayload;
  selectedProduct: Product | null;
}

export type Item = CustomItem | StandardItem;

export interface CustomItem extends CustomItemPayload {
  id: string;
  name: string;
}

export interface StandardItem extends StandardItemPayload {
  id: string;
  name: string;
  price: string;
  optionNames: string;
}

type AddItemPayload = PayloadAction<
  Omit<CustomItem, "id" | "name" | "quantity"> | Omit<StandardItem, "id">
>;

type UpdateItemPayload = PayloadAction<
  Omit<CustomItem, "id"> | Omit<StandardItem, "id">
>;
