import {
  getPlantillas,
  getPlantilla,
  createPlantilla,
  updatePlantilla,
  deletePlantilla,
  getPreguntas,
  createPregunta,
  updatePregunta,
  deletePregunta,
  getOpciones,
  createOpcion,
  deleteOpcion,
} from "../../../services/api"

export const surveysApi = {
  getTemplates: getPlantillas,
  getTemplate: getPlantilla,
  createTemplate: createPlantilla,
  updateTemplate: updatePlantilla,
  deleteTemplate: deletePlantilla,
  getQuestions: getPreguntas,
  createQuestion: createPregunta,
  updateQuestion: updatePregunta,
  deleteQuestion: deletePregunta,
  getOptions: getOpciones,
  createOption: createOpcion,
  deleteOption: deleteOpcion,
}
