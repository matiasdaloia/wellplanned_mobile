import { create } from "zustand";
import { todaySlot } from "./date/utils";

interface AppState {
  selectedWeekDay: number; // 0 = Sunday, 6 = Saturday
  setSelectedWeekDay: (day: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedWeekDay: todaySlot,
  setSelectedWeekDay: (day) => {
    if (day < 0 || day > 6) {
      throw new Error("Day must be between 0 and 6");
    }
    set({ selectedWeekDay: day });
  },
}));
