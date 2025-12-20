'use client'

import * as React from 'react'

import { useTenant } from '@/app/providers/tenant-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const tenant = useTenant()
  const rawSidebarData = require('./sidebar.data').sidebarData
  const role = tenant.user?.role
  const filteredNavGroups = rawSidebarData.navGroups.map((group: any) => ({
    ...group,
    items: group.items.filter((item: any) => {
      // Ocultar empleados para roles COCINA y EMPLEADO
      if (role === 'COCINA' || role === 'EMPLEADO') {
        return item.url !== '/admin/empleados'
      }
      return true
    }),
  }))
  const user = tenant.user ?? rawSidebarData.user
  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {filteredNavGroups.map((props: any) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser user={{ name: user.name, email: user.email, avatar: '' }} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
