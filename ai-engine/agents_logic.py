import random

class CareerAgents:
    @staticmethod
    async def get_interviewer_question(domain: str, history: list):
        # AI INTELLIGENCE: Topic State Machine for "Human-like" interviewing
        # We categorize questions by 'difficulty' and 'topic'
        ALLOWED_DOMAINS = ["frontend", "backend", "general", "cybersecurity", "datascience"]
        topic_pool = {
            "frontend": {
                "performance": [
                    {"q": "How do you optimize a React application?", "level": 1},
                    {"q": "Explain the reconciliation algorithm in React and how it relates to performance.", "level": 2},
                    {"q": "How would you handle performance bottlenecks in a list with 10,000 items without using external libraries?", "level": 3},
                    {"q": "Describe your strategy for reducing First Contentful Paint (FCP) in a media-heavy Next.js app.", "level": 2},
                    {"q": "How do you implement code-splitting at the component level versus the route level?", "level": 2}
                ],
                "state": [
                    {"q": "How would you handle global state management?", "level": 1},
                    {"q": "What are the trade-offs between Context API and dedicated libraries like Redux or Zustand?", "level": 2},
                    {"q": "Describe a scenario where using Redux would actually be a 'bad' architectural choice.", "level": 3},
                    {"q": "Explain the concept of 'State Staleness' in React hooks and how to prevent it.", "level": 3}
                ],
                "security": [
                    {"q": "How do you prevent XSS attacks in a React application?", "level": 1},
                    {"q": "Explain the implementation of Content Security Policy (CSP) headers for a modern SPA.", "level": 2},
                    {"q": "What is 'Clickjacking', and how do you protect a sensitive dashboard from it?", "level": 3}
                ],
                "ux_behavioral": {
                    "scenarios": [
                        "A stakeholder wants to push a feature that clearly violates accessibility standards. How do you handle this conflict?",
                        "Your app is slow in production for 5% of users in low-bandwidth regions. What is your investigative process?"
                    ]
                }
            },
            "backend": {
                "databases": [
                    {"q": "Explain SQL vs NoSQL for a career platform.", "level": 1},
                    {"q": "How do you handle database indexing for frequently searched fields like 'Job Skills'?", "level": 2},
                    {"q": "Explain how you would implement a distributed lock mechanism in a database.", "level": 3},
                    {"q": "How do you handle 'N+1' query problems in an ORM like Mongoose or Sequelize?", "level": 2}
                ],
                "security": [
                    {"q": "How do you prevent SQL injection?", "level": 1},
                    {"q": "Explain the OAuth2.0 flow and how you'd secure a public API.", "level": 2},
                    {"q": "How do you protect against sophisticated Replay Attacks in a stateless architecture?", "level": 3}
                ],
                "system_design": [
                    {"q": "How would you design a rate-limiting service that handles 1 million requests per second?", "level": 3},
                    {"q": "Explain the CAP theorem and how it influences your choice of a distributed data store.", "level": 2}
                ],
                "devops_behavioral": {
                    "scenarios": [
                        "A critical production database is under a DDoS attack. Walk me through your immediate 15-minute response plan.",
                        "You discover a massive data leak caused by a 3rd party library. How do you communicate this to the CTO?"
                    ]
                }
            },
            "cybersecurity": {
                "networking": [
                    {"q": "Explain the difference between Symmetric and Asymmetric encryption with real-world use cases.", "level": 1},
                    {"q": "How does a Man-in-the-Middle (MitM) attack work on a public WiFi, and how can HSTS prevent it?", "level": 2}
                ],
                "pentesting": [
                    {"q": "What is the difference between an 'Exploit' and a 'Payload' in the context of Metasploit?", "level": 2},
                    {"q": "Walk me through your process for privilege escalation after gaining initial access to a Linux server.", "level": 3}
                ]
            },
            "datascience": {
                "modeling": [
                    {"q": "What is the difference between L1 and L2 regularization? When would you use each?", "level": 2},
                    {"q": "Explain the 'Bias-Variance Tradeoff' in the context of a model that is over-performing on training data.", "level": 1}
                ],
                "infrastructure": [
                    {"q": "How do you deploy a machine learning model as a scalable REST API using FastAPI and Docker?", "level": 2},
                    {"q": "Explain the concept of 'Data Drift' and how you monitor it in a production pipeline.", "level": 3}
                ]
            },
            "android": {
                "core": [
                    {"q": "Explain the activity lifecycle in Android.", "level": 1},
                    {"q": "What is the difference between an Intent and a Bundle?", "level": 1},
                    {"q": "How does the Jetpack Compose re-composition process work?", "level": 2}
                ],
                "architecture": [
                    {"q": "Explain MVVM architecture in the context of Android development.", "level": 2},
                    {"q": "How would you handle background processing using WorkManager versus Coroutines?", "level": 3}
                ]
            },
            "ios": {
                "swift": [
                    {"q": "What are Optionals in Swift and how do you unwrap them safely?", "level": 1},
                    {"q": "Explain the difference between 'struct' and 'class' in Swift.", "level": 1},
                    {"q": "How does Automatic Reference Counting (ARC) work in iOS?", "level": 2}
                ],
                "ui": [
                    {"q": "Compare UIKit and SwiftUI. In what scenario would you choose one over the other?", "level": 2},
                    {"q": "How do you handle safe area insets in a complex UI layout?", "level": 2}
                ]
            },
            "blockchain": {
                "smart_contracts": [
                    {"q": "What is GAS in Etherium and how is it calculated?", "level": 1},
                    {"q": "Explain the difference between PoW and PoS consensus mechanisms.", "level": 2},
                    {"q": "How do you prevent Reentrancy attacks in a Solidity smart contract?", "level": 3}
                ]
            },
            "firm_level": {
                "architecture": [
                    {"q": "How would you design a scalable system that can handle 10,000 concurrent users?", "level": 3},
                    {"q": "Explain the trade-offs between consistency and availability in a distributed system.", "level": 2},
                    {"q": "How do you approach database sharding for an application with global users?", "level": 3}
                ],
                "behavioral": [
                    {"q": "Tell me about a time you had to make a difficult technical decision with partial information.", "level": 2},
                    {"q": "How do you handle conflicts between product requirements and technical debt?", "level": 2}
                ],
                "leadership": [
                    {"q": "How do you mentor junior developers or promote best practices in a team?", "level": 2},
                    {"q": "Describe your process for conducting a high-impact code review.", "level": 1}
                ]
            },
            "case_studies": {
                "frontend": "A high-traffic e-commerce site is experiencing 'Jank' on mobile during the checkout flow. The CPU profile shows heavy scripting tasks. How do you isolate the component responsible and what architectural changes would you propose?",
                "backend": "You are migrating a monolithic user service to microservices. Halfway through, you notice data inconsistency between the old SQL DB and the new NoSQL store. How do you resolve this with zero downtime?",
                "security": "A zero-day vulnerability is discovered in the 'OpenSSL' library used by your entire infrastructure. You have 200 microservices. How do you coordinate a rapid patch without taking the system offline?",
                "datascience": "Your recommendation model has started showing a bias towards a specific demographic, leading to legal concerns. Path trace why this is happening and propose a 'Fairness-by-Design' fix.",
                "firm_level": "Our platform is expanding to 10 new countries next month. Our current single-region infrastructure won't handle the latency. Walk me through your global expansion blueprint including DNS, Data residency, and Edge caching."
            },
            "general": {
                "leadership": ["How do you handle a team member who is consistently underperforming?", "Describe a time you lead a project with ambiguous requirements."],
                "growth": ["How do you stay up to date with the rapidly changing landscape of your chosen field?", "What is one technical skill you've struggled with and how did you overcome it?"],
                "hobbies": ["Tell me about your hobbies outside of work.", "Does your hobby influence how you approach problem-solving?"]
            }
        }

        # Normalize domain
        # Normalize domain
        domain_lower = domain.lower()
        if "top" in domain_lower or "company" in domain_lower:
            dk = "firm_level"
        elif "front" in domain_lower:
            dk = "frontend"
        elif "back" in domain_lower:
            dk = "backend"
        elif "android" in domain_lower:
            dk = "android"
        elif "ios" in domain_lower:
            dk = "ios"
        elif "block" in domain_lower:
            dk = "blockchain"
        elif "cyber" in domain_lower or "security" in domain_lower:
            dk = "cybersecurity"
        elif "data" in domain_lower:
            dk = "datascience"
        else:
            dk = "general"
        
        # Validation
        ALLOWED_DOMAINS = list(topic_pool.keys())
        if dk not in ALLOWED_DOMAINS:
            dk = "general"
            
        domain_topics = topic_pool.get(dk, topic_pool["general"])
        
        # 1. State Tracking: What have we asked?
        asked_q_texts = [m.lower() for m in history]
        num_user_msgs = len([m for m in history if "|||" not in m]) # Simplistic count

        # 2. Context Extraction & Personalized Greeting
        if not history:
            if dk == "firm_level":
                return f"Welcome to the {domain} screening. This is a FAANG-style comprehensive evaluation designed to assess your architecture, leadership, and systemic thinking skills. To begin, please introduce yourself and your career highlights."
            return f"Hello! I am your AI interviewer for the {domain} position. To get started, could you please tell me your name and a bit about your background?"

        last_resp = history[-1].lower()
        
        # Personalized Greeting / Name Recognition
        if len(history) <= 2:
            name_indicators = ["i am ", "my name is ", "this is ", "it's ", "i'm "]
            user_name = None
            for indicator in name_indicators:
                if indicator in last_resp:
                    user_name = last_resp.split(indicator)[-1].strip().split()[0].capitalize()
                    break
            
            if user_name:
                return f"Pleasure to meet you, {user_name}. Let's dive into the technical side. To start, {random.choice(domain_topics.get('performance', [{'q': 'how do you approach problem solving?'}])[0]['q'] if isinstance(domain_topics.get('performance'), list) else ['how do you approach problem solving?'])}"
            elif "hello" in last_resp or "hi" in last_resp:
                 return "Hello! Let's get started. What field of study or professional area do you specialize in within this domain?"

        # 3. Collaborative Acknowledgement & Follow-up
        acknowledgements = [
            "That's a solid explanation. ",
            "I see your point on that. ",
            "Interesting perspective. ",
            "Clear and concise. ",
            "Great, let's build on that. "
        ]
        prefix = random.choice(acknowledgements) if random.random() > 0.3 else ""

        # Semantic Linkage for Follow-ups
        if any(word in last_resp for word in ["hobby", "passion", "coding", "practice"]):
            if "platform" not in asked_q_texts:
                return prefix + "Since you mentioned your passion for coding, which platforms or open-source projects have you contributed to recently?"
        
        if any(word in last_resp for word in ["optimiz", "perf", "slow", "bottleneck"]):
            return prefix + "Interesting point on performance. How do you measure these optimizations? Do you use specialized profiling tools like Lighthouse or Chrome DevTools?"

        if "security" in last_resp or "vulnerab" in last_resp:
            return prefix + "You mentioned security. How do you balance the trade-off between strict security protocols and developer velocity?"

        # Trigger Behavioral Scenarios if technical talk is too abstract or user provided a good answer
        if len(history) > 6 and random.random() > 0.6:
            behavioral_cat = f"{dk}_behavioral"
            if behavioral_cat in domain_topics:
                scenario = random.choice(domain_topics[behavioral_cat]["scenarios"])
                if scenario.lower() not in asked_q_texts:
                    return prefix + f"Let's move to a scenario: {scenario}"

        # 3. Topic Depth vs Breadth Logic
        for topic, q_list in domain_topics.items():
            if isinstance(q_list, dict) and "scenarios" in q_list:
                continue # Handled by behavioral trigger
            
            if isinstance(q_list[0], dict):
                # Check if we already started this topic
                topic_asked = [q for q in q_list if q["q"].lower() in asked_q_texts]
                if topic_asked:
                    # Topic started, try to go deeper (Level 1 -> 2 -> 3)
                    max_lvl = max(q["level"] for q in topic_asked)
                    
                    # If we finished Level 3, trigger a Case Study for that Domain
                    if max_lvl >= 3:
                        case_study = topic_pool.get("case_studies", {}).get(dk)
                        if case_study and case_study.lower() not in asked_q_texts:
                            return f"Excellent depth on those topics. Let's move to a Real-World Case Study: {case_study}"
                    
                    next_lvl_qs = [q["q"] for q in q_list if q["level"] == max_lvl + 1 and q["q"].lower() not in asked_q_texts]
                    if next_lvl_qs:
                        return random.choice(next_lvl_qs)
                    # If topic fully explored, loop will move to next topic (Topic Switching)
                    continue
                else:
                    # Start new topic at Level 1
                    lvl1_qs = [q["q"] for q in q_list if q["level"] == 1]
                    if lvl1_qs:
                        return random.choice(lvl1_qs)
            else:
                # Handle simple list (general topics)
                for q in q_list:
                    if q.lower() not in asked_q_texts:
                        return q

        return "We have covered a lot of technical ground! Finally, how do you handle high-pressure deadlines in a production environment?"

    @staticmethod
    async def run_deep_analysis(transcript: list, domain: str):
        # 1. Topic-Specific Technical Keywords (Real-World High Density)
        tech_dictionary = {
            "frontend": [
                "react", "component", "state", "props", "hook", "useeffect", "usestate", "virtual dom", "reconciliation",
                "performance", "optimization", "bundling", "vite", "webpack", "css", "flexbox", "grid", "responsive",
                "accessibility", "aria", "redux", "zustand", "context api", "memorization", "usememo", "usecallback",
                "next.js", "ssr", "static site generation", "lighthouse", "fcp", "lcp", "cls", "hydration", "code splitting"
            ],
            "backend": [
                "node", "express", "middleware", "api", "rest", "endpoint", "database", "sql", "nosql", "mongodb",
                "indexing", "authentication", "jwt", "oauth", "scalability", "caching", "redis", "docker", "microservices",
                "containerization", "kubernetes", "distribute", "load balancer", "n+1", "aggregation", "pipeline", "stateless"
            ],
            "cybersecurity": [
                "encryption", "symmetric", "asymmetric", "hsts", "mitm", "metasploit", "exploit", "payload", "privilege",
                "escalation", "firewall", "ids", "ips", "penetration", "zero-day", "brute force", "xss", "csrf", "sqli"
            ],
            "datascience": [
                "regularization", "l1", "l2", "bias", "variance", "docker", "fastapi", "deployment", "drift", "monitoring",
                "regression", "classification", "neural network", "transformer", "overfitting", "underfitting", "sampling"
            ],
            "general": ["experience", "challenge", "problem", "solution", "team", "collaboration", "leadership", "communication", "growth", "learning", "agile", "scrum", "deadline", "stakeholder"]
        }

        # Determine domain key
        dk = "frontend" if "front" in domain.lower() else "backend" if "back" in domain.lower() else "general"
        required_keywords = tech_dictionary.get(dk, tech_dictionary["general"])

        # 2. Extract User Content
        user_msgs = [m["content"].lower() for m in transcript if m["role"] == "user"]
        all_user_text = " ".join(user_msgs)
        
        total_words = len(all_user_text.split())
        num_user_msgs = len(user_msgs)
        avg_length = total_words / num_user_msgs if num_user_msgs > 0 else 0

        # 3. Technical Accuracy Heuristic (Keyword Matching)
        matched_keywords = [word for word in required_keywords if word in all_user_text]
        keyword_density = len(matched_keywords) / len(required_keywords) if required_keywords else 0
        
        # Penalize short answers even if keywords match (lack of explanation)
        # Penalize long answers with no keywords (waffle/incorrect)
        base_tech = 40  # Start with a low base
        keyword_bonus = int(keyword_density * 50)  # Max 50 points for keywords
        length_bonus = min(10, int(avg_length / 2)) # Max 10 points for depth
        
        tech_score = base_tech + keyword_bonus + length_bonus
        
        # 4. Soft Skills Heuristic (Vocabulary Diversity & Response Patterns)
        unique_words = len(set(all_user_text.split()))
        vocab_diversity = unique_words / total_words if total_words > 0 else 0
        
        soft_score = 50 + int(vocab_diversity * 40) + min(10, num_user_msgs * 2)

        # Cap scores
        tech_score = min(99, max(15, tech_score))
        soft_score = min(99, max(20, soft_score))

        # 5. Dynamic SWOT Generation
        strengths = []
        weaknesses = []

        if keyword_density > 0.5:
            strengths.append("High technical accuracy")
        elif keyword_density > 0.2:
            strengths.append("Foundational knowledge present")
        else:
            weaknesses.append("Significant technical gaps identified")

        if avg_length > 20:
            strengths.append("Profound articulation depth")
        elif avg_length < 10:
            weaknesses.append("Excessively concise; needs more detail")

        if vocab_diversity > 0.6:
            strengths.append("Sophisticated professional vocabulary")
        elif vocab_diversity < 0.3:
            weaknesses.append("Repetitive phrasing detected")

        # Fallback if empty
        if not strengths: strengths = ["Consistent participation"]
        if not weaknesses: weaknesses = ["Could demonstrate more specific implementation details"]

        # Determination of status
        emotional_status = "Confident" if tech_score > 85 else "Analytical" if tech_score > 65 else "Nervous"
        
        return {
            "technical_score": tech_score,
            "soft_skills_score": soft_score,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "emotional_status": emotional_status,
            "matched_keywords": matched_keywords
        }

    @staticmethod
    async def get_support_advise(status: str):
        # LOGIC: Provide emotional grounding
        advice_map = {
            "Anxious": "You're doing great. Take a deep breath; your technical scores are impressive! Focus on your breathing and take your time.",
            "Confident": "Excellent energy! Your confidence is a major asset. Keep that momentum going into your next challenge.",
            "Analytic": "Great precision in your thoughts. Your structured approach will take you far in technical leadership.",
            "Eager": "That passion is contagious! Channel that energy into deep-diving into specific edge cases.",
            "Determined": "I see that grit! Consistency is your superpower. You are on the right track."
        }
        
        for key, advice in advice_map.items():
            if key.lower() in status.lower():
                return advice
        
        return "Stay focused. Consistency is the key to mastering this domain. Every session makes you stronger."
