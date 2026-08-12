import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import productReducer from './slices/product.slice';
import categoryReducer from './slices/category.slice';
import dashboardReducer from './slices/dashboard.slice';
import themeReducer from './slices/theme.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    category: categoryReducer,
    dashboard: dashboardReducer,
     theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;