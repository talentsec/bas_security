import http from "./http";

const BaseUrl = "/scenarios";

// 场景列表
export const GetScenariosList = (params: RequestType.GetScenariosList): Promise<ResponseType.GetScenariosList> => {
  return http.get(`${BaseUrl}`, { params });
};

// 我的场景列表
export const GetMyScenariosList = (
  params: RequestType.GetMyScenariosList
): Promise<ResponseType.GetMyScenariosList> => {
  return http.get(`${BaseUrl}/my`, { params });
};

// 创建场景
export const CreateScenario = (params: RequestType.GetScenariosList): Promise<ResponseWrapper<number>> => {
  return http.post(`${BaseUrl}`, params);
};

// 创建新场景版本
export const CreateScenariosVersion = (data: RequestType.CreateScenariosVersion): Promise<ResponseWrapper<number>> => {
  return http.post(`${BaseUrl}/version`, data);
};

// 场景版本详情
export const GetScenarioVersionDetail = (id: number): Promise<ResponseType.GetScenarioVersionDetail> => {
  return http.get(`${BaseUrl}/versions/${id}`);
};

// 更新场景版本
export const UpdateScenarioVersion = (
  id: number,
  data: RequestType.UpdateScenarioVersion
): Promise<ResponseType.UpdateScenarioVersionDetail> => {
  return http.put(`${BaseUrl}/versions/${id}`, data);
};

// 删除场景版本
export const DeleteScenarioVersion = (id: number): Promise<ResponseWrapper<number>> => {
  return http.delete(`${BaseUrl}/versions/${id}`);
};

// 审核场景版本
export const AuditScenarioVersion = (
  id: number,
  data: {
    action: "PASS" | "REJECT";
    remark: string;
  }
): Promise<ResponseWrapper<number>> => {
  return http.patch(`${BaseUrl}/versions/${id}/audit`, data);
};

// 发布/撤销场景版本
export const PublishScenarioVersion = (id: number, action: "PUBLISH" | "CANCEL"): Promise<ResponseWrapper<number>> => {
  return http.patch(`${BaseUrl}/versions/${id}/publish`, { action });
};

// 场景详情
export const GetScenarioDetail = (
  id: number,
  params: {
    keyword?: string;
    limit: number;
    page: number;
    status?: "DRAFT" | "IN_AUDIT" | "AUDIT_REJECT" | "PUBLISHED";
  }
): Promise<ResponseType.GetScenarioDetail> => {
  return http.get(`${BaseUrl}/${id}`, { params });
};

// 删除场景
export const DeleteScenario = (id: number): Promise<ResponseWrapper<number>> => {
  return http.delete(`${BaseUrl}/${id}`);
};

// 更新场景
export const UpdateScenario = (id: number, data: { name: string }): Promise<ResponseWrapper<number>> => {
  return http.patch(`${BaseUrl}/${id}`, data);
};
