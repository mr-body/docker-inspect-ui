import NetworkGrid from "@/view/networkGrid.view";
import { Suspense } from "react";

export default function NetworkPage() {
    return (
        <div className="">
            <h1>Docker NetWork</h1>
            <Suspense fallback={<span>carregando imagems</span>}>
                <NetworkGrid />
            </Suspense>
        </div>
    );
}