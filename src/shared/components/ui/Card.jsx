import React from "react"
import { cn } from "../../utils/cn"

export const Card = ({ children, className, ...props }) => (
  <div
    className={cn(
      "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden",
      className
    )}
    {...props}
  >
    {children}
  </div>
)

export const CardHeader = ({ children, className, ...props }) => (
  <div className={cn("p-5 border-b border-gray-100", className)} {...props}>
    {children}
  </div>
)

export const CardTitle = ({ children, className, ...props }) => (
  <h3 className={cn("text-lg font-semibold text-gray-900", className)} {...props}>
    {children}
  </h3>
)

export const CardContent = ({ children, className, ...props }) => (
  <div className={cn("p-5", className)} {...props}>
    {children}
  </div>
)

export const CardFooter = ({ children, className, ...props }) => (
  <div
    className={cn("p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between", className)}
    {...props}
  >
    {children}
  </div>
)
