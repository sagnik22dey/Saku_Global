(function () {
  "use strict";

  window.SAKU_TRACKS = [
    {
      id: "artificial-intelligence",
      name: "Artificial Intelligence",
      courseCount: 12,
      description: "End-to-end AI engineering — from ML fundamentals to deploying large language models in production environments.",
      duration: "6 months",
      level: "Beginner → Advanced",
      topics: [
        "Machine Learning & Deep Learning",
        "Generative AI & LLMs",
        "MLOps & Model Deployment",
        "AI Ethics & Governance",
        "Capstone Project",
      ],
      image: "https://picsum.photos/seed/track-ai-head/720/500",
      link: "/course?id=ai-ml",
    },
    {
      id: "semiconductor-engineering",
      name: "Semiconductor Engineering",
      courseCount: 12,
      description: "Deep dive into chip design, VLSI, fabrication processes, and embedded systems powering modern electronics.",
      duration: "8 months",
      level: "Intermediate",
      topics: [
        "VLSI Design & Verification",
        "CMOS Fabrication Fundamentals",
        "EDA Tools: Cadence & Synopsys",
        "Embedded C & RTOS",
        "SoC Architecture",
      ],
      image: "https://picsum.photos/seed/track-semiconductor/720/500",
      link: "/course?id=ai-ml",
    },
    {
      id: "cloud-computing",
      name: "Cloud Computing",
      courseCount: 12,
      description: "Master multi-cloud architecture, DevOps, Kubernetes, and infrastructure-as-code on AWS, Azure & GCP.",
      duration: "4 months",
      level: "All levels",
      topics: [
        "AWS / Azure / GCP Core",
        "Containers & Kubernetes",
        "CI/CD & DevOps Pipelines",
        "Cloud Security & Compliance",
        "FinOps & Cost Optimization",
      ],
      image: "https://picsum.photos/seed/track-cloud/720/500",
      link: "/course?id=ai-ml",
    },
    {
      id: "pre-placement-training",
      name: "Pre-Placement Training",
      courseCount: 12,
      description: "Comprehensive placement preparation — from aptitude and DSA to mock interviews with real hiring managers.",
      duration: "3 months",
      level: "Final Year Students",
      topics: [
        "Data Structures & Algorithms",
        "Resume & LinkedIn Branding",
        "Aptitude & Reasoning",
        "Mock Interviews (HR + Technical)",
        "Offer Negotiation Skills",
      ],
      image: "https://picsum.photos/seed/track-placement/720/500",
      link: "/course?id=ai-ml",
    },
    {
      id: "vlsi-chip-design",
      name: "VLSI & Chip Design",
      courseCount: 12,
      description: "Specialized training in RTL design, synthesis, timing closure, and physical design for the semiconductor industry.",
      duration: "6 months",
      level: "Advanced",
      topics: [
        "RTL Design with Verilog/SV",
        "Synthesis & Timing Analysis",
        "Physical Design & DFT",
        "Verification: UVM & Formal",
        "Tapeout Simulation",
      ],
      image: "https://picsum.photos/seed/track-vlsi/720/500",
      link: "/course?id=ai-ml",
    },
  ];

  window.SAKU_COURSES = [
    {
      id: "ai-ml",
      title: "Machine Learning & Deep Learning",
      track: "Artificial Intelligence",
      level: "Beginner → Advanced",
      duration: "6 months",
      rating: 4.0,
      learners: "200+",
      reviews: "100+",
      seed: "course-ml",
      excerpt:
        "Master supervised, unsupervised and deep learning — from linear models to convolutional and transformer architectures, built end to end.",
      long:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      syllabus: [
        "Foundations of ML & data pipelines",
        "Deep neural networks & backpropagation",
        "CNNs for computer vision",
        "Sequence models & transformers",
        "Capstone: production ML system",
      ],
    },
    {
      id: "gen-ai",
      title: "Generative AI & LLMs",
      track: "Artificial Intelligence",
      level: "Intermediate",
      duration: "4 months",
      rating: 4.6,
      learners: "180+",
      reviews: "90+",
      seed: "course-genai",
      excerpt:
        "Build, fine-tune and deploy large language models. Prompting, RAG, evaluation and safe deployment patterns for real products.",
      long:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut labore et dolore magna aliqua. Ut labore et dolore magna aliqua.",
      syllabus: [
        "Transformer internals & tokenization",
        "Prompt engineering & evaluation",
        "Retrieval-augmented generation",
        "Fine-tuning & PEFT/LoRA",
        "Capstone: ship an LLM application",
      ],
    },
    {
      id: "mlops",
      title: "MLOps & Model Deployment",
      track: "Artificial Intelligence",
      level: "Intermediate",
      duration: "3 months",
      rating: 4.4,
      learners: "150+",
      reviews: "70+",
      seed: "course-mlops",
      excerpt:
        "Take models from notebook to production — containers, CI/CD, monitoring, drift detection and scalable serving infrastructure.",
      long:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      syllabus: [
        "Reproducible training pipelines",
        "Containerization & model registries",
        "CI/CD for ML",
        "Monitoring, drift & observability",
        "Capstone: end-to-end MLOps pipeline",
      ],
    },
    {
      id: "ai-ethics",
      title: "AI Ethics & Governance",
      track: "Artificial Intelligence",
      level: "All levels",
      duration: "2 months",
      rating: 4.5,
      learners: "120+",
      reviews: "60+",
      seed: "course-ethics",
      excerpt:
        "Navigate fairness, accountability, transparency and regulation. Build responsible AI practices into every stage of the lifecycle.",
      long:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut labore et dolore magna aliqua. Ut labore et dolore magna aliqua.",
      syllabus: [
        "Bias, fairness & accountability",
        "Privacy & data governance",
        "Regulatory landscape (EU AI Act et al.)",
        "Model cards & documentation",
        "Capstone: responsible AI audit",
      ],
    },
    {
      id: "capstone",
      title: "Capstone Project",
      track: "Artificial Intelligence",
      level: "Advanced",
      duration: "2 months",
      rating: 4.8,
      learners: "200+",
      reviews: "110+",
      seed: "course-capstone",
      excerpt:
        "A guided, portfolio-grade build. Ship a complete AI product with mentorship, reviews and a final industry showcase.",
      long:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut labore et dolore magna aliqua. Ut labore et dolore magna aliqua.",
      syllabus: [
        "Scoping & system design",
        "Iterative build with mentor reviews",
        "Evaluation & hardening",
        "Documentation & presentation",
        "Industry showcase day",
      ],
    },
  ];

  function star(fill) {
    return `<svg viewBox="0 0 24 24" fill="${
      fill ? "currentColor" : "none"
    }" stroke="currentColor" stroke-width="1.5"><path d="M12 2l2.9 6.3 6.8.6-5.1 4.5 1.5 6.7L12 17l-6 3.6 1.5-6.7L2.4 8.9l6.8-.6L12 2z"/></svg>`;
  }

  window.SAKU_STARS = function (rating) {
    let out = "";
    for (let i = 1; i <= 5; i++) out += star(i <= Math.round(rating));
    return out;
  };

  window.SAKU_GET_COURSE = function (id) {
    return (
      window.SAKU_COURSES.find((c) => c.id === id) || window.SAKU_COURSES[0]
    );
  };
})();
