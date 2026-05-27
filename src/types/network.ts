export interface DockerNetwork {
  id: string
  name: string
  driver: string
  scope: string
}

export interface DockerNetworkInspect {
  id: string;
  name: string;
  driver: string;
  scope: string;
  containers: Record<string, DockerNetworkContainer>;
  options: Record<string, unknown>;
  ipam: DockerNetworkIPAM;
}

export interface DockerNetworkContainer {
  Name: string;
  EndpointID: string;
  MacAddress: string;
  IPv4Address: string;
  IPv6Address: string;
}

export interface DockerNetworkIPAM {
  Driver: string;
  Options: Record<string, unknown>;
  Config: DockerNetworkIPAMConfig[];
}

export interface DockerNetworkIPAMConfig {
  Subnet: string;
  Gateway: string;
}