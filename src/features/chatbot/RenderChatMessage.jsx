import React from "react"

export const RenderChatMessage = ({ text, sender }) => {
  if (!text) return null
  const currentOrigin = window.location.origin

  // Normalizar URLs que apunten a localhost o dominios de frontend antiguos hacia el origin actual
  const normalizedText = text.replace(
    /https?:\/\/(localhost|127\.0\.0\.1|[a-zA-Z0-9-]+\.vercel\.app)(:\d+)?/gi,
    currentOrigin
  )

  const urlRegex = /(https?:\/\/[^\s]+|\/dashboard-suscriptor[^\s]*|\/dashboard[^\s]*|\/dashboard-operador[^\s]*)/g
  const parts = normalizedText.split(urlRegex)

  return (
    <span>
      {parts.map((part, index) => {
        if (part.match(urlRegex)) {
          let href = part
          if (part.startsWith("/")) {
            href = `${currentOrigin}${part}`
          }
          return (
            <a
              key={index}
              href={href}
              className={`underline font-semibold break-all ${
                sender === "user" ? "text-blue-100 hover:text-white" : "text-blue-600 hover:text-blue-800"
              }`}
            >
              {part}
            </a>
          )
        }
        return part
      })}
    </span>
  )
}
