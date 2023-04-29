import { ContextProvider } from "../components/provider";
import Layout from "../components/layout";
import type { AppProps } from "next/app";
import "@solana/wallet-adapter-react-ui/styles.css";
import "../styles/variables.scss";
import "../styles/globals.scss";
import "react-tooltip/dist/react-tooltip.css";

function SolCerberus({ Component, pageProps, router }: AppProps) {
  return (
    <ContextProvider>
      <Layout>
        <Component {...pageProps} router={router} />
      </Layout>
    </ContextProvider>
  );
}

export default SolCerberus;
