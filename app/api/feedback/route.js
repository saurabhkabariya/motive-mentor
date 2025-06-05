import { NextResponse } from "next/server";
// import { connectToDB } from "@/utils/db"; 
// import Feedback from "@/models/Feedback";
import { connectToDB } from "@/app/utils/db";
import feedback from "@/app/models/feedback";

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required!" }, { status: 400 });
    }

    await connectToDB();
    const newFeedback = new Feedback({ name, email, message });
    await newFeedback.save();

    return NextResponse.json({ message: "Feedback submitted successfully!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDB();
    const feedbacks = await feedback.find();
    return NextResponse.json(feedbacks, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
  }
}
