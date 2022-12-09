declare namespace RequestType {
  interface Login {
    app: "bas_manage";
    name: string;
    password: string;
  }
  interface Register {
    captchaId: string;
    captchaValue: string;
    name: string;
    password: string;
  }
  interface GetUserList {
    keyword: string;
    limit: number;
    page: number;
  }
  interface AddUser {
    avatar: string;
    name: string;
    nickname: string;
    password: string;
    roleType: "SP";
  }
  interface UpdateUser {
    avatar: string;
    nickname: string;
  }
  interface VerifyCaptcha {
    captchaId: string;
    value: string;
  }
}

declare namespace ResponseType {
  type Login = ResponseWrapper<{
    access_token: string;
  }>;

  type GetUserDetail = ResponseWrapper<{
    avatar: string;
    createName: string;
    createdAt: string;
    createdBy: 0;
    id: 0;
    name: string;
    nickname: string;
    roleType: "SP";
    updateName: string;
    updatedAt: string;
    updatedBy: 0;
  }>;

  type GetCaptcha = ResponseWrapper<{
    captchaId: string;
    imageUrl: string;
  }>;
}

type ResponseWrapper<T> = {
  code: number;
  data?: T;
  message: string;
};
