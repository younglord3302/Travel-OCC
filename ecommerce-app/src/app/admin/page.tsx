import { redirect } from 'next/navigation'

export default function AdminRedirect() {
  // For now, redirect to a basic admin dashboard
  // In a real app, you'd check authentication here
  redirect('/admin/dashboard')
}
