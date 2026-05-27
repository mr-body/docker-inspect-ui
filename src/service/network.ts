import { DockerNetwork, DockerNetworkInspect } from "@/types/network";

export class DockerNetworkService {
    protected apiHost: string;

    constructor() {
        const server = process.env.SERVER;

        if (!server) {
            throw new Error("Environment variable SERVER not found");
        }

        this.apiHost = server;
    }

    async getNetworks(): Promise<DockerNetwork[]> {
        const response = await fetch(`${this.apiHost}/network`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch images: ${response.status}`);
        }

        return response.json();
    }

    async getNetwork(id: string): Promise<DockerNetworkInspect> {
        const response = await fetch(`${this.apiHost}/network/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch images: ${response.status}`);
        }

        return response.json();
    }
}