"use client"
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

type ToastType = 'success' | 'error' | 'info'

type Toast = {
  id: string
  message: string
  type: ToastType
  duration?: number
}

type ToastContextValue = {
  addToast: (message: string, type?: ToastType, duration?: number) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const addToast = useCallback((message: string, type: ToastType = 'success', duration = 4000) => {
    const id = String(Date.now()) + Math.random().toString(16).slice(2)
    const toast: Toast = { id, message, type, duration }
    setToasts((t) => [...t, toast])
    // schedule removal
    setTimeout(() => removeToast(id), duration)
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container: bottom-right, small text, icon, simple fade-in */}
      <div aria-live="polite" className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end">
        {toasts.map((t) => (
          <div key={t.id} className={`max-w-sm w-full flex items-center gap-3 px-4 py-2 rounded-full shadow transform transition duration-200 ease-out ${t.type === 'success' ? 'bg-blue text-white' : t.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-800 text-white'}`}>
            {/* icon */}
            <span className="flex-none">
              {t.type === 'success' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 01.083 1.32l-.083.094L8.707 14.707a1 1 0 01-1.414 0L3.293 10.707a1 1 0 011.32-1.497l.094.083L7 12.586l8.293-8.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.68-1.36 3.445 0l5.518 9.82c.75 1.334-.213 2.98-1.722 2.98H4.461c-1.51 0-2.472-1.646-1.722-2.98l5.518-9.82zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-8a1 1 0 00-.993.883L9 6v4a1 1 0 001.993.117L11 10V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </span>
            <div className="flex-1 text-sm">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider
