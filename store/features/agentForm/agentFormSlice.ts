import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AgentFormState {
  isOpen: boolean;
}

const initialState: AgentFormState = {
  isOpen: false,
};

const agentFormSlice = createSlice({
  name: "agentForm",
  initialState,
  reducers: {
    openForm: (state) => {
      state.isOpen = true;
    },
    closeForm: (state) => {
      state.isOpen = false;
    },
    toggleForm: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openForm, closeForm, toggleForm } = agentFormSlice.actions;
export default agentFormSlice.reducer;

