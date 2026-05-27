export interface DockerProcess {
  id: string;
  image: string;
  command: string;
  running_for: string;
  status: string;
  ports: string;
  name: string;
}