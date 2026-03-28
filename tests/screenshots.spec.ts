import { test, expect } from "@playwright/test";
import path from "path";
import { mkdir, rm } from "fs/promises";

const screenshotsDir = path.join(process.cwd(), "screenshots");

const mockDashboard = {
  globalScore: 92,
  totalAssets: 12,
  criticalRisks: 2,
  totalExposureUTA: 8200,
  segments: [
    { name: "SITR", score: 96, status: "success" },
    { name: "Transmisión", score: 74, status: "critical" },
    { name: "BESS", score: 88, status: "warning" },
    { name: "Consumo", score: 99, status: "success" },
  ],
  topRisks: [
    { id: "CEN-SITR-001", asset: "RTU Principal", type: "Latencia", risk: "HIGH", imp: "400 UTA" },
    { id: "CEN-BESS-204", asset: "BESS Norte", type: "FFR", risk: "MED", imp: "250 UTA" },
  ],
  remediationProgress: [
    { month: "Ene", completed: 12, pending: 20 },
    { month: "Feb", completed: 18, pending: 15 },
    { month: "Mar", completed: 25, pending: 9 },
  ],
};

const mockEducationMarkdown = `## Microlección: PMU crítico
- **Objetivo:** Comprender la ventana SITR.
- **Duración estimada:** 8 min
- **Normativa base:** NTSyCS Cap. 4

### Contenido sugerido
1. Validar GPS +/- 100 µs.
2. Revisar redundancia ICCP/DNP3.
3. Documentar latencia < 500 ms.

### Checklist de Autoevaluación
1. ¿La PMU reporta fase?
2. ¿Hay respaldo GPS?
3. ¿Se documentó latencia?
4. ¿Existen alertas CDC?
5. ¿Plan de contingencia probado?

> **Clave Rapida:** 1) Sí 2) Sí 3) Sí 4) Sí 5) Sí

#### Plan de Práctica
- **Actividad 1:** Simular pérdida GPS (Manual SITR).
- **Actividad 2:** Ensayar reporte CDC.
- **Métrica de éxito:** Checklist completado.

**CTA:** Explora el módulo "Respuesta SITR" en el hub.`;

const mockResolutionPayload = {
  role: "assistant",
  content: "### Diagnóstico SITR\n- Latencia media: 340 ms.\n- CDC exige redundancia GPS inmediata.",
  sources: ["Base RAG CEN"],
  resolution: {
    metrics: [
      { label: "Latencia", value: "340 ms", status: "warning" },
      { label: "GK Compliance", value: "82%", status: "warning" },
      { label: "Plan Fases", value: "3", status: "success" },
    ],
    actionPlan: [
      { id: "A1", task: "Migrar enlace PMU a fibra redundante", priority: "CRÍTICA", deadline: "7 días" },
      { id: "A2", task: "Actualizar manual CDC con evidencia GPS", priority: "Alta", deadline: "14 días" },
    ],
  },
  hallazgo: "Latencia borde límite en la PMU principal.",
  seoTags: ["SITR", "Latencia", "PMU"],
  agentType: "sitrAgent",
  isClosedLoop: true,
  resolutionId: "demo-res",
  originalQuery: "Plan SITR demo",
  createdAt: new Date().toISOString(),
  timings: { totalMs: 1500 },
  clientMode: "guide" as const,
  guideSuggestions: [
    "Verificar redundancia ICCP",
    "Simular falla GPS",
    "Actualizar bitácora PMU",
  ],
  educationArtifacts: mockEducationMarkdown,
};

const mockDossierResponse = {
  id: "demo",
  resolutionId: "demo-res",
  data: mockResolutionPayload,
  createdAt: mockResolutionPayload.createdAt,
};

async function mockDashboardEndpoint(page: Parameters<typeof test>[0][0]["page"]) {
  await page.route("**/api/dashboard", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockDashboard),
    });
  });
}

async function mockChatEndpoint(page: Parameters<typeof test>[0][0]["page"]) {
  await page.route("**/api/chat", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockResolutionPayload),
    });
  });
}

async function mockDossierEndpoint(page: Parameters<typeof test>[0][0]["page"]) {
  await page.route("**/api/dossiers/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockDossierResponse),
    });
  });
}

test.describe.configure({ mode: "serial" });

test.beforeAll(async () => {
  await rm(screenshotsDir, { recursive: true, force: true });
  await mkdir(screenshotsDir, { recursive: true });
});

test("01-home-landing", async ({ page }) => {
  await mockDashboardEndpoint(page);
  await page.goto("/");
  await expect(page.getByText("Agentic Compliance Matrix v9.2.0 (Asset-Aware)")).toBeVisible();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, "01-home-landing.png"), fullPage: true });
});

test("02-home-operativo", async ({ page }) => {
  await mockDashboardEndpoint(page);
  await mockChatEndpoint(page);
  await mockDossierEndpoint(page);
  await page.addInitScript(() => {
    localStorage.setItem("isRegistered", "true");
    localStorage.setItem("userProfile", JSON.stringify({ name: "Operador Test", company: "CONECTA", activeAsset: "SE Demo" }));
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Operativo" }).click();
  const input = page.getByPlaceholder("Describe tu incidente o consulta normativa...");
  await input.fill("Plan SITR demo");
  await page.getByRole("button", { name: "Ejecutar" }).click();
  await expect(page.getByText("Capacitación recomendada").first()).toBeVisible();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, "02-home-operativo.png"), fullPage: true });
});

test("03-documentacion", async ({ page }) => {
  await page.goto("/documentacion");
  await expect(page.getByText("Base de Conocimiento")).toBeVisible();
  await page.screenshot({ path: path.join(screenshotsDir, "03-documentacion.png"), fullPage: true });
});

test("04-documentacion-slug", async ({ page }) => {
  await page.goto("/documentacion/guia_operativa_ingenieria");
  await expect(page.getByText("Centro Educativo")).toBeVisible();
  await page.screenshot({ path: path.join(screenshotsDir, "04-documentacion-slug.png"), fullPage: true });
});

test("05-documentacion-dossier-educativo", async ({ page }) => {
  await mockDossierEndpoint(page);
  await page.goto("/documentacion/dossier?resolutionId=demo");
  await expect(page.getByText("Siguiente paso")).toBeVisible();
  await page.screenshot({ path: path.join(screenshotsDir, "05-documentacion-dossier-educativo.png"), fullPage: true });
});

test("06-documentacion-dossier-clasico", async ({ page }) => {
  await mockDossierEndpoint(page);
  await page.goto("/documentacion/dossier/demo");
  await expect(page.getByText("Informe Técnico Multi-Agente")).toBeVisible();
  await page.screenshot({ path: path.join(screenshotsDir, "06-documentacion-dossier-clasico.png"), fullPage: true });
});

test("07-dashboard", async ({ page }) => {
  await mockDashboardEndpoint(page);
  await page.goto("/dashboard");
  await expect(page.getByText("Panel de Control Estratégico v9.2.1")).toBeVisible();
  await page.screenshot({ path: path.join(screenshotsDir, "07-dashboard.png"), fullPage: true });
});

test("08-modernizacion", async ({ page }) => {
  await page.goto("/modernizacion");
  await expect(page.getByText("Actualización de Activos")).toBeVisible();
  await page.screenshot({ path: path.join(screenshotsDir, "08-modernizacion.png"), fullPage: true });
});

test("09-login", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByText("Acceso Seguro")).toBeVisible();
  await page.screenshot({ path: path.join(screenshotsDir, "09-login.png"), fullPage: true });
});
