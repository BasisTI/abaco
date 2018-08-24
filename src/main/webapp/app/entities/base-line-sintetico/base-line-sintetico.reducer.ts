import axios from 'axios';
import { ICrudGetAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { REQUEST, SUCCESS, FAILURE } from '../../reducers/action-type.util';
import { messages, SERVER_API_URL } from '../../config/constants';

// import { BaseLineSintetico } from './base-line-sintetico.model';

export const ACTION_TYPES = {
  FETCH_BASELINESINTETICOS: 'baseLineSintetico/FETCH_BASELINESINTETICOS',
  SEARCH_BASELINESINTETICOS: 'baseLineSintetico/SEARCH_BASELINESINTETICOS',
  FETCH_BASELINESINTETICO:  'baseLineSintetico/FETCH_BASELINESINTETICO',
  CREATE_BASELINESINTETICO: 'baseLineSintetico/CREATE_BASELINESINTETICO',
  UPDATE_BASELINESINTETICO: 'baseLineSintetico/UPDATE_BASELINESINTETICO',
  DELETE_BASELINESINTETICO: 'baseLineSintetico/DELETE_BASELINESINTETICO'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: {},
  updating: false,
  updateSuccess: false
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_BASELINESINTETICOS):
    case REQUEST(ACTION_TYPES.SEARCH_BASELINESINTETICOS):
    case REQUEST(ACTION_TYPES.FETCH_BASELINESINTETICO):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_BASELINESINTETICO):
    case REQUEST(ACTION_TYPES.UPDATE_BASELINESINTETICO):
    case REQUEST(ACTION_TYPES.DELETE_BASELINESINTETICO):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_BASELINESINTETICOS):
    case FAILURE(ACTION_TYPES.SEARCH_BASELINESINTETICOS):
    case FAILURE(ACTION_TYPES.FETCH_BASELINESINTETICO):
    case FAILURE(ACTION_TYPES.CREATE_BASELINESINTETICO):
    case FAILURE(ACTION_TYPES.UPDATE_BASELINESINTETICO):
    case FAILURE(ACTION_TYPES.DELETE_BASELINESINTETICO):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_BASELINESINTETICOS):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.SEARCH_BASELINESINTETICOS):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
    };
    case SUCCESS(ACTION_TYPES.FETCH_BASELINESINTETICO):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_BASELINESINTETICO):
    case SUCCESS(ACTION_TYPES.UPDATE_BASELINESINTETICO):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_BASELINESINTETICO):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    default:
      return state;
  }
};

const apiUrl = SERVER_API_URL + '/api/base-line-sinteticos';
const apiSearchUrl = SERVER_API_URL + '/api/_search/base-line-sinteticos';

// Actions

export const getEntities: ICrudGetAction = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_BASELINESINTETICOS,
  payload: axios.get(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getSearchEntities: ICrudGetAction = query => ({
  type: ACTION_TYPES.SEARCH_BASELINESINTETICOS,
  payload: axios.get(`${apiSearchUrl}?query=` + query)
});

export const getEntity: ICrudGetAction = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_BASELINESINTETICO,
    payload: axios.get(requestUrl)
  };
};

export const createEntity: ICrudPutAction = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_BASELINESINTETICO,
    meta: {
      successMessage: messages.DATA_CREATE_SUCCESS_ALERT,
      errorMessage: messages.DATA_UPDATE_ERROR_ALERT
    },
    payload: axios.post(apiUrl, entity)
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_BASELINESINTETICO,
    meta: {
      successMessage: messages.DATA_CREATE_SUCCESS_ALERT,
      errorMessage: messages.DATA_UPDATE_ERROR_ALERT
    },
    payload: axios.put(apiUrl, entity)
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_BASELINESINTETICO,
    meta: {
      successMessage: messages.DATA_DELETE_SUCCESS_ALERT,
      errorMessage: messages.DATA_UPDATE_ERROR_ALERT
    },
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};
