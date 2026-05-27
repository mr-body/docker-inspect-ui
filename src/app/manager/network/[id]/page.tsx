import StackIcon from "@/components/ui/stackI-con";
import { DockerNetworkService } from "@/service/network";

interface RouteProps {
    params: Promise<{ id: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
export default async function NetworkIDPage({ params }: RouteProps) {
    const docker = new DockerNetworkService();

    const id = (await params).id;
    const network = await docker.getNetwork(id);

    return (
        <div className="flex-1">
            <h1>Docker Inspect {network.name}</h1>

            <p>ID: {network.id}</p>
            <p>Driver: {network.driver}</p>
            <p>Scope: {network.scope}</p>


            {/* CONTAINERS */}
            <div>
                <h2 className="text-lg font-semibold mb-2">
                    Containers conectados
                </h2>

                <div className="grid gap-3">
                    {network.containers &&
                        Object.keys(network.containers).length > 0 &&
                        Object.entries(network.containers).map(([id, container]) => (
                            <div
                                key={id}
                                className="border rounded p-3"
                            >
                                <p><StackIcon name={container.Name} /></p>
                                <p><strong>Name:</strong> {container.Name}</p>
                                <p><strong>ID:</strong> {id}</p>
                                <p><strong>IP:</strong> {container.IPv4Address}</p>
                                <p><strong>MAC:</strong> {container.MacAddress}</p>
                            </div>
                        ))}
                </div>
            </div>

            {/* IPAM */}
            <div className="border p-4 rounded">
                <h2 className="font-semibold mb-2">IPAM</h2>

                <p>
                    <strong>Driver:</strong> {network.ipam?.Driver ?? "N/A"}
                </p>

                {network.ipam?.Config?.length ? (
                    network.ipam.Config.map((cfg, i) => (
                        <div key={i} className="mt-2">
                            <p><strong>Subnet:</strong> {cfg.Subnet}</p>
                            <p><strong>Gateway:</strong> {cfg.Gateway}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400">Sem configuração IPAM</p>
                )}
            </div>
        </div>
    );
}