import StackIcon from "@/components/ui/stackI-con";
import { DockerImageService } from "@/service/images";

export default async function ImageGrid() {
  const docker = new DockerImageService();

  const images = await docker.getImages();

  return (
    <div className="grid gap-4">
      {images.map((image) => (
        <div key={image.id} className="border rounded-lg p-4">
          <p>
            <strong>ID:</strong> {image.id}
          </p>

          <p>
            <StackIcon name={image.repository} />
          </p>
          <p>
            <strong>Repository:</strong> {image.repository}
          </p>

          <p>
            <strong>Tag:</strong> {image.tag}
          </p>

          <p>
            <strong>Created:</strong> {image.created}
          </p>

          <p>
            <strong>Size:</strong> {image.size}
          </p>
        </div>
      ))}
    </div>
  );
}