export type Project = { id: string; name: string; label: string; headline: string; summary: string; problem: string; solution: string; tech: string[]; capabilities: string[]; stages: { title: string; description: string; code: string }[]; image: string; logo: string };
export const projects: Project[] = [
  {
    id: 'sahay', name: 'SAHAY', label: 'AI PROCUREMENT · INDIAN MSMEs', headline: 'Procurement that actually negotiates.',
    summary: 'An AI-powered procurement and business operations assistant for Indian MSMEs.',
    problem: 'Finding suppliers, chasing quotes and comparing the real cost of a purchase takes time away from running a business.',
    solution: 'Sahay discovers vendors, negotiates in their language and brings back traceable deals ranked by what actually leaves the bank account.',
    tech: ['Node.js', 'Sarvam', 'Groq', 'Anakin', 'Telegram', 'PDFKit', 'Razorpay'],
    capabilities: ['Agentic procurement', 'Vendor discovery', 'AI-assisted negotiation', 'Voice in 11 Indian languages', 'Landed-cost comparison', 'Traceable quotes', 'Purchase orders', 'Payment-link workflow', 'Competitor monitoring', 'Compliance tracking', 'Telegram interface', 'Human approval'],
    stages: [
      { title: 'Start with a requirement', description: 'A voice or text requirement becomes a structured sourcing request.', code: 'NEED → cotton t-shirts · 500 units · Bengaluru' },
      { title: 'Find the right suppliers', description: 'Supplier candidates are discovered and scored for fit, locality and feasibility.', code: 'DISCOVER → supplier network → shortlist' },
      { title: 'Talk. Negotiate. Trace.', description: 'Voice-first conversations return quotes with the source of each number.', code: 'VOICE → 11 languages → recorded quote' },
      { title: 'Compare the real cost', description: 'Quotes reorder by landed cost, including quantity, freight and constraints.', code: 'RANK → rate + freight + MOQ + lead time' },
      { title: 'You make the call', description: 'Human approval comes before the purchase order and payment-link workflow.', code: 'APPROVE → purchase order → payment link' },
    ], image: '/assets/projects/sahay-architecture.svg', logo: '/assets/project-logos/sahay.png',
  },
  {
    id: 'zuik', name: 'ZUIK', label: 'INTENT-BASED DEFI', headline: 'Say what you want. Zuik builds the flow.',
    summary: 'Intent-based DeFi automation. Describe the outcome, review the workflow, authorize with your wallet.',
    problem: 'DeFi workflows often require navigating complex tools and repeatedly executing the same actions by hand.',
    solution: 'Natural language, voice or a visual builder turns your intent into a reviewable, non-custodial Algorand workflow.',
    tech: ['Algorand', 'TypeScript', 'React', 'Node.js'],
    capabilities: ['Natural-language intent', 'Voice input', 'Visual workflow builder', 'Non-custodial architecture', 'Wallet authorization', 'Atomic execution', 'Safety previews', 'Scheduled automation', 'Conditional workflows', 'Portfolio rebalancing'],
    stages: [
      { title: 'Say the intent', description: 'Start with an outcome instead of a complex tool.', code: '“I want to buy ALGO every Friday.”' },
      { title: 'Intent becomes a workflow', description: 'Asset, action and schedule become connected, readable nodes.', code: '[BUY] → [ALGO] → [EVERY FRIDAY]' },
      { title: 'Review before execution', description: 'A safety preview lets you inspect the workflow and its boundaries.', code: 'PREVIEW → schedule · asset · constraints' },
      { title: 'Authorize with your wallet', description: 'You retain custody. Your wallet authorizes the approved workflow.', code: 'YOUR WALLET → YOUR AUTHORIZATION' },
      { title: 'Execute atomically', description: 'The authorized Algorand workflow executes as an all-or-nothing group.', code: 'ATOMIC GROUP → all or nothing' },
    ], image: '', logo: '/assets/project-logos/zuik.png',
  },
  {
    id: 'swyftpay', name: 'SWYFTPAY', label: 'AGENT PAYMENT INFRASTRUCTURE', headline: 'When AI agents need to pay.',
    summary: 'Payment infrastructure that helps AI agents access paid APIs and resources on the open web.',
    problem: 'An agent encounters HTTP 402. The request stops until the payment challenge is understood and safely handled.',
    solution: 'SwyftPay interprets the challenge, enforces spending policy, pays on Algorand and continues the request with payment proof.',
    tech: ['TypeScript', 'Node.js', 'HTTP 402', 'Algorand', 'SDK / CLI'],
    capabilities: ['HTTP 402 handling', 'Spend policies', 'Audit logs', 'Retries', 'Payment-loop protection', 'Simulation', 'Caching', 'Trust scores', 'Agent wallet policies', 'Multi-agent integrations', 'SDK / CLI integrations'],
    stages: [
      { title: 'An agent hits a paywall', description: 'The API returns a payment challenge instead of the resource.', code: 'GET /resource → HTTP 402 PAYMENT REQUIRED' },
      { title: 'Read the challenge', description: 'The agent learns the amount, recipient and accepted payment asset.', code: 'PARSE → amount · recipient · asset' },
      { title: 'Policy before payment', description: 'Spending limits and allowlists are checked before a signature.', code: 'POLICY → budget ✓ host ✓ asset ✓' },
      { title: 'Settle on Algorand', description: 'A transaction supplies payment proof and an auditable record.', code: 'ALGORAND → transaction → audit log' },
      { title: 'Continue the request', description: 'Retry with proof. Loop protection prevents endless payments.', code: 'RETRY + PROOF → 200 RESOURCE ACCESS' },
    ], image: '/assets/projects/swyftpay-screen.webp', logo: '/assets/project-logos/swyftpay.png',
  },
];
