import { useEffect, useRef, useState } from "react";
import debounce from "lodash/debounce";

type UseIsLoadingReturn<Result> =
  | [true, undefined, undefined]
  | [false, unknown, Result]
  | [false, undefined, Result];

export function useIsLoading<Result, Params extends []>(
  func: (...params: Params) => Promise<Result>,
  params: Params
): UseIsLoadingReturn<Result> {
  const [isLoading, setIsLoading] = useState(true);

  const result = useRef<Result>(undefined as Result);
  const error = useRef<unknown>();

  const run = debounce(async (params: Params) => {
    setIsLoading(true);
    try {
      result.current = await func(...params);
      error.current = undefined;
    } catch (e) {
      error.current = e;
    } finally {
      setIsLoading(false);
    }
  }, 300);

  useEffect(() => {
    run(params);
  }, params);

  if (isLoading) {
    return [true, undefined, undefined];
  }

  if (error.current) {
    return [false, error.current, result.current];
  }

  return [false, undefined, result.current];
}
