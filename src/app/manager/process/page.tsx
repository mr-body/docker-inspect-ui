import { DockerProcessService } from "@/service/process";
import { ProcessView } from "@/view/networkDetails.view";

export default async function ProcessPage() {
    const docker = new DockerProcessService();

    const processes = await docker.getProcess();

    return (
        <ProcessView process={processes} />
    );
}