'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '@/stores/ui-store'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info' | 'warning'

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const colors = {
  success: 'bg-green-50 border-green-500 text-green-800',
  error: 'bg-red-50 border-red-500 text-red-800',
  info: 'bg-blue-50 border-blue-500 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
}

const iconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  warning: 'text-yellow-500',
}

export function Toast() {
  const { toast, hideToast } = useUIStore()
  const { message, type, visible } = toast

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        hideToast()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [visible, hideToast])

  const Icon = icons[type as ToastType]
  const colorClass = colors[type as ToastType]
  const iconColorClass = iconColors[type as ToastType]

  return (
    <AnimatePresence>
      {visible && message && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md"
        >
          <div
            className={cn(
              'flex items-center gap-3 p-4 rounded-lg border shadow-lg',
              colorClass
            )}
          >
            <Icon className={cn('w-5 h-5 flex-shrink-0', iconColorClass)} />
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
              onClick={hideToast}
              className="p-1 hover:bg-black/5 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}