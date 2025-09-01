"use client";
import { TransportProvider } from "@connectrpc/connect-query";
import { createConnectTransport } from "@connectrpc/connect-web";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const finalTransport = createConnectTransport({
  baseUrl: "/api/rpc",
  useBinaryFormat: true,
  // @ts-ignore
  fetch: async (input, init?) => {
    if (init?.headers != null && typeof init.headers === "object") {
      // @ts-ignore
      // init.headers['x-clerk-debug'] = 'true';

      if (
        // @ts-ignore
        typeof window["Clerk"] != "undefined" &&
        // @ts-ignore
        window.Clerk["session"] != null &&
        // @ts-ignore
        typeof window.Clerk["session"] !== "undefined" &&
        // @ts-ignore
        window.Clerk.session["getToken"] != null &&
        // @ts-ignore
        typeof window.Clerk.session["getToken"] !== "undefined"
      ) {
        // @ts-ignore
        init.headers["Session"] = await window.Clerk.session.getToken();

        // @ts-ignore
        init.headers["Session-id"] = await window.Clerk.session.id;
      }
    }
    return fetch(input, {
      ...init,
      keepalive: false,
      credentials: "include",
    });
  },
});

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5000 } },
});

export const RpcProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <TransportProvider transport={finalTransport}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </TransportProvider>
  );
};
