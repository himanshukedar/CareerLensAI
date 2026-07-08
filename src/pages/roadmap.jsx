import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle, BookOpen, Star, Layout, Code, Server, Shield, Database, Terminal, Cpu, Globe, ArrowLeft, Award, Target } from 'lucide-react';
import api from '../api/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import GlitchText from '../components/GlitchText';
import TopicPanel from '../components/TopicPanel';
import './roadmap.css';

// =========================================
// 1. THE COMPLETE DATA (ALL DOMAINS)
// ==========================================

const roleRoadmaps = [
  { id: 'frontend', title: 'Frontend', desc: 'User Interface & UX', isNew: false },
  { id: 'backend', title: 'Backend', desc: 'Server Logic & DBs', isNew: false },
  { id: 'fullstack', title: 'Full Stack', desc: 'Frontend & Backend', isNew: false },
  { id: 'devops', title: 'DevOps', desc: 'Operations & CI/CD', isNew: false },
  { id: 'devsecops', title: 'DevSecOps', desc: 'Securing DevOps', isNew: true },
  { id: 'ai-engineer', title: 'AI Engineer', desc: 'AI & Models', isNew: false },
  { id: 'data-analyst', title: 'Data Analyst', desc: 'Insights from Data', isNew: true },
  { id: 'ai-data-scientist', title: 'AI & Data Scientist', desc: 'Science of Data', isNew: false },
  { id: 'data-engineer', title: 'Data Engineer', desc: 'Big Data Pipelines', isNew: false },
  { id: 'android', title: 'Android', desc: 'Mobile Apps (Kotlin)', isNew: false },
  { id: 'ios', title: 'iOS', desc: 'Mobile Apps (Swift)', isNew: false },
  { id: 'postgresql', title: 'PostgreSQL', desc: 'DB Administration', isNew: false },
  { id: 'blockchain', title: 'Blockchain', desc: 'Web3 & Crypto', isNew: false },
  { id: 'qa', title: 'QA', desc: 'Quality Assurance', isNew: false },
  { id: 'software-architect', title: 'Software Architect', desc: 'System Design', isNew: false },
  { id: 'cyber-security', title: 'Cyber Security', desc: 'Security', isNew: false },
  { id: 'ux-design', title: 'UX Design', desc: 'User Experience', isNew: false },
  { id: 'game-developer', title: 'Game Developer', desc: 'Game Creation', isNew: false },
  { id: 'mlops', title: 'MLOps', desc: 'ML Operations', isNew: false },
  { id: 'product-manager', title: 'Product Manager', desc: 'Product Lifecycle', isNew: false },
  { id: 'engineering-manager', title: 'Eng. Manager', desc: 'Leading Teams', isNew: false },
  { id: 'devrel', title: 'Developer Relations', desc: 'Community', isNew: false },
  { id: 'bi-analyst', title: 'BI Analyst', desc: 'Business Intelligence', isNew: true },
];

const skillRoadmaps = [
  { id: 'computer-science', title: 'Computer Science', isNew: false },
  { id: 'sql', title: 'SQL', isNew: true },
  { id: 'react', title: 'React', isNew: false },
  { id: 'vue', title: 'Vue', isNew: false },
  { id: 'angular', title: 'Angular', isNew: false },
  { id: 'javascript', title: 'JavaScript', isNew: false },
  { id: 'typescript', title: 'TypeScript', isNew: false },
  { id: 'nodejs', title: 'Node.js', isNew: false },
  { id: 'python', title: 'Python', isNew: false },
  { id: 'java', title: 'Java', isNew: false },
  { id: 'spring-boot', title: 'Spring Boot', isNew: false },
  { id: 'go', title: 'Go', isNew: false },
  { id: 'rust', title: 'Rust', isNew: false },
  { id: 'cpp', title: 'C++', isNew: false },
  { id: 'flutter', title: 'Flutter', isNew: false },
  { id: 'graphql', title: 'GraphQL', isNew: false },
  { id: 'design-system', title: 'Design System', isNew: false },
  { id: 'system-design', title: 'System Design', isNew: false },
  { id: 'docker', title: 'Docker', isNew: false },
  { id: 'kubernetes', title: 'Kubernetes', isNew: false },
  { id: 'aws', title: 'AWS', isNew: false },
  { id: 'mongodb', title: 'MongoDB', isNew: false },
  { id: 'linux', title: 'Linux', isNew: false },
  { id: 'git-github', title: 'Git & GitHub', isNew: false },
  { id: 'terraform', title: 'Terraform', isNew: false },
  { id: 'redis', title: 'Redis', isNew: false },
  { id: 'datastructures', title: 'DSA', isNew: false },
  { id: 'prompt-engineering', title: 'Prompt Eng.', isNew: false },
  { id: 'nextjs', title: 'Next.js', isNew: false },
  { id: 'html', title: 'HTML', isNew: false },
  { id: 'css', title: 'CSS', isNew: false },
  { id: 'kotlin', title: 'Kotlin', isNew: false },
  { id: 'swift', title: 'Swift', isNew: false },
  { id: 'laravel', title: 'Laravel', isNew: false },
  { id: 'wordpress', title: 'WordPress', isNew: true },
];

const bestPractices = [
  { id: 'aws-best', title: 'AWS Best Practices', desc: 'Security & Cost' },
  { id: 'api-security', title: 'API Security', desc: 'Safe API Design' },
  { id: 'frontend-perf', title: 'Frontend Performance', desc: 'Speed & Vitals' },
  { id: 'backend-perf', title: 'Backend Performance', desc: 'Scaling & Caching' },
  { id: 'code-review', title: 'Code Review', desc: 'Review Guidelines' },
];

// ==========================================
// 2. DETAILED CONTENT (Expanded for All Major Roadmaps)
// ==========================================

const specificRoadmapDetails = {
  frontend: {
    title: "Frontend Developer",
    desc: "Design and build the visual and interactive elements of websites.",
    steps: [
      { title: "Internet", sub: ["How does the internet work?", "What is HTTP/HTTPS?", "Browsers & Rendering Engine", "DNS & Domain Names", "What is Hosting?"] },
      { title: "HTML", sub: ["Basics (Tags, Attributes)", "Semantic HTML", "Forms & Validations", "Accessibility (ARIA)", "SEO Basics"] },
      { title: "CSS", sub: ["Selectors & Specificity", "Box Model", "Flexbox & Grid", "Responsive Design (Media Queries)", "Animations & Transitions"] },
      { title: "JavaScript", sub: ["Syntax & Basic Constructs", "DOM Manipulation", "Fetch API / AJAX", "ES6+ Features (Arrow fns, Destructuring)", "Async/Await & Promises", "Event Loop"] },
      { title: "Version Control", sub: ["Git Basic Commands (add, commit, push)", "GitHub / GitLab", "Branching & Merging", "Pull Requests"] },
      { title: "Package Managers", sub: ["npm", "yarn", "pnpm"] },
      { title: "Frameworks", sub: ["React.js (Most Popular)", "Vue.js", "Angular", "Svelte"] },
      { title: "CSS Architecture", sub: ["BEM Naming", "Tailwind CSS", "SASS/SCSS", "CSS Modules", "Styled Components"] },
      { title: "Testing", sub: ["Unit Testing (Jest, Vitest)", "End-to-End (Cypress, Playwright)", "React Testing Library"] },
      { title: "Build Tools", sub: ["Vite", "Webpack", "Rollup", "Linters (ESLint) & Formatters (Prettier)"] },
      { title: "Web Security", sub: ["HTTPS", "CORS", "Content Security Policy (CSP)", "OWASP Security Risks"] },
    ]
  },
  backend: {
    title: "Backend Developer",
    desc: "Handle the server-side logic, databases, and APIs.",
    steps: [
      { title: "Internet & OS", sub: ["How the Internet works", "Terminal/CLI Usage", "Process Management", "Threads & Concurrency", "Memory Management"] },
      { title: "Learn a Language", sub: ["JavaScript (Node.js)", "Python (Django/Flask)", "Java (Spring Boot)", "Go (Golang)", "Rust", "C# (.NET)"] },
      { title: "Relational Databases", sub: ["PostgreSQL (Recommended)", "MySQL", "Normalization", "ACID Transactions", "Indexes & Optimization"] },
      { title: "NoSQL Databases", sub: ["MongoDB (Document)", "Redis (Key-Value)", "Cassandra (Wide Column)", "Graph Databases (Neo4j)"] },
      { title: "APIs", sub: ["REST Architecture", "JSON:API Standards", "GraphQL", "gRPC", "Authentication (OAuth2, JWT, Session)"] },
      { title: "Caching", sub: ["Client-Side Caching", "Server-Side (Redis, Memcached)", "CDN (Cloudflare, AWS CloudFront)"] },
      { title: "Web Security", sub: ["Hashing (Bcrypt, Argon2)", "HTTPS/SSL/TLS", "CORS", "OWASP Top 10", "Rate Limiting", "SQL Injection Prevention"] },
      { title: "Testing", sub: ["Integration Testing", "Unit Testing", "Mocking", "TDD (Test Driven Development)"] },
      { title: "CI/CD", sub: ["GitHub Actions", "GitLab CI", "Jenkins", "Automated Deployments"] },
      { title: "Architectural Patterns", sub: ["Monolithic", "Microservices", "Serverless", "Event-Driven Architecture"] },
    ]
  },
  devops: {
    title: "DevOps Engineer",
    desc: "Bridge the gap between development and operations.",
    steps: [
      { title: "Prerequisites", sub: ["Linux/Unix Basics", "Networking (DNS, TCP/IP, HTTP)", "Scripting (Bash, Python)"] },
      { title: "Operating Systems", sub: ["Process Management", "Systemd", "File Systems", "Virtualization", "Memory/Storage"] },
      { title: "Version Control", sub: ["Git Flow", "GitHub/GitLab", "Trunk Based Development"] },
      { title: "Containers", sub: ["Docker", "Containerd", "Docker Compose", "Multi-stage Builds"] },
      { title: "Orchestration", sub: ["Kubernetes (Pods, Services, Ingress)", "Helm Charts", "Service Mesh (Istio, Linkerd)"] },
      { title: "Infrastructure as Code", sub: ["Terraform", "Ansible", "Pulumi", "CloudFormation"] },
      { title: "CI/CD Pipelines", sub: ["Jenkins", "GitHub Actions", "CircleCI", "ArgoCD (GitOps)"] },
      { title: "Cloud Providers", sub: ["AWS (EC2, S3, RDS, Lambda)", "Azure", "Google Cloud Platform", "DigitalOcean"] },
      { title: "Monitoring & Observability", sub: ["Prometheus", "Grafana", "ELK Stack (Elasticsearch, Logstash, Kibana)", "Datadog", "OpenTelemetry"] },
    ]
  },
  'ai-engineer': {
    title: "AI Engineer",
    desc: "Build and deploy Artificial Intelligence models and systems.",
    steps: [
      { title: "Fundamentals", sub: ["Python Programming", "Linear Algebra & Calculus", "Statistics & Probability", "Data Structures"] },
      { title: "Machine Learning", sub: ["Supervised Learning", "Unsupervised Learning", "Scikit-learn", "Model Evaluation (Precision, Recall)"] },
      { title: "Deep Learning", sub: ["Neural Networks", "PyTorch / TensorFlow", "CNNs (Vision)", "RNNs/LSTMs (Sequences)", "Backpropagation"] },
      { title: "LLMs & GenAI", sub: ["Transformers Architecture", "Attention Mechanism", "GPT/BERT Models", "Hugging Face Ecosystem"] },
      { title: "Prompt Engineering", sub: ["Zero-shot / Few-shot", "Chain of Thought", "ReAct Framework", "System Prompts"] },
      { title: "RAG (Retrieval Augmented Generation)", sub: ["Embeddings", "Vector Databases (Pinecone, Chroma)", "LangChain / LlamaIndex", "Semantic Search"] },
      { title: "Deployment (MLOps)", sub: ["Model Serving (FastAPI, Flask)", "Docker for ML", "ONNX", "Model Quantization"] },
      { title: "AI Agents", sub: ["AutoGPT", "BabyAGI", "Tool Use", "Memory & Planning"] }
    ]
  },
  react: {
    title: "React Developer",
    desc: "Master the most popular frontend library.",
    steps: [
      { title: "Fundamentals", sub: ["JSX Syntax", "Functional Components", "Props & State", "Conditional Rendering", "Lists & Keys"] },
      { title: "Hooks", sub: ["useState", "useEffect", "useContext", "useRef", "useReducer", "useCallback & useMemo", "Custom Hooks"] },
      { title: "Routing", sub: ["React Router v6", "Dynamic Routes", "Nested Routes", "Protected Routes", "Loaders & Actions"] },
      { title: "State Management", sub: ["Context API", "Redux Toolkit", "Zustand", "Jotai", "Recoil"] },
      { title: "Styling", sub: ["CSS Modules", "Tailwind CSS", "Styled Components", "Emotion", "Chakra UI / MUI"] },
      { title: "Data Fetching", sub: ["Fetch API", "Axios", "React Query (TanStack Query)", "SWR"] },
      { title: "Advanced Patterns", sub: ["Higher Order Components (HOC)", "Render Props", "Compound Components", "Portals", "Error Boundaries"] },
      { title: "Ecosystem", sub: ["Next.js (SSR/SSG)", "Remix", "React Hook Form", "Storybook", "Framer Motion"] }
    ]
  },
  python: {
    title: "Python Developer",
    desc: "Master the versatile language for Web, Data, and AI.",
    steps: [
      { title: "Basics", sub: ["Variables & Data Types", "Lists, Tuples, Sets, Dictionaries", "Conditionals & Loops", "Functions & Scope"] },
      { title: "Intermediate", sub: ["Object Oriented Programming (Classes)", "Modules & Packages", "Virtual Environments (venv, poetry)", "File Handling", "Exception Handling"] },
      { title: "Advanced", sub: ["Decorators", "Generators & Iterators", "Context Managers (with statement)", "Multithreading & Multiprocessing", "Type Hinting"] },
      { title: "Web Development", sub: ["Django (MVT, ORM)", "Flask (Microframework)", "FastAPI (Modern, Async)", "Jinja2 Templates"] },
      { title: "Data Science Stack", sub: ["NumPy (Arrays)", "Pandas (Dataframes)", "Matplotlib/Seaborn (Visualization)", "Jupyter Notebooks"] },
      { title: "Testing", sub: ["PyTest", "Unittest", "Mocking"] },
      { title: "Packaging", sub: ["PyPI", "Pip", "Building Wheels"] }
    ]
  },
  java: {
    title: "Java Developer",
    desc: "Enterprise-grade backend development.",
    steps: [
      { title: "Core Java", sub: ["Syntax", "OOP Principles", "Collections Framework", "Streams API", "Lambdas", "Exception Handling"] },
      { title: "Build Tools", sub: ["Maven", "Gradle"] },
      { title: "Web Frameworks", sub: ["Spring Boot (DI, AOP)", "Spring MVC", "Jakarta EE", "Hibernate (ORM)"] },
      { title: "Database Access", sub: ["JDBC", "JPA", "Spring Data JPA"] },
      { title: "Testing", sub: ["JUnit 5", "Mockito"] },
      { title: "Deployment", sub: ["Tomcat", "Jetty", "Dockerizing Java Apps"] }
    ]
  },
  sql: {
    title: "SQL Master",
    desc: "Manage and query relational databases efficiently.",
    steps: [
      { title: "Fundamentals", sub: ["SELECT, FROM, WHERE", "INSERT, UPDATE, DELETE", "Data Types", "Operators"] },
      { title: "Filtering & Sorting", sub: ["LIKE", "IN", "BETWEEN", "ORDER BY", "LIMIT / TOP"] },
      { title: "Joins", sub: ["INNER JOIN", "LEFT/RIGHT JOIN", "FULL OUTER JOIN", "CROSS JOIN", "Self Join"] },
      { title: "Aggregation", sub: ["GROUP BY", "HAVING", "COUNT, SUM, AVG, MIN, MAX"] },
      { title: "Advanced", sub: ["Subqueries", "Common Table Expressions (CTEs)", "Window Functions (RANK, ROW_NUMBER)", "Stored Procedures", "Triggers", "Views"] },
      { title: "Database Design", sub: ["Normalization (1NF, 2NF, 3NF)", "Primary & Foreign Keys", "Indexes (Clustered vs Non-Clustered)", "Constraints"] }
    ]
  },
  android: {
    title: "Android Developer",
    desc: "Build mobile applications for the Android ecosystem.",
    steps: [
      { title: "Fundamentals", sub: ["Install Android Studio", "Kotlin Basics", "XML Layouts", "Android Manifest"] },
      { title: "Components", sub: ["Activities", "Fragments", "Intents", "Services", "Broadcast Receivers"] },
      { title: "UI Design", sub: ["Material Design 3", "Jetpack Compose (Modern UI)", "RecyclerView", "ConstraintLayout"] },
      { title: "Data Storage", sub: ["Room Database", "DataStore", "SharedPreferences"] },
      { title: "Networking", sub: ["Retrofit", "OkHttp", "Coroutines & Flow", "JSON Parsing (Moshi/Gson)"] },
      { title: "Architecture", sub: ["MVVM", "MVI", "Dependency Injection (Hilt/Dagger)"] }
    ]
  },
  ios: {
    title: "iOS Developer",
    desc: "Build mobile applications for the Apple ecosystem.",
    steps: [
      { title: "Fundamentals", sub: ["Xcode IDE", "Swift Language Basics", "CocoaPods / Swift Package Manager"] },
      { title: "UI Frameworks", sub: ["SwiftUI (Declarative)", "UIKit (Imperative)", "Auto Layout", "Storyboards"] },
      { title: "Architecture", sub: ["MVC", "MVVM", "The Composable Architecture (TCA)"] },
      { title: "Data & Networking", sub: ["Core Data", "SwiftData", "URLSession", "Codable", "Alamofire"] },
      { title: "System Frameworks", sub: ["Combine", "Core Location", "Push Notifications", "Background Tasks"] }
    ]
  },
  fullstack: {
    title: "Full Stack Developer",
    desc: "Master both frontend and backend technologies.",
    steps: [
      { title: "Frontend Stack", sub: ["HTML/CSS/JS", "React or Vue", "State Management", "Tailwind CSS"] },
      { title: "Backend Stack", sub: ["Node.js or Python", "API Design (REST/GraphQL)", "Database Modeling"] },
      { title: "Databases", sub: ["PostgreSQL", "MongoDB", "Redis", "ORM (Prisma/TypeORM/Mongoose)"] },
      { title: "DevOps Basics", sub: ["Docker", "Basic CI/CD", "Deploying to Vercel/Render/AWS"] },
      { title: "System Design", sub: ["Scalability", "Load Balancing", "Caching Strategies", "Authentication"] }
    ]
  },
  'cyber-security': {
    title: "Cyber Security",
    desc: "Protect systems, networks, and programs from digital attacks.",
    steps: [
      { title: "Fundamentals", sub: ["Networking (OSI Model, TCP/IP)", "Linux/OS Basics", "Programming (Python/Bash)"] },
      { title: "Security Operations", sub: ["SIEM Tools", "Incident Response", "Threat Intelligence", "Forensics"] },
      { title: "Application Security", sub: ["OWASP Top 10", "Web App Penetration Testing", "Secure Coding Practices"] },
      { title: "Network Security", sub: ["Firewalls", "IDS/IPS", "VPNs", "Wireshark", "Nmap"] },
      { title: "Identity & Access", sub: ["Active Directory", "IAM", "Kerberos", "Multi-Factor Authentication"] }
    ]
  },
  'data-analyst': {
    title: "Data Analyst",
    desc: "Turn data into actionable insights.",
    steps: [
      { title: "Excel / Spreadsheets", sub: ["Pivot Tables", "VLOOKUP/XLOOKUP", "Data Cleaning", "Formulas"] },
      { title: "SQL", sub: ["Querying", "Joins", "Aggregations", "Window Functions", "Common Table Expressions"] },
      { title: "BI Tools", sub: ["Tableau", "Power BI", "Looker", "Dashboard Design"] },
      { title: "Python/R", sub: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Exploratory Data Analysis (EDA)"] },
      { title: "Statistics", sub: ["Mean/Median/Mode", "Standard Deviation", "Hypothesis Testing", "Correlation"] }
    ]
  },
  'data-engineer': {
    title: "Data Engineer",
    desc: "Build pipelines to process vast amounts of data.",
    steps: [
      { title: "Programming", sub: ["Python", "Scala", "Java", "Shell Scripting"] },
      { title: "Databases", sub: ["SQL (Postgres)", "NoSQL (Cassandra, MongoDB)", "Data Warehousing (Snowflake, BigQuery, Redshift)"] },
      { title: "Data Processing", sub: ["Spark", "Hadoop", "Kafka (Streaming)", "Airflow (Orchestration)", "dbt"] },
      { title: "Cloud Platforms", sub: ["AWS Data Stack", "Azure Data Factory", "GCP Dataflow"] }
    ]
  }
}


// ==========================================
// 3. GENERATOR FUNCTION
// ==========================================


// ==========================================
// 4. COMPONENTS
// ==========================================

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="section-header">
    <div className="section-title-row">
      {Icon && <Icon size={24} className="section-icon" color="#6366f1" />}
      <h2>{title}</h2>
    </div>
    <p>{subtitle}</p>
  </div>
);

const RoadmapCard = ({ id, title, desc, isFresh, type }) => {
  let Icon = BookOpen;
  if (type === 'role') Icon = Layout;
  if (type === 'skill') Icon = Code;
  if (type === 'best') Icon = CheckCircle;

  return (
    <Link to={`/roadmap/${id}`}>
      <Motion.div
        className={`roadmap-card glass-panel ${type}`}
        whileHover={{ scale: 1.05, translateY: -5, borderColor: 'var(--primary)' }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {isFresh && <span className="new-badge">NEW</span>}
        <div className="card-top">
          <Icon size={20} className="card-icon-visual" />
        </div>
        <h3>{title}</h3>
        {desc && <p>{desc}</p>}
      </Motion.div>
    </Link>
  );
};

// --- HOME PAGE (LIST) ---
export const RoadmapList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const fetchRoadmaps = useCallback(async () => {
    try {
      // We can fetch from public or protected route. Ideally public if just content, 
      // but we put it behind auth in routes.
      const res = await api.get('/roadmap');
      setRoadmaps(res.data);
    } catch (err) {
      console.error("Failed to fetch roadmaps", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoadmaps();
  }, [fetchRoadmaps]);

  const filterList = (list) => list.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const newRoadmaps = roadmaps.filter(r => r.isAiGenerated);
  const roles = roadmaps.filter(r => r.type === 'role' && !r.isAiGenerated);
  const skills = roadmaps.filter(r => r.type === 'skill' && !r.isAiGenerated);
  const bests = roadmaps.filter(r => r.type === 'best' && !r.isAiGenerated);

  const generateCustomRoadmap = async () => {
    if (!searchTerm) return;
    setIsGenerating(true);
    const toastId = toast.loading(`Generating AI Roadmap for "${searchTerm}"...`);
    try {
      const res = await api.post('/roadmap/generate', { topic: searchTerm });
      toast.success('Roadmap generated successfully!', { id: toastId });
      navigate(`/roadmap/${res.data.roadmapId}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate roadmap', { id: toastId });
      setIsGenerating(false);
    }
  };

  return (
    <AnimatedPage className="roadmap-container container">
      <header className="roadmap-hero">
        <div className="hero-content">
          <GlitchText text="Developer Roadmaps" />
          <p className="hero-subtitle">
            Interactive guides to guide your career path.
          </p>
          <div className="search-wrapper glass-panel">
            <input
              type="text"
              placeholder="Search roadmaps (e.g. AI, React, DevOps)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading Library...</div>
      ) : (
        <div className="content-container">
          {/* New Roadmaps */}
          {(filterList(newRoadmaps).length > 0) && (
            <section className="group-section">
              <SectionHeader icon={Star} title="New Roadmaps" subtitle="Freshly added and AI-generated roadmaps" />
              <div className="grid-roles">
                {filterList(newRoadmaps).map(r => <RoadmapCard key={r.roadmapId} id={r.roadmapId} {...r} />)}
              </div>
            </section>
          )}

          {/* Skill Based */}
          {(filterList(skills).length > 0) && (
            <section className="group-section">
              <SectionHeader icon={Code} title="Skill-based Roadmaps" subtitle="Master specific technologies" />
              <div className="grid-skills">
                {filterList(skills).map(r => <RoadmapCard key={r.roadmapId} id={r.roadmapId} {...r} />)}
              </div>
            </section>
          )}

          {/* Role Based — Baad Mein */}
          {(filterList(roles).length > 0) && (
            <section className="group-section">
              <SectionHeader icon={Layout} title="Role-based Roadmaps" subtitle="Step-by-step guides for engineering roles" />
              <div className="grid-roles">
                {filterList(roles).map(r => <RoadmapCard key={r.roadmapId} id={r.roadmapId} {...r} />)}
              </div>
            </section>
          )}

          {/* Best Practices */}
          {(filterList(bests).length > 0) && (
            <section className="group-section">
              <SectionHeader icon={CheckCircle} title="Best Practices" subtitle="Standards and guidelines" />
              <div className="grid-skills">
                {filterList(bests).map(r => <RoadmapCard key={r.roadmapId} id={r.roadmapId} {...r} />)}
              </div>
            </section>
          )}

          {searchTerm && filterList(newRoadmaps).length === 0 && filterList(roles).length === 0 && filterList(skills).length === 0 && filterList(bests).length === 0 && (
            <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem' }} className="glass-panel">
              <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>No roadmaps found for "{searchTerm}".</p>
              <button 
                className="neon-btn" 
                onClick={generateCustomRoadmap}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating AI Roadmap...' : `Generate "${searchTerm}" Roadmap with AI`}
              </button>
            </div>
          )}

          {!searchTerm && roadmaps.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <p>No roadmaps found or database is empty.</p>
            </div>
          )}
        </div>
      )}

      <div style={{ height: '50px' }} />
    </AnimatedPage>
  );
};

// --- DETAIL PAGE ---
export const RoadmapDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [data, setData] = useState(null); // Values: { content, progress }
  const [loading, setLoading] = useState(true);

  // ── Quiz Gate State ──
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizPhase, setQuizPhase] = useState('gate'); // 'gate' | 'generating' | 'active' | 'passed' | 'failed'
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [wrongTopics, setWrongTopics] = useState([]);

  const fetchRoadmapData = useCallback(async () => {
    if (!user) return;
    try {
      // This endpoint now returns { content: {title, steps...}, progress: {...} }
      const res = await api.get(`/roadmap/${id}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load roadmap");
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  // Scroll to top only on initial mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch data when id or user changes
  useEffect(() => {
    fetchRoadmapData();
  }, [fetchRoadmapData]);

  const toggleNode = async (nodeTitle) => {
    try {
      const res = await api.put('/roadmap/node', {
        roadmapId: id,
        nodeTitle
      });
      // Update local state progress
      setData(prev => ({
        ...prev,
        progress: { ...prev.progress, completedNodes: res.data.completedNodes }
      }));

      // Refresh global user context for real-time evolution across app
      const userRes = await api.get('/auth/me');
      setUser(userRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update progress");
    }
  };



  const finishRoadmap = async () => {
    try {
      const res = await api.post('/roadmap/complete', {
        roadmapId: id,
        roadmapTitle: data.content.title
      });
      setData(prev => ({
        ...prev,
        progress: res.data.progress
      }));

      // Refresh global user context for real-time evolution across app
      const userRes = await api.get('/auth/me');
      setUser(userRes.data);

      if (res.data.token) {
        toast('🏆 Token Earned! Check your profile.', { duration: 5000, icon: '🎉' });
      } else {
        toast.success('Roadmap marked as complete!');
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to complete roadmap");
    }
  };

  // ── Quiz Gate Functions ──
  const startQuiz = () => {
    setShowQuiz(true);
    setQuizPhase('gate');
    setQuizQuestions([]);
    setQuizIdx(0);
    setQuizScore(0);
    setSelectedAnswer(null);
  };

  const generateQuizQuestions = async () => {
    const title = data?.content?.title || id;
    const allSubStepsList = data?.content?.steps.flatMap(s => s.sub).join(', ') || '';
    setQuizPhase('generating');
    try {
      const prompt = `Generate exactly 10 multiple choice questions to thoroughly test knowledge of "${title}". Return ONLY valid JSON with key "questions" as an array of 10 objects. Each object must have: "question" (string), "options" (array of exactly 4 strings), "correct" (integer 0-3), and "topic" (MUST be exactly chosen from one of these topics: ${allSubStepsList}). No markdown, no extra text.`;
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' }
        })
      });
      if (!response.ok) throw new Error('API failed');
      const apiData = await response.json();
      const result = JSON.parse(apiData.choices[0].message.content);
      if (result.questions?.length > 0) {
        setQuizQuestions(result.questions);
        setQuizIdx(0);
        setQuizScore(0);
        setSelectedAnswer(null);
        setWrongTopics([]);
        setQuizPhase('active');
      } else {
        throw new Error('Invalid format');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate quiz. Please try again.');
      setQuizPhase('gate');
    }
  };

  const handleQuizAnswer = (optionIdx) => {
    if (selectedAnswer !== null) return; // prevent double click
    setSelectedAnswer(optionIdx);
    const isCorrect = optionIdx === quizQuestions[quizIdx].correct;
    const newScore = isCorrect ? quizScore + 1 : quizScore;
    
    let updatedWrongTopics = isCorrect ? wrongTopics : [...wrongTopics, quizQuestions[quizIdx].topic];
    setQuizScore(newScore);
    if (!isCorrect) {
        setWrongTopics(updatedWrongTopics);
    }

    setTimeout(async () => {  
      if (quizIdx < quizQuestions.length - 1) {
        setQuizIdx(quizIdx + 1);
        setSelectedAnswer(null);
      } else {
        const finalPct = Math.round((newScore / quizQuestions.length) * 100);
        if (finalPct >= 75) {
          setQuizPhase('passed');
        } else {
          try {
              if (updatedWrongTopics.length > 0) {
                  const res = await api.post('/roadmap/downgrade', {
                      roadmapId: id,
                      topicsToRemove: updatedWrongTopics
                  });
                  setData(prev => ({
                      ...prev,
                      progress: { ...prev.progress, completedNodes: res.data.completedNodes, isFinished: res.data.isFinished }
                  }));
              }
          } catch(e) {
              console.error("Failed to downgrade roadmap progress", e);
          }
          setQuizPhase('failed');
        }
      }
    }, 700);
  };

  if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>Loading Roadmap...</div>;
  if (!data || !data.content) return <div style={{ padding: '5rem', textAlign: 'center' }}>Roadmap not found in database.</div>;

  const { content, progress } = data;

  // Flatten steps — only count nodes that actually exist in current content
  const allSubSteps = content.steps.flatMap(step => step.sub);
  const totalSubSteps = allSubSteps.length;
  const completedCount = progress.completedNodes
    ? progress.completedNodes.filter(n => allSubSteps.includes(n)).length
    : 0;
  const percent = totalSubSteps > 0 ? Math.min(100, Math.round((completedCount / totalSubSteps) * 100)) : 0;

  return (
    <>
    <AnimatedPage className="detail-wrapper container">
      <div className="detail-header">
        <button onClick={() => navigate('/roadmap')} className="back-link">
          <ArrowLeft size={16} /> Back to Roadmaps
        </button>
        <GlitchText text={content.title} />
        <p className="detail-desc">{content.desc}</p>

        {/* Progress Bar */}
        <div className="roadmap-progress-container">
          <div className="progress-info">
            <span>Progress: {percent}%</span>
            {progress.isFinished && <span className="completed-badge">COMPLETED</span>}
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${percent}%` }}></div>
          </div>

          {percent === 100 && !progress.isFinished && (
            <Motion.div
              className="completion-status-reveal"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="completion-text-wrapper">
                <Motion.div
                  className="completion-glitch-text"
                  animate={{
                    color: ['#00f3ff', '#0aff0a', '#00f3ff'],
                    textShadow: [
                      '0 0 8px rgba(0,243,255,0.8)',
                      '0 0 15px rgba(10,255,10,0.8)',
                      '0 0 8px rgba(0,243,255,0.8)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ROADMAP COMPLETE // COMPLETED SUCCESSFULLY
                </Motion.div>
                <Motion.div
                  className="completion-subline"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
              </div>
            </Motion.div>
          )}
        </div>
      </div>

      <div className="roadmap-timeline">
        <div className="timeline-line"></div>
        {content.steps.map((step, idx) => {
          const prevStepDone = idx === 0
            ? true
            : content.steps[idx - 1].sub.every(s => progress.completedNodes?.includes(s));
          const isStepCompleted = step.sub.every(s => progress.completedNodes?.includes(s));
          return (
            <Motion.div
              key={idx}
              className={`timeline-step ${!prevStepDone ? 'step-locked' : ''}`}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className={`step-marker ${isStepCompleted ? 'completed' : ''} ${!prevStepDone ? 'locked' : ''}`}>
                {!prevStepDone ? '🔒' : isStepCompleted ? <CheckCircle size={20} /> : idx + 1}
              </div>
              <div className={`step-card glass-panel ${!prevStepDone ? 'step-card-locked' : ''}`}>
                <h3>
                  {step.link && prevStepDone ? (
                    <a href={step.link} target="_blank" rel="noopener noreferrer" className="step-link">
                      {step.title}
                    </a>
                  ) : step.title}
                </h3>
                {!prevStepDone ? (
                  <div className="step-locked-msg">
                    <span className="lock-icon-big">🔒</span>
                    <p>Complete <strong>Step {idx}</strong> first to unlock this section.</p>
                  </div>
                ) : (
                  <ul className="step-list">
                    {step.sub.map((s, i) => {
                      const isChecked = !!(progress.completedNodes?.includes(s));
                      const isUnlocked = i === 0 || !!(progress.completedNodes?.includes(step.sub[i - 1]));
                      return (
                        <TopicPanel
                          key={i}
                          topic={s}
                          sectionTitle={step.title}
                          isCompleted={isChecked}
                          isUnlocked={isUnlocked}
                          onComplete={toggleNode}
                        />
                      );
                    })}
                  </ul>
                )}
              </div>
            </Motion.div>
          );
        })}
        <Motion.div
          className="timeline-end"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
        >
          <div className={`end-marker ${progress.tokenEarned ? 'earned' : ''}`}>
            {progress.tokenEarned ? <Award size={48} color="var(--matrix)" /> : <Target size={48} />}
          </div>
          <h3>{progress.tokenEarned ? 'Roadmap Completed Successfully' : 'Complete to Secure Access'}</h3>

          {percent === 100 && !progress.isFinished && (
            <Motion.button
              onClick={startQuiz}
              className="neon-btn claim-token-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              🎯 TAKE SKILL TEST TO CLAIM
            </Motion.button>
          )}
        </Motion.div>
      </div>
    </AnimatedPage>

    {/* ── Skill Verification Quiz Modal ── */}
    <AnimatePresence>
      {showQuiz && (
        <Motion.div
          className="quiz-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Motion.div
            className="quiz-modal glass-panel"
            initial={{ scale: 0.85, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
          >

            {/* GATE — intro screen */}
            {quizPhase === 'gate' && (
              <div className="quiz-phase quiz-gate">
                <div className="quiz-gate-emoji">🎓</div>
                <h2>Skill Verification Required</h2>
                <p>To earn your <strong>completion badge</strong>, you must pass a 10-question AI-generated skill test with a score of <strong>75% or higher</strong>.</p>
                <div className="quiz-rules">
                  <span><CheckCircle size={14} /> 10 Questions</span>
                  <span><Star size={14} /> 75% Pass Mark</span>
                  <span><Cpu size={14} /> AI Generated</span>
                </div>
                <button className="neon-btn quiz-start-btn" onClick={generateQuizQuestions}>Start Skill Test</button>
                <button className="quiz-cancel-btn" onClick={() => setShowQuiz(false)}>Cancel</button>
              </div>
            )}

            {/* GENERATING */}
            {quizPhase === 'generating' && (
              <div className="quiz-phase quiz-generating">
                <div className="quiz-spinner-ring" />
                <h3>Generating Your Skill Test...</h3>
                <p>AI is crafting personalized questions for you</p>
              </div>
            )}

            {/* ACTIVE — quiz questions */}
            {quizPhase === 'active' && quizQuestions[quizIdx] && (
              <div className="quiz-phase quiz-active">
                <div className="quiz-topbar">
                  <span className="quiz-counter">Q {quizIdx + 1} / {quizQuestions.length}</span>
                  <div className="quiz-progress-track">
                    <div className="quiz-progress-fill" style={{ width: `${((quizIdx) / quizQuestions.length) * 100}%` }} />
                  </div>
                  <span className="quiz-score-live">✅ {quizScore}</span>
                </div>
                <h3 className="quiz-question-text">{quizQuestions[quizIdx].question}</h3>
                <div className="quiz-options">
                  {quizQuestions[quizIdx].options.map((opt, i) => {
                    let cls = 'quiz-option';
                    if (selectedAnswer !== null) {
                      if (i === quizQuestions[quizIdx].correct) cls += ' correct';
                      else if (i === selectedAnswer) cls += ' wrong';
                    }
                    return (
                      <button key={i} className={cls} onClick={() => handleQuizAnswer(i)} disabled={selectedAnswer !== null}>
                        <span className="quiz-opt-label">{String.fromCharCode(65 + i)}</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PASSED */}
            {quizPhase === 'passed' && (
              <div className="quiz-phase quiz-passed">
                <div className="quiz-result-emoji">🏆</div>
                <h2>You Passed!</h2>
                <div className="quiz-final-score passed">{Math.round((quizScore / quizQuestions.length) * 100)}%</div>
                <p>Outstanding! You've proven your knowledge. Your roadmap completion badge is ready!</p>
                <button
                  className="neon-btn quiz-claim-btn"
                  onClick={() => { setShowQuiz(false); finishRoadmap(); }}
                >
                  🏅 Claim Your Badge!
                </button>
              </div>
            )}

            {/* FAILED */}
            {quizPhase === 'failed' && (
              <div className="quiz-phase quiz-failed">
                <div className="quiz-result-emoji">📚</div>
                <h2>Not Quite There Yet!</h2>
                <div className="quiz-final-score failed">{Math.round((quizScore / quizQuestions.length) * 100)}%</div>
                <p>You need <strong>75%</strong> to earn the badge. It looks like the roadmap wasn't fully absorbed — go back, review the topics carefully, and try again!</p>
                <div className="quiz-fail-actions">
                  <button className="neon-btn" onClick={() => setShowQuiz(false)}>📖 Review Roadmap</button>
                  <button className="quiz-retry-btn" onClick={() => { setQuizIdx(0); setQuizScore(0); setSelectedAnswer(null); generateQuizQuestions(); }}>🔄 Retry Test</button>
                </div>
              </div>
            )}

          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
    </>
  );
};