import { environment } from '../../environments/environment'

export const API_ENDPOINT_URL_CLIENT = environment.BASE_URL + environment.API_ENDPOINT_CLIENT;
export const API_ENDPOINT_URL_AUTH = environment.BASE_URL + environment.API_ENDPOINT_AUTH;


export const API = {
  // Auth API's
  adminLogin: API_ENDPOINT_URL_AUTH + 'adminLogin',


  // Client API's
  licenceList: API_ENDPOINT_URL_CLIENT + 'licence/list',
  licenceDetail: API_ENDPOINT_URL_CLIENT + 'licence/detail',
  rolesList: API_ENDPOINT_URL_CLIENT + 'roles',
  userMediaUpload: API_ENDPOINT_URL_CLIENT + 'user/medias',
  usersList:API_ENDPOINT_URL_CLIENT+'users/list',
  addLicence: API_ENDPOINT_URL_CLIENT+'license/add',
  addUser: API_ENDPOINT_URL_CLIENT+'users/add',
  deleteLicense: API_ENDPOINT_URL_CLIENT+'licence/delete/',
  deleteUser: API_ENDPOINT_URL_CLIENT+'users/delete/',
  editUser: API_ENDPOINT_URL_CLIENT+'users/update',
  editLicence: API_ENDPOINT_URL_CLIENT+'licence/update',
  adminDetails: API_ENDPOINT_URL_AUTH+'adminDetails'
};

export enum EStatusCode {
  'OK' = 200,
  'CREATED' = 201,
  'CONFLICT' = 409,
  'INVALID_DATA' = 422,
  'LOCKED' = 423,
  'FAILURE' = 404,
  'INTERNAL_SERVER_ERROR' = 500,
  'Unauthorized' = 401,
  'tokenExpired' = 419,
  'BAD_REQUEST' = 400,
}
