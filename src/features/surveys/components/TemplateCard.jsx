import React from "react"
import { FileText, ListOrdered, Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Badge, Button } from "../../../shared/components/ui"

export const TemplateCard = ({
  template,
  onEdit,
  onManageQuestions,
  onDelete,
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Plantilla
          </span>
        </div>
        <Badge variant={template.activo ? "success" : "neutral"}>
          {template.activo ? "Activa" : "Inactiva"}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-2">
        <CardTitle className="text-base font-bold text-gray-900 leading-snug">
          {template.nombre}
        </CardTitle>
        <p className="text-xs text-gray-500 line-clamp-2">
          {template.descripcion || "Sin descripción proporcionada"}
        </p>
      </CardContent>

      <CardFooter className="pt-3 border-t border-gray-100 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onManageQuestions(template)}
          className="gap-1.5 text-xs"
        >
          <ListOrdered className="w-3.5 h-3.5" />
          Preguntas
        </Button>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(template)} title="Editar">
            <Edit2 className="w-4 h-4 text-blue-600" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(template.id)} title="Eliminar">
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
