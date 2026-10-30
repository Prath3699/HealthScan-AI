import React from "react";
import FAQItem from "./FAQ/FAQItem";

const faqs = [
  {
    question: "How do I book an appointment?",
    answer:
      "You can book an appointment by clicking on the 'Book an Appointment' button on the homepage and selecting a suitable time slot with your preferred healthcare provider.",
  },
  {
    question: "How accurate is the Disease Prediction AI?",
    answer:
      "Our AI model is trained on extensive medical data and provides risk assessments based on individual health profiles. While it offers valuable insights, it should not replace professional medical advice.",
  },
  {
    question: "Can I share my reports with doctors?",
    answer:
      "Yes! You can generate shareable health reports and provide access to your doctor for better consultation and follow-ups.",
  },
];

const FAQSection = () => {
  return (
    <div className="w-full py-12 px-8 mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-center">
        Frequently Asked Questions
      </h3>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <FAQItem key={idx} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
