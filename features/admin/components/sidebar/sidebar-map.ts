import {
  ChartColumnBig,
  CircleQuestionMark,
  Folder,
  HandPlatter,
  Percent,
  Settings,
  Table2,
  Users,
  Utensils,
} from 'lucide-react'

import { pageMap, type ValidUrl } from '@/config/page-map'

type SidebarVisualMeta = {
  icon: React.ElementType
  group: 'inicio' | 'principal' | 'otros'
}

export const sidebarMap: Partial<Record<ValidUrl, SidebarVisualMeta>> = {}

const setSidebar = <T extends ValidUrl>(url: T, meta: SidebarVisualMeta) => {
  if (pageMap[url].showInSidebar) {
    sidebarMap[url] = meta
  }
}

setSidebar('/admin', { icon: ChartColumnBig, group: 'inicio' })

setSidebar('/admin/productos', { icon: Utensils, group: 'principal' })
setSidebar('/admin/categorias', { icon: Folder, group: 'principal' })
setSidebar('/admin/pedidos', { icon: HandPlatter, group: 'principal' })
setSidebar('/admin/mesas', { icon: Table2, group: 'principal' })
setSidebar('/admin/ofertas', { icon: Percent, group: 'principal' })
setSidebar('/admin/clientes', { icon: Users, group: 'principal' })

setSidebar('/admin/ajustes', { icon: Settings, group: 'otros' })
setSidebar('/admin/centro-de-ayuda', { icon: CircleQuestionMark, group: 'otros' })
