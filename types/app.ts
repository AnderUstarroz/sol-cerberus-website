import { PublicKey } from "@solana/web3.js";

export interface NewAPPType {
  name: string;
  recovery: PublicKey | null;
  cached: true;
}

export interface NewAPPErrorType {
  name?: String;
  recovery?: String;
}
