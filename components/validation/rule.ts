import { RuleError } from "../../types/permissions";
import { is_ascii_alphanumeric } from "../utils/string";

export function isAsciiAlphanumeric(field: string, value: string) {
  if (!is_ascii_alphanumeric(value)) {
    throw new RuleError(
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
    throw new RuleError(
      field,
      `${field.replace(/^./, field[0].toUpperCase())} cannot be empty`
    );
  }
}
export function roleValidator(value: string) {
  noEmpty("role", value);
  isAsciiAlphanumeric("role", value);
}
export function resourceValidator(value: string) {
  noEmpty("resource", value);
  if (value !== "*") {
    isAsciiAlphanumeric("resource", value);
  }
}
export function permissionValidator(value: string) {
  noEmpty("permission", value);
  if (value !== "*") {
    isAsciiAlphanumeric("permission", value);
  }
}
export function expiresAtValidator(value: string | null) {
  if (value !== null) {
    if (new Date() > new Date(value)) {
      throw new RuleError(
        "expiresAt",
        "The expiring date cannot be in the past"
      );
    }
  }
}

export const VALIDATORS: { [key: string]: any } = {
  roleValidator,
  resourceValidator,
  permissionValidator,
  expiresAtValidator,
};

export function validateInput(key: string, value: any, nameSpace: string = "") {
  if (`${key}${nameSpace}Validator` in VALIDATORS) {
    VALIDATORS[`${key}${nameSpace}Validator`](value);
  }
}
