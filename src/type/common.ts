export type OrdinaryType = {
  value: string;
  label: string;
};

export enum EditModeEnum {
  CREATE = "CREATE",
  CREATE_VERSION = "CREATE_VERSION",
  EDIT_VERSION = "EDIT_VERSION",
  CREATE_VERSION_BASE_EXIST = "CREATE_VERSION_BASE_EXIST"
}

export type EditModeType =
  | EditModeEnum.CREATE
  | EditModeEnum.CREATE_VERSION
  | EditModeEnum.CREATE_VERSION_BASE_EXIST
  | EditModeEnum.EDIT_VERSION;
