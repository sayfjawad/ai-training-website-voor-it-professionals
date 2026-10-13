# Deploy — AI Governance site on k3s (multicode cluster)

Public web app on the **vmi3419075** control-plane VPS (only node with a public IP).
Exposed via **ingress-nginx + cert-manager** (Let's Encrypt). Data on a `local-path` PVC.

All commands use `kubectl --context k3s-multicode`.

## 0. One-time cluster prerequisites (first public app)

These are cluster-wide and only need to run once.

```bash
# ingress-nginx — pinned to the public VPS node, binding host ports 80/443
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  --set controller.hostNetwork=true \
  --set controller.service.type=ClusterIP \
  --set controller.nodeSelector."kubernetes\.io/hostname"=vmi3419075 \
  --set controller.publishService.enabled=false

# cert-manager
helm repo add jetstack https://charts.jetstack.io
helm upgrade --install cert-manager jetstack/cert-manager \
  --namespace cert-manager --create-namespace --set crds.enabled=true

kubectl --context k3s-multicode apply -f clusterissuer.yaml
```

> ⚠️ ingress-nginx uses `hostNetwork` to bind :80/:443 on vmi3419075 — make sure no
> other process on that host already holds those ports (`sudo ss -ltnp | grep -E ':80|:443'`).

## 1. DNS

Point an A record at the VPS public IP:

```
governance.stichtingduurzaamai.nl.  A  <vmi3419075 public IP>
```

cert-manager's HTTP-01 challenge needs this resolving before TLS can issue.

## 2. App namespace + secrets

```bash
kubectl --context k3s-multicode apply -f 00-namespace.yaml

# GHCR pull secret (same pattern as other namespaces)
kubectl --context k3s-multicode -n stichting create secret docker-registry ghcr-pull-secret \
  --docker-server=ghcr.io --docker-username=sayfjawad \
  --docker-password=<GHCR_PAT> --docker-email=sayf@multicode.nl

# App env secret — copy 20-secret.example.yaml to 20-secret.yaml, fill it in, then:
kubectl --context k3s-multicode apply -f 20-secret.yaml
#   (20-secret.yaml is gitignored — never commit real credentials)
```

## 3. Deploy

```bash
kubectl --context k3s-multicode apply -f 10-pvc.yaml -f 30-deployment.yaml -f 40-service.yaml -f 50-ingress.yaml
kubectl --context k3s-multicode -n stichting rollout status deploy/ai-governance
kubectl --context k3s-multicode -n stichting get ingress,certificate
```

TLS should go `Ready=True` within a minute or two once DNS resolves.

## 4. Tikkie webhook (optional — polling already works without it)

Register the webhook once so paid status updates arrive instantly (the poller is
the fallback / source of truth either way):

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
# after pushing a new image tag:
kubectl --context k3s-multicode -n stichting set image deploy/ai-governance app=ghcr.io/sayfjawad/ai-governance-training:<tag>
kubectl --context k3s-multicode -n stichting rollout status deploy/ai-governance
```
