declare namespace RequestType {
  interface Login {
    app: "bas_security";
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
  interface CreateVector {
    attCkCategory: string;
    attCkID: string;
    categoryID: string;
    execMode: "LOCAL";
    name: string;
    platform: string;
    remark: string;
    roleType: "NORMAL";
    scenarios: {
      inputConfig: {
        additionalProp1: any;
      };
      os: string;
      osArch: [string];
      osVersion: [string];
      outputConfig: {
        additionalProp1: any;
      };
      url: string;
    }[];
    targetRangeURL: string;
    version: string;
  }
  interface UpdateVector {
    attCkCategory: string;
    attCkID: string;
    category_id: string;
    execMode: "LOCAL";
    platform: string;
    remark: string;
    roleType: "NORMAL";
    scenarios: [
      {
        inputConfig: {
          additionalProp1: unknown;
        };
        os: string;
        osArch: [string];
        osVersion: [string];
        outputConfig: {
          additionalProp1: unknown;
        };
        url: string;
      }
    ];
    targetRangeURL: string;
    vectorID: number;
    version: string;
  }
  interface UpdateVectorVersion {
    attCkCategory: string;
    attCkID: string;
    category_id: string;
    execMode: "LOCAL";
    platform: string;
    remark: string;
    roleType: "NORMAL";
    scenarios: [
      {
        inputConfig: {
          additionalProp1: unknown;
        };
        os: string;
        osArch: [string];
        osVersion: [string];
        outputConfig: {
          additionalProp1: unknown;
        };
        url: string;
      }
    ];
    targetRangeURL: string;
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

  type GetVectorList = ResponseWrapper<
    PageWrapper<{
      createdBy: number;
      createdName: string;
      id: number;
      name: string;
      pubNum: number;
      pubTime: string;
      usedNum: number;
      version: string;
    }>
  >;

  type GetVectorDetail = ResponseWrapper<PageWrapper<GetVectorDetailContent>>;
  type GetVectorDetailContent = {
    id: number;
    name: string;
    pubTime: string;
    status: VectorPublishStateType;
    updatedAt: string;
    version: string;
  };

  type GetMyVectorList = ResponseWrapper<
    PageWrapper<{
      id: number;
      name: string;
      pubNum: number;
      versionNum: number;
    }>
  >;
}

enum VectorPublishStateType {
  DRAFT = "DRAFT", // 未发布
  IN_AUDIT = "IN_AUDIT", // 审核中
  AUDIT_REJECT = "AUDIT_REJECT", // 审核拒绝
  PUBLISHED = "PUBLISHED" // 已发布
}

type ResponseWrapper<T> = {
  code: number;
  data?: T;
  message: string;
};

type PageWrapper<T> = {
  content: T[];
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};

declare type PageData = {
  limit: number;
  page: number;
};
