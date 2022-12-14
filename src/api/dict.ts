import http from "./http";

const BaseUrl = "/dict";

// ๅ้ๅ่กจ
export const GetDictData = (str: string): Promise<ResponseWrapper<{ name: string; value: string }[]>> => {
  return http.get(`${BaseUrl}/data/types/${str}`);
};
