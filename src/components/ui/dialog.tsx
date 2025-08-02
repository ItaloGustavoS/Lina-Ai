"use client"

import * as React from "react"
import * as DialogPr from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

// 1) factory for Radix primitives with data-slot + className merging + forwarding refs
function makeDialogSlot<
  P extends React.ElementType,
  Props = React.ComponentProps<P>
>(
  Comp: P,
  slot: string,
  baseClass?: string
) {
  type InProps = Props & { className?: string };
  return React.forwardRef<React.ElementRef<P>, InProps>(
    ({ className, ...props }, ref) => (
      <Comp
        ref={ref}
        data-slot={slot}
        className={cn(baseClass, className as string)}
        {...(props as any)}
      />
    )
  );
}

// 2) create all wrappers in one shot
export const Dialog = (props: React.ComponentProps<typeof DialogPr.Root>) => (
  <DialogPr.Root data-slot="dialog" {...props} />
);

export const DialogTrigger = makeDialogSlot(
  DialogPr.Trigger,
  "dialog-trigger"
);

export const DialogPortal = makeDialogSlot(
  DialogPr.Portal,
  "dialog-portal"
);

export const DialogOverlay = makeDialogSlot(
  DialogPr.Overlay,
  "dialog-overlay",
  "fixed inset-0 z-50 bg-black/50 " +
    "data-[state=open]:animate-in data-[state=closed]:animate-out " +
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
);

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPr.Content>,
  React.ComponentProps<typeof DialogPr.Content> & { showCloseButton?: boolean }
>(({ showCloseButton = true, className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPr.Content
      ref={ref}
      data-slot="dialog-content"
      className={cn(
        "bg-background fixed top-[50%] left-[50%] z-50 grid w-full " +
          "max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] " +
          "gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg " +
          "data-[state=open]:animate-in data-[state=closed]:animate-out " +
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 " +
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPr.Close data-slot="dialog-close" className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPr.Close>
      )}
    </DialogPr.Content>
  </DialogPortal>
));

export const DialogHeader = makeDialogSlot(
  "div",
  "dialog-header",
  "flex flex-col space-y-1.5 text-center sm:text-left"
);
export const DialogFooter = makeDialogSlot(
  "div",
  "dialog-footer",
  "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2"
);
export const DialogTitle = makeDialogSlot(
  DialogPr.Title,
  "dialog-title",
  "text-lg font-semibold leading-none tracking-tight"
);
export const DialogDescription = makeDialogSlot(
  DialogPr.Description,
  "dialog-description",
  "text-sm text-muted-foreground"
);
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
