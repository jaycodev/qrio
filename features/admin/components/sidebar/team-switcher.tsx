import * as React from 'react'

import { ChevronsUpDown, Plus } from 'lucide-react'
import { ChefHat } from 'lucide-react'
import { toast } from 'sonner'

import { useTenant } from '@/app/providers/tenant-provider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

import { AddBranchDialog } from './add-branch-dialog'

export function TeamSwitcher() {
  const { isMobile } = useSidebar()
  const tenant = useTenant()
  const restaurantName = tenant.restaurant?.name ?? 'Restaurante'
  const branches = tenant.branches
  const activeBranch = branches.find((b) => b.id === tenant.branchId) ?? branches[0]

  const [openAdd, setOpenAdd] = React.useState(false)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <ChefHat className="size-5" />
              </div>
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-semibold">{restaurantName}</span>
                <span className="truncate text-xs">{activeBranch?.name ?? 'Sucursal'}</span>
              </div>
              <ChevronsUpDown className="ms-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Sucursal
            </DropdownMenuLabel>
            {branches.map((b) => (
              <DropdownMenuItem
                key={b.id}
                onClick={() => {
                  tenant.setBranchId(b.id)
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <ChefHat className="size-5 shrink-0" />
                </div>
                <div className="grid flex-1 text-start text-sm leading-tight">
                  <span className="truncate font-medium">{b.name}</span>
                  <span className="truncate text-xs">{b.address ?? ''}</span>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => {
                if (!tenant.restaurantId) {
                  toast.error('Debes tener un restaurante para agregar sucursales')
                  return
                }
                setOpenAdd(true)
              }}
            >
              <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Agregar negocio</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <AddBranchDialog
        open={openAdd}
        onOpenChange={setOpenAdd}
        onCreated={(br) => {
          tenant.refresh().then(() => {
            tenant.setBranchId(br.id)
          })
        }}
      />
    </SidebarMenu>
  )
}
