import { createThirdwebClient } from "thirdweb";
import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";

if (!process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID) {
    console.warn("Missing NEXT_PUBLIC_THIRDWEB_CLIENT_ID");
}

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});

export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});
