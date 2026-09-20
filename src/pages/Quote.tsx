import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHero } from "@/components/shell/PageHero";
import { Seo } from "@/components/Seo";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";
import { Button } from "@/components/primitives/Button";
import { Field } from "@/components/primitives/Field";
import { NumberStepper, ReconcileBlock } from "@/components/quote/Controls";
import { PartyGroupField } from "@/components/quote/PartyGroupField";
import { VenueField } from "@/components/quote/VenueField";
import {
  HAIR_LENGTHS,
  OCCASIONS,
  OCCASION_LABELS,
  PRICES,
  REFERRAL_OPTIONS,
  STYLE_OPTIONS,
  isBeyondBridalOccasion,
  type HairLength,
  type Occasion,
} from "@/content/pricing";
import { activePromotion } from "@/content/promotions";
import {
  emptyHairCounts,
  emptyPartyGroup,
  estimate,
  estimateStateLine,
  type EstimateInput,
  type EstimateLine,
  type PartyGroupInput,
} from "@/lib/pricing";
import { evaluateActivePromotion } from "@/lib/promo";
import { formatTotal, formatZar, pluralise } from "@/lib/format";
import { hasHereKey, unknownTravel, type TravelEstimate } from "@/lib/distance";
import {
  submitEnquiry,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryForm,
} from "@/lib/submitEnquiry";

const initialForm: EnquiryForm = {
  occasion: "wedding",
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  referral: "",
  weddingDate: "",
  venueName: "",
  venueAddress: "",
  distanceBand: "",
  bride: { makeup: true, hair: true, trial: true, hairLength: "medium" },
  bridesmaids: emptyPartyGroup(),
  mothers: emptyPartyGroup(),
  guests: emptyPartyGroup(),
  flowerGirlsUnder12: { makeup: 0, hair: 0, hairCounts: emptyHairCounts() },
  flowerGirlsOver12: emptyPartyGroup(),
  extraArtists: 0,
  event: { location: "venue", makeup: 0, hair: 0, hairCounts: emptyHairCounts() },
  lesson: { attendees: 6 },
  style: "",
  inspirationUrl: "",
  notes: "",
  consent: false,
  promoToggle: false,
};

function monthsUntil(iso: string): number | null {
  if (!iso) return null;
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  return (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
}

export default function Quote() {
  const navigate = useNavigate();
  const [form, setForm] = useState<EnquiryForm>(initialForm);
  const [travel, setTravel] = useState<TravelEstimate>(unknownTravel());
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);

  const hereKeyReady = hasHereKey();

  const setField = <K extends keyof EnquiryForm>(key: K, value: EnquiryForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const estimateInput: EstimateInput = useMemo(
    () => ({
      occasion: form.occasion,
      bride: form.bride,
      bridesmaids: form.bridesmaids,
      mothers: form.mothers,
      guests: form.guests,
      flowerGirlsUnder12: form.flowerGirlsUnder12,
      flowerGirlsOver12: form.flowerGirlsOver12,
      extraArtists: form.extraArtists,
      event: form.event,
      lesson: form.lesson,
      travel,
    }),
    [form, travel],
  );

  const result = useMemo(() => estimate(estimateInput), [estimateInput]);

  const promoEval = useMemo(() => {
    const date = form.weddingDate;
    return evaluateActivePromotion(activePromotion, result, {
      weddingDayOfWeek: date ? new Date(date).getDay() : null,
      weddingMonth: date ? new Date(date).getMonth() + 1 : null,
      monthsUntilWedding: monthsUntil(date),
    });
  }, [activePromotion, result, form.weddingDate]);

  const promoOn = form.promoToggle;
  const promoLines = promoOn ? promoEval.lines : [];
  const promoDiscount = promoOn ? promoEval.discount : 0;
  const total = result.total + promoDiscount;

  const isWeddingLike = form.occasion === "wedding";
  const stateLine = estimateStateLine(estimateInput, result);
  const showOffer = activePromotion.meta != null && activePromotion.config.kind !== "none";

  const progress = useMemo(() => {
    const checks: boolean[] = [
      form.firstName.trim().length > 0,
      form.email.trim().length > 0,
      form.mobile.trim().length > 0,
      form.occasion === "wedding" ? form.weddingDate.length > 0 : true,
      form.occasion === "lessons"
        ? true
        : form.venueName.trim().length > 0 || form.venueAddress.trim().length > 0,
      form.consent,
    ];
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  }, [form]);

  const panelLines = [...result.lines, ...promoLines];
  const grouped = useMemo(() => {
    const map: { section: string; lines: EstimateLine[] }[] = [];
    for (const line of panelLines) {
      const existing = map.find((g) => g.section === line.section);
      if (existing) existing.lines.push(line);
      else map.push({ section: line.section, lines: [line] });
    }
    return map;
  }, [panelLines]);

  const beyondRate = isBeyondBridalOccasion(form.occasion)
    ? PRICES.beyondBridal.rates[form.occasion]
    : null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateEnquiry(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus({ type: "error", message: "Please check the highlighted fields below." });
      const firstKey = Object.keys(nextErrors)[0];
      window.setTimeout(() => {
        document.querySelector(`[data-field="${firstKey}"]`)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 0);
      return;
    }

    setSubmitting(true);
    setStatus(null);
    const response = await submitEnquiry({
      ...form,
      submittedAt: new Date().toISOString(),
      estimate: {
        subtotal: result.subtotal,
        discount: promoDiscount,
        total,
        heads: result.heads,
        isDestination: result.isDestination,
        lines: panelLines,
      },
    });
    setSubmitting(false);

    if (response.ok) {
      setStatus({ type: "success", message: response.message });
      navigate("/thank-you");
    } else {
      setStatus({ type: "error", message: response.message });
      statusRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const eventHairReconcile = form.event.hair > 0;

  return (
    <>
      <Seo
        title="Get a Quote"
        description="Build a live estimate for your wedding hair and makeup, and send your enquiry."
        path="/quote"
      />
      <JsonLd data={breadcrumbSchema([{ label: "Get a Quote", to: "/quote" }])} />

      <PageHero
        eyebrow="Get a Quote"
        title="Tell us about your day."
        intro="As you fill this in, your estimate updates live — before you ever press send."
        crumbs={[{ label: "Get a Quote" }]}
      />

      <section className="section section--tight">
        <div className="wrap">
          <div className="quote-layout">
            {/* ——— Form column ——— */}
            <div>
              <div className="estimate-bar" aria-live="polite">
                <div>
                  <div className="estimate-bar__label">Your live estimate</div>
                  <div className="estimate-bar__state">{stateLine}</div>
                </div>
                <div className="estimate-bar__figure tabular">{formatTotal(total, isWeddingLike)}</div>
              </div>

              {showOffer ? (
                <div className="offer-toggle" data-field="promoToggle">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={form.promoToggle}
                      onChange={(e) => setField("promoToggle", e.target.checked)}
                    />
                    Apply the “{activePromotion.meta?.name}” offer to my estimate
                    {activePromotion.meta?.tagline ? ` — ${activePromotion.meta.tagline}` : ""}
                  </label>
                </div>
              ) : null}

              <form onSubmit={onSubmit} noValidate>
                <div
                  className="form-progress"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                  aria-label="How far through the form you are"
                >
                  <span style={{ width: `${progress}%` }} />
                </div>

                {/* 1 · Occasion */}
                <div className="form-section">
                  <div className="form-section__head">
                    <span className="form-section__num">1</span>
                    <h3>Your occasion</h3>
                  </div>
                  <div className="radio-cards" role="radiogroup" aria-label="Occasion">
                    {OCCASIONS.map((o) => (
                      <label
                        key={o.value}
                        className={`radio-card ${form.occasion === o.value ? "is-active" : ""}`}
                      >
                        <input
                          type="radio"
                          name="occasion"
                          value={o.value}
                          checked={form.occasion === o.value}
                          onChange={() => setField("occasion", o.value as Occasion)}
                        />
                        {o.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* 2 · About you */}
                <div className="form-section">
                  <div className="form-section__head">
                    <span className="form-section__num">2</span>
                    <h3>About you</h3>
                  </div>
                  <div className="field-row field-row--2">
                    <div data-field="firstName">
                      <Field label="First name" required htmlFor="firstName" error={errors.firstName}>
                        <input
                          id="firstName"
                          type="text"
                          value={form.firstName}
                          aria-invalid={!!errors.firstName}
                          onChange={(e) => setField("firstName", e.target.value)}
                        />
                      </Field>
                    </div>
                    <Field label="Last name" htmlFor="lastName">
                      <input
                        id="lastName"
                        type="text"
                        value={form.lastName}
                        onChange={(e) => setField("lastName", e.target.value)}
                      />
                    </Field>
                  </div>
                  <div className="field-row field-row--2">
                    <div data-field="email">
                      <Field label="Email" required htmlFor="email" error={errors.email}>
                        <input
                          id="email"
                          type="email"
                          value={form.email}
                          aria-invalid={!!errors.email}
                          onChange={(e) => setField("email", e.target.value)}
                        />
                      </Field>
                    </div>
                    <div data-field="mobile">
                      <Field label="Mobile / WhatsApp" required htmlFor="mobile" error={errors.mobile}>
                        <input
                          id="mobile"
                          type="tel"
                          value={form.mobile}
                          aria-invalid={!!errors.mobile}
                          onChange={(e) => setField("mobile", e.target.value)}
                        />
                      </Field>
                    </div>
                  </div>
                  <Field label="How did you hear about us?" htmlFor="referral">
                    <select
                      id="referral"
                      value={form.referral}
                      onChange={(e) => setField("referral", e.target.value)}
                    >
                      <option value="">Prefer not to say</option>
                      {REFERRAL_OPTIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                {/* 3 · Your big day */}
                {form.occasion !== "lessons" && (
                  <div className="form-section">
                    <div className="form-section__head">
                      <span className="form-section__num">3</span>
                      <h3>Your big day</h3>
                    </div>
                    {form.occasion === "wedding" && (
                      <div data-field="weddingDate">
                        <Field
                          label="Wedding date"
                          required
                          htmlFor="weddingDate"
                          error={errors.weddingDate}
                        >
                          <input
                            id="weddingDate"
                            type="date"
                            value={form.weddingDate}
                            aria-invalid={!!errors.weddingDate}
                            onChange={(e) => setField("weddingDate", e.target.value)}
                          />
                        </Field>
                      </div>
                    )}
                    <VenueField
                      form={form}
                      setField={setField}
                      travel={travel}
                      setTravel={setTravel}
                      heads={result.heads}
                      errors={errors}
                      hasKey={hereKeyReady}
                      requireVenue={form.occasion === "wedding" || form.occasion === "event"}
                    />
                  </div>
                )}

                {/* 4 · The bride (wedding only) */}
                {form.occasion === "wedding" && (
                  <div className="form-section">
                    <div className="form-section__head">
                      <span className="form-section__num">4</span>
                      <h3>The bride</h3>
                    </div>
                    <div data-field="brideServices">
                      <div className="btn-row" style={{ gap: "1.6rem" }}>
                        <label className="checkbox">
                          <input
                            type="checkbox"
                            checked={form.bride.makeup}
                            onChange={(e) =>
                              setField("bride", { ...form.bride, makeup: e.target.checked })
                            }
                          />
                          Bridal makeup
                        </label>
                        <label className="checkbox">
                          <input
                            type="checkbox"
                            checked={form.bride.hair}
                            onChange={(e) =>
                              setField("bride", { ...form.bride, hair: e.target.checked })
                            }
                          />
                          Bridal hair
                        </label>
                        <label className="checkbox">
                          <input
                            type="checkbox"
                            checked={form.bride.trial}
                            onChange={(e) =>
                              setField("bride", { ...form.bride, trial: e.target.checked })
                            }
                          />
                          Include a trial
                        </label>
                      </div>
                      {errors.brideServices ? (
                        <p className="field__error" role="alert">
                          {errors.brideServices}
                        </p>
                      ) : null}
                    </div>
                    <Field label="Your hair length" htmlFor="brideHairLength">
                      <select
                        id="brideHairLength"
                        value={form.bride.hairLength}
                        onChange={(e) =>
                          setField("bride", {
                            ...form.bride,
                            hairLength: e.target.value as HairLength,
                          })
                        }
                      >
                        {HAIR_LENGTHS.map((l) => (
                          <option key={l.value} value={l.value}>
                            {l.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                )}

                {/* 5 · Bridal party (wedding only) */}
                {form.occasion === "wedding" && (
                  <div className="form-section">
                    <div className="form-section__head">
                      <span className="form-section__num">5</span>
                      <h3>Your bridal party</h3>
                    </div>
                    <div className="grid grid--2">
                      <PartyGroupField
                        label="Bridesmaids"
                        noun="bridesmaid"
                        value={form.bridesmaids}
                        onChange={(v: PartyGroupInput) => setField("bridesmaids", v)}
                        hairError={errors.bridesmaidsHair}
                      />
                      <PartyGroupField
                        label="Mothers"
                        noun="mother"
                        value={form.mothers}
                        onChange={(v: PartyGroupInput) => setField("mothers", v)}
                        makeupMax={4}
                        hairMax={4}
                        hairError={errors.mothersHair}
                      />
                      <PartyGroupField
                        label="Flower girls (12 & over)"
                        noun="flower girl"
                        value={form.flowerGirlsOver12}
                        onChange={(v: PartyGroupInput) => setField("flowerGirlsOver12", v)}
                        makeupMax={4}
                        hairMax={4}
                        hairError={errors.flowerGirlsOver12Hair}
                      />
                      <PartyGroupField
                        label="Flower girls (under 12)"
                        noun="flower girl"
                        value={form.flowerGirlsUnder12}
                        onChange={(v: PartyGroupInput) => setField("flowerGirlsUnder12", v)}
                        makeupMax={4}
                        hairMax={4}
                        hairError={errors.flowerGirlsUnder12Hair}
                      />
                      <PartyGroupField
                        label="Guests"
                        noun="guest"
                        value={form.guests}
                        onChange={(v: PartyGroupInput) => setField("guests", v)}
                        makeupMax={5}
                        hairMax={5}
                        hairError={errors.guestsHair}
                      />
                    </div>
                  </div>
                )}

                {/* 6 · Event / beyond-bridal faces */}
                {(form.occasion === "event" || isBeyondBridalOccasion(form.occasion)) && (
                  <div className="form-section">
                    <div className="form-section__head">
                      <span className="form-section__num">
                        {isBeyondBridalOccasion(form.occasion) ? "5" : "7"}
                      </span>
                      <h3>{OCCASION_LABELS[form.occasion]}</h3>
                    </div>
                    <div className="radio-cards" role="radiogroup" aria-label="Event location">
                      <label className={`radio-card ${form.event.location === "venue" ? "is-active" : ""}`}>
                        <input
                          type="radio"
                          name="eventLocation"
                          checked={form.event.location === "venue"}
                          onChange={() => setField("event", { ...form.event, location: "venue" })}
                        />
                        Meet at the venue
                      </label>
                      <label className={`radio-card ${form.event.location === "studio" ? "is-active" : ""}`}>
                        <input
                          type="radio"
                          name="eventLocation"
                          checked={form.event.location === "studio"}
                          onChange={() => setField("event", { ...form.event, location: "studio" })}
                        />
                        At the studio
                      </label>
                    </div>
                    <p className="field__hint">
                      {form.event.location === "venue"
                        ? "Travel applies when we come to you."
                        : "No travel — you come to our studio."}
                    </p>
                    <div className="field-row field-row--2" style={{ marginTop: "1rem" }}>
                      <div className="field" style={{ marginBottom: 0 }}>
                        <span className="field__label">Makeup</span>
                        <NumberStepper
                          value={form.event.makeup}
                          max={8}
                          ariaLabel="event makeup"
                          onChange={(v) => setField("event", { ...form.event, makeup: v })}
                        />
                      </div>
                      <div className="field" style={{ marginBottom: 0 }}>
                        <span className="field__label">Hair</span>
                        <NumberStepper
                          value={form.event.hair}
                          max={8}
                          ariaLabel="event hair"
                          onChange={(v) => setField("event", { ...form.event, hair: v })}
                        />
                      </div>
                    </div>
                    {beyondRate != null ? (
                      <p className="field__hint" style={{ marginTop: "0.6rem" }}>
                        {formatZar(beyondRate)} per face — hair &amp; makeup included.
                      </p>
                    ) : null}
                    {eventHairReconcile && beyondRate == null && (
                      <div style={{ marginTop: "1rem" }}>
                        <ReconcileBlock
                          noun="event"
                          hairCount={form.event.hair}
                          counts={form.event.hairCounts}
                          onChange={(hairCounts) => setField("event", { ...form.event, hairCounts })}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* 6 · Group lesson */}
                {form.occasion === "lessons" && (
                  <div className="form-section">
                    <div className="form-section__head">
                      <span className="form-section__num">5</span>
                      <h3>Your group</h3>
                    </div>
                    <Field
                      label="How many guests are attending?"
                      htmlFor="lessonAttendees"
                      hint={`Minimum ${PRICES.lesson.minAttendees}. ${formatZar(
                        PRICES.lesson.under10,
                      )} a face under ${PRICES.lesson.threshold}, ${formatZar(
                        PRICES.lesson.tenPlus,
                      )} at ${PRICES.lesson.threshold}+.`}
                    >
                      <NumberStepper
                        value={form.lesson.attendees}
                        min={1}
                        max={40}
                        ariaLabel="lesson attendees"
                        onChange={(v) => setField("lesson", { attendees: v })}
                      />
                    </Field>
                  </div>
                )}

                {/* Additional artist */}
                <div className="form-section">
                  <div className="form-section__head">
                    <span className="form-section__num">6</span>
                    <h3>Additional artist</h3>
                  </div>
                  <div className="radio-cards" role="radiogroup" aria-label="Additional artist">
                    {([0, 1, 2] as const).map((n) => (
                      <label
                        key={n}
                        className={`radio-card ${form.extraArtists === n ? "is-active" : ""}`}
                      >
                        <input
                          type="radio"
                          name="extraArtists"
                          checked={form.extraArtists === n}
                          onChange={() => setField("extraArtists", n)}
                        />
                        {n === 0 ? "No" : `Yes — ${n} extra`}
                      </label>
                    ))}
                  </div>
                  <p className="field__hint">
                    Only added if you ask for them · {formatZar(PRICES.extraArtist)} each.
                  </p>
                </div>

                {/* 8 · Your vision */}
                <div className="form-section">
                  <div className="form-section__head">
                    <span className="form-section__num">7</span>
                    <h3>Your vision</h3>
                  </div>
                  <Field label="Style" htmlFor="style">
                    <select id="style" value={form.style} onChange={(e) => setField("style", e.target.value)}>
                      <option value="">Not sure yet</option>
                      {STYLE_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Inspiration link" htmlFor="inspirationUrl" hint="Optional — a Pinterest board or a photo.">
                    <input
                      id="inspirationUrl"
                      type="url"
                      value={form.inspirationUrl}
                      onChange={(e) => setField("inspirationUrl", e.target.value)}
                    />
                  </Field>
                  <Field label="Anything else?" htmlFor="notes">
                    <textarea
                      id="notes"
                      value={form.notes}
                      onChange={(e) => setField("notes", e.target.value)}
                    />
                  </Field>
                </div>

                {/* 9 · Consent + send */}
                <div className="form-section" id="send">
                  <div className="form-section__head">
                    <span className="form-section__num">8</span>
                    <h3>Consent &amp; send</h3>
                  </div>
                  <div data-field="consent">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={form.consent}
                        onChange={(e) => setField("consent", e.target.checked)}
                      />
                      I consent to Lustique Co. storing and using my details to respond
                      to this enquiry, in line with POPIA.
                    </label>
                    {errors.consent ? (
                      <p className="field__error" role="alert">
                        {errors.consent}
                      </p>
                    ) : null}
                  </div>

                  {/* Spam honeypot placeholder — intentionally empty for humans. */}
                  <div className="visually-hidden" aria-hidden="true">
                    <label htmlFor="companyWebsite">Leave this field empty</label>
                    <input id="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="btn-row cta-line">
                    <Button type="submit" variant="primary" size="lg" disabled={submitting}>
                      {submitting ? "Sending…" : "Request to Book"}
                    </Button>
                  </div>

                  <div ref={statusRef}>
                    {status ? (
                      <div
                        className={`status-region status-region--${status.type}`}
                        role="alert"
                        aria-live="polite"
                      >
                        {status.message}
                      </div>
                    ) : null}
                  </div>

                  <p className="field__hint" style={{ marginTop: "1rem" }}>
                    Having trouble? Email us or message us on WhatsApp and we'll help directly.
                  </p>
                  <noscript>
                    <p className="noscript-note">
                      JavaScript is required to send this form. Please email us at
                      hello@lustiqueco.co.za and we'll take care of the rest.
                    </p>
                  </noscript>
                  <p className="serif-italic" style={{ marginTop: "1.2rem" }}>
                    Blessings, The Lustique Cosmetology Team
                  </p>
                </div>
              </form>
            </div>

            {/* ——— Breakdown column ——— */}
            <aside className="quote-aside">
              <div className="panel">
                <div className="panel__head">
                  <h2>What's in your estimate</h2>
                </div>

                {promoOn && promoEval.perks.length > 0 ? (
                  <div className="perk-pills">
                    {promoEval.perks.map((perk) => (
                      <span key={perk} className="perk-pill">
                        {perk}
                      </span>
                    ))}
                  </div>
                ) : null}

                {panelLines.length === 0 ? (
                  <p className="breakdown__empty">
                    Add a service and your line items will appear here.
                  </p>
                ) : (
                  <div className="breakdown__list">
                    {grouped.map((group) => (
                      <div key={group.section} className="breakdown__group">
                        <h4 className="breakdown__section">{group.section}</h4>
                        {group.lines.map((line) => (
                          <div
                            key={line.id}
                            className={`breakdown__row ${
                              line.amount < 0 ? "breakdown__row--promo" : ""
                            }`}
                          >
                            <span>{line.label}</span>
                            <span className="amt">{formatZar(line.amount)}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                <div className="breakdown__rule" />

                <div className="breakdown__total">
                  <span className="label">Estimated total</span>
                  <span className="figure tabular">{formatTotal(total, isWeddingLike)}</span>
                </div>

                {result.isDestination ? (
                  <p className="field__hint" style={{ marginTop: "0.6rem" }}>
                    Destination — we'll tailor this with you.
                    {result.heads > 0
                      ? ` For ${result.heads} ${pluralise(result.heads, "person", "people")}.`
                      : ""}
                  </p>
                ) : travel.status === "unknown" ? (
                  <p className="field__hint" style={{ marginTop: "0.6rem" }}>
                    Travel to be confirmed.
                  </p>
                ) : null}
              </div>

              <div className="panel">
                <h3 style={{ fontSize: "var(--step-1)" }}>A note on your estimate</h3>
                <p className="muted" style={{ marginTop: "0.5rem" }}>
                  This is a considered estimate, not a final quote. Hair length,
                  travel and party size all move the number — we confirm everything
                  with you before booking.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Mobile sticky total — mirrors the live .sticky-bottom-cta + .floating-total */}
      <div className="sticky-bottom-cta">
        <div className="floating-total">
          <span className="floating-total__label">Estimated total</span>
          <span className="floating-total__figure tabular">{formatTotal(total, isWeddingLike)}</span>
        </div>
        <Button
          variant="light"
          size="sm"
          onClick={() =>
            document.getElementById("send")?.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        >
          Review &amp; send
        </Button>
      </div>
    </>
  );
}