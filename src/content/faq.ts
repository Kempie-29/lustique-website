/**
 * Frequently asked questions. Kept to factual, schedule-derived answers only —
 * nothing promotional is invented. Rendered as an accordion on /faq (Phase 2).
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
];