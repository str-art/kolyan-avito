import { useState } from "react";
import { useAlert } from "../contexts/AlertProvider";
import { useSchedulesContext } from "../contexts/SchedulesProvider";
import { formatError } from "../utils/error";
import { useSchedulesApi } from "./useSchedulesApi";

export function useSchedulesController() {
  const api = useSchedulesApi();
  const [isLoading, setIsLoading] = useState(false);
  const alert = useAlert();
  const { schedules, add, remove, update } = useSchedulesContext();

  const newSchedule = async (link: string, name: string) => {
    setIsLoading(true);
    try {
      const schedule = await api.addSchedule(name, link);
      add(schedule);
    } catch (error) {
      alert({ message: formatError(error), type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const toggle = async (name: string) => {
    setIsLoading(true);
    try {
      const schedule = schedules.find((schedule) => schedule.name === name);
      const updatedSchedule = await api.updateSchedule(name, {
        enabled: !schedule?.enabled,
      });
      update({ ...schedule, ...updatedSchedule });
    } catch (error) {
      alert({
        message: formatError(error),
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSchedule = async (name: string) => {
    setIsLoading(true);
    try {
      await api.deleteSchedule(name);
      remove(name);
    } catch (error) {
      alert({
        message: formatError(error),
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    schedules,
    newSchedule,
    toggle,
    deleteSchedule,
    isLoading,
  };
}
