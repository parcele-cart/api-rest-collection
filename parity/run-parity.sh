#!/usr/bin/env bash
# Validação de paridade: roda a MESMA collection contra o proxy atual (baseline)
# e contra a saturno-api migrada (candidate), depois compara os resultados.
#
# Uso:
#   BASELINE_URL=https://api-sandbox.parcelecart.com.br \
#   CANDIDATE_URL=http://localhost:8080 \
#   CLIENT_ID=xxx CLIENT_SECRET=yyy \
#   ./parity/run-parity.sh
set -euo pipefail

cd "$(dirname "$0")/.."

BASELINE_URL="${BASELINE_URL:?Defina BASELINE_URL (proxy atual)}"
CANDIDATE_URL="${CANDIDATE_URL:?Defina CANDIDATE_URL (saturno-api migrada)}"
CLIENT_ID="${CLIENT_ID:?Defina CLIENT_ID}"
CLIENT_SECRET="${CLIENT_SECRET:?Defina CLIENT_SECRET}"

# Ideal: mesmas credenciais e MESMO banco nos dois lados (comparação limpa).
# Se precisar de credenciais distintas por lado, use os overrides abaixo.
BASELINE_CLIENT_ID="${BASELINE_CLIENT_ID:-$CLIENT_ID}"
BASELINE_CLIENT_SECRET="${BASELINE_CLIENT_SECRET:-$CLIENT_SECRET}"
CANDIDATE_CLIENT_ID="${CANDIDATE_CLIENT_ID:-$CLIENT_ID}"
CANDIDATE_CLIENT_SECRET="${CANDIDATE_CLIENT_SECRET:-$CLIENT_SECRET}"

mkdir -p parity/reports

run() {
  local name="$1" url="$2" client_id="$3" client_secret="$4"
  echo "==> Rodando collection contra ${name}: ${url}"
  npx newman run collection.json \
    -e sandbox.postman_environment.json \
    --env-var "BASE_URL=${url}" \
    --env-var "CLIENT_ID=${client_id}" \
    --env-var "CLIENT_SECRET=${client_secret}" \
    -r cli,json \
    --reporter-json-export "parity/reports/${name}.json" \
    || true # não aborta: falhas de teste fazem parte da comparação
}

run baseline "${BASELINE_URL}" "${BASELINE_CLIENT_ID}" "${BASELINE_CLIENT_SECRET}"
run candidate "${CANDIDATE_URL}" "${CANDIDATE_CLIENT_ID}" "${CANDIDATE_CLIENT_SECRET}"

echo ""
echo "==> Comparando baseline vs candidate"
node parity/compare-reports.js parity/reports/baseline.json parity/reports/candidate.json
