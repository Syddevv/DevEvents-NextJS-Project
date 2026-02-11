import connectToDatabase from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { Event, EventDocument } from "@/database/event.model";

interface RouteParams {
  slug: string;
}

interface RouteContext {
  params: Promise<RouteParams>;
}

export async function GET(
  _req: unknown,
  context: RouteContext,
): Promise<NextResponse> {
  try {
    const { slug } = await context.params;

    // Validate slug parameter
    if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
      return NextResponse.json(
        { message: "Invalid or missing slug parameter" },
        { status: 400 },
      );
    }

    // Connect to database
    await connectToDatabase();

    // Query event by slug (case-insensitive)
    const event: EventDocument | null = await Event.findOne({
      slug: slug.toLowerCase().trim(),
    });

    // Handle event not found
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    // Return event data
    return NextResponse.json(
      {
        message: "Event fetched successfully",
        event,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching event:", error);

    // Return generic error for unexpected exceptions
    return NextResponse.json(
      {
        message: "Failed to fetch event",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
