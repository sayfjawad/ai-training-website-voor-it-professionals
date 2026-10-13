# Deploy — AI Governance site on k3s (multicode cluster)

The app pod runs in k3s on **c4130** (tailnet `100.64.0.14`) and serves both the
static site and the API on container port 3002, exposed on the node as
**hostPort 5055**. Data lives on a `local-path` PVC.

The public HTTPS edge is the **existing nginx + certbot on vmi2702091**
(`100.64.0.5`, public `158.220.106.157`), where `governance.stichtingduurzaamai.nl`
already resolves and has a valid Let's Encrypt cert. nginx reverse-proxies to the
pod over the tailnet. This replaces the old systemd service
(`ai-governance.service` on vmi2702091, port 3004).

All kubectl commands use `--context k3s-multicode`.

## 1. Namespace + secrets

```bash
kubectl --context k3s-multicode apply -f 00-namespace.yaml

# GHCR pull secret (same pattern as other namespaces)
kubectl --context k3s-multicode -n stichting create secret docker-registry ghcr-pull-secret \
  --docker-server=ghcr.io --docker-username=sayfjawad \
  --docker-password=<GHCR_PAT> --docker-email=sayf@multicode.nl

# App env secret — copy 20-secret.example.yaml to 20-secret.yaml, fill in the
# TransIP SMTP creds + a long random ADMIN_TOKEN (and Tikkie creds once you have
# them), then:
kubectl --context k3s-multicode apply -f 20-secret.yaml
#   (20-secret.yaml is gitignored — never commit real credentials)
```

## 2. Deploy the pod

```bash
kubectl --context k3s-multicode apply -f 10-pvc.yaml -f 30-deployment.yaml -f 40-service.yaml
kubectl --context k3s-multicode -n stichting rollout status deploy/ai-governance

# Verify over the tailnet (non-disruptive — old site still live):
curl -s -o /dev/null -w '%{http_code}\n' http://100.64.0.14:5055/
```

## 3. Cutover: point nginx at the pod (brief, user-facing)

On **vmi2702091**, edit `/etc/nginx/sites-available/governance.stichtingduurzaamai.nl`
so everything proxies to the pod (keep the existing `listen 443 ssl` + cert lines):

```nginx
    location / {
        proxy_pass http://100.64.0.14:5055;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
```

(Remove the old `root /var/www/...`, `/assets/` and `/api/ -> :3004` blocks.) Then:

```bash
sudo nginx -t && sudo systemctl reload nginx
sudo systemctl disable --now ai-governance.service   # retire the old :3004 backend
```

## 4. Tikkie webhook (optional — polling is the source of truth)

```bash
curl -s https://api-sandbox.abnamro.com/v2/tikkie/paymentrequestssubscription \
  -H "Api-Key: $TIKKIE_API_KEY" -H "X-App-Token: $TIKKIE_APP_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://governance.stichtingduurzaamai.nl/api/tikkie/webhook"}'
```

## Who-paid dashboard

`https://governance.stichtingduurzaamai.nl/admin` — enter `ADMIN_TOKEN`.

## Updating the app

```bash
# on z8, after code changes:
docker build -t ghcr.io/sayfjawad/ai-governance-training:latest . && docker push ghcr.io/sayfjawad/ai-governance-training:latest
# then restart the pod:
kubectl --context k3s-multicode -n stichting rollout restart deploy/ai-governance
```

> hostPort + rolling update gotcha: the `Recreate` strategy already handles this —
> the old pod releases hostPort 5055 before the new one starts.
