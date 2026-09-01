import { NextResponse } from "next/server";

let serviceCardsData = [
  { id: "1", serviceId: "PERSONAL", title: "18 hr studio access" },
  { id: "2", serviceId: "PERSONAL", title: "Full setup & assistance" }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get("service");

  if (service) {
    const filtered = serviceCardsData.filter(
      (card) => card.serviceId.trim().toLowerCase() === service.trim().toLowerCase()
    );
    return NextResponse.json(filtered);
  }

  return NextResponse.json(serviceCardsData);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newCard = {
      id: Date.now().toString(),
      serviceId: body.serviceId,
      title: body.title
    };
    serviceCardsData.push(newCard);
    return NextResponse.json(newCard, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to add service card", error }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, serviceId } = body;
    
    const index = serviceCardsData.findIndex((item) => item.id === id);
    if (index === -1) {
      return NextResponse.json({ message: "Card not found" }, { status: 404 });
    }

    serviceCardsData[index] = {
      ...serviceCardsData[index],
      title: title ?? serviceCardsData[index].title,
      serviceId: serviceId ?? serviceCardsData[index].serviceId
    };

    return NextResponse.json(serviceCardsData[index]);
  } catch (error) {
    return NextResponse.json({ message: "Failed to update card", error }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });

    serviceCardsData = serviceCardsData.filter((item) => item.id !== id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete card", error }, { status: 500 });
  }
}