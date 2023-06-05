import { useRouter as useNextRouter, type NextRouter } from "next/router";

function go(delta: number) {
    window.history.go(delta);
}

type Router = NextRouter & { go: typeof go };
export const useRouter = (): Router => {
    const router = useNextRouter();
    return { ...router, go };
};
