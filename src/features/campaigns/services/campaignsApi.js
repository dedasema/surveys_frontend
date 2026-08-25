import {
  getCampanas,
  getCampana,
  getCampanaFullDetail,
  createCampana,
  updateCampana,
  deleteCampana,
  getPlantillas,
} from "../../../services/api"

export const campaignsApi = {
  getAll: getCampanas,
  getById: getCampana,
  getFullDetail: getCampanaFullDetail,
  create: createCampana,
  update: updateCampana,
  delete: deleteCampana,
  getPlantillas,
}
