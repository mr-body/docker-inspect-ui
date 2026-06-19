"use client";

import StackIcon from "@/components/ui/stackI-con";
import { useImages } from "@/hooks/useImages";

export default function ImageGrid() {
  const { data: images, isLoading, error } = useImages();

  if (isLoading) {
    return <div>Carregando imagens...</div>;
  }

  if (error) {
    return <div>Erro ao carregar imagens.</div>;
  }

  if (!images) {
    return null;
  }

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