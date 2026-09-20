import { useState } from "react";
import { PageHero } from "@/components/shell/PageHero";
import { Seo } from "@/components/Seo";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";
import { Button } from "@/components/primitives/Button";
import { Field } from "@/components/primitives/Field";
import { Monogram } from "@/components/shell/Monogram";
import { directionsLink, site, whatsappLink } from "@/content/site";
import {
  submitContact,
  validateContact,
  type ContactErrors,
  type ContactForm,
} from "@/lib/contact";

const initialForm: ContactForm = { name: "", email: "", message: "", consent: false };

export default function Contact() {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateContact(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus({ type: "error", message: "Please check the highlighted fields below." });
      return;
    }
    setSubmitting(true);
    setStatus(null);
    const response = await submitContact(form);
    setSubmitting(false);
    if (response.ok) {
      setStatus({ type: "success", message: response.message });
      setForm(initialForm);
    } else {
      setStatus({ type: "error", message: response.message });
    }
  };

  const { lat, lng } = site.coords;
    const mapBbox = `${lng - 0.012},${lat - 0.009},${lng + 0.012},${lat + 0.009}`;
  
    return (
    <>
      <Seo
        title="Contact"
        description={`Contact ${site.name} in ${site.address.suburb}, ${site.address.city} — email, phone and WhatsApp.`}
        path="/contact"
      />
      <JsonLd data={breadcrumbSchema([{ label: "Contact", to: "/contact" }])} />

      <PageHero
        eyebrow="Contact"
        title="Say hello."
        intro="Our studio is in La Montagne, Pretoria. For a full quote, the estimator is the fastest route — but we're always happy to talk."
        crumbs={[{ label: "Contact" }]}
      />

      <section className="section">
        <div className="wrap">
          <div className="contact-grid">
            <div>
              <h2 style={{ fontSize: "var(--step-2)" }}>Studio &amp; details</h2>
              <ul className="info-list" style={{ marginTop: "1rem" }}>
                <li>
                  <strong>Email</strong>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </li>
                <li>
                  <strong>Phone</strong>
                  <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phoneDisplay}</a>
                </li>
                <li>
                  <strong>WhatsApp</strong>
                  <a href={whatsappLink()} target="_blank" rel="noopener">
                    Message us
                  </a>
                </li>
                <li>
                  <strong>Location</strong>
                  <address>{site.address.full}</address>
                </li>
                {site.hours.map((h) => (
                  <li key={h.label}>
                    <strong>{h.label}</strong>
                    {h.value}
                  </li>
                ))}
                <li>
                  <strong>Areas served</strong>
                  {site.areasServed.join(" · ")}
                </li>
              </ul>

              <div className="btn-row" style={{ marginTop: "1.2rem" }}>
                <Button to="/quote" variant="primary">
                  Build your estimate
                </Button>
                <Button href={directionsLink()} variant="outline" target="_blank" rel="noopener">
                  Get directions
                </Button>
              </div>

              <div className="map-frame" style={{ marginTop: "var(--space-lg)" }}>
                              <iframe
                                title={`Map showing ${site.name}`}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapBbox}&layer=mapnik&marker=${lat},${lng}`}
                              />
                              <p className="muted" style={{ marginTop: "0.75rem" }}>
                                <Monogram mark="LC" />{" "}
                                <a href={directionsLink()} target="_blank" rel="noopener" style={{ textDecoration: "underline" }}>
                                  Directions to our studio
                                </a>
                              </p>
                            </div>
            </div>

            <div className="panel">
              <h2 style={{ fontSize: "var(--step-2)" }}>Send us a message</h2>
              <p className="muted" style={{ marginTop: "0.5rem" }}>
                For a full estimate, use the estimator. For anything else, this form
                reaches the team directly.
              </p>

              <form onSubmit={onSubmit} noValidate style={{ marginTop: "1.2rem" }}>
                <div data-field="name">
                  <Field label="Name" required htmlFor="contact-name" error={errors.name}>
                    <input
                      id="contact-name"
                      type="text"
                      value={form.name}
                      aria-invalid={!!errors.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </Field>
                </div>
                <div data-field="email">
                  <Field label="Email" required htmlFor="contact-email" error={errors.email}>
                    <input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      aria-invalid={!!errors.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </Field>
                </div>
                <div data-field="message">
                  <Field label="Message" required htmlFor="contact-message" error={errors.message}>
                    <textarea
                      id="contact-message"
                      value={form.message}
                      aria-invalid={!!errors.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </Field>
                </div>

                <div data-field="consent">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                    />
                    I consent to Lustique Co. storing and using my details to respond,
                    in line with POPIA.
                  </label>
                  {errors.consent ? (
                    <p className="field__error" role="alert">
                      {errors.consent}
                    </p>
                  ) : null}
                </div>

                <Button type="submit" variant="primary" size="lg" disabled={submitting}>
                  {submitting ? "Sending…" : "Send message"}
                </Button>

                {status ? (
                  <div
                    className={`status-region status-region--${status.type}`}
                    role="alert"
                    aria-live="polite"
                  >
                    {status.message}
                  </div>
                ) : null}

                <p className="serif-italic" style={{ marginTop: "1.2rem", color: "var(--rose-ink)" }}>
                  Blessings, The Lustique Cosmetology Team
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}