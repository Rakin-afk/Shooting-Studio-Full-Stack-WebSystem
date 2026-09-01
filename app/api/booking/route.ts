import { NextResponse } from "next/server";

export interface Booking {
  id: string;
  serviceCategory: string;
  packageName: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  businessType: string;
  userSize: string;
  startDate: string;
  budget: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

// Global in-memory storage for demonstration
let bookings: Booking[] = [];

export async function GET() {
  return NextResponse.json(bookings, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newBooking: Booking = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    bookings.unshift(newBooking);
    return NextResponse.json({ success: true, booking: newBooking }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id } = await req.json();
    bookings = bookings.map((b) => (b.id === id ? { ...b, isRead: true } : b));
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update notification status" }, { status: 500 });
  }
}