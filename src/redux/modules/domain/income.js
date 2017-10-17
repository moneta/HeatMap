import fetchData from '../../../common/utils/fetchData';

const REQUEST_POLYGON = '/modules/domain/income/REQUEST_POLYGON';
const RECEIVE_POLYGON = '/modules/domain/income/RECEIVE_POLYGON';
const UPDATE_INCOME = '/modules/domain/income/UPDATE_INCOME';
const BAD_REQUEST = '/modules/domain/income/BAD_REQUEST';

export const ActionTypes = {
  REQUEST_POLYGON,
  RECEIVE_POLYGON,
  UPDATE_INCOME,
  BAD_REQUEST,
};

const initialState = {
  polygon: [],
  medianIncome: [],
};

export default function income(state = initialState, action = {}) {
  switch (action.type) {
    case RECEIVE_POLYGON:
      return {
        ...state,
        polygon: action.data,
      };
    case UPDATE_INCOME:
      return {
        ...state,
        medianIncome: action.data,
      };
    case BAD_REQUEST:
      return {
        ...state,
        [action.req]: {
          lastError: action.error,
        },
      };
    default:
      return state;
  }
}

// Export actions
export function requestPolygon(params) {
  return {
    type: REQUEST_POLYGON,
    params,
  };
}

export function receivePolygon(data, params) {
  return {
    type: RECEIVE_POLYGON,
    data,
    params,
    receivedAt: Date.now(),
  };
}

export function updateIncome(data) {
  return {
    type: UPDATE_INCOME,
    data,
  };
}

export function badRequest(req, error) {
  return {
    type: BAD_REQUEST,
    req,
    error,
  };
}

export function fetchPolygon(params) {
  const { callback } = params;
  return (dispatch) => {
    const serverUrl = '/api/polygons';

    dispatch(requestPolygon(params));

    return fetchData(serverUrl, {
      method: 'GET',
      params: {},
    })
      .then(response => response.json())
      .then((json) => {
        if (json && json.status === 'OK') {
          dispatch(receivePolygon(json.data, params));

          if (callback) {
            callback();
          }
        } else {
          dispatch(badRequest('fetchIncome', 'Error happens on the backend'));
        }
      })
      .catch((e) => {
        dispatch(badRequest('fetchIncome', e.toString()));
      });
  }
}

export function getIncome(params) {
  const { lat, lng } = params;
  const API_BASE = 'https://www.broadbandmap.gov/broadbandmap';
  const version = 2014;

  const serverUrl = `${API_BASE}/demographic/${version}/coordinates?latitude=${lat}&longitude=${lng}&format=json`;

  return fetchData(serverUrl, {
    method: 'GET',
    params: {},
  }).then(response => response.json());
}