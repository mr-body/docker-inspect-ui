import { DockerImage } from "@/types/image";
import { DockerProcess } from "@/types/process";

export class DockerProcessService {
    protected apiHost: string;

    constructor() {
        const server = process.env.SERVER;

        if (!server) {
            throw new Error("Environment variable SERVER not found");
        }

        this.apiHost = server;
    }

    async getProcess(): Promise<DockerProcess[]> {
        const response = await fetch(`${this.apiHost}/process`, {
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