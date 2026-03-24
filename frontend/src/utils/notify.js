import toast from "react-hot-toast";

const baseOptions = {
  duration: 2200,
  style: {
    borderRadius: "14px",
    fontWeight: 600,
    border: "1px solid transparent",
  },
};

export const notifySuccess = (message) =>
  toast.success(message, {
    ...baseOptions,
    style: {
      ...baseOptions.style,
      background: "#ecfdf3",
      color: "#166534",
      borderColor: "#86efac",
    },
  });

export const notifyError = (message) =>
  toast.error(message, {
    ...baseOptions,
    duration: 3000,
    style: {
      ...baseOptions.style,
      background: "#fef2f2",
      color: "#991b1b",
      borderColor: "#fca5a5",
    },
  });

export const notifyInfo = (message) =>
  toast(message, {
    ...baseOptions,
    icon: "ℹ️",
    style: {
      ...baseOptions.style,
      background: "#eff6ff",
      color: "#1e3a8a",
      borderColor: "#93c5fd",
    },
  });
