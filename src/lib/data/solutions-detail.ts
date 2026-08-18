import { Cuboid, Code2, Brain, Bot, Factory, PenTool, Cpu, Settings, Smartphone, Layout, Blocks, Zap } from "lucide-react";

export type SubSolution = {
  title: string;
  description: string;
  capabilities: string[];
  icon?: any;
};

export type ProcessStep = {
  title: string;
  description: string;
};

export type FAQ = {
  question: string;
  answer: string;
};

export type SolutionDetail = {
  id: string;
  title: string;
  intro: string;
  icon: any;
  subSolutions: SubSolution[];
  workflow: ProcessStep[];
  whyChooseUs: string[];
  projects: { title: string; imageSrc: string; href: string }[];
  faqs: FAQ[];
};

export const SOLUTIONS_DATA: Record<string, SolutionDetail> = {
  "3d-designing-and-printing": {
    id: "3d-designing-and-printing",
    title: "3D Designing & Printing",
    intro: "Transform your concepts into physical reality with our industrial-grade additive manufacturing and precision 3D modeling services. We specialize in rapid iterations and high-fidelity functional parts.",
    icon: Cuboid,
    subSolutions: [
      {
        title: "3D Printing Services",
        description: "Industrial-scale additive manufacturing using advanced materials (SLA, SLS, FDM) for robust end-use parts.",
        capabilities: ["High-resolution SLA", "Industrial SLS nylon", "Multi-material printing", "Large-format FDM"]
      },
      {
        title: "Rapid Prototyping",
        description: "Accelerate your R&D cycles by turning CAD models into physical prototypes within days, not weeks.",
        capabilities: ["Iterative design testing", "Visual models", "Quick turnaround", "Cost-effective validation"]
      },
      {
        title: "Custom 3D Printing",
        description: "Bespoke printing solutions tailored exactly to your unique geometries and structural requirements.",
        capabilities: ["Complex geometries", "Custom textures", "Color matching", "Specialty filaments"]
      },
      {
        title: "Functional Prototyping",
        description: "Prototypes engineered with mechanical properties identical to mass-produced parts for rigorous field testing.",
        capabilities: ["Heat resistance", "Tensile strength testing", "Snap-fit joints", "Living hinges"]
      },
      {
        title: "Custom Parts & Components",
        description: "On-demand manufacturing of specialized low-volume parts, jigs, and fixtures for factory floors.",
        capabilities: ["Replacement parts", "Manufacturing jigs", "Assembly fixtures", "Low-volume runs"]
      }
    ],
    workflow: [
      { title: "Design Review", description: "We analyze your CAD models for manufacturability and select the optimal printing technology." },
      { title: "Pre-processing & Slicing", description: "Models are oriented and sliced with optimized toolpaths to ensure structural integrity and surface finish." },
      { title: "Fabrication", description: "Industrial printers manufacture your parts using aerospace and medical-grade resins or thermoplastics." },
      { title: "Post-processing & QA", description: "Parts undergo support removal, curing, sanding, and strict dimensional verification." }
    ],
    whyChooseUs: [
      "Access to an extensive library of engineering-grade materials.",
      "Micron-level precision and strict quality assurance.",
      "Lightning-fast turnaround times for rapid iterative cycles.",
      "Expert engineers who understand design for additive manufacturing (DfAM)."
    ],
    projects: [
      { title: "Aerospace Turbine Prototype", imageSrc: "/images/project-1.png", href: "/projects/aerospace-prototype" },
      { title: "Custom Medical Prosthetics", imageSrc: "/images/project-2.png", href: "/projects/medical-prosthetics" }
    ],
    faqs: [
      { question: "What materials do you support for 3D printing?", answer: "We support a wide range of materials including standard resins, tough/durable resins, Nylon (PA12), TPU, ABS, PLA, and carbon-fiber filled composites." },
      { question: "How fast can I get a rapid prototype?", answer: "Depending on the complexity and volume, standard rapid prototypes are shipped within 3 to 5 business days, with expedited options available." },
      { question: "Can you help optimize my design for 3D printing?", answer: "Yes. Our engineers specialize in Design for Additive Manufacturing (DfAM) and will optimize your CAD models to reduce cost and improve strength." }
    ]
  },
  "software-solutions": {
    id: "software-solutions",
    title: "Software Solutions",
    intro: "Deploy highly scalable, secure, and robust digital infrastructure. From complex web portals to enterprise CRM systems, we build software that drives operational efficiency and exponential growth.",
    icon: Code2,
    subSolutions: [
      {
        title: "Web Development",
        description: "High-performance, responsive web applications built on modern frameworks designed to scale globally.",
        capabilities: ["React & Next.js", "Serverless architecture", "Global CDN deployment", "Progressive Web Apps (PWA)"]
      },
      {
        title: "App Development",
        description: "Native and cross-platform mobile applications that deliver seamless user experiences across iOS and Android.",
        capabilities: ["React Native", "Swift & Kotlin", "Offline-first architectures", "Secure API integrations"]
      },
      {
        title: "CRM Solutions",
        description: "Custom Customer Relationship Management systems tailored to automate your specific sales and operational pipelines.",
        capabilities: ["Sales automation", "Data visualization", "Custom ERP integration", "Role-based access control"]
      }
    ],
    workflow: [
      { title: "Discovery & Architecture", description: "We map out your business logic, user flows, and select the optimal technology stack." },
      { title: "UI/UX Design", description: "Creating intuitive, high-conversion interfaces that align with your brand identity." },
      { title: "Agile Development", description: "Iterative coding in two-week sprints with continuous integration and deployment (CI/CD)." },
      { title: "Testing & Deployment", description: "Rigorous automated QA, security audits, and zero-downtime production deployment." }
    ],
    whyChooseUs: [
      "Deep expertise in modern, scalable JavaScript/TypeScript ecosystems.",
      "Security-first development approach preventing vulnerabilities.",
      "Zero-downtime deployment strategies and robust cloud architectures.",
      "Codebases optimized for long-term maintainability and speed."
    ],
    projects: [
      { title: "Global Logistics Dashboard", imageSrc: "/images/project-1.png", href: "/projects/logistics-dashboard" },
      { title: "FinTech Mobile App", imageSrc: "/images/project-2.png", href: "/projects/fintech-app" }
    ],
    faqs: [
      { question: "Do you build custom CRMs or integrate existing ones?", answer: "We do both. We can build a fully bespoke CRM tailored precisely to your workflow, or we can build custom integrations on top of platforms like Salesforce or HubSpot." },
      { question: "Will my web application be mobile-friendly?", answer: "Absolutely. Every web application we build follows a mobile-first responsive design methodology to ensure perfect usability on any device." },
      { question: "What technologies do you use for app development?", answer: "We primarily utilize React Native for highly efficient cross-platform development, but we also build native Swift/Kotlin apps when hardware-level performance is required." }
    ]
  },
  "ai-solutions": {
    id: "ai-solutions",
    title: "AI Solutions",
    intro: "Leverage the power of machine learning and generative intelligence to automate complex tasks, uncover deep data insights, and radically transform how your business operates.",
    icon: Brain,
    subSolutions: [
      {
        title: "AI Agents",
        description: "Autonomous software agents capable of reasoning, planning, and executing complex workflows without human intervention.",
        capabilities: ["LLM orchestration", "Tool use & API execution", "Autonomous reasoning", "24/7 task automation"]
      },
      {
        title: "Generative AI",
        description: "Custom generative models to create text, code, images, and synthetic data tailored to your proprietary knowledge base.",
        capabilities: ["RAG systems", "Fine-tuned models", "Content generation", "Semantic search"]
      },
      {
        title: "AI Automation",
        description: "Replacing manual, repetitive business processes with intelligent systems that learn and adapt over time.",
        capabilities: ["Document parsing", "Data entry automation", "Intelligent routing", "Predictive maintenance"]
      },
      {
        title: "AI Data & Intelligence",
        description: "Transforming raw, unstructured data lakes into actionable, predictive business intelligence dashboards.",
        capabilities: ["Predictive analytics", "Anomaly detection", "Data clustering", "Real-time insights"]
      },
      {
        title: "Custom AI Solutions",
        description: "Bespoke machine learning architectures engineered specifically for your unique industry challenges.",
        capabilities: ["Computer vision", "NLP models", "Time-series forecasting", "Edge AI deployment"]
      }
    ],
    workflow: [
      { title: "Data Assessment", description: "Evaluating your existing data infrastructure, quality, and privacy constraints." },
      { title: "Model Selection & Training", description: "Selecting foundational models or training custom neural networks on your proprietary datasets." },
      { title: "Integration & Orchestration", description: "Deploying the AI models via scalable APIs and integrating them into your existing software stack." },
      { title: "Monitoring & Fine-tuning", description: "Continuously monitoring model drift and fine-tuning parameters to improve accuracy over time." }
    ],
    whyChooseUs: [
      "Pioneering experience with advanced LLMs, RAG, and AI agent frameworks.",
      "Strict adherence to data privacy and secure on-premise deployment options.",
      "Focus on practical ROI rather than theoretical AI hype.",
      "End-to-end capabilities: from data pipeline engineering to UI deployment."
    ],
    projects: [
      { title: "Autonomous Legal Document Analyzer", imageSrc: "/images/project-1.png", href: "/projects/legal-ai" },
      { title: "Predictive Factory Maintenance AI", imageSrc: "/images/project-2.png", href: "/projects/predictive-maintenance" }
    ],
    faqs: [
      { question: "Is our data secure when using your Generative AI solutions?", answer: "Yes. We can deploy private, localized LLMs or use enterprise-grade APIs with zero-retention policies to ensure your proprietary data never trains public models." },
      { question: "What is an AI Agent?", answer: "Unlike a simple chatbot, an AI Agent can break down complex goals into steps, interact with your existing software APIs, and autonomously execute tasks (like booking a meeting or generating a report)." },
      { question: "How long does it take to implement a custom AI solution?", answer: "Initial proof-of-concepts (PoC) can be deployed in 2 to 4 weeks. Full-scale production systems typically take 2 to 4 months depending on data readiness and complexity." }
    ]
  },
  "robotics-prototyping": {
    id: "robotics-prototyping",
    title: "Robotics Prototyping",
    intro: "Bridge the gap between software intelligence and physical execution. We engineer autonomous systems, smart sensors, and advanced mechatronics for industrial automation.",
    icon: Bot,
    subSolutions: [
      {
        title: "Embedded Systems",
        description: "Custom firmware and microcontroller engineering for highly constrained, real-time hardware environments.",
        capabilities: ["RTOS development", "Custom PCB firmware", "Low-power optimization", "Hardware-in-the-loop testing"]
      },
      {
        title: "IoT Solutions",
        description: "Secure, scalable networks of connected physical devices transmitting telemetry data to the cloud.",
        capabilities: ["Sensor networks", "MQTT/CoAP protocols", "Edge computing", "Over-the-air (OTA) updates"]
      },
      {
        title: "Robotics Prototyping",
        description: "Rapid development of mechatronic assemblies, robotic arms, and autonomous mobile robots (AMRs).",
        capabilities: ["Kinematics & control", "ROS2 integration", "Actuator selection", "Computer vision integration"]
      },
      {
        title: "Automation Solutions",
        description: "End-to-end industrial automation systems designed to increase factory floor throughput and safety.",
        capabilities: ["PLC programming", "SCADA integration", "Conveyor systems", "Machine tending automation"]
      }
    ],
    workflow: [
      { title: "System Architecture", description: "Defining hardware requirements, selecting microcontrollers, sensors, and actuators." },
      { title: "Mechatronic Assembly", description: "Rapid 3D printing and CNC machining of custom chassis and structural components." },
      { title: "Firmware & Control Logic", description: "Writing real-time embedded code (C/C++/Rust) and integrating ROS navigation stacks." },
      { title: "Field Testing", description: "Rigorous real-world stress testing for environmental endurance and operational reliability." }
    ],
    whyChooseUs: [
      "Hardware and software teams working in perfect unison under one roof.",
      "Expertise in ROS2, computer vision, and real-time operating systems (RTOS).",
      "Agile hardware development methodologies drastically reducing iteration time.",
      "Extensive experience in ruggedizing prototypes for harsh industrial environments."
    ],
    projects: [
      { title: "Autonomous Warehouse Rover", imageSrc: "/images/project-1.png", href: "/projects/warehouse-rover" },
      { title: "Smart Grid IoT Mesh Network", imageSrc: "/images/project-2.png", href: "/projects/smart-grid" }
    ],
    faqs: [
      { question: "Do you design custom PCBs as part of your embedded systems?", answer: "Yes, our electronics design team can design, route, and manufacture custom Printed Circuit Boards tailored specifically to your robotic prototype's form factor." },
      { question: "What robotics frameworks do you use?", answer: "We heavily utilize ROS2 (Robot Operating System) for high-level logic, navigation, and computer vision, while using C/C++ on microcontrollers for real-time motor control." },
      { question: "Can you help scale a prototype to mass production?", answer: "Yes. Once the prototype is validated, we transition the design into a Design for Manufacturing (DfM) phase to prepare it for high-volume factory production." }
    ]
  },
  "product-designing-and-development": {
    id: "product-designing-and-development",
    title: "Product Designing and Development",
    intro: "From napkin sketch to scaled manufacturing. We combine aesthetic industrial design with rigorous mechanical engineering to bring viable, market-ready physical products to life.",
    icon: Factory,
    subSolutions: [
      {
        title: "Industrial Product Design",
        description: "Creating visually striking, ergonomic, and user-centric designs that elevate your brand and market presence.",
        capabilities: ["Concept sketching", "Ergonomic studies", "CMF (Color, Material, Finish)", "User persona mapping"]
      },
      {
        title: "3D Product Design",
        description: "Transforming 2D sketches into high-fidelity 3D digital concepts for visualization and stakeholder approval.",
        capabilities: ["Surface modeling", "Photorealistic rendering", "VR design reviews", "Form factor exploration"]
      },
      {
        title: "CAD Design",
        description: "Rigorous parametric Computer-Aided Design prioritizing dimensional accuracy and complex assemblies.",
        capabilities: ["Parametric modeling", "SolidWorks / Fusion 360", "Assembly mates", "Tolerance analysis"]
      },
      {
        title: "3D Modeling",
        description: "Versatile digital modeling for rapid prototyping, simulation, and manufacturing blueprints.",
        capabilities: ["Mesh to solid conversion", "Generative design", "Topology optimization", "Digital twins"]
      },
      {
        title: "Mechanical Design",
        description: "Engineering the internal mechanics—gears, linkages, and structural integrity—to ensure perfect operation.",
        capabilities: ["Kinematic analysis", "Stress testing", "Thermal dynamics", "Material selection"]
      },
      {
        title: "Functional Design",
        description: "Ensuring the product not only looks good but performs its intended mechanical function flawlessly.",
        capabilities: ["Mechanism design", "Usability testing", "Failure Mode Analysis", "Lifecycle engineering"]
      },
      {
        title: "Prototype Design",
        description: "Engineering CAD files specifically tailored for rapid prototyping technologies (3D printing, CNC).",
        capabilities: ["Design for Additive", "Mockup engineering", "Iterative adjustments", "Proof of Concept"]
      },
      {
        title: "Design Optimization",
        description: "Refining existing designs to reduce weight, lower material costs, and improve overall structural strength.",
        capabilities: ["FEA (Finite Element Analysis)", "Weight reduction", "Part consolidation", "Cost-down engineering"]
      },
      {
        title: "Design for Manufacturing",
        description: "Preparing your final CAD files for injection molding, CNC machining, or sheet metal fabrication.",
        capabilities: ["Draft angles", "Wall thickness analysis", "Tooling preparation", "BOM generation"]
      }
    ],
    workflow: [
      { title: "Concept & Ideation", description: "Brainstorming sessions resulting in mood boards, industrial sketches, and ergonomic studies." },
      { title: "Detailed Engineering", description: "Transitioning chosen concepts into rigorous CAD models, complete with mechanical assemblies and FEA." },
      { title: "Prototyping & Validation", description: "Building functional physical prototypes to validate mechanics, fit, and aesthetic appeal." },
      { title: "Manufacturing Handoff", description: "Finalizing Design for Manufacturing (DfM) protocols, generating BOMs, and sourcing manufacturing partners." }
    ],
    whyChooseUs: [
      "A rare blend of artistic industrial design and hardcore mechanical engineering.",
      "Extensive knowledge of manufacturing constraints (injection molding, CNC, etc.).",
      "In-house rapid prototyping capabilities for immediate physical validation.",
      "Commitment to creating products that are both beautiful and economically viable to produce."
    ],
    projects: [
      { title: "Next-Gen Wearable Device", imageSrc: "/images/project-1.png", href: "/projects/wearable" },
      { title: "Ruggedized Field Sensor Casing", imageSrc: "/images/project-2.png", href: "/projects/sensor-casing" }
    ],
    faqs: [
      { question: "What is the difference between Industrial Design and Mechanical Engineering?", answer: "Industrial Design focuses on the product's aesthetics, ergonomics, and user experience. Mechanical Engineering ensures the internal mechanisms work, the structure is sound, and the product can actually be manufactured." },
      { question: "Do you help with sourcing manufacturers?", answer: "Yes. After the Design for Manufacturing (DfM) phase, we provide complete technical drawing packages and can connect you with trusted manufacturing partners globally." },
      { question: "What CAD software do you use?", answer: "Our engineers are proficient in industry-standard tools including SolidWorks, Autodesk Fusion 360, and Rhino for advanced surface modeling." }
    ]
  }
};
