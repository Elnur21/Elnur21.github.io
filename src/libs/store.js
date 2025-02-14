import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAppStore = create()(
  persist(
    (set, get) => ({
      tabs: [
        {
          icon: "/react_icon.svg",
          fileName: "home.jsx",
          path: "/",
        },
      ],
      setTabs: (tabs) => set({ tabs }),
      removeTab: (tabPath) =>
        set({ tabs: get().tabs.filter((tab) => tab.path !== tabPath) }),
      addTab: (newTab) =>
        set({
          tabs: get().tabs.find((tab) => tab?.path == newTab?.path)
            ? get().tabs
            : [...get().tabs, newTab],
        }),
    }),
    { name: "portfolio-store" }
  )
);
