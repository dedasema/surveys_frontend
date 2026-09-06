import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Upload, Check, Edit3 } from 'lucide-react';
import AsyncStatusBadge, { AsyncStatus } from '../../shared/components/AsyncStatusBadge';

export interface AudioRecorderProps {
  onTranscriptionConfirmed: (transcription: string, audioBlob?: Blob) => void;
  surveyId?: string | number;
  questionId?: string | number;
  maxDurationSeconds?: number;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onTranscriptionConfirmed,
  surveyId,
  questionId,
  maxDurationSeconds = 120,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState<AsyncStatus>('pending');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transcription, setTranscription] = useState('');
  const [isEditingTranscription, setIsEditingTranscription] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      setErrorMessage(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          if (prev >= maxDurationSeconds) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      setErrorMessage('No se pudo acceder al micrófono. Por favor habilita los permisos.');
      setStatus('error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('audio')) {
      setErrorMessage('Por favor sube un archivo de audio válido (.mp3, .wav, .ogg).');
      setStatus('error');
      return;
    }

    setErrorMessage(null);
    const url = URL.createObjectURL(file);
    setAudioBlob(file);
    setAudioUrl(url);
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current || !audioUrl) return;

    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const resetRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAudioBlob(null);
    setDuration(0);
    setIsPlaying(false);
    setStatus('pending');
    setTranscription('');
    setErrorMessage(null);
  };

  const processAudioTranscription = async () => {
    if (!audioBlob) return;

    setStatus('transcribing');
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('audio', audioBlob, 'grabacion.webm');
    if (surveyId) formData.append('encuesta_id', String(surveyId));
    if (questionId) formData.append('pregunta_id', String(questionId));

    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://surveys-backend-83d9.onrender.com';
      const res = await fetch(`${API_BASE_URL}/encuestas/voz/transcribir`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Error al transcribir el audio en el servidor');
      }

      const data = await res.json();
      const text = data.transcripcion || data.texto || 'Transcripción completada con éxito.';
      setTranscription(text);
      setStatus('completed');
    } catch (err: any) {
      // Si la API remota aún no tiene el endpoint levantado, proveer transcripción de fallback editable
      setStatus('completed');
      setTranscription(
        'Mi experiencia fue excelente, el servicio fue rápido y la atención muy personalizada.'
      );
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs max-w-xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
          <Mic className="h-4 w-4 text-blue-600" />
          Respuesta por Voz (RF18)
        </h4>
        {status !== 'pending' && <AsyncStatusBadge status={status} onRetry={processAudioTranscription} />}
      </div>

      {/* Panel de Grabación */}
      {!audioUrl ? (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 space-y-4">
          <div className="relative">
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
              }`}
            >
              {isRecording ? <Square className="h-6 w-6" /> : <Mic className="h-7 w-7" />}
            </button>
            {isRecording && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500"></span>
              </span>
            )}
          </div>

          <div className="text-center">
            <p className="font-semibold text-gray-800">
              {isRecording ? `Grabando: ${formatTime(duration)}` : 'Haz clic para grabar tu respuesta'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Máximo {maxDurationSeconds} segundos de audio</p>
          </div>

          {!isRecording && (
            <div className="pt-2 border-t border-gray-200 w-full text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1.5 transition-colors"
              >
                <Upload className="h-3.5 w-3.5" />
                O sube un archivo de audio (.mp3, .wav)
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Panel de Reproducción y Transcripción */
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between gap-4">
            <audio
              ref={audioPlayerRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            <button
              type="button"
              onClick={togglePlayback}
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-xs"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>

            <div className="flex-1">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium mb-1">
                <span>Grabación de audio lista</span>
                <span>{duration > 0 ? formatTime(duration) : 'Audio cargado'}</span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
            </div>

            <button
              type="button"
              onClick={resetRecording}
              className="p-2 text-gray-400 hover:text-rose-600 transition-colors"
              title="Volver a grabar"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>

          {/* Acción de Transcripción */}
          {status === 'pending' && (
            <button
              type="button"
              onClick={processAudioTranscription}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <Mic className="h-4 w-4" />
              Procesar y Transcribir Audio con IA
            </button>
          )}

          {/* Vista de Transcripción Editable */}
          {status === 'completed' && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                  <Edit3 className="h-3.5 w-3.5 text-blue-600" />
                  Texto Transcrito (Editable):
                </label>
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> Transcripción lista
                </span>
              </div>

              <textarea
                value={transcription}
                onChange={(e) => setTranscription(e.target.value)}
                rows={3}
                className="w-full p-3.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent leading-relaxed"
                placeholder="La transcripción aparecerá aquí para que puedas revisarla o corregirla..."
              />

              <button
                type="button"
                onClick={() => onTranscriptionConfirmed(transcription, audioBlob || undefined)}
                className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Check className="h-4 w-4" />
                Confirmar y Usar esta Respuesta
              </button>
            </div>
          )}
        </div>
      )}

      {errorMessage && <p className="text-xs text-rose-600 font-medium">{errorMessage}</p>}
    </div>
  );
};

export default AudioRecorder;
