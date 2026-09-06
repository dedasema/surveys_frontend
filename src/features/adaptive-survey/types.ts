export type QuestionType = 'texto' | 'opcion_multiple' | 'seleccion_unica' | 'nps' | 'escala' | 'audio';

export interface SurveyOption {
  id: string | number;
  texto: string;
  valor?: any;
}

export interface AdaptiveQuestion {
  id: string | number;
  texto: string;
  tipo: QuestionType;
  descripcion?: string;
  opciones?: SurveyOption[];
  es_generativa?: boolean; // RF17b
  justificacion_ia?: string;
  obligatoria?: boolean;
}

export interface AnswerHistoryEntry {
  pregunta_id: string | number;
  pregunta_texto?: string;
  respuesta: any;
  timestamp?: string;
}

export interface AdaptiveSurveyStepResult {
  fin_encuesta: boolean;
  siguiente_pregunta?: AdaptiveQuestion | null;
  mensaje_cierre?: string;
  progreso_estimado?: number;
}
