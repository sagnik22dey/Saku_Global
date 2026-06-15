(function () {
  "use strict";

  window.SAKU_INTERNSHIPS = [
    {
      id: "ai-research",
      title: "AI Research Internship",
      mode: "Hybrid",
      duration: "3–6 months",
      seed: "intern-ai",
      excerpt:
        "Work alongside Saku's in-house research team on live AI projects. Contribute to model fine-tuning, dataset curation, and benchmark evaluations.",
    },
    {
      id: "semiconductor",
      title: "Semiconductor Design Internship",
      mode: "On-site",
      duration: "4–6 months",
      seed: "intern-chip",
      excerpt:
        "Gain hands-on experience in RTL design, verification, and physical design using industry-standard EDA tools at partner chip companies.",
    },
    {
      id: "cloud-devops",
      title: "Cloud & DevOps Internship",
      mode: "Remote",
      duration: "3–6 months",
      seed: "intern-cloud",
      excerpt:
        "Deploy and manage real cloud infrastructure with mentorship from senior architects. Work on live migration and optimization projects.",
    },
    {
      id: "embedded",
      title: "Embedded Systems Internship",
      mode: "On-site",
      duration: "6 months",
      seed: "intern-embedded",
      excerpt:
        "Design and test firmware for IoT and automotive embedded systems. Work with microcontrollers, RTOS, and communication protocols.",
    },
    {
      id: "ai-product",
      title: "AI Product Internship",
      mode: "Hybrid",
      duration: "3 months",
      seed: "intern-product",
      excerpt:
        "Join a product team building AI-powered applications. Work on feature development, user testing, and integrating LLM APIs into real products.",
    },
    {
      id: "research-pub",
      title: "Research Publication Program",
      mode: "Hybrid",
      duration: "6–12 months",
      seed: "intern-research",
      excerpt:
        "Co-author research papers with Saku faculty and industry mentors. Target IEEE/ACM publications in AI, semiconductor, or systems domains.",
    },
  ];

  window.SAKU_GET_INTERNSHIP = function (id) {
    return (
      window.SAKU_INTERNSHIPS.find((i) => i.id === id) ||
      window.SAKU_INTERNSHIPS[0]
    );
  };
})();
