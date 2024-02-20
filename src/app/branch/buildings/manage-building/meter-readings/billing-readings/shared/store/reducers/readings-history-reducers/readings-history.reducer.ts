import * as readingsHistoryState from '../../state/readings-history.state';
import * as readingsHistoryActions from '../../actions/readings-history-actions/readings-history.action';

export function reducer(state = readingsHistoryState.initialState, action: readingsHistoryActions.Action) {

  switch (action.type) {
    case readingsHistoryActions.GET_READINGS_HISTORY_LIST_COMPLETE: {
      return {
        ...state,
        groupsOfReadings: action.payload
      };
    }

    case readingsHistoryActions.GET_READINGS_HISTORY_AMOUNT: {
      return {
        ...state,
        totalReadingsAmount: action.payload
      };
    }

    case readingsHistoryActions.GET_PINNED_READINGS_HISTORY_COMPLETE: {
      return {
        ...state,
        pinnedReadings: action.payload
      };
    }

    case readingsHistoryActions.SORT_BY_FILTER: {
      return {
        ...state,
        sortBy: action.payload
      };
    }

    case readingsHistoryActions.INIT_FILTER: {
      return {
        ...state,
        ...action.payload,
      };
    }

    case readingsHistoryActions.GET_METERS_REQUEST_COMPLETE: {
      return {
        ...state,
        meters: action.payload
      };
    }

    case readingsHistoryActions.TOGGLE_PIN_REQUEST_COMPLETE: {

      const groupOfReadings = [...state.groupsOfReadings
        .map(gr => {
          return {
            ...gr,
            readings: gr.readings.map(r => {
              return r.id === action.payload.readingId ? {
                ...r,
                isPinned: action.payload.isPinned
              } : r;
            })
          };
        })
      ];

      const pinnedReadings = action.payload.isPinned ?
        [...state.pinnedReadings, {...action.payload.reading, isPinned: true}] :
        state.pinnedReadings.filter(r => r.id !== action.payload.readingId);

      return {
        ...state,
        groupsOfReadings: groupOfReadings,
        pinnedReadings: pinnedReadings
      };
    }

    case readingsHistoryActions.UPDATE_METER: {
      return {
        ...state,
        meterId: action.payload
      };
    }

    case readingsHistoryActions.UPDATE_REGISTER_TOU: {
      return {
        ...state,
        registerId: action.payload.registerId,
        timeOfUse: action.payload.timeOfUse
      };
    }

    case readingsHistoryActions.UPDATE_START_DATE: {
      return {
        ...state,
        startDate: action.payload
      };
    }

    case readingsHistoryActions.UPDATE_END_DATE: {
      return {
        ...state,
        endDate: action.payload
      };
    }

    case readingsHistoryActions.DEFAULT_READINGS: {
      return {...(readingsHistoryState.initialState)};
    }

    default:
      return state;
  }
}
