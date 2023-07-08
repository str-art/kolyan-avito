import { createContext, useContext, useReducer } from "react";
import { Noop, mapify } from "../utils";
import { useSchedulesApi } from "../hooks/useSchedulesApi";
import { useIsLoading } from "../hooks/useIsLoading";
import { Loader } from "../components/Loader";
import { Error } from "../components/Error";

enum ScheduleActions {
  ADD = "ADD",
  REMOVE = "REMOVE",
  UPDATE = "UPDATE",
}

type SchedulesMap = Record<string, Api.Schedule>;

type ReducerAction = {
  type: ScheduleActions;
  schedule: Api.Schedule;
};

const ReducerActionsMap: Record<
  ScheduleActions,
  (state: SchedulesMap, schedule: Api.Schedule) => SchedulesMap
> = {
  [ScheduleActions.ADD]: (state, schedule) => {
    state[schedule.name] = schedule;
    return { ...state };
  },
  [ScheduleActions.UPDATE]: (state, schedule) => {
    state[schedule.name] = schedule;
    return { ...state };
  },
  [ScheduleActions.REMOVE]: (state, schedule) => {
    delete state[schedule.name];
    return { ...state };
  },
};

function reducer(state: SchedulesMap, action: ReducerAction) {
  const { type, schedule } = action;
  return ReducerActionsMap[type](state, schedule);
}

type SchedulesContextType = {
  schedules: Api.Schedule[];
  remove: (name: string) => void;
  add: (schedule: Api.Schedule) => void;
  update: (schedule: Api.Schedule) => void;
};

const defaultContext: SchedulesContextType = {
  schedules: [],
  remove: Noop,
  add: Noop,
  update: Noop,
};

const SchedulesContext = createContext(defaultContext);

export const useSchedulesContext = () => useContext(SchedulesContext);

const ScheduleContextProvider = ({
  children,
  initialSchedules,
}: {
  children: React.ReactNode;
  initialSchedules: Api.Schedule[];
}) => {
  const [map, dispatch] = useReducer(reducer, {}, () =>
    mapify("name", initialSchedules)
  );

  const remove = (name: string) => {
    const schedule = map[name];
    dispatch({ type: ScheduleActions.REMOVE, schedule });
  };

  const add = (schedule: Api.Schedule) => {
    dispatch({ type: ScheduleActions.ADD, schedule });
  };

  const update = (schedule: Api.Schedule) => {
    dispatch({ type: ScheduleActions.UPDATE, schedule });
  };

  return (
    <SchedulesContext.Provider
      value={{
        schedules: Object.values(map),
        add,
        remove,
        update,
      }}>
      {children}
    </SchedulesContext.Provider>
  );
};

export const ScheduleProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const api = useSchedulesApi();
  const [isLoading, error, schedules] = useIsLoading(api.getSchedules, []);
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <ScheduleContextProvider initialSchedules={schedules}>
      {children}
    </ScheduleContextProvider>
  );
};
