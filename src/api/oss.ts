import http from "./http";
const BaseUrl = "/oss";

// 获取minioSTS授权
export const GetSTSAssumeRole = (): Promise<
  ResponseWrapper<{
    accessKeyID: string;
    endPoint: string;
    port: number;
    secretAccessKey: string;
    sessionToken: string;
    useSSL: boolean;
  }>
> => {
  return http.post(`${BaseUrl}/sts`);
};
