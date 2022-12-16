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
  interface VectorDetailBaseType {
    attCkCategory: string;
    attCkID: string;
    categoryID: string;
    execMode: "LOCAL" | "REMOTE";
    platform: string;
    remark: string;
    roleType: "NORMAL" | "ADMIN";
    contents: {
      inputConfig: {
        content: VectorInputConfigType[];
      };
      os: string;
      osArch: string[];
      osVersion: string[];
      outputConfig: {
        content: { name: string; content: string }[];
      };
      url: string;
    }[];
    targetRangeURL: string;
  }

  type updateVectorVersions = VectorDetailBaseType;

  interface GetVectorList {
    keyword?: string;
    limit: number;
    page: number;
    status?: "PUBLISHED" | "UNPUBLISHED";
    execMode?: "LOCAL" | "REMOTE";
  }
  interface GetMyVectorList {
    keyword?: string;
    limit: number;
    page: number;
    status?: "PUBLISHED" | "UNPUBLISHED";
  }
  interface GetVectorDetail {
    limit: number;
    page: number;
    status?: VectorPublishStateType;
  }
  interface CreateVector extends VectorDetailBaseType {
    name: string;
    version: string;
  }
  interface CreateVectorVersion extends VectorDetailBaseType {
    vectorID: number;
    version: string;
  }

  interface GetScenariosList {
    keyword?: string;
    limit: number;
    page: number;
    status?: "UNPUBLISHED" | "PUBLISHED";
  }

  type GetMyScenariosList = GetScenariosList;

  interface BaseScenarioType {
    capTests: string[];
    compTechs: string[];
    contents: {
      connectorConfig: {
        contents: any;
      };
      vectorVersionID: number;
    }[];
    remark: string;
    vectorGraph: {
      contents: any;
    };
  }
  interface CreateScenario extends BaseScenarioType {
    name: string;
    version: string;
  }

  interface CreateScenariosVersion extends BaseScenarioType {
    version: string;
  }
  type UpdateScenarioVersion = BaseScenarioType;
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

  type VectorContentConfig = {
    inputConfig: Record<string, unknown>;
    os: string;
    osArch: string[];
    osVersion: string[];
    outputConfig: Record<string, unknown>;
    url: string;
  };

  interface GetVectorVersionDetailContent extends RequestType.VectorDetailBaseType {
    id: number;
    name: string;
    version: string;
  }

  type GetVectorVersionDetail = ResponseWrapper<GetVectorVersionDetailContent>;

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
  interface GetScenariosListContent {
    createdBy: number;
    createdName: string;
    id: number;
    name: string;
    pubNum: number;
    pubTime: string;
    usedNum: number;
    vectorNum: number;
    version: string;
  }
  type GetScenariosList = ResponseWrapper<PageWrapper<GetScenariosListContent>>;
  interface GetMyScenariosListContent {
    capTests: string[];
    compTechs: string[];
    id: number;
    name: string;
    pubNum: number;
    scenarioVersionID: number;
    version: string;
    versionNum: number;
  }
  type GetMyScenariosList = ResponseWrapper<PageWrapper<GetMyScenariosListContent>>;

  type GetScenarioVersionDetail = ResponseWrapper<{
    capTests: string[];
    compTechs: string[];
    contents: {
      connectorConfig: {
        contents: any;
      };
      execMode: string;
      name: string;
      platform: string;
      roleType: string;
      vectorVersionID: number;
      version: string;
    }[];
    id: number;
    name: string;
    remark: string;
    vectorGraph: {
      contents: any;
    };
    version: string;
  }>;

  type GetScenarioDetail = ResponseWrapper<
    PageWrapper<{
      id: 0;
      name: string;
      pubTime: string;
      status: "DRAFT" | "IN_AUDIT" | "AUDIT_REJECT" | "PUBLISHED";
      updatedAt: string;
      version: string;
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

type PageData = {
  limit: number;
  page: number;
};
