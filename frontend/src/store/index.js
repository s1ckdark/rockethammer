import logger from "redux-logger";
import { configureStore } from "@reduxjs/toolkit";

import pagingReducer from "../redux/paging";
//redux store
export const store = configureStore({
  reducer: {
    paging: pagingReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    devTools: process.env.NODE_ENV !== "production", //  개발자 도구 on/off
    // preloadedState: {}, // 스토어의 초기값
    // 개발자가 원하는 store enhancer를 미들웨어가 적용되는 순서보다 앞서서 추가 가능
    // enhancers: [reduxBatch],
});