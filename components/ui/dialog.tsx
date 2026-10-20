"use client";

/**
 * Dialog — Radix Dialog primitives restyled to JOLT dark chrome (Brief 02).
 *
 * Panel inherits the quirk-modal chrome from the frozen design: dark
 * `#08080A` panel, hairline border, 16px radius, orange-tinted shadow,
 * backdrop blur. Entrance animation (overlay fade, panel rise) mirrors the
 * frozen `.jq-modal` transition and is gated on `prefers-reduced-motion`.
 * No tailwindcss-animate dependency — motion/react drives the entrances.
 */

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  const reduceMotion = useReducedMotion();
  return (
    <DialogPrimitive.Overlay asChild {...props}>
      <motion.div
        ref={ref}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "fixed inset-0 z-[1100] bg-[#050507]/[0.72] backdrop-blur-[6px]",
          className,
        )}
      />
    </DialogPrimitive.Overlay>
  );
});
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const reduceMotion = useReducedMotion();
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-[1100] w-[min(460px,calc(100vw-48px))] max-h-[85dvh] translate-x-[-50%] translate-y-[-50%]",
          className,
        )}
        {...props}
      >
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-y-auto overscroll-contain rounded-[16px] border border-[rgba(255,255,255,0.14)] bg-[#08080A] text-[#E8E8EA] shadow-[0_40px_90px_-20px_rgba(0,0,0,0.7),0_0_60px_-20px_rgba(232,90,44,0.35)]"
        >
          {children}
        </motion.div>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-[#E8E8EA]",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-[14px] leading-[1.65] text-[#B9B9BF]", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
};
