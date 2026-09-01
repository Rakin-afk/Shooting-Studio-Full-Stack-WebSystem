import { NextResponse } from "next/server";

// Shared In-Memory Data Store
let services = [
  { id: "1", title: "PERSONAL" },
  { id: "2", title: "OFFICIAL" },
  { id: "3", title: "SSHOOTING" },
];

let subCards: Array<{ id: string; category: string; title: string }> = [];
let packages: Array<{ id: string; category: string; name: string; price: string; features: string[] }> = [];

export async function GET() {
  return NextResponse.json({ services, subCards, packages });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { type, payload } = body;

  if (type === "ADD_SERVICE") {
    services.push(payload);
  } else if (type === "DELETE_SERVICE") {
    services = services.filter((s) => s.id !== payload.id);
  } else if (type === "ADD_SUBCARD") {
    subCards.push(payload);
  } else if (type === "DELETE_SUBCARD") {
    subCards = subCards.filter((sc) => sc.id !== payload.id);
  } else if (type === "ADD_PACKAGE") {
    packages.push(payload);
  } else if (type === "DELETE_PACKAGE") {
    packages = packages.filter((p) => p.id !== payload.id);
  }

  return NextResponse.json({ success: true, services, subCards, packages });
}