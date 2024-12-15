import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "../../lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef(({ className, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={-45}
    align="center"
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-white px-3 py-1.5 text-sm text-gray-700 shadow-md animate-in fade-in-0 zoom-in-95",
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
