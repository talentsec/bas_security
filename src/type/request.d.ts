declare namespace RequestType {
  interface Login {
    app: "bas_manage";
    name: "string";
    password: "string";
  }
  interface Rogister {
    captchaId: "string";
    captchaValue: "string";
    name: "string";
    password: "string";
  }
  interface GetUserList {
    keyword: string;
    limit: number;
    page: number;
  }
  interface AddUser {
    avatar: "string";
    name: "string";
    nickname: "string";
    password: "string";
    roleType: "SP";
  }
  interface UpdateUser {
    avatar: "string";
    nickname: "string";
  }
  interface VerifyCaptcha {
    captchaId: "string";
    value: "string";
  }
}

declare namespace ResponseType {
  interface Login {
    access_token: "string";
  }
  interface GetUserDetail {
    avatar: "string";
    createName: "string";
    createdAt: "string";
    createdBy: 0;
    id: 0;
    name: "string";
    nickname: "string";
    roleType: "SP";
    updateName: "string";
    updatedAt: "string";
    updatedBy: 0;
  }
  interface GetCaptcha {
    captchaId: "string";
    imageUrl: "string";
  }
}
