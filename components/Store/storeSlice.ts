import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBLEPrinter } from "react-native-thermal-receipt-printer-image-qr";

const initialState: StoreState = {
  selectedStoreId: null,
  base64ReceiptLogo: "",
  isAutoPrintReceipt: false,
  selectedBluetoothPrinter: null,
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    selectBluetoothPrinter: (
      state,
      action: PayloadAction<IBLEPrinter | null>
    ) => {
      state.selectedBluetoothPrinter = action.payload;
    },
    setAutoPrintReceipt: (state, action: PayloadAction<boolean>) => {
      state.isAutoPrintReceipt = action.payload;
    },
    setBase64ReceiptLogo: (state, action: PayloadAction<string>) => {
      state.base64ReceiptLogo = action.payload;
    },
  },
  extraReducers: (build) => {},
});

export const {
  setAutoPrintReceipt,
  selectBluetoothPrinter,
  setBase64ReceiptLogo,
} = storeSlice.actions;

export default storeSlice.reducer;

interface StoreState {
  selectedStoreId: number | null;
  base64ReceiptLogo: string;
  isAutoPrintReceipt: boolean;
  selectedBluetoothPrinter: IBLEPrinter | null;
}
