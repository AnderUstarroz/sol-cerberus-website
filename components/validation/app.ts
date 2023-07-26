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
  if (!value || value.length > 16) {
    let error = !value ? "empty" : "longer than 16 characters";
    throw new AppError("name", `APP name cannot be ${error}`);
  }
}

export function authorityValidator(value: string | PublicKey) {
  try {
    if (value?.constructor?.name === "PublicKey") return;
    new PublicKey(value);
  } catch (e) {
    throw new AppError("authority", `Invalid Authority wallet address`);
  }
}

export function recoveryValidator(value: string | PublicKey) {
  try {
    if (value?.constructor?.name === "PublicKey") return;
    if (value) {
      new PublicKey(value);
    }
  } catch (e) {
    throw new AppError("recovery", `Invalid recovery wallet address`);
  }
}

export const VALIDATORS: { [key: string]: any } = {
  nameValidator,
  authorityValidator,
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
