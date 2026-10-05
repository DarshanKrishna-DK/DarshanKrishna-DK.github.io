export const profile = {
  resumeUrl: 'https://drive.google.com/file/d/1OUpDvnZUzZc_PHhuugRdXb00gtgxOoNJ/view?usp=drive_link',
  name: 'Darshan Krishna N', email: 'darshankrishna2k2@gmail.com',
  introduction: "I'm Darshan Krishna, a developer, community builder and DevRel enthusiast who loves turning technology into experiences people can understand, use and rally around. I build products, grow developer communities, speak and teach, and I'm working toward becoming a solo entrepreneur by turning my ideas into products of my own.",
  secondary: "When I'm not building something, you'll probably find me riding toward a waterfall, getting competitive in a game, watching anime, or letting Codex handle the coding while I pretend I've finally learned delegation.",
  philosophy: 'I enjoy making technology easier to understand, helping developers discover tools, creating spaces where people can learn together, and turning technical products into communities and experiences people care about.',
  role: 'Data Quality & Governance Analyst I', employer: 'JLL Technologies', dates: 'August 2024 - Present',
  socials: [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/darshan-krishna-dk/' },
    { name: 'GitHub', url: 'https://github.com/DarshanKrishna-DK' },
    { name: 'Instagram', url: 'https://www.instagram.com/cryptech_dk/' },
    { name: 'X / Twitter', url: 'https://x.com/CrypTech_DK' },
  ],
};
export const skillGroups = [
  { name: 'Core languages', label: 'THE TOOLBOX', skills: ['Python', 'SQL', 'PySpark', 'Solidity', 'C++', 'Git'], description: 'From data pipelines and validation scripts to smart contracts. Tools for making an idea work.' },
  { name: 'Web & products', label: 'THE BUILD SURFACE', skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'], description: 'Interfaces, services and systems that turn a technical idea into something people can use.' },
  { name: 'Platforms & workflows', label: 'THE WORKBENCH', skills: ['Databricks', 'Tableau', 'Power BI', 'GitHub', 'Postman', 'Canva', 'MCPs', 'Playwright'], description: 'Data platforms, developer tooling, agentic workflows and testing. The useful parts behind the finished experience.' },
];
export const communityStats = [
  { value: '1,400+', label: 'community members', detail: 'KrowdKraft · Bengaluru' },
  { value: '30+', label: 'events brought to life', detail: 'Learning happens together' },
  { value: '5,000+', label: 'developers reached', detail: 'Through community initiatives' },
  { value: '15+', label: 'talks delivered', detail: 'Technology, made approachable' },
  { value: '3,000+', label: 'students & faculty trained', detail: 'GitHub · Postman · AWS · Blockchain' },
];
export const ecosystemRoles = ['Founder · KrowdKraft', 'Regional Ambassador · AlgoBharat (7+ community events)', 'Community Lead · TigerGraph Bengaluru', 'Postman Captain', 'Former Arbitrum Ambassador', 'Former Program Manager · HerAura Community'];
export type CommunityMemory = { image: string; alt: string; caption: string; date?: string };
export const communityMemories: CommunityMemory[] = [];
export const animeFavourites: string[] = ['One Piece', 'Akame ga Kill!', 'Hunter × Hunter'];
