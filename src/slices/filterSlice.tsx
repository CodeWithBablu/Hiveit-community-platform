import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type SortBy = "latest" | "top" | "hot";


export interface FilterState {
  filter: SortBy;
}

const defaultFilterState: FilterState = {
  filter: "hot",
};

export const FilterSlice = createSlice({
  name: "filterState",
  initialState: defaultFilterState,
  reducers: {
    setFilterState: (state, action: PayloadAction<{ filter: SortBy }>) => {
      return ({ ...state, filter: action.payload.filter });
    },
  },
});

export default FilterSlice.reducer;
