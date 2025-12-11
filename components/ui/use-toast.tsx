import * as React from 'react'

import { type ToastProps } from './toast' // Necesita importar los tipos del componente toast.tsx

const TOAST_LIMIT = 1

type ToasActionType = {
  type: 'ADD_TOAST' | 'UPDATE_TOAST' | 'DISMISS_TOAST' | 'REMOVE_TOAST'
  toast?: Toast
  toastId?: string
}

type Toast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  duration?: number
  variant?: 'default' | 'destructive'
}

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const

type State = {
  toasts: Toast[]
}

const initialState: State = {
  toasts: [],
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

function reducer(state: State, action: ToasActionType): State {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast as Toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast!.id ? { ...t, ...action.toast } : t
        ),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action
      // Específicamente, establece 'open' en false para que el componente de Radix maneje la animación de salida.
      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.map((t) => (t.id === toastId ? { ...t, open: false } : t)),
        }
      }
      return {
        ...state,
        toasts: state.toasts.map((t) => ({ ...t, open: false })),
      }
    }

    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) return state
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
    default:
      return state
  }
}

const listeners: Array<(state: State) => void> = []

let state = initialState

function setState(action: ToasActionType) {
  state = reducer(state, action)
  listeners.forEach((listener) => listener(state))
}

export function useToast() {
  const [activeState, setActiveState] = React.useState(state)

  React.useEffect(() => {
    const listener = (newState: State) => {
      setActiveState(newState)
    }

    listeners.push(listener)
    return () => {
      listeners.splice(listeners.indexOf(listener), 1)
    }
  }, [])

  return {
    ...activeState,
    toast,
    dismiss: (toastId?: string) => setState({ type: 'DISMISS_TOAST', toastId }),
  }
}

export function toast({ ...props }: Omit<Toast, 'id'>) {
  const id = genId()
  const update = (props: Partial<Toast>) =>
    setState({
      type: 'UPDATE_TOAST',
      toast: { ...props, id },
    })
  const dismiss = () => setState({ type: 'DISMISS_TOAST', toastId: id })

  setState({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}
