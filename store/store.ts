import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { chatApi } from "./features/chat/chatApi";
import { agentApi } from "./features/agents/agentApi";
import { modelApi } from "./features/models/modelApi";
import { knowledgebaseApi } from "./features/knowledgebase/knowledgebaseApi";
import agentFormReducer from "./features/agentForm/agentFormSlice";

export const store = configureStore({
  reducer: {
    [chatApi.reducerPath]: chatApi.reducer,
    [agentApi.reducerPath]: agentApi.reducer,
    [modelApi.reducerPath]: modelApi.reducer,
    [knowledgebaseApi.reducerPath]: knowledgebaseApi.reducer,
    agentForm: agentFormReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      chatApi.middleware,
      agentApi.middleware,
      modelApi.middleware,
      knowledgebaseApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

