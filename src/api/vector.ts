import http from "./http";

const BaseUrl = "/vectors";

// 向量列表
export const GetVectorList = (data: RequestType.GetVectorList): Promise<ResponseType.GetVectorList> => {
  return http.get(`${BaseUrl}`, { params: data });
};

// 创建向量
export const CreateVector = (data: RequestType.CreateVector): Promise<ResponseWrapper<unknown>> => {
  return http.post(`${BaseUrl}`, data);
};

// 我的向量列表
export const GetMyVectorList = (params: RequestType.GetMyVectorList): Promise<ResponseType.GetMyVectorList> => {
  return http.get(`${BaseUrl}/my`, { params });
};

// 向量版本详情
export const GetVectorVersionDetail = (id: string): Promise<ResponseType.GetVectorVersionDetail> => {
  return http.get(`${BaseUrl}/versions/${id}`);
};

// 创建新向量版本
export const CreateVectorVersions = (params: RequestType.CreateVectorVersion): Promise<ResponseWrapper<unknown>> => {
  return http.post(`${BaseUrl}/versions`, params);
};

// 更新向量版本
export const UpdateVectorVersions = (
  id: string,
  data: RequestType.updateVectorVersions
): Promise<ResponseWrapper<unknown>> => {
  return http.put(`${BaseUrl}/versions/${id}`, data);
};

// 删除向量版本
export const DeleteVectorVersions = (id: string): Promise<ResponseWrapper<unknown>> => {
  return http.delete(`${BaseUrl}/versions/${id}`);
};

// 发布/撤销向量版本
export const PublishVectorVersions = (id: string, action: "CANCEL" | "PUBLISH"): Promise<ResponseWrapper<unknown>> => {
  return http.patch(`${BaseUrl}/versions/${id}/publish`, {
    action
  });
};

// 向量详情
export const GetVectorDetail = (
  id: string,
  params: {
    keyword: string;
    limit: number;
    page: number;
  }
): Promise<ResponseType.GetVectorDetail> => {
  return http.get(`${BaseUrl}/${id}`, {
    params
  });
};

// 删除向量
export const DeleteVector = (id: string): Promise<ResponseWrapper<unknown>> => {
  return http.delete(`${BaseUrl}/${id}`);
};

// 更新向量
export const UpdateVector = (id: string, data: { name: string }): Promise<ResponseWrapper<unknown>> => {
  return http.patch(`${BaseUrl}/${id}`, data);
};
