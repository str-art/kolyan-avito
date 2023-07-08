import { useClientContext } from "../contexts/ClientsProvider";

export function useSchedulesApi(resourcePrefix = "/schedules") {
  const client = useClientContext();

  const getSchedules = async () => {
    const { data } = await client.get<Api.Schedule[]>(resourcePrefix);
    return data;
  };

  const getSchedule = async (name: string) => {
    const { data } = await client.get<Api.Schedule>(
      `${resourcePrefix}/${name}`
    );

    return data;
  };

  const updateSchedule = async (
    name: string,
    updates: Partial<Api.Schedule>
  ) => {
    const { data } = await client.put<Api.Schedule>(
      `${resourcePrefix}/${name}`,
      updates
    );
    return data;
  };

  const addSchedule = async (name: string, link: string) => {
    const { data } = await client.post<Api.Schedule>(resourcePrefix, {
      name,
      link,
    });
    return data;
  };

  const deleteSchedule = async (name: string) => {
    await client.delete(`${resourcePrefix}/${name}`);
  };

  return {
    getSchedule,
    updateSchedule,
    addSchedule,
    deleteSchedule,
    getSchedules,
  };
}
