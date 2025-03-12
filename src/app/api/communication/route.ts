import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import nodemailer from "nodemailer";

export async function GET(request: NextRequest) {
    try {
        return NextResponse.json({ message: "Communication endpoint is working" });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { to, subject, text } = body;

        if (!to || !subject || !text) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.NEXT_PUBLIC_EMAIL_USERNAME,
                pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.NEXT_PUBLIC_PERSONAL_EMAIL,
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
        return NextResponse.json({ success: true, message: "Email sent successfully!" });
    } catch (error) {
        console.error("Email error:", error);
        return NextResponse.json({ error: "Email sending failed" }, { status: 500 });
    }
}
