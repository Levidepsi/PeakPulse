/* eslint-disable @typescript-eslint/no-explicit-any */
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { date, startTime, endTime, businessName, email } =
      await req.json();

    if (!process.env.GOOGLE_REFRESH_TOKEN) {
      throw new Error("Missing GOOGLE_REFRESH_TOKEN");
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client,
    });

    const event = {
      summary: `Audit Booking - ${businessName}`,
      description: `Audit booked by ${businessName}\nEmail: ${email}`,
      start: {
        dateTime: `${date}T${startTime}:00`,
        timeZone: "Asia/Manila",
      },
      end: {
        dateTime: `${date}T${endTime}:00`,
        timeZone: "Asia/Manila",
      },
      extendedProperties: {
        private: {
          bookingType: "AUDIT",
          bookingStatus: "CONFIRMED",
          clientEmail: email,
          source: "WEBSITE",
        },
      },
    };

    console.log("Event date:", event.start.dateTime);

    await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    return NextResponse.json({ success: true });  
  } catch (err: any) {
    console.error("Google Calendar error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
