import { AxiosError } from "axios";
import { DEFAULT_ERROR_MESSAGE } from "../constants/global";

export const formatError = (err: unknown) => {
  if (err instanceof AxiosError) {
    return err.response?.data.message || DEFAULT_ERROR_MESSAGE;
  }

  if (err instanceof Error) {
    return err.message || DEFAULT_ERROR_MESSAGE;
  }

  if (typeof err === "string") {
    return err;
  }

  return DEFAULT_ERROR_MESSAGE;
};
