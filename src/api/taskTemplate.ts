import http from "./http";

const BaseUrl = "/taskTemplates";

// 任务模版列表
export const GetTemplateList = (data: RequestType.GetTemplateList): Promise<ResponseType.GetTemplateList> => {
  return http.get(`${BaseUrl}`, { params: data });
};

// 创建任务模版
export const CreateTemplate = (data: RequestType.CreateTemplate): Promise<ResponseWrapper<number>> => {
  return http.post(`${BaseUrl}`, data);
};

// 我的任务模版列表
export const GetMyTemplateList = (data: RequestType.GetTemplateList): Promise<ResponseType.GetMyTemplateList> => {
  return http.get(`${BaseUrl}/my`, { params: data });
};

// 创建新任务模版版本
export const CreateTemplateVersion = (data: RequestType.CreateTemplateVersion): Promise<ResponseWrapper<number>> => {
  return http.post(`${BaseUrl}/versions`, data);
};

// 任务模版版本详情
export const GetTemplateVersionDetail = (id: number): Promise<ResponseType.GetTemplateVersionDetail> => {
  return http.get(`${BaseUrl}/versions/${id}`);
};

// 更新任务模版版本
export const UpdateTemplateVersion = (
  id: number,
  data: RequestType.UpdateTemplateVersion
): Promise<ResponseWrapper<number>> => {
  return http.put(`${BaseUrl}/versions/${id}`, data);
};

// 删除任务模版版本
export const DeleteTemplateVersion = (id: number): Promise<ResponseWrapper<number>> => {
  return http.delete(`${BaseUrl}/versions/${id}`);
};

// 发布/撤销任务模版版本
export const PublishTemplateVersion = (id: number, action: "PUBLISH" | "CANCEL"): Promise<ResponseWrapper<number>> => {
  return http.patch(`${BaseUrl}/versions/${id}/publish`, {
    action
  });
};

// 任务模版详情
export const GetTemplateDetail = (
  id: number,
  params: RequestType.GetTemplateDetail
): Promise<ResponseType.GetTemplateDetail> => {
  return http.get(`${BaseUrl}/${id}`, { params });
};

// 删除任务模版
export const DeleteTemplate = (id: number): Promise<ResponseWrapper<number>> => {
  return http.delete(`${BaseUrl}/${id}`);
};

// 删除任务模版
export const UpdateTemplate = (id: number, name: string): Promise<ResponseWrapper<number>> => {
  return http.patch(`${BaseUrl}/${id}`, { name });
};
