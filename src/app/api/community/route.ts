import { NextResponse } from "next/server";

export interface CommunityCandidateServer {
  id: string;
  nombre: string;
  categoria: string;
  categoryKey: "salud_mental" | "salud_fisica";
  habito: string;
  racha: number;
  auraLevel: number;
  colorFrom: string;
  colorTo: string;
  bio: string;
  photoUrl?: string;
  createdAt: number;
  isRealUser?: boolean;
}

// In-memory store for shared community candidates across users during server execution
let communityStore: CommunityCandidateServer[] = [
  {
    id: "seed_1",
    nombre: "Camila R.",
    categoria: "Salud Emocional",
    categoryKey: "salud_mental",
    habito: "10 min de meditación y soltar la ansiedad laboral",
    racha: 6,
    auraLevel: 82,
    colorFrom: "#f97316",
    colorTo: "#7c2d12",
    bio: "Buscando reducir la rumiación mental al final del día.",
    createdAt: Date.now() - 100000,
    isRealUser: false,
  },
  {
    id: "seed_2",
    nombre: "Diego M.",
    categoria: "Salud Emocional",
    categoryKey: "salud_mental",
    habito: "Dormir antes de las 11:00 PM sin pantallas",
    racha: 4,
    auraLevel: 74,
    colorFrom: "#fbbf24",
    colorTo: "#b45309",
    bio: "Enfocado en higiene de sueño y paz interior.",
    createdAt: Date.now() - 80000,
    isRealUser: false,
  },
  {
    id: "seed_3",
    nombre: "Valeria K.",
    categoria: "Salud Física",
    categoryKey: "salud_fisica",
    habito: "Entrenar 4 veces por semana sin excusas",
    racha: 12,
    auraLevel: 91,
    colorFrom: "#a78bfa",
    colorTo: "#4c1d95",
    bio: "Buscando constancia física y mayor fuerza muscular.",
    createdAt: Date.now() - 60000,
    isRealUser: false,
  },
  {
    id: "seed_4",
    nombre: "Mateo S.",
    categoria: "Salud Física",
    categoryKey: "salud_fisica",
    habito: "Tomar 2.5 litros de agua y evitar azúcares",
    racha: 5,
    auraLevel: 68,
    colorFrom: "#34d399",
    colorTo: "#065f46",
    bio: "Mejorando energía vital y hábitos de hidratación.",
    createdAt: Date.now() - 40000,
    isRealUser: false,
  },
  {
    id: "seed_5",
    nombre: "Sofía T.",
    categoria: "Salud Emocional",
    categoryKey: "salud_mental",
    habito: "Escribir en diario de gratitud al despertar",
    racha: 9,
    auraLevel: 88,
    colorFrom: "#f472b6",
    colorTo: "#831843",
    bio: "Reemplazando el scroll matutino por paz mental.",
    createdAt: Date.now() - 20000,
    isRealUser: false,
  },
];

export async function GET() {
  // Sort real users first, then by creation date
  const sorted = [...communityStore].sort((a, b) => {
    if (a.isRealUser && !b.isRealUser) return -1;
    if (!a.isRealUser && b.isRealUser) return 1;
    return b.createdAt - a.createdAt;
  });

  return NextResponse.json({ candidates: sorted });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user, habitTitle } = body;

    if (!user || !user.name) {
      return NextResponse.json({ error: "Datos de usuario inválidos" }, { status: 400 });
    }

    const userId = user.id || "usr_" + Math.random().toString(36).substring(2, 9);
    const categoryKey: "salud_mental" | "salud_fisica" = user.category || "salud_mental";

    const colors = [
      { from: "#f97316", to: "#7c2d12" },
      { from: "#fbbf24", to: "#b45309" },
      { from: "#a78bfa", to: "#4c1d95" },
      { from: "#60a5fa", to: "#1e3a8a" },
      { from: "#34d399", to: "#065f46" },
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const candidate: CommunityCandidateServer = {
      id: userId,
      nombre: user.name,
      categoria: categoryKey === "salud_mental" ? "Salud Emocional" : "Salud Física",
      categoryKey,
      habito: habitTitle || user.goal || "Elevar mi nivel de Aura día a día",
      racha: user.currentStreak || 1,
      auraLevel: user.auraLevel || 75,
      colorFrom: color.from,
      colorTo: color.to,
      bio: user.goal || "Construyendo mejores hábitos con AURA.",
      photoUrl: user.photoUrl,
      createdAt: Date.now(),
      isRealUser: true,
    };

    // Replace if existing, or insert at top
    communityStore = [candidate, ...communityStore.filter((c) => c.id !== userId && c.nombre !== user.name)];

    return NextResponse.json({ success: true, candidate, totalCandidates: communityStore.length });
  } catch (error) {
    console.error("Error al registrar usuario en comunidad", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
