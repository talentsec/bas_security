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
    attackIDs: string[];
    execMode: "LOCAL" | "REMOTE";
    remark: string;
    roleType: "NORMAL" | "ADMIN";
    inputConfig: {
      content: VectorInputConfigType[];
    };
    outputConfig: {
      content: { name: string; content: string; type: string }[];
    };
    contents: {
      filePath: string;
      os: string;
      osArch: string[];
      osVersion: string[];

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
    keyword?: string;
    status?: PublishStateType;
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
      items: {
        connectorConfig: {
          contents: any;
        };
        inputConfig: any;
        tag: string;
      };
      vectorID: number;
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
  interface GetTemplateList {
    keyword?: string;
    limit: number;
    page: number;
    status?: "UNPUBLISHED" | "PUBLISHED";
  }
  interface CreateTemplate {
    contents: {
      scenarioID: number;
    }[];
    name: string;
    remark: string;
    version: string;
  }

  interface CreateTemplateVersion {
    contents: {
      scenarioVersionID: number;
    }[];
    remark: string;
    taskTemplateID: number;
    version: string;
  }

  interface UpdateTemplateVersion {
    contents: {
      scenarioVersionID: number;
    }[];
    remark: string;
  }

  interface GetTemplateDetail {
    keyword?: string;
    limit: number;
    page: number;
    status?: "DRAFT" | "IN_AUDIT" | "AUDIT_REJECT" | "PUBLISHED";
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
    createdBy: number;
    id: number;
    name: string;
    nickname: string;
    roleType: "SP";
    updateName: string;
    updatedAt: string;
    updatedBy: number;
  }>;

  type GetCaptcha = ResponseWrapper<{
    captchaId: string;
    imageUrl: string;
  }>;

  type GetVectorListContent = {
    createdBy: number;
    createdName: string;
    execMode: "LOCAL" | "REMOTE";
    id: number;
    name: string;
    platforms: string[];
    pubNum: number;
    pubTime: string;
    roleType: "NORMAL" | "ADMIN";
    usedNum: number;
    vectorVersionID: number;
    version: string;
  };
  type GetVectorList = ResponseWrapper<PageWrapper<GetVectorListContent>>;

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
    createdBy: number;
    createdName: string;
  }

  type GetVectorVersionDetail = ResponseWrapper<GetVectorVersionDetailContent>;

  type GetVectorDetail = ResponseWrapper<PageWrapper<GetVectorDetailContent>>;
  type GetVectorDetailContent = {
    id: number;
    name: string;
    pubTime: string;
    status: PublishStateType;
    updatedAt: string;
    version: string;
    createdBy: string;
    createdName: string;
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
    capTests: string[];
    compTechs: string[];
    createdBy: number;
    createdName: string;
    id: number;
    name: string;
    pubNum: number;
    pubTime: string;
    scenarioVersionID: number;
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
      platforms: string[];
      roleType: string;
      vectorID: number;
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

  type UpdateScenarioVersionDetail = ResponseWrapper<{
    capTests: string[];
    compTechs: string[];
    contents: [
      {
        items: {
          connectorConfig: {
            contents: any;
          };
          inputConfig: any;
          tag: string;
        };
        vectorID: number;
      }
    ];
    remark: string;
    vectorGraph: {
      contents: any;
    };
  }>;

  interface GetScenarioDetailContent {
    id: number;
    name: string;
    pubTime: string;
    status: "DRAFT" | "IN_AUDIT" | "AUDIT_REJECT" | "PUBLISHED";
    updatedAt: string;
    version: string;
    createdBy: string;
    createdName: string;
  }

  type GetScenarioDetail = ResponseWrapper<PageWrapper<GetScenarioDetailContent>>;

  interface GetTemplateListContent {
    createdBy: number;
    createdName: string;
    id: number;
    name: string;
    pubNum: number;
    pubTime: string;
    scenarioNum: number;
    usedNum: number;
    version: string;
  }
  type GetTemplateList = ResponseWrapper<PageWrapper<GetTemplateListContent>>;

  interface GetMyTemplateListContent {
    id: number;
    name: string;
    pubNum: number;
    versionNum: number;
  }
  type GetMyTemplateList = ResponseWrapper<PageWrapper<GetMyTemplateListContent>>;

  interface GetTemplateVersionDetailContent {
    contents: {
      capTests: string[];
      compTechs: string[];
      name: string;
      scenarioID: number;
      version: string;
      id: number;
    }[];
    id: number;
    name: string;
    remark: string;
    version: string;
  }
  type GetTemplateVersionDetail = ResponseWrapper<GetTemplateVersionDetailContent>;

  interface GetTemplateDetailContent {
    id: number;
    name: string;
    pubTime: string;
    status: "DRAFT" | "IN_AUDIT" | "AUDIT_REJECT" | "PUBLISHED";
    updatedAt: string;
    version: string;
    createdBy: string;
    createdName: string;
  }

  type GetTemplateDetail = ResponseWrapper<PageWrapper<GetTemplateDetailContent>>;

  interface GetAttackListContent {
    attackID: string;
    attackName: string;
    attackNameCN: string;
    techs: {
      attackID: string;
      attackName: string;
      attackNameCN: string;
      techs: {
        attackID: string;
        attackName: string;
        attackNameCN: string;
      }[];
    }[];
  }

  type GetAttackList = ResponseWrapper<GetAttackListContent[]>;
}

enum PublishStateEnum {
  DRAFT = "DRAFT", // 未发布
  IN_AUDIT = "IN_AUDIT", // 审核中
  AUDIT_REJECT = "AUDIT_REJECT", // 审核拒绝
  PUBLISHED = "PUBLISHED" // 已发布
}

type PublishStateType =
  | PublishStateEnum.AUDIT_REJECT
  | PublishStateEnum.DRAFT
  | PublishStateEnum.IN_AUDIT
  | PublishStateEnum.PUBLISHED;

type ResponseWrapper<T> = {
  code: number;
  data?: T;
  message: string;
};
GetMyTemplateList;
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
