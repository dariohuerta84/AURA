# 🔥 Grill Me Session — Decisiones y Metodología (Matt Pocock Style)

Este documento registra el proceso de **stress-test de producto y arquitectura** realizado siguiendo las habilidades de **Matt Pocock (Grill Me)** para acotar el scope, definir el factor WOW y enfocar la ejecución de **AURA** en una hackathon de 10 horas.

---

## 🎯 Grill #1 — El Momento "WOW" del Demo

* **Pregunta:** En 3 minutos de pitch ante más de 20 demos, ¿cuál es el ÚNICO momento donde el jurado dice "wow"?
* **Respuesta & Decisión:** El momento **"Dos Futuros"**. Ver las dos escenas generándose en vivo con efecto de máquina de escribir y leídas en voz alta por síntesis de voz (`SpeechSynthesis`), mostrando la consecuencia visceral de su patrón actual vs. su transformación si retoma hoy.
* **Impacto en Arquitectura:** Priorizar la integración multisensorial (IA texto + TTS + máquina de escribir) como la pieza central de la UI en `/two-futures`.

---

## ⚡ Grill #2 — Justificación de Convex en una App Personal

* **Pregunta:** Convex brilla en apps multijugador/colaborativas. ¿Por qué Reflejo/AURA (una app personal de hábitos) realmente necesita Convex?
* **Respuesta & Decisión:** **Reactividad Nativa y Actions Serverless.** 
  1. Al marcar un check-in en los hábitos, las queries reactivas de Convex propagan el recálculo del nivel de aura (0 a 100) al instante a todas las pantallas sin recargar la página.
  2. Las **Actions de Convex** (`ai.generateTwoFutures`) orquestan las llamadas a la API de Inteligencia Artificial (Gemini 2.5 Flash / OpenAI) de forma segura y serverless en el backend.

---

## 🚀 Grill #3 — El Dilema del Minuto 0 (Onboarding)

* **Pregunta:** ¿Qué pasa en el minuto 0 cuando el usuario instala la app sin historial ni datos acumulados?
* **Respuesta & Decisión:** **Onboarding Adaptativo de 5 Pasos.**
  - Paso 1: Perfil General (Nombre, edad, género, peso).
  - Paso 2: Elección de Categoría (🧠 Salud Mental vs 💪 Salud Física).
  - Paso 3: Tu Meta en tus propias palabras.
  - Paso 4: Configuración Específica (Nivel de estrés 1-5, calidad de sueño, fuente de ansiedad o nivel de actividad).
  - Paso 5: **Primera generación de aura** (Reveal animado del orbe en nivel 50 + confeti + generación inicial de Dos Futuros).
* **Impacto:** Al terminar el onboarding en 60 segundos, la IA ya tiene contexto suficiente para generar proyecciones hiper-personalizadas desde el día 1.

---

## 🎨 Grill #4 — Requisito del Track "Out of the Box"

* **Pregunta:** El track exige *"algo generativo en vivo que reacciona a quien lo usa"*. ¿Un avatar con estados predefinidos es suficiente?
* **Respuesta & Decisión:** **Generación Mixta (Texto LLM + Voz en vivo + Orbe Dinámico).**
  - La narrativa de "Dos Futuros" se genera en vivo con **Google Gemini 2.5 Flash** tomando los datos exactos del usuario.
  - El Orbe de Aura reacciona en tiempo real ajustando su tamaño, velocidad de animación, color y resplandor según los hábitos completados.
  - Soporte para **DALL-E 3** en Convex Actions para generación visual atmosférica.

---

## ⚔️ Grill #5 — PvP vs Batallas "Yo vs Yo Ideal"

* **Pregunta:** Se planteó un sistema de batallas entre usuarios con 5 poderes. ¿Es viable en 10 horas con 1 dev principal?
* **Respuesta & Decisión:** **Scope Kill en PvP:** Re-orientar la "batalla" a **Tu Yo Actual vs Tu Yo Ideal** dentro de "Dos Futuros".
  - Las batallas PvP multijugador requerían lobby, matchmaking y balance de poderes (imposible en 10 horas).
  - La confrontación emocional en "Dos Futuros" cumple el mismo propósito psicológico (Aversión a la pérdida y Continuidad del yo futuro) con 10x menos complejidad.

---

## 🥊 Grill #6 — Scope Check: Categorías de Hábitos

* **Pregunta:** Originalmente se pensaron 4 categorías (Salud Mental, Física, Finanzas, Educación). ¿Cuántas construir para la hackathon?
* **Respuesta & Decisión:** **Cerrar a 2 categorías para el MVP (Salud Mental y Salud Física)** con hábitos predefinidos y calibrados por la neuropsicóloga del equipo. En el pitch se demuestra que la arquitectura en Convex escala trivialmente a $N$ categorías.

---

## 📊 Matriz de Decisiones Grill Me vs Implementación

| Desafío Grill | Riesgo Identificado | Solución Implementada en AURA |
|---|---|---|
| Latencia en IA | El usuario espera 10s mirando un loader | Animación mística de orbe + fallback fluido + llamada en background |
| Fallo de API en Demo | Que la API Key falle durante el pitch ante el jurado | Generador dinámico de respaldo en `/api/generate-futures` + soporte Gemini y OpenAI |
| Complejidad de Dev | 1 dev (LLM) + 10 horas restantes | MVP Enfocado: 5 pantallas principales, PWA standalone, Tailwind CSS y Convex |
