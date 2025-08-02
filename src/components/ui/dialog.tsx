"use client"

import * as React from "react"
import * as DialogPr from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

const Dialog = DialogPr.Root

const DialogTrigger = DialogPr.Trigger

const DialogPortal = DialogPr.Portal

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPr.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPr.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPr.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPr.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPr.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPr.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPr.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPr.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPr.Close>
    </DialogPr.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPr.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPr.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPr.Title>
>(({ className, ...props }, ref) => (
  <DialogPr.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPr.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPr.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPr.Description>
>(({ className, ...props }, ref) => (
  <DialogPr.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPr.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
