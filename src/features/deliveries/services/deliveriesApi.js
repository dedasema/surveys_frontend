import {
  getCampanas,
  getEntregasByCampana,
  createEntrega,
  deleteEntrega,
  markEntregaAsSent,
  markEntregaAsResponded,
  createBulkEntregas,
  createBulkAudioEntregas,
  downloadFormularioPdf,
  getDestinatarios,
} from "../../../services/api"

export const deliveriesApi = {
  getCampanas,
  getEntregasByCampana,
  createEntrega,
  deleteEntrega,
  markSent: markEntregaAsSent,
  markResponded: markEntregaAsResponded,
  createBulkPaper: createBulkEntregas,
  createBulkAudio: createBulkAudioEntregas,
  downloadPdf: downloadFormularioPdf,
  getDestinatarios,
}
