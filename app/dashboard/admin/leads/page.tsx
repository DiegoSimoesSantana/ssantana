import { redirect } from 'next/navigation'

// /dashboard/admin/leads → admin usa /admin/dashboard com tab leads
export default function AdminLeadsRedirect() {
  redirect('/admin/dashboard')
}
