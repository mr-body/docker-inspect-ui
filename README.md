# Docker Inspect UI

Uma interface web simples e eficiente para inspecionar containers Docker visualmente.

![Docker Inspect UI](https://raw.githubusercontent.com/mr-body/docker-inspect-ui/main/.github/assets/screenshot.png)

## ✨ Sobre

O **Docker Inspect UI** é uma aplicação web que permite visualizar, explorar e entender informações detalhadas sobre containers Docker de forma amigável, sem usar o terminal.

## 🚀 Funcionalidades

- Listagem de containers ativos e inativos
- Visualização dos detalhes do `docker inspect` em formato organizado
- Busca e filtragem de containers
- Interface limpa e responsiva

## 🛠️ Tecnologias

- **TypeScript**
- **React** (ou framework JS moderno, especifique aqui se necessário)
- **CSS**
## Executar Docker Inspect UI

```bash
docker pull mrbody/docker-inspect-ui:beta.0.1

docker run -d \
  --name docker-inspect-ui \
  -p 3000:3000 \
  -e SERVER="http://SEU_IP:8000" \
  -e WS_SERVER="ws://SEU_IP:8000" \
  --restart unless-stopped \
  mrbody/docker-inspect-ui:beta.0.1
```

Docker Hub:
https://hub.docker.com/repository/docker/mrbody/docker-inspect-ui/general

Código-fonte:
https://github.com/mr-body/docker-inspect-ui/tree/main

## 📦 Instalação local

1. Clone o repositório:
   ```bash
   git clone https://github.com/mr-body/docker-inspect-ui.git
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o projeto:
   ```bash
   npm start
   ```
4. Acesse via [http://localhost:3000](http://localhost:3000)

> Obs: Certifique-se de ter o Docker rodando localmente para visualizar os containers.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues, enviar PRs ou sugerir melhorias.

## 📄 Licença

Este projeto está sob a licença MIT.

---

Feito com ❤️ por [mr-body](https://github.com/mr-body)
