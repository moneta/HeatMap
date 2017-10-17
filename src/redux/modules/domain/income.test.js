import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';

import reducer, * as actions from './operaCollection';
const types = actions.ActionTypes;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('operaCollection async actions', () => {
  beforeEach(() => {
    fetchMock.restore();
  });

  it('creates COLLECTION once fetch is done successfully', () => {
    const params = { solutionName: 'SimpleDemo' };

    fetchMock
      .get('/vektordata/currentCollections?solutionName=SimpleDemo', {
        $resolved: true,
      })
      .catch();

    const expectedActions = [
      {
        type: types.REQUEST_COLLECTION,
        params,
      },
      {
        type: types.RECEIVE_COLLECTION,
        params,
        data: [],
      },
    ];

    const store = mockStore({ operaCollection: {} });

    return store.dispatch(actions.fetchCollections({ solutionName: 'SimpleDemo' })).then(() => {
      const respActions = store.getActions();

      // Remove timestamp
      delete respActions[1]['receivedAt'];

      expect(respActions).toEqual(expectedActions);
    });
  });

  it('creates BAD_REQUEST once fetch is done unsuccessfully', () => {
    const params = { solutionName: 'SimpleDemo' };
    const error = 'Error happens on the backend';

    fetchMock
      .get('/vektordata/currentCollections?solutionName=SimpleDemo', {
        error,
      })
      .catch();

    const expectedActions = [
      {
        type: types.REQUEST_COLLECTION,
        params,
      },
      {
        type: types.BAD_REQUEST,
        req: 'fetchCollections',
        error,
      },
    ];

    const store = mockStore({ operaCollection: {} });

    return store.dispatch(actions.fetchCollections({ solutionName: 'SimpleDemo' })).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('creates BAD_REQUEST once fetch throws exception', () => {
    const params = { solutionName: 'SimpleDemo' };
    const error = 'TypeError: Cannot read property \'ok\' of undefined';

    fetchMock
      .get('/vektordata/currentCollections?solutionName=SimpleDemo', {
        throws: () => 'Exception',
      })
      .catch();

    const expectedActions = [
      {
        type: types.REQUEST_COLLECTION,
        params,
      },
      {
        type: types.BAD_REQUEST,
        req: 'fetchCollections',
        error,
      },
    ];

    const store = mockStore({ operaCollection: {} });

    return store.dispatch(actions.fetchCollections({ solutionName: 'SimpleDemo' })).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});


describe('operaCollection reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  it('should handle REQUEST_COLLECTION', () => {
    expect(
      reducer(undefined, {
        type: actions.ActionTypes.REQUEST_COLLECTION,
//        name,
//        options,
//        ...props,
      })
    ).toEqual({
//      type: name,
//      loading: false,
//      options,
    });
  });

  it('should handle RECEIVE_COLLECTION', () => {
    expect(
      reducer(undefined, {
        type: actions.ActionTypes.RECEIVE_COLLECTION,
//        name,
//        options,
//        ...props,
      })
    ).toEqual({
//      type: name,
//      loading: false,
//      options,
    });
  });
});
