import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ContextProvider } from "../components/provider";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import "@solana/wallet-adapter-react-ui/styles.css";
import "../styles/variables.scss";
import "../styles/globals.scss";
import dynamic from "next/dynamic";

const Layout = dynamic(() => import("../components/layout"));

function SolCerberus({ Component, pageProps, router }: AppProps) {
  const [cluster, setCluster] = useState<WalletAdapterNetwork>(
    process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork
  );

  const handleSetCluster = (cluster: WalletAdapterNetwork) => {
    sessionStorage.setItem("cluster", cluster);
    setCluster(cluster);
    window.location.reload();
  };

  // Define Solana Cluster
  useEffect(() => {
    let cached = sessionStorage.getItem("cluster") as WalletAdapterNetwork;
    if (cached && cached !== cluster) {
      setCluster(cached);
    }
  }, []);

  return (
    <ContextProvider cluster={cluster}>
      <Layout setCluster={handleSetCluster} cluster={cluster} router={router}>
        <Component {...pageProps} router={router} cluster={cluster} />
      </Layout>
    </ContextProvider>
  );
}

export default SolCerberus;
