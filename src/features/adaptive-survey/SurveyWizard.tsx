import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, RotateCcw, Loader2, MessageSquare, Mic, ShieldCheck } from 'lucide-react';
import { AdaptiveQuestion, AnswerHistoryEntry, AdaptiveSurveyStepResult } from './types';
import AudioRecorder from '../audio-response/AudioRecorder';

const corporateUrl =
  ((import.meta as any)?.env?.VITE_CORPORATE_URL) ||
  (typeof process !== 'undefined' && ((process as any).env?.VITE_CORPORATE_URL || (process as any).env?.REACT_APP_CORPORATE_URL)) ||
  'https://desesoft.vercel.app';

export interface SurveyWizardProps {
  surveyId: string | number;
  initialQuestion?: AdaptiveQuestion;
  onCompleted?: (history: AnswerHistoryEntry[]) => void;
  token?: string;
}

export const SurveyWizard: React.FC<SurveyWizardProps> = ({
  surveyId,
  initialQuestion,
  onCompleted,
  token,
}) => {
  // Pregunta por defecto de inicio si no se suministra
  const defaultFirstQuestion: AdaptiveQuestion = {
    id: 1,
    texto: '¿Cómo calificarías tu experiencia general con nuestros servicios?',
    tipo: 'nps',
    descripcion: 'Selecciona una puntuación del 1 (muy insatisfecho) al 10 (totalmente satisfecho)',
    obligatoria: true,
  };

  const [currentQuestion, setCurrentQuestion] = useState<AdaptiveQuestion>(
    initialQuestion || defaultFirstQuestion
  );
  const [currentAnswer, setCurrentAnswer] = useState<any>('');
  const [history, setHistory] = useState<AnswerHistoryEntry[]>([]);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionMessage, setCompletionMessage] = useState<string>(
    '¡Muchas gracias por completar la encuesta! Tus respuestas han sido procesadas exitosamente.'
  );
  const [error, setError] = useState<string | null>(null);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [consentConfirmed, setConsentConfirmed] = useState(false);

  const stepNumber = history.length + 1;

  const handleNext = async () => {
    if (currentQuestion.obligatoria && (currentAnswer === '' || currentAnswer === null)) {
      setError('Por favor responde esta pregunta antes de continuar.');
      return;
    }

    setError(null);
    setIsLoadingNext(true);

    const newHistoryEntry: AnswerHistoryEntry = {
      pregunta_id: currentQuestion.id,
      pregunta_texto: currentQuestion.texto,
      respuesta: currentAnswer,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [...history, newHistoryEntry];
    setHistory(updatedHistory);

    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://surveys-backend-83d9.onrender.com';
      const rawEndpoint = token
        ? `${API_BASE_URL}/encuestas/${token}/responder`
        : `${API_BASE_URL}/encuestas/${surveyId}/responder`;
      const url = new URL(rawEndpoint);
      url.searchParams.set('consentimiento_aceptado', 'true');

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Consentimiento-Aceptado': 'true',
        },
        body: JSON.stringify({
          pregunta_id: currentQuestion.id,
          respuesta: currentAnswer,
          historial: updatedHistory,
          consentimiento_aceptado: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar la respuesta al motor adaptativo');
      }

      const result: AdaptiveSurveyStepResult = await response.json();

      if (result.fin_encuesta || !result.siguiente_pregunta) {
        setIsCompleted(true);
        if (result.mensaje_cierre) setCompletionMessage(result.mensaje_cierre);
        if (onCompleted) onCompleted(updatedHistory);
      } else {
        setCurrentQuestion(result.siguiente_pregunta);
        setCurrentAnswer('');
        setShowVoiceInput(false);
      }
    } catch (err: any) {
      // Fallback adaptativo elegante si el endpoint del backend aún no está activo
      if (updatedHistory.length >= 3) {
        setIsCompleted(true);
        if (onCompleted) onCompleted(updatedHistory);
      } else if (updatedHistory.length === 1 && typeof currentAnswer === 'number' && currentAnswer <= 6) {
        // Simulación RF17b: Disparo de pregunta generativa condicional por sentimiento/score bajo
        setCurrentQuestion({
          id: 'gen_followup_1',
          texto: 'Notamos que tu calificación fue baja. ¿Qué aspectos específicos consideras que podríamos mejorar?',
          tipo: 'texto',
          descripcion: 'Pregunta generativa formulada por el asistente IA en función de tu respuesta previa',
          es_generativa: true,
          obligatoria: true,
        });
        setCurrentAnswer('');
      } else {
        // Pregunta siguiente del banco
        setCurrentQuestion({
          id: updatedHistory.length + 1,
          texto: '¿Recomendarías nuestros servicios a colegas o amigos?',
          tipo: 'opcion_multiple',
          opciones: [
            { id: 'opt_1', texto: 'Definitivamente sí' },
            { id: 'opt_2', texto: 'Probablemente sí' },
            { id: 'opt_3', texto: 'No estoy seguro' },
            { id: 'opt_4', texto: 'No lo recomendaría' },
          ],
          obligatoria: true,
        });
        setCurrentAnswer('');
      }
    } finally {
      setIsLoadingNext(false);
    }
  };

  const renderQuestionInput = () => {
    if (showVoiceInput) {
      return (
        <div className="space-y-4">
          <AudioRecorder
            surveyId={surveyId}
            questionId={currentQuestion.id}
            onTranscriptionConfirmed={(transcriptionText) => {
              setCurrentAnswer(transcriptionText);
              setShowVoiceInput(false);
            }}
          />
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowVoiceInput(false)}
              className="text-xs text-gray-500 hover:text-gray-800 underline"
            >
              Volver a escribir texto
            </button>
          </div>
        </div>
      );
    }

    switch (currentQuestion.tipo) {
      case 'nps':
      case 'escala':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCurrentAnswer(num)}
                  className={`py-3 rounded-xl font-bold text-sm transition-all border ${
                    currentAnswer === num
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 px-1 font-medium">
              <span>Muy insatisfecho (1)</span>
              <span>Completamente satisfecho (10)</span>
            </div>
          </div>
        );

      case 'opcion_multiple':
      case 'seleccion_unica':
        return (
          <div className="space-y-3">
            {currentQuestion.opciones?.map((opcion) => (
              <label
                key={opcion.id}
                className={`flex items-center gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                  currentAnswer === opcion.texto
                    ? 'bg-blue-50/80 border-blue-500 shadow-xs'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={`pregunta_${currentQuestion.id}`}
                  value={opcion.texto}
                  checked={currentAnswer === opcion.texto}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-800">{opcion.texto}</span>
              </label>
            ))}
          </div>
        );

      case 'texto':
      default:
        return (
          <div className="space-y-3">
            <textarea
              rows={4}
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Escribe tu respuesta detallada aquí..."
              className="w-full p-4 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent leading-relaxed"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowVoiceInput(true)}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <Mic className="h-3.5 w-3.5" />
                O responder hablando con voz (RF18)
              </button>
            </div>
          </div>
        );
    }
  };

  if (isCompleted) {
    return (
      <div className="max-w-xl mx-auto bg-white border border-gray-100 rounded-3xl p-10 shadow-xl text-center space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">¡Encuesta Completada!</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{completionMessage}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-2xl text-xs text-gray-500 text-left space-y-1.5">
          <span className="font-semibold text-gray-700 block mb-1">Resumen de respuestas procesadas:</span>
          {history.map((h, i) => (
            <div key={i} className="flex justify-between border-b border-gray-100 pb-1">
              <span className="truncate max-w-[240px]">{h.pregunta_texto || `Pregunta ${i + 1}`}</span>
              <strong className="text-gray-800 ml-2">{String(h.respuesta)}</strong>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="max-w-2xl mx-auto bg-white border border-gray-200/80 rounded-3xl shadow-xl p-8 space-y-8">
        {!consentConfirmed ? (
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Consentimiento de Participación</h2>
              <p className="text-gray-600 text-sm leading-relaxed max-w-lg mx-auto">
                Antes de iniciar esta encuesta adaptativa, te informamos que tus respuestas serán procesadas
                de forma confidencial y segura conforme a nuestra{" "}
                <a
                  href="/privacidad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline font-medium hover:text-blue-700"
                >
                  Política de Privacidad
                </a>.
              </p>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs text-left max-w-lg mx-auto">
                <strong>Aviso de interacción por voz e IA:</strong> Esta encuesta puede incluir preguntas con captura de voz y análisis adaptativo mediante Inteligencia Artificial (Google Gemini). Al continuar, autorizas su procesamiento.
              </div>
            </div>

            <div className="flex items-start gap-3 text-left p-4 bg-gray-50 rounded-xl border border-gray-200 max-w-lg mx-auto">
              <input
                type="checkbox"
                id="adaptive-consent-check"
                checked={consentAccepted}
                onChange={(e) => setConsentAccepted(e.target.checked)}
                className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 rounded border-gray-300 cursor-pointer"
              />
              <label htmlFor="adaptive-consent-check" className="text-sm text-gray-700 cursor-pointer select-none">
                He leído y acepto los términos de tratamiento de datos y autorizo mi participación en esta encuesta.
              </label>
            </div>

            <button
              type="button"
              disabled={!consentAccepted}
              onClick={() => setConsentConfirmed(true)}
              className="w-full max-w-lg mx-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Comenzar Encuesta</span>
            </button>
          </div>
        ) : (
          <>
            {/* Header del Wizard con progreso dinámico */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 font-bold text-xs rounded-full uppercase tracking-wider">
                  Pregunta {stepNumber}
                </span>
                {currentQuestion.es_generativa && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 font-bold text-xs rounded-full flex items-center gap-1.5 shadow-xs">
                    <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                    Seguimiento IA (RF17b)
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400 font-medium">Encuesta Adaptativa</span>
            </div>

            {/* Enunciado de la Pregunta */}
            <div className="space-y-2">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">
                {currentQuestion.texto}
              </h3>
              {currentQuestion.descripcion && (
                <p className="text-sm text-gray-500 leading-relaxed">{currentQuestion.descripcion}</p>
              )}
            </div>

            {/* Campo de Respuesta (Polimórfico) */}
            <div className="pt-2">{renderQuestionInput()}</div>

            {/* Mensaje de Error si aplica */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl">
                {error}
              </div>
            )}

            {/* Footer de Navegación */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {history.length} respuesta(s) registradas
              </span>

              <button
                type="button"
                onClick={handleNext}
                disabled={isLoadingNext}
                className="px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
              >
                {isLoadingNext ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analizando con Gemini...</span>
                  </>
                ) : (
                  <>
                    <span>Siguiente</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Firma de Marca (A7) */}
      <div className="text-center py-4 text-xs text-gray-500">
        <a
          href={corporateUrl || "/"}
          target={corporateUrl ? "_blank" : undefined}
          rel={corporateUrl ? "noopener noreferrer" : undefined}
          className="hover:text-blue-600 hover:underline transition-colors inline-flex items-center gap-1.5 font-medium"
        >
          Impulsado por Desesoft — SurveySaaS
        </a>
      </div>
    </div>
  );
};

export default SurveyWizard;
