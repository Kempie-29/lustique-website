/**
 * Frequently asked questions. Kept to factual, schedule-derived answers only —
 * nothing promotional is invented. Rendered as an accordion on /faq, and used
 * for FAQPage structured data. No review or rating markup anywhere.
 */

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

export const faqs: FaqEntry[] = [
  {
    id: "travel",
    question: "Do you travel to me on the day?",
    answer:
      "Yes. We come to you on the wedding morning. Travel within 40 km round trip of our La Montagne studio is free; beyond that we charge R7 per km round trip, and we confirm the exact figure before you book.",
  },
  {
    id: "trial",
    question: "Is a trial included?",
    answer:
      "A bridal trial is included in the bridal estimate and takes place at our studio. You can opt out of the trial when you build your estimate.",
  },
  {
    id: "party",
    question: "Can you look after my whole bridal party?",
    answer:
      "Absolutely. Bridesmaids, mothers, flower girls and guests can all be added to your estimate, and you can request up to two additional artists for larger groups.",
  },
  {
    id: "payment",
    question: "How do I secure my date?",
    answer:
      "Send an enquiry through the estimator and we will confirm availability and next steps with you directly.",
  },
  {
    id: "hair-length",
    question: "Why does my estimate change when I change my hair length?",
    answer:
      "Hair is priced by length — short, medium, long and extra long — because longer and thicker hair takes more time to prepare and style. Changing the length you choose updates your estimate straight away.",
  },
  {
    id: "promo",
    question: "How does the current offer work?",
    answer:
          "Book hair and makeup for four or more full looks and the least-expensive eligible look is on us. The bride, under-12 flower girls and trials are never the look that is freed. Minimum bookings and any conditions are confirmed with your estimate.",
      },
      {
        id: "events",
        question: "Do you do matric farewells and events?",
        answer:
          "Yes. Matric farewells are a flat rate per face, and we offer event makeup and hair at the venue or in our studio. We also run group lessons for smaller groups.",
      },
  {
    id: "bring",
    question: "What should I bring to my appointment?",
    answer:
      "Bring inspiration photos, your hair accessory or jewellery if you have it, and any questions. Arrive with a clean face and your hair in its usual state of washing.",
  },
];