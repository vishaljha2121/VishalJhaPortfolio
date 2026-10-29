
export interface Project {
    title: string
    description: string
    tech: string[]
    link?: string
    github?: string
    preview?: string
}

export interface Experience {
    role: string
    company: string
    date: string
    location: string
    description: string[]
    tech?: string[]
}

export interface Education {
    school: string
    degree: string
    date: string
    location: string
    coursework?: string[]
}


export interface Personal {
    name: string
    role: string
    email: string
    location: string
    phone: string
    linkedin: string
    github: string
    photo?: string
    bio: string
    skills: string[]
}

export interface Publication {
    title: string
    venue: string
    date: string
    description: string
    link?: string
}

export const portfolio = {
    personal: {
        name: "Vishal Jha",
        role: "MSCS @ NYU | Developer",
        email: "vj2307@nyu.edu",
        location: "New York, USA",
        phone: "+1 (801) 792-8116",
        linkedin: "https://www.linkedin.com/in/vishal-jha21/",
        github: "https://github.com/vishaljha2121",
        // Add your photo here. Place the file in the public/ folder (e.g. public/me.jpg) and reference it here as "/me.jpg"
        photo: "ME.JPG",
        bio: "Graduate student in Computer Science at NYU Tandon, specializing in high-performance systems and machine learning infrastructure. Experienced in building scalable financial technology and low-latency trading engines. Passionate about distributed systems, market microstructure, and probabilistic algorithms.",
        skills: [
            "C++", "Python", "Java", "VHDL/Verilog", "SQL",
            "Spring Boot", "FastAPI", "Flask", "React", "Kafka",
            "AWS", "Linux", "Distributed Systems", "Low-latency Computing",
            "Risk Modeling", "Market Microstructure", "Machine Learning"
        ]
    } as Personal,

    experience: [
        {
            role: "C++ Engineer Intern",
            company: "True Markets",
            date: "May 2026 – Aug 2026",
            location: "New York, NY",
            description: [
                "Built a matching-engine latency harness using RDTSCP, p50–p99.99 measurements and bootstrap A/B testing; identified cold-start artifacts that inflated reported per-operation cost.",
                "Fixed an Aeron crash during network churn by tracing an unsynchronized handler registry and a single-producer queue receiving writes from multiple threads.",
                "Deployed a C++ market-surveillance service as a read-only follower of two Raft clusters, with restart replay that avoids repeating historical actions; fixed a persistence bug that left recovered state empty.",
                "Made customer-fund settlement restart-safe by preserving transfer idempotency keys across recovery, preventing duplicate transfers and retry storms during interrupted cycles.",
                "Built Raft snapshot inspection and copy utilities, plus an exchange operations console for inspecting persisted cluster and order-book state."
            ],
            tech: ["C++", "Raft", "Aeron", "Concurrency", "Latency Measurement", "Recovery"]
        },
        {
            role: "Senior Analyst",
            company: "Standard Chartered GBS",
            date: "May 2025 – Jul 2025",
            location: "Chennai, TN",
            description: [
                "Fortified application security by integrating HashiCorp Vault for secrets management and remediating OWASP vulnerabilities."
            ],
            tech: ["HashiCorp Vault", "Security", "OWASP"]
        },
        {
            role: "Development Engineer",
            company: "Standard Chartered GBS",
            date: "Jul 2023 – Apr 2025",
            location: "Chennai, TN",
            description: [
                "Engineered a scalable, high-throughput RESTful API framework using Spring Boot to facilitate real-time customer onboarding across diverse international markets.",
                "Architected a modular system with reusable Data Transfer Objects (DTOs) to parse and map dynamic JSON responses, enhancing code maintainability.",
                "Implemented idempotent API endpoints and robust custom exception handling, increasing system reliability and ensuring data consistency in distributed transactions."
            ],
            tech: ["Spring Boot", "Java", "RESTful API", "Distributed Transactions"]
        },
        {
            role: "Internship - Quant Developer",
            company: "Finvant Research Capital LLP",
            date: "Mar 2022 – Jun 2023",
            location: "Ahmadabad, GJ (Remote)",
            description: [
                "Developed a multi-threaded, low-latency Python server that doubled signal processing throughput for algorithmic trading strategies.",
                "Architected a distributed trading platform leveraging Kafka and FastAPI, enabling the system to scale and support 4x the number of concurrent users.",
                "Optimized the Order Management System (OMS) backend, resulting in a 36% reduction in resource consumption and a 50% improvement in order execution speed."
            ],
            tech: ["Python", "FastAPI", "Kafka", "AWS", "Linux", "Algorithmic Trading"]
        }
    ],

    projects: [
        {
            title: "Velocita: Replicated Trading on Raft",
            description: "A deterministic C++20 trading kernel replicated by Raft over Aeron across two NUCs and a Raspberry Pi 5, with a separate execution gateway and a key-holding signer. Traded real money on Solana unattended: 16 swaps, every settlement equal to the chain to the atom, 126 ms p50 replicated commits, and 4–7 s voter rejoin times during a graceful rolling upgrade with trading halted.",
            tech: ["C++20", "Raft", "Aeron", "Distributed Systems", "Solana", "Python"],
            github: "https://github.com/vishaljha2121/Velocita",
            link: "https://github.com/vishaljha2121/Velocita"
        },
        {
            title: "SpotyBoys: Music Recommendation System",
            description: "Built with Dawei Sun and Yonghyeon Shin for our spring 2026 ML systems course at NYU. A session-based music recommender with GRU ranking, Navidrome playback and a retraining pipeline. My work included serving integration, fallback behaviour, PostgreSQL/Grafana monitoring, model-promotion checks and load testing.",
            tech: ["Python", "PyTorch", "FastAPI", "PostgreSQL", "Docker", "MLOps"],
            github: "https://github.com/Bobosi-coder/SpotyBoys",
            link: "https://vishaljha2121.github.io/VishalJhaPortfolio/blog/spotyboys-from-recommendations-to-a-music-service/"
        },
        {
            title: "High-Frequency Trading Engine",
            description: "Engineered a high-performance, low-latency trading engine in C++ featuring a price-time priority order matching algorithm and a custom FIX-like messaging protocol.",
            tech: ["C++", "Low-Latency Systems", "Quant"],
            github: "https://github.com/vishaljha2121/TradingEngine",
            link: "https://github.com/vishaljha2121/TradingEngine"
        },
        {
            title: "CLibML (C Machine Learning Framework)",
            description: "Building a lightweight machine learning framework in C with core components for tensors, memory management (arena-style allocation), and model training primitives.",
            tech: ["C", "Systems Programming", "ML", "Memory Management"],
            github: "https://github.com/vishaljha2121/CLibML",
            link: "https://github.com/vishaljha2121/CLibML"
        },
        {
            title: "Real-Time Posture Analysis",
            description: "Developed a browser-based application using Mediapipe to perform real-time human pose estimation for tracking and correcting exercise forms.",
            tech: ["JavaScript", "Computer Vision", "Mediapipe", "React"],
            github: "https://github.com/vishaljha2121/exercise-buddy",
            link: "https://github.com/vishaljha2121/exercise-buddy"
        }
    ],

    education: [
        {
            school: "New York University",
            degree: "Masters of Science - Computer Science",
            date: "Aug 2025 - May 2027",
            location: "New York, USA",
            coursework: ["Randomized Algorithms", "Machine Learning", "Design and Analysis of Algorithms I"]
        },
        {
            school: "SRM Institute of Science and Technology",
            degree: "Bachelors of Technology | CSE with specialisation in AIML",
            date: "Jun 2023",
            location: "Chennai, India"
        }
    ],

    publications: [
        {
            title: "Multi-model ensemble and architecture comparison",
            venue: "IJSR",
            date: "Jan 2022",
            description: "Compared CNN, ANN, DNN on multiple datasets for accuracy and generalization with fixed hyperparameters.",
            link: "https://www.ijsr.in/upload/1368857845Chapter_15.pdf"
        },
        {
            title: "Crypto sentiment: Social media impact on coin markets",
            venue: "IJAR",
            date: "Jun 2023",
            description: "Analyzed Twitter sentiment to track crypto trends and LTP patterns for risk-aware portfolio allocation.",
            link: "https://www.journalijar.com/article/44908/live-crypto-sentiment:-social-media-influence-on-multi-sectoral-coin-and-its-impact-on-portfolio-risk-management,-using-data-analytics/" // Update this link
        }
    ]
}
