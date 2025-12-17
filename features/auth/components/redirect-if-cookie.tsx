"use client"
import React from 'react'

export function RedirectIfCookie() {
  React.useEffect(() => {
    const has = typeof document !== 'undefined' && document.cookie.includes('access_token=')
    if (has) {
      window.location.replace('/admin')
    }
  }, [])
  return null
}
