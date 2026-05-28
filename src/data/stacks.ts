import {
    SiApachekafka,
    SiGrafana,
    SiMariadb,
    SiMongodb,
    SiN8N,
    SiNginx,
    SiPostgresql,
    SiPrometheus,
    SiRabbitmq,
    SiWordpress,

    // LANGUAGES
    SiJavascript,
    SiTypescript,
    SiPython,
    SiGo,
    SiRust,
    SiPhp,
    SiKotlin,
    SiCplusplus,

    // FRAMEWORKS / BACKEND
    SiNestjs,
    SiExpress,
    SiDjango,
    SiFlask,
    SiFastapi,
    SiSpring,

    // FRONTEND
    SiReact,
    SiNextdotjs,
    SiVuedotjs,
    SiAngular,
    SiSvelte,

    // DEVOPS / CLOUD
    SiDocker,
    SiKubernetes,
    SiGooglecloud,
    SiTerraform,
    SiAnsible,
    SiGithubactions,

    // DATABASES
    SiRedis,
    SiSqlite,
    SiElastic,

    // OBSERVABILITY / MONITORING

    SiElasticsearch,

    // MISC TOOLS
    SiLinux,
    SiGit,
    SiGithub,
    SiGitlab,
    SiFastify,
    SiBetterauth,
} from "react-icons/si";



export const Stacks = [
    // ORCHESTRATION / AUTOMATION
    { name: "n8n", icon: SiN8N },
    { name: "RabbitMQ", icon: SiRabbitmq },
    { name: "Kafka", icon: SiApachekafka },

    // WEB SERVERS
    { name: "Nginx", icon: SiNginx },

    // DATABASES
    { name: "Postgres", icon: SiPostgresql },
    { name: "MongoDB", icon: SiMongodb },
    { name: "MariaDB", icon: SiMariadb },
    { name: "Redis", icon: SiRedis },
    { name: "SQLite", icon: SiSqlite },
    { name: "ElasticSearch", icon: SiElastic },

    // OBSERVABILITY
    { name: "Grafana", icon: SiGrafana },
    { name: "Prometheus", icon: SiPrometheus },

    // BACKEND FRAMEWORKS
    { name: "Node.js", icon: SiJavascript },
    { name: "TypeScript", icon: SiTypescript },
    { name: "NestJS", icon: SiNestjs },
    { name: "Express", icon: SiExpress },
    { name: "FastAPI", icon: SiFastapi },
    { name: "Django", icon: SiDjango },
    { name: "Spring", icon: SiSpring },
    { name: "Flask", icon: SiFlask },
    { name: "Betterauth", icon: SiBetterauth },
    { name: "Fastify", icon: SiFastify },
    { name: "Javascript", icon: SiJavascript },

    // FRONTEND
    { name: "React", icon: SiReact },
    { name: "Next.js", icon: SiNextdotjs },
    { name: "Vue", icon: SiVuedotjs },
    { name: "Angular", icon: SiAngular },
    { name: "Svelte", icon: SiSvelte },

    // LANGUAGES
    { name: "Python", icon: SiPython },
    { name: "Go", icon: SiGo },
    { name: "Rust", icon: SiRust },
    { name: "PHP", icon: SiPhp },
    { name: "Kotlin", icon: SiKotlin },
    { name: "C++", icon: SiCplusplus },

    // DEVOPS / CLOUD
    { name: "Docker", icon: SiDocker },
    { name: "Kubernetes", icon: SiKubernetes },
    { name: "Terraform", icon: SiTerraform },
    { name: "Ansible", icon: SiAnsible },
    { name: "GitHub Actions", icon: SiGithubactions },

    // CLOUD PROVIDERS
    { name: "GCP", icon: SiGooglecloud },

    // TOOLS
    { name: "Git", icon: SiGit },
    { name: "GitHub", icon: SiGithub },
    { name: "GitLab", icon: SiGitlab },
    { name: "Linux", icon: SiLinux },
];