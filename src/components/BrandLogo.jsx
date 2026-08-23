import React from "react"

export default function BrandLogo({
  size = "md",
  showText = true,
  textColor = "dark",
  className = "",
}) {
  const sizeMap = {
    sm: "h-7 w-7",
    md: "h-8 w-8",
    lg: "h-10 w-10",
    xl: "h-12 w-12",
  }

  const textSizeMap = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  }

  const imgSize = sizeMap[size] || sizeMap.md
  const textSize = textSizeMap[size] || textSizeMap.md

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/favicon.svg"
        alt="SurveySaaS Logo"
        className={`${imgSize} rounded-xl shadow-sm shadow-blue-500/20 object-contain flex-shrink-0 transition-transform duration-200 hover:scale-105`}
      />
      {showText && (
        <span
          className={`${textSize} font-bold tracking-tight ${
            textColor === "light"
              ? "text-white"
              : "bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent"
          }`}
        >
          SurveySaaS
        </span>
      )}
    </div>
  )
}
