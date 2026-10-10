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

      // Chat panel
      chatOpen: false,
      toggleChat: () => set({ chatOpen: !get().chatOpen }),
      setChatOpen: (chatOpen) => set({ chatOpen }),
      chatMessages: [],
      addChatMessage: (message) =>
        set({ chatMessages: [...get().chatMessages, message] }),
      clearChat: () => set({ chatMessages: [] }),
    }),
    {
      name: "portfolio-store",
      // The conversation itself is not saved, only whether the panel is open
      partialize: ({ tabs, chatOpen }) => ({ tabs, chatOpen }),
    }
  )
);
