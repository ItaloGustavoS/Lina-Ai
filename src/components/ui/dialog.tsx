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
