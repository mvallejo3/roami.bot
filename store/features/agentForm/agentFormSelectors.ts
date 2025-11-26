import type { RootState } from "@/store/store";

export const selectAgentFormIsOpen = (state: RootState) => state.agentForm.isOpen;

