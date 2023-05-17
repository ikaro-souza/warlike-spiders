import { Analytics } from "@vercel/analytics/react";
import { Provider } from "jotai";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import "y/styles/globals.css";
import { api } from "y/utils/api";

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <SessionProvider session={session}>
            <Provider>
                <Component {...pageProps} />
            </Provider>
            <Analytics />
        </SessionProvider>
    );
};

export default api.withTRPC(MyApp);
