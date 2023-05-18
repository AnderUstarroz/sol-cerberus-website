import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { SolCerberusTypes } from "sol-cerberus-js";

export class AppError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "AppError";
  }
}

export function nameValidator(value: string) {
  if (!value || value.length > 64) {
    let error = !value ? "empty" : "longer than 64 characters";
    throw new AppError("name", `APP name cannot be ${error}`);
  }
}

export function recoveryValidator(value: string) {
  try {
    if (value) {
      new PublicKey(value);
    }
  } catch (e) {
    throw new AppError("recovery", `Invalid recovery wallet address`);
  }
}

export const VALIDATORS: { [key: string]: any } = {
  nameValidator,
  recoveryValidator,
};

export function validateInput(key: string, value: any, nameSpace: string = "") {
  if (`${key}${nameSpace}Validator` in VALIDATORS) {
    VALIDATORS[`${key}${nameSpace}Validator`](value);
  }
}

export interface AllStatesType {
  App: anchor.IdlAccounts<SolCerberusTypes>["app"];
}
