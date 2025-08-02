"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

type Intrinsic = keyof JSX.IntrinsicElements

function createTableSlot<
  T extends Intrinsic
>(tag: T, slot: string, base: string) {
  const Comp = React.forwardRef<
    JSX.IntrinsicElements[T] extends React.DetailedHTMLProps<
      React.HTMLAttributes<infer E>,
      infer E
    >
      ? E
      : never,
    React.ComponentProps<T>
  >(({ className, ...props }, ref) => {
    return React.createElement(tag, {
      ref,
      "data-slot": slot,
      className: cn(base, className),
      ...props,
    })
  })
  Comp.displayName = `Table${slot
    .replace(/^table-/, "")
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("")}`
  return Comp as React.FC<React.ComponentProps<T>>
}

// keep your original Table wrapper
export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

export const TableHeader = createTableSlot(
  "thead",
  "table-header",
  "[&_tr]:border-b"
)
export const TableBody = createTableSlot(
  "tbody",
  "table-body",
  "[&_tr:last-child]:border-0"
)
export const TableFooter = createTableSlot(
  "tfoot",
  "table-footer",
  "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0"
)
export const TableRow = createTableSlot(
  "tr",
  "table-row",
  "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
)
export const TableHead = createTableSlot(
  "th",
  "table-head",
  "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
)
export const TableCell = createTableSlot(
  "td",
  "table-cell",
  "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
)
export const TableCaption = createTableSlot(
  "caption",
  "table-caption",
  "text-muted-foreground mt-4 text-sm"
)

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}

