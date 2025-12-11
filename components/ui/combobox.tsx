'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export interface ComboBoxOption {
  value: string | number
  label: string
}

interface ComboBoxProps {
  value?: string | number
  onChange?: (value: string | number) => void
  options: ComboBoxOption[]
  placeholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
}

export function ComboBox({
  value,
  onChange,
  options,
  placeholder = 'Seleccione...',
  emptyText = 'Sin resultados',
  disabled,
  className,
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false)
  const selected = options.find((o) => String(o.value) === String(value))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
          disabled={disabled}
        >
          {selected ? selected.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar..." />
          <CommandEmpty>{emptyText}</CommandEmpty>
          <CommandGroup>
            {options.map((o) => (
              <CommandItem
                key={String(o.value)}
                value={String(o.label)}
                onSelect={() => {
                  onChange?.(o.value)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn('mr-2 h-4 w-4', String(o.value) === String(value) ? 'opacity-100' : 'opacity-0')}
                />
                {o.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
