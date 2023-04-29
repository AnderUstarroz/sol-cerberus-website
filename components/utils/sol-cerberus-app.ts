import { Connection } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";

export function get_provider(connection: Connection, wallet): anchor.Provider {
  return new anchor.AnchorProvider(
    connection,
    wallet.adapter,
    anchor.AnchorProvider.defaultOptions()
  );
}

export function getApps() {}
