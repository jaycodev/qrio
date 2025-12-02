export const columnLabelsByResource: Record<string, Record<string, string>> = {
  authors: {
    photoUrl: 'Foto',
    name: 'Nombre',
    nationality: 'Nacionalidad',
    birthDate: 'Fecha nacimiento',
    status: 'Estado',
  },
  orders: {
    code: 'Código',
    table: 'N° Mesa',
    customer: 'Cliente',
    status: 'Estado',
    total: 'Total',
    people: 'N° Personas',
    itemCount: 'Ítems',
  },
}

export function getColumnLabel(resource: string | undefined, columnId: string): string {
  if (!resource) return columnId
  return columnLabelsByResource[resource]?.[columnId] ?? columnId
}
