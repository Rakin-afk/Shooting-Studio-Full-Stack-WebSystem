import { NextResponse } from "next/server";

let packagesData = [
  {
    id: "1",
    serviceName: "PERSONAL",
    name: "Full Day",
    price: 10000,
    features: ["Full day studio access", "Senior creative team"]
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get("service");

  if (service) {
    const filtered = packagesData.filter(
      (p) => p.serviceName.trim().toLowerCase() === service.trim().toLowerCase()
    );
    return NextResponse.json(filtered);
  }

  return NextResponse.json(packagesData);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newPackage = {
      id: Date.now().toString(),
      serviceName: body.serviceName,
      name: body.name || "UNNAMED PACKAGE",
      price: Number(body.price),
      features: Array.isArray(body.features) ? body.features : []
    };
    packagesData.push(newPackage);
    return NextResponse.json(newPackage, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to add package", error }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, price, serviceName, features } = body;
    const index = packagesData.findIndex((item) => item.id === id);
    if (index === -1) return NextResponse.json({ message: "Package not found" }, { status: 404 });

    packagesData[index] = {
      ...packagesData[index],
      name: name ?? packagesData[index].name,
      price: price ? Number(price) : packagesData[index].price,
      serviceName: serviceName ?? packagesData[index].serviceName,
      features: features ?? packagesData[index].features
    };

    return NextResponse.json(packagesData[index]);
  } catch (error) {
    return NextResponse.json({ message: "Failed to update package", error }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });

    packagesData = packagesData.filter((item) => item.id !== id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete package", error }, { status: 500 });
  }
}