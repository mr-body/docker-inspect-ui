import { DockerImage } from "@/types/image";

export class DockerImageService {
    protected apiHost: string;

    constructor() {
        const server = process.env.SERVER;

        if (!server) {
            throw new Error("Environment variable SERVER not found");
        }

        this.apiHost = server;
    }

    async getImages(): Promise<DockerImage[]> {
        const response = await fetch(`${this.apiHost}/image`, {
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