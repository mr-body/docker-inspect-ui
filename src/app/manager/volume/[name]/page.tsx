import VolumeDetail from "@/view/volume.view";
import { Suspense } from "react"

interface RouteProps {
    params: Promise<{ name: string }>
}

export default async function Volume({ params }: RouteProps) {
    const name = (await params).name;

    return (
        <Suspense>
            <VolumeDetail name={name} />
        </Suspense>
    )
}