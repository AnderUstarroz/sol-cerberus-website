import { addressTypes } from "sol-cerberus-js";
import { RoleError } from "../../types/roles";
import { is_ascii_alphanumeric } from "../utils/string";
import { PublicKey } from "@metaplex-foundation/js";

export function isAsciiAlphanumeric(field: string, value: string) {
  if (!is_ascii_alphanumeric(value)) {
    throw new RoleError(
      field,
      `${field.replace(
        /^./,
        field[0].toUpperCase()
      )} can only contain alphanumeric ASCII characters (a-z, A-Z, 0-9)`
    );
  }
}

export function noEmpty(field: string, value: any) {
  if (!value) {
    throw new RoleError(
      field,
      `${field.replace(/^./, field[0].toUpperCase())} cannot be empty`
    );
  }
}

export function roleValidator(value: string) {
  noEmpty("role", value);
  isAsciiAlphanumeric("role", value);
}

export function addressTypeValidator(value: addressTypes) {
  if (
    ![addressTypes.Wallet, addressTypes.NFT, addressTypes.Collection].includes(
      value
    )
  ) {
    throw new RoleError(
      "addressType",
      `The address type must be either Wallet, NFT or Collection`
    );
  }
}

export function addressValidator(value: string) {
  try {
    value === "*" || new PublicKey(value);
  } catch (e) {
    throw new RoleError(
      "address",
      `Invalid Solana address! Either use a valid address or the "*" wildcard`
    );
  }
}

export function expiresAtValidator(value: string | null) {
  if (value !== null) {
    if (new Date() > new Date(value)) {
      throw new RoleError(
        "expiresAt",
        "The expiring date cannot be in the past"
      );
    }
  }
}

export const VALIDATORS: { [key: string]: any } = {
  roleValidator,
  addressTypeValidator,
  addressValidator,
  expiresAtValidator,
};

export function validateInput(key: string, value: any, nameSpace: string = "") {
  if (`${key}${nameSpace}Validator` in VALIDATORS) {
    VALIDATORS[`${key}${nameSpace}Validator`](value);
  }
}
