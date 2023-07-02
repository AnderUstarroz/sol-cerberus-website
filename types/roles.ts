import { PublicKey } from "@solana/web3.js";
import { AddressTypeType } from "sol-cerberus-js";

export class RoleError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "RoleError";
  }
}
export enum Actions {
  Create = 0,
  Delete = 1,
}

export interface RolesType {
  [role: string]: {
    [addressType in AddressTypeType]: {
      [address: string]: {
        expiresAt: number | null;
      };
    };
  };
}

export interface ManageRoleType {
  action: Actions;
  role: string;
  address: string;
  addressType: AddressTypeType;
  expiresAt: number | null;
  readOnlyRole: boolean;
  readOnlyAddressType: boolean;
  readOnlyAddress: boolean;
}

export interface ManageRoleErrorsType {
  action?: string;
  role?: string;
  address?: PublicKey | null;
  addressType?: string;
  expiresAt?: string;
}
