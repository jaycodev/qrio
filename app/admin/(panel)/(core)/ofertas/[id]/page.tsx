import { redirect } from 'next/navigation'

export default function Page() {
  // Página de detalle removida: redirigir a la lista de ofertas
  redirect('/admin/ofertas')
  return null
}
