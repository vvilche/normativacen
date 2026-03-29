#!/usr/bin/env node
const readline = require("readline");

const questions = [
  {
    key: "audience",
    text: "¿Quién es la audiencia principal? (Ej: Operadores OT, C-level, etc.)",
  },
  {
    key: "primaryGoal",
    text: "¿Cuál es la acción principal que deben realizar después de ver la pantalla?",
  },
  {
    key: "secondaryGoal",
    text: "¿Qué acción secundaria debería estar visible pero no estorbar?",
  },
  {
    key: "tone",
    text: "Define el tono visual deseado (Ej: Industrial premium, educativo liviano, etc.)",
  },
  {
    key: "heroContent",
    text: "¿Qué debe contar el hero en máximo dos frases?",
  },
  {
    key: "metrics",
    text: "Lista hasta 3 métricas o indicadores que deben aparecer siempre visibles",
  },
  {
    key: "ctaPrimary",
    text: "Escribe el CTA principal (texto literal del botón)",
  },
  {
    key: "ctaSecondary",
    text: "Escribe un CTA secundario opcional",
  },
  {
    key: "resources",
    text: "¿Qué recursos o módulos deben destacarse en tarjetas (ej: Fundamentos SITR, Quiz EDAC)?",
  },
  {
    key: "constraints",
    text: "¿Hay restricciones técnicas o de contenido (idioma, tiempos, branding) que debamos respetar?",
  },
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const answers = {};

function askQuestion(index = 0) {
  if (index >= questions.length) {
    rl.close();
    printSummary();
    return;
  }

  const { key, text } = questions[index];
  rl.question(`\n${index + 1}. ${text}\n> `, (response) => {
    answers[key] = response.trim();
    askQuestion(index + 1);
  });
}

function printSummary() {
  const lines = [
    "\n================ UX/UI BRIEF ================",
    `Audiencia: ${answers.audience || "Sin definir"}`,
    `Objetivo principal: ${answers.primaryGoal || "Sin definir"}`,
    `Objetivo secundario: ${answers.secondaryGoal || "Sin definir"}`,
    `Tono visual: ${answers.tone || "Sin definir"}`,
    `Hero: ${answers.heroContent || "Sin definir"}`,
    `Métricas clave: ${answers.metrics || "Sin definir"}`,
    `CTA primario: ${answers.ctaPrimary || "Sin definir"}`,
    `CTA secundario: ${answers.ctaSecondary || "Sin definir"}`,
    `Recursos destacados: ${answers.resources || "Sin definir"}`,
    `Restricciones: ${answers.constraints || "Sin definir"}`,
    "============================================\n",
  ];

  console.log(lines.join("\n"));
}

console.clear();
console.log("Brief UX/UI interactivo - responde las preguntas para generar la guía:\n");
askQuestion();
