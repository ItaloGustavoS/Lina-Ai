import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type DivProps = React.ComponentProps<"div">
type MotionDivProps = React.ComponentProps<typeof motion.div>

function createCardSlot(
  slot: string,
  baseClasses: string,
  isMotion: boolean = false
) {
  const Component = React.forwardRef<HTMLDivElement, MotionDivProps>(
    ({ className, ...props }, ref) => {
      const El = isMotion ? motion.div : 'div';
      return (
        <El
          ref={ref}
          data-slot={`card${slot ? `-${slot}` : ""}`}
          className={cn(baseClasses, className)}
          {...props}
        />
      )
    }
  )
  Component.displayName = `Card${slot.charAt(0).toUpperCase() + slot.slice(1)}`
  return Component
}

export const Card = React.forwardRef<HTMLDivElement, MotionDivProps>(
  ({ className, ...props }, ref) => (
    <motion.div
      ref={ref}
      data-slot="card"
      className={cn("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className)}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      {...props}
    />
  )
)
Card.displayName = "Card"
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
