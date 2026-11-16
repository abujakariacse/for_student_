// App-wide toast API.
//
// The root layout renders the Sonner <Toaster /> (components/ui/sonner), so
// this module routes `toast.add()` calls into Sonner while keeping the
// `{ title, description, type }` signature every page uses.

import { toast as sonnerToast } from "sonner"

type ToastType = "success" | "error" | "warning" | "info"

type ToastPayload = {
  title: string
  description?: string
  type?: ToastType
}

const emitToast = ({ title, description, type = "info" }: ToastPayload) => {
  const emit =
    type === "success"
      ? sonnerToast.success
      : type === "error"
        ? sonnerToast.error
        : type === "warning"
          ? sonnerToast.warning
          : sonnerToast.info

  emit(title, { description })
}

export const toast = {
  add: emitToast,
}

export type { ToastPayload, ToastType }
