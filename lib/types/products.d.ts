export interface Product {
  id: string
  category: number
  name: string
  description: string
  price: number
  imageUrl?: string
  available: boolean
}

declare module '@tanstack/react-table' {
  interface ColumnMeta {
    filter?: ColumnFilterMeta
    searchable?: boolean
    dateRangeFilter?: boolean
    cellClass?: string
    headerClass?: string
    customFacetCalculator?: (data: unknown[]) => Map<string, number>
    resource?: string
  }
}
