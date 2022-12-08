import http from "./http";

const BaseUrl = "";

// 登录
export const Login = (data: RequestType.Login): Promise<ResponseType.Login> => {
  return http.post(`${BaseUrl}/login`, data);
};

// 注册
export const Rogister = (data: RequestType.Rogister): Promise<number> => {
  return http.post(`${BaseUrl}/register`, data);
};

// 用户列表
export const GetUserList = (data: RequestType.Rogister): Promise<ResponseType.GetUserDetail[]> => {
  return http.get(`${BaseUrl}/users`, { params: data });
};

// 新增用户
export const AddUser = (data: RequestType.AddUser): Promise<number> => {
  return http.post(`${BaseUrl}/users`, data);
};

// 用户详情
export const GetUserDetail = (id: number): Promise<ResponseType.GetUserDetail> => {
  return http.get(`${BaseUrl}/users/${id}`);
};

// 更新用户
export const UpdateUser = (id: number, data: RequestType.UpdateUser): Promise<number> => {
  return http.patch(`${BaseUrl}/users/${id}`, data);
};

// 获取验证码
export const GetCaptcha = (): Promise<number> => {
  return http.get(`${BaseUrl}/captcha`);
};

// 验证验证码
export const VerifyCaptcha = (data: RequestType.VerifyCaptcha): Promise<number> => {
  return http.post(`${BaseUrl}/captcha/verify`, data);
};

// 验证码图片资源
export const GetCaptchaImg = (path: string) => {
  return http.get(`${BaseUrl}/captcha/${path}`);
};
