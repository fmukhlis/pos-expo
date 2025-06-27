import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBLEPrinter } from "react-native-thermal-receipt-printer-image-qr";

const initialState: StoreState = {
  selectedStoreId: null,
  isAutoPrintReceipt: false,
  selectedBluetoothPrinter: null,
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    setSelectedStoreId: (state, action: PayloadAction<number | null>) => {
      state.selectedStoreId = action.payload;
    },
    selectBluetoothPrinter: (
      state,
      action: PayloadAction<IBLEPrinter | null>
    ) => {
      state.selectedBluetoothPrinter = action.payload;
    },
    setAutoPrintReceipt: (state, action: PayloadAction<boolean>) => {
      state.isAutoPrintReceipt = action.payload;
    },
  },
  extraReducers: (build) => {},
});

export const {
  setSelectedStoreId,
  setAutoPrintReceipt,
  selectBluetoothPrinter,
} = storeSlice.actions;

export default storeSlice.reducer;

interface StoreState {
  selectedStoreId: number | null;
  isAutoPrintReceipt: boolean;
  selectedBluetoothPrinter: IBLEPrinter | null;
}
