import { useRouter as useNextRouter, type NextRouter } from "next/router";

function go(this: NextRouter, delta: number) {
    for (let i = 0; i < Math.abs(delta); i++) {
        if (delta < 0) {
            this.back();
        } else {
            this.forward();
        }
    }
}

type Router = NextRouter & { go: typeof go };
export const useRouter = (): Router => {
    const router = useNextRouter();
    go.bind(router);

    return { ...router, go };
};
