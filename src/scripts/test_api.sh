#!/usr/bin/env bash
# test_api.sh - Prueba el API /api/chat sin abrir el navegador
# Uso: bash src/scripts/test_api.sh [consulta]

QUERY="${1:-¿Cuál es el tiempo exigido para la operación de un relé EDAC?}"

echo "🧪 Probando API /api/chat"
echo "📝 Query: $QUERY"
echo "---"

RESPONSE=$(curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{
    \"messages\": [{\"role\": \"user\", \"content\": \"$QUERY\"}],
    \"userProfile\": {\"tipo\": \"Generación BESS\", \"potencia\": \"50MW\"}
  }")

echo "📦 Respuesta completa:"
echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"

echo ""
echo "🔍 Campos clave:"
echo "  content:   $(echo "$RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('content','')[:150])" 2>/dev/null)"
echo "  hallazgo:  $(echo "$RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('hallazgo','N/A')[:120])" 2>/dev/null)"
echo "  metrics:   $(echo "$RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); m=d.get('resolution',{}).get('metrics',[]); print(m)" 2>/dev/null)"
echo "  seoTags:   $(echo "$RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('seoTags',['N/A']))" 2>/dev/null)"
