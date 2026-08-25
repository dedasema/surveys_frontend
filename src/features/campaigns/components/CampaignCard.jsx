import React from "react"
import { Calendar, Send, Edit2, Trash2, Globe, Mail, Phone, Clock, CheckCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Badge, Button } from "../../../shared/components/ui"

export const CampaignCard = ({
  campaign,
  onEdit,
  onDelete,
}) => {
  const getStatusBadge = (statusId) => {
    switch (statusId) {
      case 1:
        return <Badge variant="neutral">Borrador</Badge>
      case 2:
        return <Badge variant="warning">Programada</Badge>
      case 3:
        return <Badge variant="default">Enviada</Badge>
      case 4:
        return <Badge variant="success">Cerrada</Badge>
      default:
        return <Badge variant="neutral">Desconocido</Badge>
    }
  }

  const getChannelIcon = (canalId) => {
    switch (canalId) {
      case 1:
        return <Mail className="w-4 h-4 text-blue-600" />
      case 5:
        return <Phone className="w-4 h-4 text-emerald-600" />
      case 4:
        return <Globe className="w-4 h-4 text-purple-600" />
      default:
        return <Send className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          {getChannelIcon(campaign.canal_id)}
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {campaign.canal?.nombre || "Canal"}
          </span>
        </div>
        {getStatusBadge(campaign.estado_id)}
      </CardHeader>

      <CardContent className="space-y-2.5">
        <CardTitle className="text-base font-bold text-gray-900 leading-snug line-clamp-2">
          {campaign.nombre}
        </CardTitle>

        <p className="text-xs text-gray-500 line-clamp-1">
          Plantilla: <span className="font-medium text-gray-700">{campaign.plantilla?.nombre || "Sin plantilla"}</span>
        </p>

        {campaign.programada_en && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Programada: {new Date(campaign.programada_en).toLocaleDateString()}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>Creada: {new Date(campaign.creada_en || Date.now()).toLocaleDateString()}</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(campaign)} title="Editar">
            <Edit2 className="w-4 h-4 text-blue-600" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(campaign.id)} title="Eliminar">
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
