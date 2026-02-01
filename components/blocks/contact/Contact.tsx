"use client";

import "./contact-cta.css";

export default function ContactCTA() {
  return (
    <section className="contact-cta">
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
          <form className="contact-form">
            <div className="form-group">
              <label>Business Name</label>
              <input
                type="text"
                placeholder="Your company name"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@company.com"
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                placeholder="Tell us about your project..."
                rows={4}
              />
            </div>

            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
