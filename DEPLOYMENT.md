# RunPsy deployment

## Domain

Production domain:

- `runpsy.ru`
- `www.runpsy.ru`

Point DNS records to the server IP:

```text
A      @      <SERVER_IP>
A      www    <SERVER_IP>
```

You can also use `CNAME www runpsy.ru` if your DNS provider supports it.

## Server requirements

- Docker
- Docker Compose
- Open ports `80` and `443`

## Start

From the project root:

```bash
docker compose up -d --build
```

Caddy will proxy traffic to the Next.js app and issue HTTPS certificates automatically for `runpsy.ru` and `www.runpsy.ru`.

## Stop

```bash
docker compose down
```

## Logs

```bash
docker compose logs -f
```
