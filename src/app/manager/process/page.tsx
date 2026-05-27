import StackIcon from "@/components/ui/stackI-con";
import { DockerProcessService } from "@/service/process";

export default async function ProcessPage() {
    const docker = new DockerProcessService();

    const processes = await docker.getProcess();

    return (
        <div>
            <h1 className="text-2xl font-bold">Docker Process</h1>

            <div className="grid gap-3 mt-4">
                {processes.map((proc) => (
                    <div key={proc.id} className="border p-4 rounded space-y-1">
                        <StackIcon name={proc.name} />
                        <p>
                            <strong>Name:</strong> {proc.name}
                        </p>

                        <p>
                            <strong>ID:</strong> {proc.id}
                        </p>

                        <p>
                            <strong>Image:</strong> {proc.image}
                        </p>

                        <p>
                            <strong>Command:</strong>{" "}
                            <code className="text-xs">{proc.command}</code>
                        </p>

                        <p>
                            <strong>Status:</strong> {proc.status}
                        </p>

                        <p>
                            <strong>Running for:</strong> {proc.running_for}
                        </p>

                        <p>
                            <strong>Ports:</strong> {proc.ports || "N/A"}
                        </p>

                    </div>
                ))}
            </div>
        </div>
    );
}