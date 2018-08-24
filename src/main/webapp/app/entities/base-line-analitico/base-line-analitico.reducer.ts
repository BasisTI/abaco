import axios from 'axios';
import { ICrudGetAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { REQUEST, SUCCESS, FAILURE } from '../../reducers/action-type.util';
import { messages, SERVER_API_URL } from '../../config/constants';

// import { JhiDateUtils } from 'ng-jhipster';
// import { BaseLineAnalitico } from './base-line-analitico.model';

export const ACTION_TYPES = {
  FETCH_BASELINEANALITICOS: 'baseLineAnalitico/FETCH_BASELINEANALITICOS',
  SEARCH_BASELINEANALITICOS: 'baseLineAnalitico/SEARCH_BASELINEANALITICOS',
  FETCH_BASELINEANALITICO:  'baseLineAnalitico/FETCH_BASELINEANALITICO',
  CREATE_BASELINEANALITICO: 'baseLineAnalitico/CREATE_BASELINEANALITICO',
  UPDATE_BASELINEANALITICO: 'baseLineAnalitico/UPDATE_BASELINEANALITICO',
  DELETE_BASELINEANALITICO: 'baseLineAnalitico/DELETE_BASELINEANALITICO'
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
    case REQUEST(ACTION_TYPES.FETCH_BASELINEANALITICOS):
    case REQUEST(ACTION_TYPES.SEARCH_BASELINEANALITICOS):
    case REQUEST(ACTION_TYPES.FETCH_BASELINEANALITICO):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_BASELINEANALITICO):
    case REQUEST(ACTION_TYPES.UPDATE_BASELINEANALITICO):
    case REQUEST(ACTION_TYPES.DELETE_BASELINEANALITICO):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_BASELINEANALITICOS):
    case FAILURE(ACTION_TYPES.SEARCH_BASELINEANALITICOS):
    case FAILURE(ACTION_TYPES.FETCH_BASELINEANALITICO):
    case FAILURE(ACTION_TYPES.CREATE_BASELINEANALITICO):
    case FAILURE(ACTION_TYPES.UPDATE_BASELINEANALITICO):
    case FAILURE(ACTION_TYPES.DELETE_BASELINEANALITICO):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_BASELINEANALITICOS):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.SEARCH_BASELINEANALITICOS):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
    };
    case SUCCESS(ACTION_TYPES.FETCH_BASELINEANALITICO):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_BASELINEANALITICO):
    case SUCCESS(ACTION_TYPES.UPDATE_BASELINEANALITICO):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_BASELINEANALITICO):
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

const apiUrl = SERVER_API_URL + '/api/base-line-analiticos';
const apiSearchUrl = SERVER_API_URL + '/api/_search/base-line-analiticos';

// Actions

export const getEntities: ICrudGetAction = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_BASELINEANALITICOS,
  payload: axios.get(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getSearchEntities: ICrudGetAction = query => ({
  type: ACTION_TYPES.SEARCH_BASELINEANALITICOS,
  payload: axios.get(`${apiSearchUrl}?query=` + query)
});

export const getEntity: ICrudGetAction = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_BASELINEANALITICO,
    payload: axios.get(requestUrl)
  };
};

export const createEntity: ICrudPutAction = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_BASELINEANALITICO,
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
    type: ACTION_TYPES.UPDATE_BASELINEANALITICO,
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
    type: ACTION_TYPES.DELETE_BASELINEANALITICO,
    meta: {
      successMessage: messages.DATA_DELETE_SUCCESS_ALERT,
      errorMessage: messages.DATA_UPDATE_ERROR_ALERT
    },
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};
