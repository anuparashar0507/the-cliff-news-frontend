import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.email("Please provide a valid email").max(200),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(5000),
});

const escapeHtml = (str: string) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const toAddress = (
    process.env.CONTACT_TO_EMAIL || "thecliffnewspaper@gmail.com"
  ).toLowerCase();
  const fromAddress = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey) {
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const { name, email, subject, message } = parsed.data;
  const resend = new Resend(apiKey);

  const html = `
    <div style="font-family:system-ui,Segoe UI,Roboto,sans-serif;line-height:1.6;color:#111">
      <h2 style="margin:0 0 16px;color:#ea580c">New contact form submission</h2>
      <table style="border-collapse:collapse">
        <tr><td style="padding:4px 12px 4px 0;color:#666"><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666"><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666"><strong>Subject</strong></td><td>${escapeHtml(subject)}</td></tr>
      </table>
      <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
      <div style="white-space:pre-wrap">${escapeHtml(message)}</div>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: `The Cliff News Contact <${fromAddress}>`,
      to: [toAddress],
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
