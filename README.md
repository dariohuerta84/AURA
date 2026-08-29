# ✦ AURA — Eleva tu energía personal

> **Track:** Out of the Box — *"Algo generativo en vivo que reacciona a quien lo usa"*  
> **Despliegue de Producción:** [https://aura-986642980997.us-central1.run.app](https://aura-986642980997.us-central1.run.app)

---

## Inspiración

9 de cada 10 personas que se proponen una meta fracasan en las primeras semanas. La causa no es falta de voluntad, sino la **ausencia de consecuencias visibles e inmediatas**. Las aplicaciones tradicionales de hábitos se limitan a castigos numéricos fríos (Habitica) o compasión sin fricción (Finch). Ninguna genera una proyección honesta en el momento sobre a dónde te lleva tu patrón actual.

Construimos **AURA** aplicando las habilidades de **Matt Pocock (Grill Me Session)** para someter el producto a stress-test de scope, arquitectura y diferenciación. Puedes revisar la sesión de Grill Me completa y todas las decisiones tomadas en [**GRILL_ME.md**](file:///Users/milumon/AURA/GRILL_ME.md).

AURA resuelve el sesgo de **descuento temporal**: la tendencia del cerebro a subestimar las consecuencias futuras frente a la gratificación inmediata. Con el respaldo de fundamentos neuropsicológicos (**Continuidad del yo futuro** de Hershfield et al., **Aversión a la pérdida** de Kahneman & Tversky, y **Pensamiento episódico prospectivo**), AURA refleja tu energía en tiempo real y materializa tus **"Dos Futuros"** — enfrentando una visión visceral de tu patrón sin hábitos frente a cómo se transforma tu vida si retomas tu aura hoy.

---

## Lo que Aprendimos

Construir AURA nos enseñó que el cambio de comportamiento requiere **resonancia emocional, no solo gráficos estáticos de progreso**.

1. **Feedback Generativo en Tiempo Real:** Un gráfico estático es fácil de ignorar. Un orbe de aura vivo y respirable acoplado a proyecciones generadas con IA hace que descuidar un hábito se sienta como una pérdida real de vitalidad personal.
2. **Psicología del Comportamiento en Software:** Al mostrar la consecuencia en el entorno y la energía que rodea al avatar (y no en un rostro deteriorándose), logramos responsabilidad constructiva sin provocar culpa ni vergüenza paralizante.
3. **Experiencia Multisensorial Sincronizada:** Combinar la reactividad en tiempo real (Convex) con narraciones en vivo por IA y síntesis de voz nativa (`SpeechSynthesis`) transforma el check-in diario en un ritual personal inspirador.

---

## Cómo Construimos el Proyecto

La creación de AURA requirió una integración fluida entre flujo de datos en tiempo real, orquestación serverless de Inteligencia Artificial y un diseño móvil de alto rendimiento:

### Stack Técnico
* **Core & Framework:** Next.js 14+ (App Router), React 19, TypeScript.
* **Backend & Base de Datos:** Convex (Reactividad en tiempo real, Actions, Mutaciones y Queries).
* **Inteligencia Artificial:** Google Gemini 2.5 Flash API (Generación en vivo de las narrativas "Dos Futuros") y OpenAI DALL-E 3 (Arte atmosférico del aura).
* **Voz & Audio:** Web Speech API nativa del navegador (`SpeechSynthesis`).
* **Estilo & Sistema de Diseño:** Tailwind CSS, Glassmorphism, CSS Variables y Fuentes de Google (`Outfit` & `Space Grotesk`).
* **UI Interactiva:** Canvas Confetti, Lucide React Icons.
* **Despliegue & Cloud:** Docker, Google Cloud Run, GitHub Actions CI/CD.

### Integración Profunda con Convex
AURA aprovecha Convex como el motor principal de su arquitectura en tiempo real:
- **Esquema y Consultas Reactivas:** Definimos esquemas relacionales estrictos para `users`, `habits`, `checkIns`, `twoFutures` y `auraSnapshots`. Las consultas por suscripción de Convex propagan los check-ins diarios al instante a la interfaz sin necesidad de recargar la página.
- **Mutaciones y Cálculo de Estado:** Las mutaciones serverless calculan el nivel de aura (0 a 100) combinando la tasa de cumplimiento del día con multiplicadores de racha consecutiva.
- **Acciones Serverless para IA:** Las Actions de Convex (`ai.generateTwoFutures`) orquestan llamadas seguras a modelos LLM (Gemini 2.5 Flash & OpenAI), parseando respuestas en JSON y guardando las narrativas estructuradas en la base de datos.
- **Indexación y Validación:** Validadores estrictos (`v.union`, `v.object`) previenen datos corruptos, mientras que los índices (`by_user_date`, `by_habit`) optimizan el rendimiento de las consultas.

---

## Retos Enfrentados

1. **Latencia de IA y Sincronización Multisensorial:** Generar narrativas altamente personalizadas en segundos manteniendo la interfaz fluida requirió optimizar las llamadas a la API de Gemini 2.5 Flash y sincronizar el efecto de máquina de escribir con la locución de la voz en español (`SpeechSynthesis`).
2. **Estética Visual de Alta Rendimiento:** Diseñar un orbe de energía vivo que reacciona dinámicamente en 5 niveles (*Apagada, Tenue, Estable, Brillante, Radiante*) usando gradientes CSS y efectos de partículas ligeros a 60 FPS en dispositivos móviles.
3. **Resiliencia Cliente-Servidor:** Implementar una capa de datos reactiva que responda con 0ms de latencia en demostraciones en vivo, manteniendo total compatibilidad con las funciones serverless de Convex.

---

## Lista de Características

- 🔮 **Orbe de Aura Vivo:** Núcleo de energía que responde en tiempo real a tu cumplimiento de hábitos y días de racha.
- 📋 **Onboarding Adaptativo de 5 Pasos:** Captura datos de perfil, elección de categoría (*🧠 Salud Mental* vs *💪 Salud Física*), tu meta en tus propias palabras y factores específicos de estrés/ansiedad.
- ✨ **Momento WOW "Dos Futuros":** Genera proyecciones con IA en tiempo real (*"Si sigues así..."* vs *"Si retomas hoy..."*) con escritura tipo máquina de escribir y voz narrada en español.
- ✅ **Check-ins Diarios Reactivos:** Cards de micro-hábitos con niveles de dificultad (+5, +8, +12 pts) y explosión de partículas de confeti.
- 📅 **Calendario Semanal y Galería de Auras:** Contador de racha 🔥, mapa de calor de cumplimiento y galería de snapshots de auras pasadas.
- 📱 **PWA Mobile-First:** Interfaz glassmorphism adaptada para instalarse y usarse en dispositivos móviles como aplicación nativa.

---

## Desarrollado Con

- `convex`
- `google-gemini-api`
- `nextjs`
- `openai`
- `pwa`
- `react`
- `speech-synthesis-api`
- `tailwind-css`
- `typescript`
- `docker`
- `google-cloud-run`
