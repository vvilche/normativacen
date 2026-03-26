#!/usr/bin/env node
// test_harness_advanced.mjs - Batería de pruebas CLI progresivas del Orquestador
// Sin explorador, sin UI. Puro JSON.
// Uso: node src/scripts/test_harness_advanced.mjs

const BASE_URL = "http://localhost:3000/api/chat";

const TESTS = [
  {
    nivel: 1,
    titulo: "BÁSICO: EDAC tiempo de despeje",
    query: "¿Cuál es el tiempo máximo de operación de un relé EDAC según la norma CEN?",
    perfil: { tipo: "Generación BESS", potencia: "50MW", nivelTension: "110kV" },
    assert: (d) => {
      const ok = d.hallazgo && d.hallazgo.length > 0;
      const metrics = d.resolution?.metrics || [];
      return { ok, nota: ok ? `✅ ${metrics.length} métricas Tung` : "❌ Sin hallazgo" };
    }
  },
  {
    nivel: 2,
    titulo: "INTERMEDIO: PMGD en MT obligaciones SITR",
    query: "PMGD de 3MW en 13.2kV conectada vía distribuidora. ¿Qué obligaciones SITR tenemos con el Coordinador? ¿Se requiere telemetría de primer o segundo nivel?",
    perfil: { tipo: "PMGD", potencia: "3MW", nivelTension: "13.2kV" },
    assert: (d) => {
      const ok = (d.content || "").toLowerCase().includes("telemetr");
      return { ok, nota: ok ? "✅ Responde sobre telemetría" : "❌ No menciona telemetría" };
    }
  },
  {
    nivel: 3,
    titulo: "AVANZADO: PMU parcial en subestación 220kV",
    query: "Nuestra subestación 220kV tiene 4 PMUs pero solo 2 tienen segundo enlace de comunicaciones redundante. El MMF nos exige cobertura plena. ¿Cuál es la multa y el plazo de remediación según NTSyCS?",
    perfil: { tipo: "Transmisión", nivelTension: "220kV", activos: "PMU" },
    assert: (d) => {
      const content = (d.content || "").toLowerCase();
      const hasMulita = content.includes("multa") || content.includes("uta");
      const hasMetrics = (d.resolution?.metrics || []).length > 0;
      return {
        ok: hasMulita || hasMetrics,
        nota: `${hasMulita ? "✅ Menciona sanciones" : "❌ Sin sanciones"} | ${hasMetrics ? `✅ ${d.resolution.metrics.length} métricas` : "❌ Sin métricas"}`
      };
    }
  },
  {
    nivel: 4,
    titulo: "COMPLEJO: BESS+GD hidro, normativa cruzada SITR/EDAC",
    query: "Operamos un parque híbrido: 50MW BESS + 20MW hidro de pasada, ambos en la misma barra de 110kV. El BESS activa el EDAC en <200ms pero la hidro tiene inercia propia. ¿Cómo se coordinan los esquemas de desconexión para evitar sobreactuación? ¿Qué estudios se requieren presentar al Coordinador?",
    perfil: { tipo: "Generación Híbrida", potencia: "70MW", nivelTension: "110kV", activos: "BESS+GD" },
    assert: (d) => {
      const content = (d.content || "").toLowerCase();
      const ok = content.includes("bess") && (content.includes("inercia") || content.includes("coordinación") || content.includes("estudio"));
      const tungscore = [d.hallazgo, d.resolution?.metrics?.length > 0, d.seoTags?.length > 0].filter(Boolean).length;
      return {
        ok,
        nota: `${ok ? "✅ Responde híbrido" : "❌ Incompleto"} | Tung Score: ${tungscore}/3`
      };
    }
  },
  {
    nivel: 5,
    titulo: "CASO BORDE: Ciberseguridad + SITR + plazo vencido",
    query: "Tenemos una RTU legacy DNP3 sin autenticación Secure Authentication v5. La resolución exenta de nuestra empresa vence en 30 días. El Coordinador ya envió una notificación de incumplimiento. ¿Cuál es el camino crítico para remediar y qué documentación le debo enviar al CEN esta semana para suspender la sanción?",
    perfil: { tipo: "Transmisión", nivelTension: "220kV", urgencia: "CRÍTICA", diasPlazo: 30 },
    assert: (d) => {
      const content = (d.content || "").toLowerCase();
      const hasRoadmap = content.includes("plazo") || content.includes("documento") || content.includes("semana") || content.includes("remedi");
      const hasAllTung = d.hallazgo && d.resolution?.metrics?.length > 0 && d.seoTags?.length > 0;
      return {
        ok: hasRoadmap && hasAllTung,
        nota: `${hasRoadmap ? "✅ Da hoja de ruta" : "❌ Sin roadmap"} | ${hasAllTung ? "✅ Tung completo" : "❌ Tung incompleto"}`
      };
    }
  }
];

async function runTest(test, idx) {
  const start = Date.now();
  process.stdout.write(`\n[${test.nivel}/5] ${test.titulo}\n`);
  process.stdout.write(`    Query: ${test.query.substring(0, 80)}...\n`);

  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: test.query }], userProfile: test.perfil })
    });

    const data = await res.json();
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    const metrics = data.resolution?.metrics || [];
    const { ok, nota } = test.assert(data);

    const status = res.ok ? (ok ? "✅ PASS" : "⚠️  WARN") : "❌ FAIL";
    console.log(`    ${status} [${elapsed}s] ${nota}`);
    console.log(`    Hallazgo: ${(data.hallazgo || "—").substring(0, 120)}`);
    console.log(`    Métricas: ${metrics.map(m => `${m.label}=${m.value}(${m.status})`).join(" | ") || "—"}`);
    console.log(`    SEOTags:  ${(data.seoTags || []).join(", ") || "—"}`);

    return { nivel: test.nivel, ok, elapsed };
  } catch (err) {
    console.log(`    ❌ ERROR: ${err.message}`);
    return { nivel: test.nivel, ok: false, elapsed: "??" };
  }
}

async function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  HARNESS AVANZADO - AGENTE NORMATIVO CONECTA v8.0     ");
  console.log("  Metodología Tung | LangGraph | Gemini 3 Flash         ");
  console.log("═══════════════════════════════════════════════════════");

  const results = [];
  for (const test of TESTS) {
    const r = await runTest(test);
    results.push(r);
  }

  const passed = results.filter(r => r.ok).length;
  console.log("\n═══════════════════════════════════════════════════════");
  console.log(`  RESULTADO FINAL: ${passed}/${results.length} PASS`);
  console.log(`  Niveles OK: ${results.filter(r => r.ok).map(r => r.nivel).join(", ") || "Ninguno"}`);
  console.log(`  Niveles WARN/FAIL: ${results.filter(r => !r.ok).map(r => r.nivel).join(", ") || "Ninguno"}`);
  console.log("═══════════════════════════════════════════════════════");
}

main();
