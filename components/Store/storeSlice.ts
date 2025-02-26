import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: StoreState = {
  selectedStoreId: null,
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    setSelectedStoreId: (state, action: PayloadAction<number | null>) => {
      state.selectedStoreId = action.payload;
    },
  },
  extraReducers: (build) => {},
});

export const { setSelectedStoreId } = storeSlice.actions;

export default storeSlice.reducer;

interface StoreState {
  selectedStoreId: number | null;
}
