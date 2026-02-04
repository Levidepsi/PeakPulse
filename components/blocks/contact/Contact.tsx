/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState } from "react";
import "./contact-cta.css";
import emailjs from '@emailjs/browser';
import AuditCalendarPage from "./BookingContact";

export default function ContactCTA() {
  const form = useRef<any>(null);
    const [emailSent, setEmailSent] = useState(false);
  const [hasError, setHasError] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  
  console.log(selectedDate, selectedTime)

  const sendEmail = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // 1️⃣ Send email
    const result = await emailjs.sendForm(
      "service_7zdxvd1",
      "template_yqye2qm",
      form.current!,
      "Irih0kFMOFDhpXxXI"
    );

    console.log("Email sent:", result.text);

    await fetch("/api/google/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessName: form.current.business_name.value,
        email: form.current.user_email.value,
        date: selectedDate,
        startTime: selectedTime?.split("-")[0],
        endTime: selectedTime?.split("-")[1],
      }),
    });
    console.log("Calendar event created");
    // 3️⃣ UI cleanup
    setEmailSent(true);
    setHasError(false);
    form.current.reset();

  } catch (error) {
    console.error("Error:", error);
    setEmailSent(false);
    setHasError(true);
  }
};

  return (
    <section id="contact" className="contact-cta">
      <div className="contact-cta__container">
        {/* Heading */}
        <h2 className="contact-cta__title">
          Ready to Amplify Your <br /> Growth?
        </h2>

        <p className="contact-cta__subtitle">
          Let&apos;s discuss how we can help you achieve your digital goals.
        </p>

        {/* Form Card */}
        <div className="contact-card">
          <form
            ref={form}
            onSubmit={sendEmail}
            className="contact-form">
            <div className="form-group">
              <label>Business Name</label>
              <input
                required
                name="business_name"
                id="business_name"
                type="text"
                placeholder="Your company name"
                defaultValue={emailSent ? "" : ""}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                name="user_email"
                required
                id="user_email"
                type="email"
                placeholder="you@company.com"
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                name="message"
                required
                id="message"
                placeholder="Tell us about your project..."
                rows={4}
              />
            </div>
            <input type="hidden" name="audit_date" value={selectedDate} />
            <input type="hidden" name="audit_time" value={selectedTime || ""} />
            <AuditCalendarPage
              onDateSelect={setSelectedDate}
              onTimeSelect={setSelectedTime}
              emailSent={emailSent}
            />

            <button type="submit" className="submit-btn">
              {emailSent ? "Email has been sent to the admin" : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
