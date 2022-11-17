import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

export const pagingSlice = createSlice({
  name: "paging",
  //초기값
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

//actions
//dispatch할 때 액션을 전달해 상태를 어떻게 변화시킬지를 결정한다
export const { increment, decrement } = pagingSlice.actions;

//reducer
export default pagingSlice.reducer;