import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IBLEPrinter,
  INetPrinter,
} from "react-native-thermal-receipt-printer-image-qr";

const initialState: StoreState = {
  paperWidth: "58mm",
  selectedStoreId: null,
  base64ReceiptLogo: "",
  isAutoPrintReceipt: false,
  selectedNetPrinter: null,
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
    setPaperWidth: (state, action: PayloadAction<"58mm" | "80mm">) => {
      state.paperWidth = action.payload;
    },
    selectNetPrinter: (state, action: PayloadAction<INetPrinter | null>) => {
      state.selectedNetPrinter = action.payload;
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
  setPaperWidth,
  selectNetPrinter,
  setAutoPrintReceipt,
  setBase64ReceiptLogo,
  selectBluetoothPrinter,
} = storeSlice.actions;

export default storeSlice.reducer;

interface StoreState {
  paperWidth: "58mm" | "80mm";
  selectedStoreId: number | null;
  base64ReceiptLogo: string;
  isAutoPrintReceipt: boolean;
  selectedNetPrinter: INetPrinter | null;
  selectedBluetoothPrinter: IBLEPrinter | null;
}
