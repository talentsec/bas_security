import http from "./http";

const BaseUrl = "/vectors";

// 向量列表
export const GetVectorList = (): Promise<ResponseType.GetVectorList> => {
  return http.get(`${BaseUrl}`);
};

// 创建向量
export const CreateVector = (data: RequestType.CreateVector): Promise<ResponseWrapper<unknown>> => {
  return http.post(`${BaseUrl}`, data);
};

// 我的向量列表
export const GetMyVectorList = (params: PageData): Promise<ResponseType.GetMyVectorList> => {
  return http.get(`${BaseUrl}/my`, { params });
};

// 创建新向量版本
export const UpdataVector = (params: RequestType.UpdateVector): Promise<ResponseWrapper<unknown>> => {
  return http.post(`${BaseUrl}/versions`, { params });
};

// 向量版本详情
export const GetVectorVersions = (id: string): Promise<ResponseWrapper<unknown>> => {
  return http.get(`${BaseUrl}/versions/${id}`);
};

// 更新向量版本
export const UpdateVectorVersions = (
  id: string,
  data: RequestType.UpdateVectorVersion
): Promise<ResponseWrapper<unknown>> => {
  return http.put(`${BaseUrl}/versions/${id}`, data);
};

// 删除向量版本
export const DeleteVectorVersions = (id: string): Promise<ResponseWrapper<unknown>> => {
  return http.delete(`${BaseUrl}/versions/${id}`);
};

// 发布/撤销向量版本
export const PublishVectorVersions = (id: string, action: "CANCEL" | "PUBLISH"): Promise<ResponseWrapper<unknown>> => {
  return http.patch(`${BaseUrl}/versions/${id}`, {
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
): Promise<ResponseWrapper<unknown>> => {
  return http.get(`${BaseUrl}/${id}`, {
    params
  });
};

// 删除向量
export const DeleteVector = (id: string): Promise<ResponseWrapper<unknown>> => {
  return http.delete(`${BaseUrl}/${id}`);
};

//
export const UpdateVector = (id: string, data: { name: string }): Promise<ResponseWrapper<unknown>> => {
  return http.patch(`${BaseUrl}/${id}`, data);
};
