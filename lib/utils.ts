// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities
export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

export function formatRelativeTime(date: string | Date) {
  const now = new Date()
  const target = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return formatDate(date)
}

// Currency formatting
export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount / 100) // Convert from cents
}

// Pet status formatting
export function formatPetStatus(status: string) {
  const statusMap = {
    received: 'Received',
    prepared: 'Prepared', 
    in_chamber: 'In Chamber',
    cremated: 'Cremated',
    packaged: 'Packaged',
    ready: 'Ready for Pickup',
    completed: 'Completed'
  }
  
  return statusMap[status as keyof typeof statusMap] || status
}

// Tracking ID validation
export function isValidTrackingId(trackingId: string): boolean {
  return /^PR-\d{4}-\d{6}$/.test(trackingId)
}

// Generate tracking URL
export function getTrackingUrl(trackingId: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL}/track/${trackingId}`
}

// File size formatting
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}