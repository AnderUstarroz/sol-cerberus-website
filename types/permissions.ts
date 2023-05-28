import { namespaces } from "sol-cerberus-js";

export enum Actions {
  Create = 0,
  Delete = 1,
}

export class RuleError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "RuleError";
  }
}

export interface ManageRuleType {
  action: Actions;
  namespace: namespaces;
  role: string;
  resource: string;
  permission: string;
  expiresAt: number | null;
  readOnlyRole: boolean;
  readOnlyResource: boolean;
  readOnlyPermission: boolean;
}

export interface ManageRuleErrorsType {
  action?: string;
  namespace?: string;
  role?: string;
  resource?: string;
  permission?: string;
  expiresAt?: string;
}

export interface TXStackType {
  [id: string]: { type: Actions; ix: any };
}
