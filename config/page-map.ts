type PageMeta = {
  title: string
  authOnly?: boolean
  showInSidebar?: boolean
  resource?: string
}

export const pageMap: Record<string, PageMeta> = {
  '/admin': { title: 'Dashboard', authOnly: true, showInSidebar: true },

  '/admin/productos': {
    title: 'Productos',
    authOnly: true,
    showInSidebar: true,
    resource: 'products',
  },
  '/admin/categorias': {
    title: 'Categorías',
    authOnly: true,
    showInSidebar: true,
    resource: 'categories',
  },
  '/admin/pedidos': {
    title: 'Pedidos',
    authOnly: true,
    showInSidebar: true,
    resource: 'orders',
  },
  '/admin/mesas': {
    title: 'Mesas',
    authOnly: true,
    showInSidebar: true,
    resource: 'tables',
  },
  '/admin/ofertas': {
    title: 'Ofertas',
    authOnly: true,
    showInSidebar: true,
    resource: 'offers',
  },
  '/admin/empleados': {
    title: 'Empleados',
    authOnly: true,
    showInSidebar: true,
    resource: 'employees',
  },
  '/admin/clientes': {
    title: 'Clientes',
    authOnly: true,
    showInSidebar: true,
    resource: 'customers',
  },

  '/admin/ajustes': { title: 'Ajustes', authOnly: true, showInSidebar: true },
  '/admin/ajustes/cuenta': { title: 'Cuenta', authOnly: true },
  '/admin/ajustes/apariencia': { title: 'Apariencia', authOnly: true },
  '/admin/ajustes/notificaciones': { title: 'Notificaciones', authOnly: true },
  '/admin/ajustes/visualizacion': { title: 'Visualización', authOnly: true },

  '/admin/centro-de-ayuda': { title: 'Centro de ayuda', authOnly: true, showInSidebar: true },

  '/iniciar-sesion': { title: 'Iniciar sesión' },
  '/registrarse': { title: 'Registrarse' },
  '/iniciar-sesion-admin': { title: 'Iniciar sesión (App Admin)' },
  '/requerimientos': { title: 'Requerimientos', authOnly: true },

  '/error/401': { title: 'Acceso no autorizado' },
  '/error/403': { title: 'Acceso denegado' },
  '/error/404': { title: 'Página no encontrada' },
  '/error/500': { title: 'Algo salió mal' },
  '/error/503': { title: 'Sitio en mantenimiento' },
} as const

export type ValidUrl = keyof typeof pageMap
