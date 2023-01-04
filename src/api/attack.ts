import http from "./http";

const BaseUrl = "/attacks";

//  attack列表
export const GetAttackList = (): Promise<ResponseType.GetAttackList> => {
  return http.get(`${BaseUrl}`);
};
