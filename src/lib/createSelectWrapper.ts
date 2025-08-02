"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export function createSelectWrapper<T extends React.ElementType>(
  Primitive: T,
  slot: string,
  defaultClass?: string
) {
  type Props = React.ComponentProps<T> & { className?: string }
  return React.forwardRef<React.ElementRef<T>, Props>(function Wrapper(
    { className, ...props },
    ref
  ) {
    return (
      <Primitive
        ref={ref}
        data-slot={slot}
        className={cn(defaultClass, className)}
        {...props}
      />
    )
  })
}
