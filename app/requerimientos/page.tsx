import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Requerimientos',
}

export default function Page() {
  return (
    <div className="p-6">
      {/* EN CONSTRUCCION */}
      <h1 className="text-2xl font-semibold">Requerimientos</h1>
      <p className="text-muted-foreground mt-2">EN CONSTRUCCION...</p>
    </div>
  )
}
