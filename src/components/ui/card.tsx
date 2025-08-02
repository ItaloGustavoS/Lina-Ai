import * as React from "react"
import { cn } from "@/lib/utils"

type DivProps = React.ComponentProps<"div">

function createCardSlot(
  slot: string,
  baseClasses: string
) {
  const Component = React.forwardRef<HTMLDivElement, DivProps>(
    ({ className, ...props }, ref) => (
      <div
        ref={ref}
        data-slot={`card${slot ? `-${slot}` : ""}`}
        className={cn(baseClasses, className)}
        {...props}
      />
    )
  )
  Component.displayName = `Card${slot.charAt(0).toUpperCase() + slot.slice(1)}`
  return Component
}

export const Card = createCardSlot(
  "",
  "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm"
)
export const CardHeader = createCardSlot(
  "header",
  "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6"
)
export const CardTitle = createCardSlot("title", "leading-none font-semibold")
export const CardDescription = createCardSlot("description", "text-muted-foreground text-sm")
export const CardAction = createCardSlot(
  "action",
  "col-start-2 row-span-2 row-start-1 self-start justify-self-end"
)
export const CardContent = createCardSlot("content", "px-6")
export const CardFooter = createCardSlot(
  "footer",
  "flex items-center px-6 [.border-t]:pt-6"
)
