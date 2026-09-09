import { create } from "zustand";

const useNotificationStore = create((set) => ({
  message: null,
  setNotification: (msg) =>
    set(() => ({
      message: msg,
    })),
  clearNotification: () =>
    set(() => ({
      message: null,
    })),
}));

export default useNotificationStore;
