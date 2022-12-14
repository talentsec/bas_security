import http from "./http";

const BaseUrl = "/dict";

// 向量列表
export const GetDictData = (str: string): Promise<{ name: string; value: string }[]> => {
  return http.get(`${BaseUrl}/data/type/${str}`);
};
