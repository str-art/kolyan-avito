declare module 'tor-request' {
  // eslint-disable-next-line node/no-unpublished-import
  import {RequestAPI, Request, CoreOptions, Response} from 'request';

  interface ISetTorAddress {
    (address: string, port: number, type: number): void;
  }
  interface IProxySettings {
    ipaddress: string;
    port: number;
    type: number;
  }
  interface CallBack<Result = never> {
    (err?: unknown, result?: Result): void;
  }
  interface ICallBackFunc<Result = never> {
    (cb: CallBack<Result>): void;
  }
  export type TorRequest = Request;
  export type TorResponse = Response;

  export const request: RequestAPI<TorRequest, CoreOptions, never>;
  export const newTorSession: ICallBackFunc;
  export const SetTorAddress: ISetTorAddress;
  export const proxySettings: IProxySettings;
}
