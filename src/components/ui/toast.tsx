'use client'
import { useState, useEffect, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react'

export interface Toast {
  id: string
  title: string
  message: string
  type: 'error' | 'success' | 'info' | 'warning'
}

interface ToastContextType {
  toast: (options: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType>({
  toast: () => {},
  removeToast: () => {},
})

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({ title, message, type = 'error' }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, title, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 6000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
    success: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-400 shrink-0" />,
  }

  const borders = {
    error: 'border-red-500/30 bg-[#1e1315]/95',
    success: 'border-emerald-500/30 bg-[#0f1d18]/95',
    warning: 'border-amber-500/30 bg-[#1e180f]/95',
    info: 'border-indigo-500/30 bg-[#121424]/95',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${borders[toast.type]} shadow-2xl backdrop-blur-md text-white`}
    >
      {icons[toast.type]}
      <div className="flex-1 text-sm">
        <p className="font-semibold text-gray-100">{toast.title}</p>
        <p className="text-gray-300 text-xs mt-0.5 break-words line-clamp-4">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white p-0.5 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}
