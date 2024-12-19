import {APP_CONFIG} from '../../environments/environment';


export const API_ENDPOINT_URL_CLIENT = APP_CONFIG.BASE_URL + APP_CONFIG.API_ENDPOINT_CLIENT;
export const API_ENDPOINT_URL_AUTH = APP_CONFIG.BASE_URL +  APP_CONFIG.API_ENDPOINT_AUTH;


export const API = {
  // auth apis
  licenseVerify: API_ENDPOINT_URL_AUTH+'licenceVerification',
  userLogin: API_ENDPOINT_URL_AUTH+'userLogin',
  userLogout:API_ENDPOINT_URL_AUTH+'logout',
  changePassword: API_ENDPOINT_URL_AUTH+'change_user_password',
  deviceVerify: API_ENDPOINT_URL_AUTH+'deviceVerification',
  //client Apis
  licenceDetail: API_ENDPOINT_URL_CLIENT + 'licence/detail',
  projectList: API_ENDPOINT_URL_CLIENT+'project/list',
  addProject: API_ENDPOINT_URL_CLIENT+'project/add',
  deleteProject: API_ENDPOINT_URL_CLIENT+'project/delete'
};
