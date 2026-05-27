import ImageGrid from "@/view/imageGrid.view";
import { Suspense } from "react";

export default function ImagePage() {
    return (
        <div className="">
            <h1>Docker Image</h1>
            <Suspense fallback={<span>carregando imagems</span>}>
                <ImageGrid />
            </Suspense>
        </div>
    );
}