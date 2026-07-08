const mongoose = require('mongoose');
const Roadmap = require('../models/Roadmap');
const dotenv = require('dotenv');

dotenv.config();

const roadmaps = [
    // ── ROLE BASED ─────────────────────────────────────────────────────────────
    {
        roadmapId: 'frontend', title: 'Frontend Developer', desc: 'Design and build the visual and interactive elements of websites.', type: 'role', isFresh: false,
        steps: [
            { title: 'Internet', sub: ['How does the internet work?', 'What is HTTP/HTTPS?', 'Browsers & Rendering Engine', 'DNS & Domain Names', 'What is Hosting?'] },
            { title: 'HTML', sub: ['Basics (Tags, Attributes)', 'Semantic HTML', 'Forms & Validations', 'Accessibility (ARIA)', 'SEO Basics'] },
            { title: 'CSS', sub: ['Selectors & Specificity', 'Box Model', 'Flexbox & Grid', 'Responsive Design (Media Queries)', 'Animations & Transitions'] },
            { title: 'JavaScript', sub: ['Syntax & Basic Constructs', 'DOM Manipulation', 'Fetch API / AJAX', 'ES6+ Features (Arrow fns, Destructuring)', 'Async/Await & Promises', 'Event Loop'] },
            { title: 'Version Control', sub: ['Git Basic Commands (add, commit, push)', 'GitHub / GitLab', 'Branching & Merging', 'Pull Requests'] },
            { title: 'Package Managers', sub: ['npm', 'yarn', 'pnpm'] },
            { title: 'Frameworks', sub: ['React.js (Most Popular)', 'Vue.js', 'Angular', 'Svelte'] },
            { title: 'CSS Architecture', sub: ['BEM Naming', 'Tailwind CSS', 'SASS/SCSS', 'CSS Modules', 'Styled Components'] },
            { title: 'Testing', sub: ['Unit Testing (Jest, Vitest)', 'End-to-End (Cypress, Playwright)', 'React Testing Library'] },
            { title: 'Build Tools', sub: ['Vite', 'Webpack', 'Rollup', 'Linters (ESLint) & Formatters (Prettier)'] },
            { title: 'Web Security', sub: ['HTTPS', 'CORS', 'Content Security Policy (CSP)', 'OWASP Security Risks'] },
        ]
    },
    {
        roadmapId: 'backend', title: 'Backend Developer', desc: 'Handle the server-side logic, databases, and APIs.', type: 'role', isFresh: false,
        steps: [
            { title: 'Internet & OS', sub: ['How the Internet works', 'Terminal/CLI Usage', 'Process Management', 'Threads & Concurrency', 'Memory Management'] },
            { title: 'Learn a Language', sub: ['JavaScript (Node.js)', 'Python (Django/Flask)', 'Java (Spring Boot)', 'Go (Golang)', 'Rust', 'C# (.NET)'] },
            { title: 'Relational Databases', sub: ['PostgreSQL (Recommended)', 'MySQL', 'Normalization', 'ACID Transactions', 'Indexes & Optimization'] },
            { title: 'NoSQL Databases', sub: ['MongoDB (Document)', 'Redis (Key-Value)', 'Cassandra (Wide Column)', 'Graph Databases (Neo4j)'] },
            { title: 'APIs', sub: ['REST Architecture', 'JSON:API Standards', 'GraphQL', 'gRPC', 'Authentication (OAuth2, JWT, Session)'] },
            { title: 'Caching', sub: ['Client-Side Caching', 'Server-Side (Redis, Memcached)', 'CDN (Cloudflare, AWS CloudFront)'] },
            { title: 'Web Security', sub: ['Hashing (Bcrypt, Argon2)', 'HTTPS/SSL/TLS', 'CORS', 'OWASP Top 10', 'Rate Limiting', 'SQL Injection Prevention'] },
            { title: 'Testing', sub: ['Integration Testing', 'Unit Testing', 'Mocking', 'TDD (Test Driven Development)'] },
            { title: 'CI/CD', sub: ['GitHub Actions', 'GitLab CI', 'Jenkins', 'Automated Deployments'] },
            { title: 'Architectural Patterns', sub: ['Monolithic', 'Microservices', 'Serverless', 'Event-Driven Architecture'] },
        ]
    },
    {
        roadmapId: 'fullstack', title: 'Full Stack Developer', desc: 'Master both frontend and backend technologies.', type: 'role', isFresh: false,
        steps: [
            { title: 'Frontend Stack', sub: ['HTML/CSS/JS', 'React or Vue', 'State Management', 'Tailwind CSS'] },
            { title: 'Backend Stack', sub: ['Node.js or Python', 'API Design (REST/GraphQL)', 'Database Modeling'] },
            { title: 'Databases', sub: ['PostgreSQL', 'MongoDB', 'Redis', 'ORM (Prisma/TypeORM/Mongoose)'] },
            { title: 'DevOps Basics', sub: ['Docker', 'Basic CI/CD', 'Deploying to Vercel/Render/AWS'] },
            { title: 'System Design', sub: ['Scalability', 'Load Balancing', 'Caching Strategies', 'Authentication'] },
        ]
    },
    {
        roadmapId: 'devops', title: 'DevOps Engineer', desc: 'Bridge the gap between development and operations.', type: 'role', isFresh: false,
        steps: [
            { title: 'Prerequisites', sub: ['Linux/Unix Basics', 'Networking (DNS, TCP/IP, HTTP)', 'Scripting (Bash, Python)'] },
            { title: 'Operating Systems', sub: ['Process Management', 'Systemd', 'File Systems', 'Virtualization', 'Memory/Storage'] },
            { title: 'Version Control', sub: ['Git Flow', 'GitHub/GitLab', 'Trunk Based Development'] },
            { title: 'Containers', sub: ['Docker', 'Containerd', 'Docker Compose', 'Multi-stage Builds'] },
            { title: 'Orchestration', sub: ['Kubernetes (Pods, Services, Ingress)', 'Helm Charts', 'Service Mesh (Istio, Linkerd)'] },
            { title: 'Infrastructure as Code', sub: ['Terraform', 'Ansible', 'Pulumi', 'CloudFormation'] },
            { title: 'CI/CD Pipelines', sub: ['Jenkins', 'GitHub Actions', 'CircleCI', 'ArgoCD (GitOps)'] },
            { title: 'Cloud Providers', sub: ['AWS (EC2, S3, RDS, Lambda)', 'Azure', 'Google Cloud Platform', 'DigitalOcean'] },
            { title: 'Monitoring & Observability', sub: ['Prometheus', 'Grafana', 'ELK Stack (Elasticsearch, Logstash, Kibana)', 'Datadog', 'OpenTelemetry'] },
        ]
    },
    {
        roadmapId: 'devsecops', title: 'DevSecOps Engineer', desc: 'Integrate security into every stage of the DevOps pipeline.', type: 'role', isFresh: true,
        steps: [
            { title: 'Foundations', sub: ['DevOps Basics', 'Security Fundamentals', 'Linux & Networking', 'Scripting (Bash/Python)'] },
            { title: 'Secure SDLC', sub: ['Threat Modeling', 'Secure Code Review', 'SAST (Static Analysis)', 'DAST (Dynamic Analysis)', 'SCA (Software Composition Analysis)'] },
            { title: 'CI/CD Security', sub: ['Secrets Management (Vault, AWS Secrets)', 'Pipeline Security', 'GitHub Actions Security', 'Image Scanning (Trivy, Clair)'] },
            { title: 'Container Security', sub: ['Docker Security Best Practices', 'Kubernetes RBAC', 'Pod Security Policies', 'Network Policies'] },
            { title: 'Cloud Security', sub: ['IAM Policies & Least Privilege', 'AWS Security Hub', 'CloudTrail & Logging', 'Compliance (SOC2, GDPR)'] },
            { title: 'Monitoring & Response', sub: ['SIEM Tools', 'Incident Response Playbooks', 'Vulnerability Management', 'Penetration Testing Basics'] },
        ]
    },
    {
        roadmapId: 'ai-engineer', title: 'AI Engineer', desc: 'Build and deploy Artificial Intelligence models and systems.', type: 'role', isFresh: false,
        steps: [
            { title: 'Fundamentals', sub: ['Python Programming', 'Linear Algebra & Calculus', 'Statistics & Probability', 'Data Structures'] },
            { title: 'Machine Learning', sub: ['Supervised Learning', 'Unsupervised Learning', 'Scikit-learn', 'Model Evaluation (Precision, Recall)'] },
            { title: 'Deep Learning', sub: ['Neural Networks', 'PyTorch / TensorFlow', 'CNNs (Vision)', 'RNNs/LSTMs (Sequences)', 'Backpropagation'] },
            { title: 'LLMs & GenAI', sub: ['Transformers Architecture', 'Attention Mechanism', 'GPT/BERT Models', 'Hugging Face Ecosystem'] },
            { title: 'Prompt Engineering', sub: ['Zero-shot / Few-shot', 'Chain of Thought', 'ReAct Framework', 'System Prompts'] },
            { title: 'RAG (Retrieval Augmented Generation)', sub: ['Embeddings', 'Vector Databases (Pinecone, Chroma)', 'LangChain / LlamaIndex', 'Semantic Search'] },
            { title: 'Deployment (MLOps)', sub: ['Model Serving (FastAPI, Flask)', 'Docker for ML', 'ONNX', 'Model Quantization'] },
            { title: 'AI Agents', sub: ['AutoGPT', 'BabyAGI', 'Tool Use', 'Memory & Planning'] },
        ]
    },
    {
        roadmapId: 'data-analyst', title: 'Data Analyst', desc: 'Turn data into actionable insights.', type: 'role', isFresh: true,
        steps: [
            { title: 'Excel / Spreadsheets', sub: ['Pivot Tables', 'VLOOKUP/XLOOKUP', 'Data Cleaning', 'Formulas'] },
            { title: 'SQL', sub: ['Querying', 'Joins', 'Aggregations', 'Window Functions', 'Common Table Expressions'] },
            { title: 'BI Tools', sub: ['Tableau', 'Power BI', 'Looker', 'Dashboard Design'] },
            { title: 'Python/R', sub: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Exploratory Data Analysis (EDA)'] },
            { title: 'Statistics', sub: ['Mean/Median/Mode', 'Standard Deviation', 'Hypothesis Testing', 'Correlation'] },
        ]
    },
    {
        roadmapId: 'ai-data-scientist', title: 'AI & Data Scientist', desc: 'Combine AI research with deep data science expertise.', type: 'role', isFresh: false,
        steps: [
            { title: 'Mathematics', sub: ['Linear Algebra', 'Calculus & Optimization', 'Probability & Statistics', 'Information Theory'] },
            { title: 'Data Engineering', sub: ['Data Collection & Cleaning', 'Feature Engineering', 'ETL Pipelines', 'Big Data (Spark, Hadoop)'] },
            { title: 'Machine Learning', sub: ['Regression & Classification', 'Ensemble Methods (XGBoost, Random Forest)', 'Clustering (K-Means, DBSCAN)', 'Dimensionality Reduction (PCA, t-SNE)'] },
            { title: 'Deep Learning', sub: ['Neural Networks', 'CNNs & Vision Transformers', 'RNNs & Transformers', 'GANs & Diffusion Models'] },
            { title: 'Experimentation', sub: ['A/B Testing', 'Hypothesis Testing', 'Causal Inference', 'Experiment Design'] },
            { title: 'MLOps', sub: ['Model Versioning (MLflow)', 'Model Deployment', 'Monitoring & Drift Detection', 'Feature Stores'] },
        ]
    },
    {
        roadmapId: 'data-engineer', title: 'Data Engineer', desc: 'Build pipelines to process vast amounts of data.', type: 'role', isFresh: false,
        steps: [
            { title: 'Programming', sub: ['Python', 'Scala', 'Java', 'Shell Scripting'] },
            { title: 'Databases', sub: ['SQL (Postgres)', 'NoSQL (Cassandra, MongoDB)', 'Data Warehousing (Snowflake, BigQuery, Redshift)'] },
            { title: 'Data Processing', sub: ['Spark', 'Hadoop', 'Kafka (Streaming)', 'Airflow (Orchestration)', 'dbt'] },
            { title: 'Cloud Platforms', sub: ['AWS Data Stack', 'Azure Data Factory', 'GCP Dataflow'] },
            { title: 'Data Modeling', sub: ['Star Schema & Snowflake Schema', 'Dimensional Modeling', 'Normalization vs Denormalization', 'Data Lake vs Warehouse'] },
            { title: 'Monitoring & Quality', sub: ['Data Quality Checks', 'Great Expectations', 'Lineage Tracking', 'Alerting & Logging'] },
        ]
    },
    {
        roadmapId: 'android', title: 'Android Developer', desc: 'Build mobile applications for the Android ecosystem.', type: 'role', isFresh: false,
        steps: [
            { title: 'Fundamentals', sub: ['Install Android Studio', 'Kotlin Basics', 'XML Layouts', 'Android Manifest'] },
            { title: 'Components', sub: ['Activities', 'Fragments', 'Intents', 'Services', 'Broadcast Receivers'] },
            { title: 'UI Design', sub: ['Material Design 3', 'Jetpack Compose (Modern UI)', 'RecyclerView', 'ConstraintLayout'] },
            { title: 'Data Storage', sub: ['Room Database', 'DataStore', 'SharedPreferences'] },
            { title: 'Networking', sub: ['Retrofit', 'OkHttp', 'Coroutines & Flow', 'JSON Parsing (Moshi/Gson)'] },
            { title: 'Architecture', sub: ['MVVM', 'MVI', 'Dependency Injection (Hilt/Dagger)'] },
        ]
    },
    {
        roadmapId: 'ios', title: 'iOS Developer', desc: 'Build mobile applications for the Apple ecosystem.', type: 'role', isFresh: false,
        steps: [
            { title: 'Fundamentals', sub: ['Xcode IDE', 'Swift Language Basics', 'CocoaPods / Swift Package Manager'] },
            { title: 'UI Frameworks', sub: ['SwiftUI (Declarative)', 'UIKit (Imperative)', 'Auto Layout', 'Storyboards'] },
            { title: 'Architecture', sub: ['MVC', 'MVVM', 'The Composable Architecture (TCA)'] },
            { title: 'Data & Networking', sub: ['Core Data', 'SwiftData', 'URLSession', 'Codable', 'Alamofire'] },
            { title: 'System Frameworks', sub: ['Combine', 'Core Location', 'Push Notifications', 'Background Tasks'] },
        ]
    },
    {
        roadmapId: 'postgresql', title: 'PostgreSQL DBA', desc: 'Master PostgreSQL database administration and optimization.', type: 'role', isFresh: false,
        steps: [
            { title: 'Basics', sub: ['Installation & Setup', 'psql CLI', 'Data Types', 'CRUD Operations'] },
            { title: 'Schema Design', sub: ['Tables & Constraints', 'Primary & Foreign Keys', 'Indexes', 'Views & Materialized Views'] },
            { title: 'Advanced SQL', sub: ['Window Functions', 'CTEs', 'Stored Procedures', 'Triggers', 'Full-Text Search'] },
            { title: 'Performance', sub: ['EXPLAIN ANALYZE', 'Index Optimization', 'Vacuuming & Autovacuum', 'Connection Pooling (PgBouncer)'] },
            { title: 'Administration', sub: ['Backup & Restore (pg_dump)', 'Replication', 'High Availability', 'Monitoring (pg_stat_*)'] },
        ]
    },
    {
        roadmapId: 'blockchain', title: 'Blockchain Developer', desc: 'Build decentralized applications and smart contracts.', type: 'role', isFresh: false,
        steps: [
            { title: 'Blockchain Fundamentals', sub: ['How Blockchain Works', 'Consensus Mechanisms (PoW, PoS)', 'Cryptography Basics', 'Wallets & Keys'] },
            { title: 'Ethereum', sub: ['Solidity Language', 'Smart Contracts', 'EVM (Ethereum Virtual Machine)', 'Gas & Fees'] },
            { title: 'Development Tools', sub: ['Hardhat / Foundry', 'Ethers.js / Web3.js', 'Metamask Integration', 'IPFS'] },
            { title: 'DeFi & NFTs', sub: ['ERC-20 Tokens', 'ERC-721 (NFTs)', 'Uniswap & Liquidity Pools', 'Yield Farming'] },
            { title: 'Security', sub: ['Common Vulnerabilities (Reentrancy, Flash Loans)', 'Auditing Smart Contracts', 'OpenZeppelin Library'] },
        ]
    },
    {
        roadmapId: 'qa', title: 'QA Engineer', desc: 'Ensure software quality through systematic testing.', type: 'role', isFresh: false,
        steps: [
            { title: 'Testing Fundamentals', sub: ['SDLC & Testing Phases', 'Test Plans & Test Cases', 'Bug Lifecycle', 'Testing Types (Functional, Non-functional)'] },
            { title: 'Manual Testing', sub: ['Black Box Testing', 'White Box Testing', 'Regression Testing', 'User Acceptance Testing (UAT)'] },
            { title: 'Automation', sub: ['Selenium WebDriver', 'Cypress', 'Playwright', 'API Testing (Postman, Rest Assured)'] },
            { title: 'Performance Testing', sub: ['JMeter', 'Load Testing', 'Stress Testing', 'Performance Metrics'] },
            { title: 'CI/CD Integration', sub: ['Jenkins Pipelines', 'GitHub Actions', 'Test Reporting', 'Allure Reports'] },
        ]
    },
    {
        roadmapId: 'software-architect', title: 'Software Architect', desc: 'Design scalable and maintainable software systems.', type: 'role', isFresh: false,
        steps: [
            { title: 'Architecture Patterns', sub: ['Monolithic', 'Microservices', 'Event-Driven', 'Serverless', 'CQRS & Event Sourcing'] },
            { title: 'Design Principles', sub: ['SOLID Principles', 'DRY, KISS, YAGNI', 'Domain-Driven Design (DDD)', 'Design Patterns (GoF)'] },
            { title: 'API Design', sub: ['RESTful API Best Practices', 'GraphQL Schema Design', 'gRPC', 'API Versioning', 'Rate Limiting'] },
            { title: 'Scalability', sub: ['Horizontal vs Vertical Scaling', 'Load Balancing', 'Caching Strategies', 'Database Sharding'] },
            { title: 'Cloud Architecture', sub: ['AWS Well-Architected Framework', 'Multi-Cloud Strategy', 'Serverless Architecture', 'Container Orchestration'] },
            { title: 'Documentation', sub: ['Architecture Decision Records (ADR)', 'C4 Model Diagrams', 'API Documentation', 'Runbooks'] },
        ]
    },
    {
        roadmapId: 'cyber-security', title: 'Cyber Security', desc: 'Protect systems, networks, and programs from digital attacks.', type: 'role', isFresh: false,
        steps: [
            { title: 'Fundamentals', sub: ['Networking (OSI Model, TCP/IP)', 'Linux/OS Basics', 'Programming (Python/Bash)'] },
            { title: 'Security Operations', sub: ['SIEM Tools', 'Incident Response', 'Threat Intelligence', 'Forensics'] },
            { title: 'Application Security', sub: ['OWASP Top 10', 'Web App Penetration Testing', 'Secure Coding Practices'] },
            { title: 'Network Security', sub: ['Firewalls', 'IDS/IPS', 'VPNs', 'Wireshark', 'Nmap'] },
            { title: 'Identity & Access', sub: ['Active Directory', 'IAM', 'Kerberos', 'Multi-Factor Authentication'] },
        ]
    },
    {
        roadmapId: 'ux-design', title: 'UX Designer', desc: 'Create meaningful and user-centered digital experiences.', type: 'role', isFresh: false,
        steps: [
            { title: 'Design Fundamentals', sub: ['Color Theory', 'Typography', 'Layout & Grids', 'Visual Hierarchy'] },
            { title: 'UX Research', sub: ['User Interviews', 'Usability Testing', 'Surveys & Analytics', 'Personas & Journey Maps'] },
            { title: 'Wireframing & Prototyping', sub: ['Sketching', 'Low-Fidelity Wireframes', 'High-Fidelity Prototypes', 'Interactive Prototypes in Figma'] },
            { title: 'Design Systems', sub: ['Component Libraries', 'Design Tokens', 'Accessibility (WCAG)', 'Storybook'] },
            { title: 'Tools', sub: ['Figma', 'Adobe XD', 'Maze (Testing)', 'Hotjar & FullStory'] },
        ]
    },
    {
        roadmapId: 'game-developer', title: 'Game Developer', desc: 'Build engaging games for PC, console, and mobile.', type: 'role', isFresh: false,
        steps: [
            { title: 'Programming Basics', sub: ['C# or C++', 'Object-Oriented Programming', 'Data Structures & Algorithms', 'Math for Games (Vectors, Matrices)'] },
            { title: 'Game Engine', sub: ['Unity (C#)', 'Unreal Engine (C++/Blueprints)', 'Godot (GDScript)', 'Game Loop & Update Cycle'] },
            { title: 'Game Physics', sub: ['Rigid Body Physics', 'Collision Detection', 'Raycasting', 'Physics Engine (PhysX, Box2D)'] },
            { title: 'Graphics', sub: ['2D Sprites & Animation', '3D Models & Rendering', 'Shaders (HLSL/GLSL)', 'Lighting & Shadows'] },
            { title: 'Game Design', sub: ['Game Mechanics', 'Level Design', 'UI/UX for Games', 'Monetization & Balancing'] },
            { title: 'Multiplayer', sub: ['Networking Fundamentals', 'Client-Server Architecture', 'Unity Netcode / Photon', 'Anti-Cheat Strategies'] },
        ]
    },
    {
        roadmapId: 'mlops', title: 'MLOps Engineer', desc: 'Operationalize machine learning models at scale.', type: 'role', isFresh: false,
        steps: [
            { title: 'Foundations', sub: ['Python & ML Basics', 'Linux & Shell Scripting', 'Docker & Kubernetes', 'Git & Version Control'] },
            { title: 'Model Development', sub: ['Experiment Tracking (MLflow)', 'Hyperparameter Tuning (Optuna)', 'Model Versioning', 'Feature Stores (Feast)'] },
            { title: 'CI/CD for ML', sub: ['GitHub Actions for ML', 'Automated Retraining Pipelines', 'Data Validation (Great Expectations)', 'Jenkins ML Pipelines'] },
            { title: 'Model Serving', sub: ['FastAPI / Flask Serving', 'TorchServe / TF Serving', 'BentoML', 'ONNX Runtime'] },
            { title: 'Monitoring', sub: ['Data Drift Detection', 'Model Performance Monitoring', 'Grafana Dashboards', 'Alerting & Logging'] },
        ]
    },
    {
        roadmapId: 'product-manager', title: 'Product Manager', desc: 'Drive product vision, strategy, and execution.', type: 'role', isFresh: false,
        steps: [
            { title: 'PM Fundamentals', sub: ['Product Lifecycle', 'Roadmapping', 'Prioritization Frameworks (RICE, MoSCoW)', 'OKRs & KPIs'] },
            { title: 'User Research', sub: ['User Interviews', 'Market Research', 'Competitive Analysis', 'Customer Empathy Mapping'] },
            { title: 'Agile & Scrum', sub: ['Sprint Planning', 'Backlog Grooming', 'Standups & Retrospectives', 'Kanban Boards'] },
            { title: 'Data & Analytics', sub: ['Product Metrics (DAU, Retention, Churn)', 'A/B Testing', 'Funnel Analysis', 'Google Analytics / Mixpanel'] },
            { title: 'Stakeholder Management', sub: ['Communication with Engineering', 'Exec Presentations', 'Go-to-Market Strategy', 'PRD Writing'] },
        ]
    },
    {
        roadmapId: 'engineering-manager', title: 'Engineering Manager', desc: 'Lead engineering teams to deliver impactful products.', type: 'role', isFresh: false,
        steps: [
            { title: 'Leadership', sub: ['1-on-1s & Mentorship', 'Giving & Receiving Feedback', 'Conflict Resolution', 'Career Development for ICs'] },
            { title: 'Technical Skills', sub: ['System Design Reviews', 'Code Review Culture', 'Technical Debt Management', 'Architecture Decisions'] },
            { title: 'Project Management', sub: ['Agile & Scrum', 'Estimation & Planning', 'Risk Management', 'Delivery & Milestones'] },
            { title: 'Team Building', sub: ['Hiring & Onboarding', 'Team Culture & Morale', 'Diversity & Inclusion', 'Remote Team Management'] },
            { title: 'Strategy', sub: ['Engineering OKRs', 'Roadmap Alignment with Product', 'Budget & Headcount Planning', 'Cross-functional Collaboration'] },
        ]
    },
    {
        roadmapId: 'devrel', title: 'Developer Relations', desc: 'Build and nurture the developer community around a product.', type: 'role', isFresh: false,
        steps: [
            { title: 'Foundations', sub: ['Understanding Developers as Users', 'Developer Experience (DX)', 'Community Platforms (Discord, Slack, GitHub)'] },
            { title: 'Content Creation', sub: ['Technical Blog Posts', 'Video Tutorials', 'Sample Apps & Demos', 'Documentation Writing'] },
            { title: 'Community Building', sub: ['Running Hackathons', 'Meetups & Conferences', 'Open Source Contributions', 'Developer Advocacy'] },
            { title: 'Technical Skills', sub: ['API Knowledge', 'SDKs & Integration', 'Live Coding & Demos', 'Public Speaking'] },
            { title: 'Metrics', sub: ['Community Growth', 'Developer Adoption', 'NPS for Developers', 'Content Engagement'] },
        ]
    },
    {
        roadmapId: 'bi-analyst', title: 'BI Analyst', desc: 'Transform raw data into actionable business intelligence.', type: 'role', isFresh: true,
        steps: [
            { title: 'Data Foundations', sub: ['SQL Mastery', 'Database Concepts', 'Data Warehousing (Snowflake, BigQuery)', 'ETL Basics'] },
            { title: 'BI Tools', sub: ['Tableau', 'Power BI (DAX, Power Query)', 'Looker / Looker Studio', 'Qlik Sense'] },
            { title: 'Data Visualization', sub: ['Chart Selection', 'Dashboard Design Principles', 'Storytelling with Data', 'KPI Design'] },
            { title: 'Analytics', sub: ['Descriptive Analytics', 'Diagnostic Analytics', 'Predictive Analytics Basics', 'Cohort Analysis'] },
            { title: 'Business Acumen', sub: ['Understanding Business KPIs', 'Finance Basics', 'Stakeholder Communication', 'Report Automation'] },
        ]
    },

    // ── SKILL BASED ────────────────────────────────────────────────────────────
    {
        roadmapId: 'computer-science', title: 'Computer Science', desc: 'Build a strong foundation in core computer science concepts.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Programming Fundamentals', sub: ['Variables & Data Types', 'Control Flow (if/else, loops)', 'Functions & Recursion', 'OOP Concepts'] },
            { title: 'Data Structures', sub: ['Arrays & Linked Lists', 'Stacks & Queues', 'Trees & Graphs', 'Hash Tables', 'Heaps'] },
            { title: 'Algorithms', sub: ['Sorting (Merge, Quick, Heap)', 'Searching (Binary Search)', 'Dynamic Programming', 'Greedy Algorithms', 'Graph Algorithms (BFS, DFS, Dijkstra)'] },
            { title: 'Computer Architecture', sub: ['CPU & Memory', 'Process vs Thread', 'Cache & Storage', 'Assembly Basics'] },
            { title: 'Operating Systems', sub: ['Process Management', 'Memory Management', 'File Systems', 'Concurrency & Synchronization'] },
            { title: 'Networking', sub: ['OSI Model', 'TCP/IP', 'HTTP/HTTPS', 'DNS & Routing'] },
        ]
    },
    {
        roadmapId: 'sql', title: 'SQL Master', desc: 'Manage and query relational databases efficiently.', type: 'skill', isFresh: true,
        steps: [
            { title: 'Fundamentals', sub: ['SELECT, FROM, WHERE', 'INSERT, UPDATE, DELETE', 'Data Types', 'Operators'] },
            { title: 'Filtering & Sorting', sub: ['LIKE', 'IN', 'BETWEEN', 'ORDER BY', 'LIMIT / TOP'] },
            { title: 'Joins', sub: ['INNER JOIN', 'LEFT/RIGHT JOIN', 'FULL OUTER JOIN', 'CROSS JOIN', 'Self Join'] },
            { title: 'Aggregation', sub: ['GROUP BY', 'HAVING', 'COUNT, SUM, AVG, MIN, MAX'] },
            { title: 'Advanced', sub: ['Subqueries', 'Common Table Expressions (CTEs)', 'Window Functions (RANK, ROW_NUMBER)', 'Stored Procedures', 'Triggers', 'Views'] },
            { title: 'Database Design', sub: ['Normalization (1NF, 2NF, 3NF)', 'Primary & Foreign Keys', 'Indexes (Clustered vs Non-Clustered)', 'Constraints'] },
        ]
    },
    {
        roadmapId: 'react', title: 'React Developer', desc: 'Master the most popular frontend library.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Fundamentals', sub: ['JSX Syntax', 'Functional Components', 'Props & State', 'Conditional Rendering', 'Lists & Keys'] },
            { title: 'Hooks', sub: ['useState', 'useEffect', 'useContext', 'useRef', 'useReducer', 'useCallback & useMemo', 'Custom Hooks'] },
            { title: 'Routing', sub: ['React Router v6', 'Dynamic Routes', 'Nested Routes', 'Protected Routes', 'Loaders & Actions'] },
            { title: 'State Management', sub: ['Context API', 'Redux Toolkit', 'Zustand', 'Jotai', 'Recoil'] },
            { title: 'Styling', sub: ['CSS Modules', 'Tailwind CSS', 'Styled Components', 'Emotion', 'Chakra UI / MUI'] },
            { title: 'Data Fetching', sub: ['Fetch API', 'Axios', 'React Query (TanStack Query)', 'SWR'] },
            { title: 'Advanced Patterns', sub: ['Higher Order Components (HOC)', 'Render Props', 'Compound Components', 'Portals', 'Error Boundaries'] },
            { title: 'Ecosystem', sub: ['Next.js (SSR/SSG)', 'Remix', 'React Hook Form', 'Storybook', 'Framer Motion'] },
        ]
    },
    {
        roadmapId: 'vue', title: 'Vue.js Developer', desc: 'Master the progressive JavaScript framework.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Fundamentals', sub: ['Vue Instance & Template Syntax', 'Data Binding (v-bind, v-model)', 'Directives (v-if, v-for)', 'Computed Properties & Watchers'] },
            { title: 'Components', sub: ['Single File Components', 'Props & Emits', 'Slots', 'Component Lifecycle Hooks', 'Provide & Inject'] },
            { title: 'Composition API', sub: ['setup()', 'ref() & reactive()', 'Composables', 'watchEffect & watch', 'defineExpose'] },
            { title: 'Routing', sub: ['Vue Router v4', 'Dynamic Routes', 'Navigation Guards', 'Lazy Loading Routes'] },
            { title: 'State Management', sub: ['Pinia (Recommended)', 'Vuex 4', 'Composable Stores'] },
            { title: 'Ecosystem', sub: ['Nuxt.js (SSR/SSG)', 'Vite + Vue', 'Vitest for Testing', 'VueUse Composables'] },
        ]
    },
    {
        roadmapId: 'angular', title: 'Angular Developer', desc: 'Build enterprise-grade web apps with Angular.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Fundamentals', sub: ['TypeScript Basics', 'Modules & Components', 'Templates & Data Binding', 'Directives & Pipes'] },
            { title: 'Components', sub: ['Component Lifecycle', 'Input/Output Decorators', 'ViewChild & ContentChild', 'Change Detection'] },
            { title: 'Services & DI', sub: ['Dependency Injection', 'Creating Services', 'Hierarchical Injectors', 'HTTP Client'] },
            { title: 'Routing', sub: ['Router Module', 'Lazy Loading', 'Route Guards (CanActivate)', 'Resolvers'] },
            { title: 'State Management', sub: ['NgRx (Redux for Angular)', 'Signals (Angular 16+)', 'RxJS Observables', 'BehaviorSubject'] },
            { title: 'Testing', sub: ['Unit Testing with Jasmine', 'TestBed', 'Component Testing', 'E2E with Cypress'] },
        ]
    },
    {
        roadmapId: 'javascript', title: 'JavaScript Mastery', desc: 'Master the language of the web from basics to advanced.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Fundamentals', sub: ['Variables (var, let, const)', 'Data Types & Operators', 'Control Flow', 'Functions & Scope', 'Arrays & Objects'] },
            { title: 'DOM Manipulation', sub: ['Selecting Elements', 'Event Listeners', 'Modifying DOM', 'Creating & Removing Elements', 'Forms'] },
            { title: 'Async JavaScript', sub: ['Callbacks', 'Promises', 'Async/Await', 'Error Handling', 'Fetch API'] },
            { title: 'ES6+ Features', sub: ['Arrow Functions', 'Destructuring', 'Spread & Rest', 'Modules (import/export)', 'Template Literals', 'Optional Chaining'] },
            { title: 'Advanced Concepts', sub: ['Closures', 'Prototypal Inheritance', 'Event Loop & Call Stack', 'WeakMap & WeakSet', 'Proxies & Reflect'] },
            { title: 'Tooling', sub: ['npm & Package Management', 'Babel & Transpiling', 'Webpack / Vite', 'ESLint & Prettier'] },
        ]
    },
    {
        roadmapId: 'typescript', title: 'TypeScript Mastery', desc: 'Add static typing to JavaScript for safer, scalable code.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Fundamentals', sub: ['Type Annotations', 'Primitive Types', 'Arrays & Tuples', 'Enums', 'Type Inference'] },
            { title: 'Functions & Objects', sub: ['Function Types', 'Optional & Default Params', 'Rest Params', 'Object Types & Interfaces'] },
            { title: 'Advanced Types', sub: ['Union & Intersection Types', 'Type Guards', 'Mapped Types', 'Conditional Types', 'Template Literal Types'] },
            { title: 'Generics', sub: ['Generic Functions', 'Generic Interfaces', 'Generic Constraints', 'Utility Types (Partial, Pick, Omit, Record)'] },
            { title: 'Classes & OOP', sub: ['Access Modifiers', 'Abstract Classes', 'Decorators', 'Mixins'] },
            { title: 'Configuration', sub: ['tsconfig.json', 'Strict Mode', 'Module Resolution', 'Declaration Files (.d.ts)'] },
        ]
    },
    {
        roadmapId: 'nodejs', title: 'Node.js Expert', desc: 'Build fast and scalable server-side applications with Node.js.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Fundamentals', sub: ['Event Loop', 'Modules (CommonJS & ESM)', 'File System (fs)', 'Streams & Buffers', 'Process & Environment'] },
            { title: 'HTTP & Express', sub: ['HTTP Module', 'Express.js Setup', 'Routing & Middleware', 'Request & Response', 'Error Handling'] },
            { title: 'Databases', sub: ['MongoDB with Mongoose', 'PostgreSQL with pg', 'Redis Caching', 'Query Builders (Knex, Drizzle)'] },
            { title: 'Authentication', sub: ['JWT (jsonwebtoken)', 'Session-based Auth', 'Passport.js', 'OAuth Strategies'] },
            { title: 'Performance', sub: ['Clustering', 'Worker Threads', 'PM2 Process Manager', 'Profiling & Debugging'] },
            { title: 'Testing', sub: ['Jest for Node', 'Supertest for HTTP', 'Mocking', 'Integration Tests'] },
        ]
    },
    {
        roadmapId: 'python', title: 'Python Developer', desc: 'Master the versatile language for Web, Data, and AI.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Basics', sub: ['Variables & Data Types', 'Lists, Tuples, Sets, Dictionaries', 'Conditionals & Loops', 'Functions & Scope'] },
            { title: 'Intermediate', sub: ['Object Oriented Programming (Classes)', 'Modules & Packages', 'Virtual Environments (venv, poetry)', 'File Handling', 'Exception Handling'] },
            { title: 'Advanced', sub: ['Decorators', 'Generators & Iterators', 'Context Managers (with statement)', 'Multithreading & Multiprocessing', 'Type Hinting'] },
            { title: 'Web Development', sub: ['Django (MVT, ORM)', 'Flask (Microframework)', 'FastAPI (Modern, Async)', 'Jinja2 Templates'] },
            { title: 'Data Science Stack', sub: ['NumPy (Arrays)', 'Pandas (Dataframes)', 'Matplotlib/Seaborn (Visualization)', 'Jupyter Notebooks'] },
            { title: 'Testing', sub: ['PyTest', 'Unittest', 'Mocking'] },
            { title: 'Packaging', sub: ['PyPI', 'Pip', 'Building Wheels'] },
        ]
    },
    {
        roadmapId: 'java', title: 'Java Developer', desc: 'Build enterprise-grade applications with Java.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Core Java', sub: ['Syntax & Data Types', 'OOP (Inheritance, Polymorphism)', 'Collections Framework', 'Streams & Lambdas', 'Exception Handling'] },
            { title: 'Build Tools', sub: ['Maven', 'Gradle', 'Dependency Management', 'Build Lifecycle'] },
            { title: 'Web Frameworks', sub: ['Spring Boot (DI, AOP)', 'Spring MVC', 'Jakarta EE', 'Hibernate (ORM)'] },
            { title: 'Database Access', sub: ['JDBC', 'JPA', 'Spring Data JPA', 'Liquibase / Flyway'] },
            { title: 'Testing', sub: ['JUnit 5', 'Mockito', 'AssertJ', 'Spring Boot Test'] },
            { title: 'Deployment', sub: ['Tomcat', 'Jetty', 'Dockerizing Java Apps', 'GraalVM Native Images'] },
        ]
    },
    {
        roadmapId: 'spring-boot', title: 'Spring Boot Expert', desc: 'Build production-ready Java microservices with Spring Boot.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Core Concepts', sub: ['Spring IoC & DI', 'Spring Beans & Scopes', 'Application Context', 'Auto-Configuration'] },
            { title: 'Web Layer', sub: ['REST Controllers', 'Request Mapping', 'Exception Handling (@ControllerAdvice)', 'Validation (Bean Validation)'] },
            { title: 'Data Layer', sub: ['Spring Data JPA', 'JPQL & Criteria API', 'Transactions (@Transactional)', 'Multiple DataSources'] },
            { title: 'Security', sub: ['Spring Security', 'JWT Authentication', 'OAuth2 / OIDC', 'Method Security (@PreAuthorize)'] },
            { title: 'Testing', sub: ['@SpringBootTest', 'MockMvc', 'Testcontainers', 'WireMock'] },
            { title: 'Production', sub: ['Actuator & Health Checks', 'Logging (Logback/Log4j2)', 'Profiles & Configuration', 'Docker & Kubernetes Deployment'] },
        ]
    },
    {
        roadmapId: 'go', title: 'Go (Golang) Developer', desc: 'Build fast and concurrent backend systems with Go.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Fundamentals', sub: ['Variables & Types', 'Functions & Multiple Returns', 'Structs & Interfaces', 'Pointers', 'Error Handling'] },
            { title: 'Concurrency', sub: ['Goroutines', 'Channels', 'Select Statement', 'Mutex & RWMutex', 'Context Package'] },
            { title: 'Web Development', sub: ['net/http Package', 'Gin Framework', 'Echo Framework', 'Middleware', 'REST API Design'] },
            { title: 'Data & Databases', sub: ['database/sql', 'GORM', 'Redis with go-redis', 'JSON Encoding/Decoding'] },
            { title: 'Testing', sub: ['testing Package', 'Table-driven Tests', 'Mocking with testify', 'Benchmarking'] },
            { title: 'Tooling', sub: ['Go Modules', 'gofmt & golint', 'Air (Live Reload)', 'Building & Cross-compilation'] },
        ]
    },
    {
        roadmapId: 'rust', title: 'Rust Developer', desc: 'Build safe and blazingly fast systems with Rust.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Fundamentals', sub: ['Ownership & Borrowing', 'Lifetimes', 'Variables & Data Types', 'Functions & Closures', 'Pattern Matching'] },
            { title: 'Data Structures', sub: ['Structs & Enums', 'Option & Result', 'Collections (Vec, HashMap)', 'Iterators'] },
            { title: 'Error Handling', sub: ['Result & Option Chaining', 'Custom Error Types', 'thiserror & anyhow', 'Propagation with ?'] },
            { title: 'Concurrency', sub: ['Threads (std::thread)', 'Arc & Mutex', 'Async/Await (Tokio)', 'Channels (mpsc)'] },
            { title: 'Web Development', sub: ['Actix-web', 'Axum', 'Diesel ORM', 'SQLx', 'Serde (Serialization)'] },
            { title: 'Advanced', sub: ['Macros', 'Unsafe Rust', 'FFI (Foreign Function Interface)', 'WebAssembly with Rust'] },
        ]
    },
    {
        roadmapId: 'cpp', title: 'C++ Developer', desc: 'Master high-performance systems programming with C++.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Fundamentals', sub: ['Syntax & Variables', 'Pointers & References', 'OOP (Classes, Inheritance)', 'Operator Overloading', 'Templates'] },
            { title: 'Memory Management', sub: ['Stack vs Heap', 'new & delete', 'Smart Pointers (unique_ptr, shared_ptr)', 'RAII Pattern'] },
            { title: 'STL', sub: ['Containers (vector, map, set)', 'Algorithms (sort, find, transform)', 'Iterators', 'String Manipulation'] },
            { title: 'Modern C++', sub: ['C++11/14/17/20 Features', 'Lambda Expressions', 'auto & decltype', 'Range-based for loops', 'Modules (C++20)'] },
            { title: 'Concurrency', sub: ['std::thread', 'std::mutex & locks', 'std::async & futures', 'Atomic Operations'] },
            { title: 'Build & Tools', sub: ['CMake', 'vcpkg Package Manager', 'GDB Debugging', 'Valgrind (Memory Analysis)'] },
        ]
    },
    {
        roadmapId: 'flutter', title: 'Flutter Developer', desc: 'Build beautiful cross-platform apps with Flutter & Dart.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Dart Language', sub: ['Variables & Types', 'Functions & Closures', 'OOP in Dart', 'Async & Futures', 'Null Safety'] },
            { title: 'Flutter Basics', sub: ['Widgets (Stateless & Stateful)', 'Widget Tree & BuildContext', 'Material & Cupertino Design', 'Layouts (Row, Column, Stack)'] },
            { title: 'State Management', sub: ['setState', 'Provider', 'Riverpod', 'Bloc / Cubit', 'GetX'] },
            { title: 'Navigation', sub: ['Navigator 1.0 & 2.0', 'Named Routes', 'GoRouter', 'Deep Linking'] },
            { title: 'Networking & Data', sub: ['HTTP with dio', 'REST API Integration', 'JSON Parsing', 'Local Storage (SharedPrefs, Hive)'] },
            { title: 'Deployment', sub: ['Android Build & Signing', 'iOS Build (Xcode)', 'Flutter Web', 'App Store & Play Store Publishing'] },
        ]
    },
    {
        roadmapId: 'graphql', title: 'GraphQL Expert', desc: 'Build flexible and efficient APIs with GraphQL.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Fundamentals', sub: ['Queries & Mutations', 'Subscriptions', 'Schema Definition Language (SDL)', 'Scalar & Custom Types'] },
            { title: 'Schema Design', sub: ['Types, Queries & Mutations', 'Input Types & Enums', 'Interfaces & Unions', 'Pagination Patterns'] },
            { title: 'Server Implementation', sub: ['Apollo Server', 'GraphQL Yoga', 'Resolvers & Context', 'DataLoader (Batching)'] },
            { title: 'Client', sub: ['Apollo Client', 'urql', 'Fragments', 'Caching Strategies'] },
            { title: 'Security & Performance', sub: ['Query Complexity Analysis', 'Depth Limiting', 'Persisted Queries', 'Rate Limiting'] },
        ]
    },
    {
        roadmapId: 'design-system', title: 'Design System', desc: 'Build scalable, consistent UI component libraries.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Foundations', sub: ['Design Tokens', 'Color Palette', 'Typography Scale', 'Spacing & Grid System', 'Iconography'] },
            { title: 'Components', sub: ['Atomic Design Methodology', 'Component API Design', 'Variants & States', 'Accessibility (WCAG)'] },
            { title: 'Documentation', sub: ['Storybook', 'Chromatic (Visual Testing)', 'Component Docs', 'Usage Guidelines'] },
            { title: 'CSS Architecture', sub: ['CSS Custom Properties', 'SASS Mixins & Variables', 'CSS Modules', 'Themed Components'] },
            { title: 'Tooling', sub: ['Figma Tokens', 'Style Dictionary', 'Semantic Versioning', 'Monorepo (Turborepo, Nx)'] },
        ]
    },
    {
        roadmapId: 'system-design', title: 'System Design', desc: 'Design scalable, reliable, and maintainable systems.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Fundamentals', sub: ['Client-Server Architecture', 'API Design (REST, GraphQL)', 'Database Choices (SQL vs NoSQL)', 'CAP Theorem'] },
            { title: 'Scalability', sub: ['Horizontal vs Vertical Scaling', 'Load Balancers (Round Robin, Least Connections)', 'Database Replication', 'Database Sharding'] },
            { title: 'Caching', sub: ['CDN (Content Delivery Network)', 'Application-level Cache (Redis)', 'Cache Invalidation Strategies', 'Write-through & Write-back'] },
            { title: 'Messaging', sub: ['Message Queues (Kafka, RabbitMQ)', 'Pub/Sub Pattern', 'Event-Driven Architecture', 'Saga Pattern'] },
            { title: 'Real-world Designs', sub: ['URL Shortener (TinyURL)', 'Rate Limiter', 'Notification System', 'Video Streaming (YouTube)', 'Ride-sharing (Uber)'] },
        ]
    },
    {
        roadmapId: 'docker', title: 'Docker Master', desc: 'Containerize applications with Docker.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Fundamentals', sub: ['What is a Container?', 'Images vs Containers', 'Docker Architecture', 'Docker Hub'] },
            { title: 'Core Commands', sub: ['docker build', 'docker run', 'docker push/pull', 'docker exec & logs', 'docker ps & inspect'] },
            { title: 'Dockerfile', sub: ['FROM, RUN, COPY, WORKDIR', 'Multi-stage Builds', 'Best Practices for Small Images', '.dockerignore'] },
            { title: 'Docker Compose', sub: ['docker-compose.yml', 'Services, Networks & Volumes', 'Health Checks', 'Profiles'] },
            { title: 'Networking & Volumes', sub: ['Bridge, Host & Overlay Networks', 'Named Volumes vs Bind Mounts', 'Secrets Management'] },
            { title: 'Production', sub: ['Docker in CI/CD', 'Security Scanning (Trivy)', 'Registry Setup', 'Resource Limits'] },
        ]
    },
    {
        roadmapId: 'kubernetes', title: 'Kubernetes Guru', desc: 'Orchestrate containerized workloads at scale.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Core Concepts', sub: ['Pods & Containers', 'Nodes & Clusters', 'Namespaces', 'kubectl CLI'] },
            { title: 'Workloads', sub: ['Deployments', 'StatefulSets', 'DaemonSets', 'Jobs & CronJobs', 'ReplicaSets'] },
            { title: 'Networking', sub: ['Services (ClusterIP, NodePort, LoadBalancer)', 'Ingress Controllers', 'DNS in Kubernetes', 'NetworkPolicies'] },
            { title: 'Configuration', sub: ['ConfigMaps', 'Secrets', 'Environment Variables', 'Resource Requests & Limits'] },
            { title: 'Storage', sub: ['Persistent Volumes (PV & PVC)', 'StorageClasses', 'Volume Types (emptyDir, hostPath, NFS)'] },
            { title: 'Advanced', sub: ['Helm Charts', 'RBAC', 'HPA & Cluster Autoscaler', 'Service Mesh (Istio)', 'ArgoCD (GitOps)'] },
        ]
    },
    {
        roadmapId: 'aws', title: 'AWS Architect', desc: 'Design and deploy scalable cloud solutions on AWS.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Core Services', sub: ['EC2 (Virtual Machines)', 'S3 (Object Storage)', 'VPC (Networking)', 'IAM (Identity & Access)'] },
            { title: 'Databases', sub: ['RDS (Managed SQL)', 'DynamoDB (NoSQL)', 'ElastiCache (Redis/Memcached)', 'Aurora Serverless'] },
            { title: 'Serverless', sub: ['AWS Lambda', 'API Gateway', 'Step Functions', 'EventBridge'] },
            { title: 'Containers', sub: ['ECS (Elastic Container Service)', 'EKS (Kubernetes)', 'ECR (Container Registry)', 'Fargate'] },
            { title: 'Monitoring & Security', sub: ['CloudWatch (Logs & Metrics)', 'CloudTrail (Audit)', 'AWS Shield & WAF', 'Secrets Manager'] },
            { title: 'Architecture Best Practices', sub: ['Well-Architected Framework', 'High Availability Design', 'Cost Optimization', 'Infrastructure as Code (CDK, CloudFormation)'] },
        ]
    },
    {
        roadmapId: 'mongodb', title: 'MongoDB Master', desc: 'Master document-based NoSQL database management.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Fundamentals', sub: ['Documents & Collections', 'BSON vs JSON', 'CRUD Operations', 'MongoDB Shell & Compass'] },
            { title: 'Schema Design', sub: ['Embedding vs Referencing', 'One-to-Many Relationships', 'Many-to-Many Patterns', 'Schema Validation'] },
            { title: 'Querying', sub: ['Find & Filter', 'Aggregation Pipeline', '$match, $group, $project, $lookup', 'Sorting & Pagination'] },
            { title: 'Indexing', sub: ['Single Field Indexes', 'Compound Indexes', 'Text Indexes', 'Geospatial Indexes', 'Explain Plans'] },
            { title: 'Production', sub: ['Replication & Replica Sets', 'Sharding', 'Transactions (ACID)', 'Atlas Cloud Setup', 'Security & Auth'] },
        ]
    },
    {
        roadmapId: 'linux', title: 'Linux Mastery', desc: 'Master the Linux operating system for development and administration.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Basics', sub: ['File System Hierarchy', 'Basic Commands (ls, cd, cp, mv, rm)', 'File Permissions (chmod, chown)', 'Text Editors (vim, nano)'] },
            { title: 'Shell Scripting', sub: ['Bash Scripting Basics', 'Variables & Conditionals', 'Loops & Functions', 'Cron Jobs', 'Process Substitution'] },
            { title: 'Networking', sub: ['ifconfig & ip commands', 'netstat & ss', 'SSH & SCP', 'Firewall (ufw, iptables)', 'nmap & curl'] },
            { title: 'System Administration', sub: ['Process Management (ps, top, kill)', 'Systemd & Services', 'User & Group Management', 'Package Managers (apt, yum, dnf)'] },
            { title: 'Advanced', sub: ['LVM & Disk Management', 'Kernel Tuning', 'Performance Monitoring', 'Docker on Linux', 'SELinux & AppArmor'] },
        ]
    },
    {
        roadmapId: 'git-github', title: 'Git & GitHub', desc: 'Master version control and collaborative development.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Git Basics', sub: ['git init, add, commit', 'Working Directory, Staging, Repository', 'git log & history', 'git diff & status'] },
            { title: 'Branching', sub: ['git branch', 'git checkout & switch', 'git merge', 'git rebase', 'Conflict Resolution'] },
            { title: 'Remote Repositories', sub: ['git remote', 'git push, pull, fetch', 'Tracking Branches', 'Forking & Cloning'] },
            { title: 'GitHub Features', sub: ['Pull Requests', 'Code Reviews', 'Issues & Projects', 'GitHub Actions (CI/CD)', 'GitHub Pages'] },
            { title: 'Advanced Git', sub: ['git stash', 'git cherry-pick', 'git bisect', 'git reflog', 'Hooks & Aliases', 'Monorepo Strategies'] },
        ]
    },
    {
        roadmapId: 'terraform', title: 'Terraform Expert', desc: 'Provision and manage infrastructure as code.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Fundamentals', sub: ['What is IaC?', 'Terraform Architecture', 'Providers & Resources', 'terraform init, plan, apply, destroy'] },
            { title: 'Configuration', sub: ['HCL Syntax', 'Variables & Outputs', 'Locals', 'Data Sources', 'Expressions & Functions'] },
            { title: 'State Management', sub: ['Local vs Remote State', 'S3 Backend', 'State Locking (DynamoDB)', 'terraform import & state mv'] },
            { title: 'Modules', sub: ['Creating Modules', 'Module Sources', 'Module Versioning', 'Public Registry Modules'] },
            { title: 'Advanced', sub: ['Workspaces', 'Provisioners', 'Dynamic Blocks', 'for_each & count', 'Terraform Cloud'] },
        ]
    },
    {
        roadmapId: 'redis', title: 'Redis Expert', desc: 'Master in-memory data structures for caching and real-time apps.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Fundamentals', sub: ['What is Redis?', 'Key-Value Store Basics', 'redis-cli', 'TTL & Expiration', 'Persistence (RDB, AOF)'] },
            { title: 'Data Structures', sub: ['Strings', 'Lists', 'Sets & Sorted Sets', 'Hashes', 'Geospatial', 'Streams'] },
            { title: 'Caching Patterns', sub: ['Cache-Aside', 'Write-through', 'Write-behind', 'Read-through', 'Cache Stampede Prevention'] },
            { title: 'Pub/Sub & Messaging', sub: ['SUBSCRIBE & PUBLISH', 'Redis Streams', 'Consumer Groups', 'Real-time Leaderboards'] },
            { title: 'Production', sub: ['Redis Cluster', 'Sentinel (High Availability)', 'Redis Modules (RedisJSON, RediSearch)', 'Security & ACLs'] },
        ]
    },
    {
        roadmapId: 'datastructures', title: 'DSA Mastery', desc: 'Master data structures and algorithms for technical interviews.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Arrays & Strings', sub: ['Two Pointers', 'Sliding Window', 'Prefix Sums', 'Sorting Algorithms', 'Binary Search'] },
            { title: 'Linked Lists', sub: ['Singly & Doubly Linked Lists', 'Fast & Slow Pointers', 'Reversal Techniques', 'Merge Sorted Lists'] },
            { title: 'Stacks & Queues', sub: ['Stack Implementation', 'Monotonic Stack', 'Queue & Deque', 'BFS using Queue'] },
            { title: 'Trees & Graphs', sub: ['Binary Trees (DFS, BFS)', 'Binary Search Trees', 'Tries', 'Graph Representation', 'DFS/BFS on Graphs', 'Dijkstra & Bellman-Ford'] },
            { title: 'Dynamic Programming', sub: ['Memoization vs Tabulation', '1D DP (Fibonacci, Coin Change)', '2D DP (Grid, Knapsack)', 'LCS & LIS'] },
            { title: 'Advanced Topics', sub: ['Heaps & Priority Queues', 'Union-Find (Disjoint Set)', 'Segment Trees', 'Bit Manipulation'] },
        ]
    },
    {
        roadmapId: 'prompt-engineering', title: 'Prompt Engineering', desc: 'Master the art of communicating with AI language models.', type: 'skill', isFresh: false,
        steps: [
            { title: 'LLM Fundamentals', sub: ['How LLMs Work (Transformers)', 'Tokens & Context Window', 'Temperature & Top-p', 'Model Capabilities & Limitations'] },
            { title: 'Prompting Basics', sub: ['Zero-shot Prompting', 'Few-shot Prompting', 'Role Prompting', 'Instruction Following'] },
            { title: 'Advanced Techniques', sub: ['Chain-of-Thought (CoT)', 'Tree of Thoughts (ToT)', 'ReAct (Reason + Act)', 'Self-Consistency'] },
            { title: 'Structured Outputs', sub: ['JSON Mode', 'Function Calling', 'Output Parsing', 'Grammar-constrained Generation'] },
            { title: 'AI Agents', sub: ['Agent Architectures', 'Tool Use & APIs', 'Memory Systems (Short-term, Long-term)', 'Multi-agent Frameworks (LangGraph, CrewAI)'] },
        ]
    },
    {
        roadmapId: 'nextjs', title: 'Next.js Developer', desc: 'Build production-ready React applications with Next.js.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Fundamentals', sub: ['App Router vs Pages Router', 'File-based Routing', 'Layouts & Templates', 'Loading & Error States'] },
            { title: 'Data Fetching', sub: ['Server Components', 'fetch() in Next.js', 'generateStaticParams (SSG)', 'Incremental Static Regeneration (ISR)', 'Route Handlers (API Routes)'] },
            { title: 'Rendering', sub: ['Static Site Generation (SSG)', 'Server-Side Rendering (SSR)', 'Client Components (use client)', 'Streaming with Suspense'] },
            { title: 'Styling & Assets', sub: ['CSS Modules', 'Tailwind CSS', 'next/image (Optimization)', 'next/font (Google Fonts)', 'next/link'] },
            { title: 'Deployment', sub: ['Vercel Deployment', 'Environment Variables', 'Middleware', 'Edge Runtime', 'Self-hosting'] },
        ]
    },
    {
        roadmapId: 'html', title: 'HTML Mastery', desc: 'Master the structure and semantics of the web.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Fundamentals', sub: ['Document Structure (DOCTYPE, html, head, body)', 'Text Elements (h1-h6, p, span, div)', 'Links & Images', 'Lists (ul, ol, dl)', 'Comments'] },
            { title: 'Semantic HTML', sub: ['header, nav, main, section, article', 'footer, aside, figure, figcaption', 'Why Semantics Matter (SEO & Accessibility)', 'Landmarks & ARIA Roles'] },
            { title: 'Forms', sub: ['Input Types (text, email, password, number)', 'Checkboxes, Radios, Selects', 'Form Validation (required, pattern)', 'Fieldset & Legend', 'File Uploads'] },
            { title: 'Tables', sub: ['table, thead, tbody, tr, th, td', 'Colspan & Rowspan', 'Accessible Tables (scope, caption)'] },
            { title: 'Multimedia', sub: ['video & audio tags', 'Responsive Images (srcset)', 'iframes', 'SVG Basics', 'Canvas Element'] },
            { title: 'Accessibility', sub: ['ARIA Labels & Descriptions', 'Tab Order & Focus', 'Screen Reader Compatibility', 'Color Contrast', 'WCAG Guidelines'] },
        ]
    },
    {
        roadmapId: 'css', title: 'CSS Mastery', desc: 'Master styling and layout for modern web design.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Fundamentals', sub: ['Selectors & Specificity', 'Box Model (margin, padding, border)', 'Cascade & Inheritance', 'Units (px, em, rem, %, vw/vh)'] },
            { title: 'Layouts', sub: ['Flexbox', 'CSS Grid', 'Positioning (relative, absolute, fixed, sticky)', 'Multi-column Layout'] },
            { title: 'Responsive Design', sub: ['Media Queries', 'Mobile-First Approach', 'Fluid Typography (clamp)', 'Container Queries'] },
            { title: 'Visual Design', sub: ['Colors & Gradients', 'Typography & Web Fonts', 'Shadows (box-shadow, text-shadow)', 'Filters & Blend Modes'] },
            { title: 'Animations', sub: ['Transitions', 'Keyframe Animations (@keyframes)', 'Transform (translate, rotate, scale)', 'CSS Variables (Custom Properties)', 'will-change'] },
            { title: 'Architecture', sub: ['BEM Methodology', 'SASS/SCSS', 'CSS Modules', 'Tailwind CSS', 'Component Styling Patterns'] },
        ]
    },
    {
        roadmapId: 'kotlin', title: 'Kotlin Developer', desc: 'Build modern Android and JVM applications with Kotlin.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Fundamentals', sub: ['Variables (val vs var)', 'Null Safety', 'Data Classes', 'Sealed Classes', 'Object & Companion Object'] },
            { title: 'Functions & Lambdas', sub: ['Extension Functions', 'Higher-order Functions', 'Lambdas & Closures', 'Inline Functions', 'Operator Overloading'] },
            { title: 'Collections', sub: ['List, Set, Map', 'Filter, Map, Reduce', 'Sequences', 'Destructuring Declarations'] },
            { title: 'Coroutines', sub: ['Coroutine Basics', 'launch & async', 'Dispatchers', 'Flow (Cold Streams)', 'StateFlow & SharedFlow'] },
            { title: 'Android Specific', sub: ['ViewModel & LiveData', 'Jetpack Compose Basics', 'Hilt (Dependency Injection)', 'Room Database with Kotlin'] },
        ]
    },
    {
        roadmapId: 'swift', title: 'Swift Developer', desc: 'Build native Apple platform apps with Swift.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Fundamentals', sub: ['Variables & Constants', 'Optionals & Unwrapping', 'Enums with Associated Values', 'Structs vs Classes', 'Protocols'] },
            { title: 'Functional Swift', sub: ['Closures', 'Higher-order Functions (map, filter, reduce)', 'Generics', 'Result Type', 'Property Wrappers'] },
            { title: 'SwiftUI', sub: ['Views & Modifiers', 'State & Binding', 'ObservableObject & @StateObject', 'NavigationStack', 'Animations in SwiftUI'] },
            { title: 'Concurrency', sub: ['async/await', 'Actors', 'Task & TaskGroup', 'Combine Framework'] },
            { title: 'Networking & Data', sub: ['URLSession with async/await', 'Codable & JSONDecoder', 'Core Data', 'SwiftData', 'CloudKit'] },
        ]
    },
    {
        roadmapId: 'laravel', title: 'Laravel Developer', desc: 'Build elegant PHP web applications with Laravel.', type: 'skill', isFresh: false,
        steps: [
            { title: 'Fundamentals', sub: ['MVC Architecture', 'Routing & Controllers', 'Blade Templates', 'Artisan CLI', 'Service Container & DI'] },
            { title: 'Eloquent ORM', sub: ['Models & Migrations', 'Relationships (hasMany, belongsTo)', 'Query Builder', 'Scopes & Accessors', 'Eager Loading'] },
            { title: 'Authentication', sub: ['Laravel Breeze / Jetstream', 'Sanctum (API Auth)', 'Passport (OAuth)', 'Policies & Gates'] },
            { title: 'Advanced Features', sub: ['Queues & Jobs', 'Events & Listeners', 'Broadcasting (WebSockets)', 'Notifications', 'Task Scheduling'] },
            { title: 'Testing & Deployment', sub: ['PHPUnit & Feature Tests', 'Laravel Dusk (Browser Tests)', 'Horizon (Queue Monitoring)', 'Forge & Vapor Deployment'] },
        ]
    },
    {
        roadmapId: 'wordpress', title: 'WordPress Developer', desc: 'Build and customize websites with WordPress.', type: 'skill', isFresh: true,
        steps: [
            { title: 'Fundamentals', sub: ['WordPress Architecture', 'Installation & Setup', 'Dashboard Overview', 'Posts vs Pages', 'Plugins & Themes'] },
            { title: 'Theme Development', sub: ['Theme Files Structure', 'Template Hierarchy', 'functions.php', 'Block Themes (FSE)', 'Gutenberg Blocks'] },
            { title: 'Plugin Development', sub: ['Plugin File Structure', 'Hooks (Actions & Filters)', 'Shortcodes', 'Custom Post Types & Taxonomies', 'REST API with WordPress'] },
            { title: 'Advanced', sub: ['Child Themes', 'WP_Query & Custom Queries', 'Multisite', 'Internationalization (i18n)', 'Performance Optimization'] },
            { title: 'WooCommerce', sub: ['Product Types', 'Payment Gateways', 'Order Management', 'Custom WooCommerce Extensions'] },
        ]
    },

    // ── BEST PRACTICES ─────────────────────────────────────────────────────────
    { roadmapId: 'api-security', title: 'API Security', desc: 'Safe API Design', type: 'best' },
    { roadmapId: 'frontend-perf', title: 'Frontend Performance', desc: 'Speed & Vitals', type: 'best' },
    { roadmapId: 'code-review', title: 'Code Review', desc: 'Review Guidelines', type: 'best' },
];

const seedDB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careerlens';
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing roadmaps
        await Roadmap.deleteMany({});
        console.log('Cleared existing roadmaps.');

        // Insert new ones
        await Roadmap.insertMany(roadmaps);
        console.log('Successfully seeded roadmaps!');

        mongoose.connection.close();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
