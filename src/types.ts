export interface Hackathon {
  id: string;
  slug: string;
  title: string;
  status: 'ongoing' | 'ended';
  tags: string[];
  startDate: string;
  endDate: string;
  participants: number;
  description: string;
  prize: string;
  schedule: { time: string; event: string }[];
  evaluation: string;
  posterUrl?: string;
}

export interface Team {
  id: string;
  name: string;
  intro: string;
  isOpen: boolean;
  positions: string[];
  contactLink: string;
  hackathonSlug?: string;
  members: string[];
}

export interface RankingUser {
  rank: number;
  nickname: string;
  points: number;
  lastActive: string; // ISO string
}

export const MOCK_HACKATHONS: Hackathon[] = [
  {
    id: '1',
    slug: 'ai-innovation-2026',
    title: '2026 AI 혁신 해커톤',
    status: 'ongoing',
    tags: ['AI', 'Python', 'ML'],
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    participants: 1240,
    description: '인공지능을 활용한 사회적 문제 해결 솔루션을 제안하세요.',
    prize: '총 상금 5,000만원',
    evaluation: '창의성(30%), 기술성(40%), 실현가능성(30%)',
    schedule: [
      { time: '03-01', event: '참가 접수 시작' },
      { time: '03-25', event: '결과물 제출 마감' },
      { time: '03-31', event: '최종 발표 및 시상' },
    ],
    posterUrl: 'https://picsum.photos/seed/ai/800/450'
  },
  {
    id: '2',
    slug: 'web3-future-builders',
    title: 'Web3 퓨처 빌더스',
    status: 'ended',
    tags: ['Blockchain', 'Solidity', 'Web3'],
    startDate: '2026-01-10',
    endDate: '2026-02-15',
    participants: 850,
    description: '탈중앙화 기술을 이용한 새로운 금융 생태계를 구축합니다.',
    prize: '총 상금 3,000만원',
    evaluation: '보안성(40%), 혁신성(30%), 사용자 경험(30%)',
    schedule: [
      { time: '01-10', event: '해커톤 킥오프' },
      { time: '02-10', event: '코드 프리징' },
      { time: '02-15', event: '데모 데이' },
    ],
    posterUrl: 'https://picsum.photos/seed/web3/800/450'
  },
  {
    id: '3',
    slug: 'green-tech-challenge',
    title: '그린 테크 챌린지',
    status: 'ongoing',
    tags: ['Eco', 'IoT', 'Hardware'],
    startDate: '2026-03-15',
    endDate: '2026-04-20',
    participants: 420,
    description: '지속 가능한 지구를 위한 친환경 기술 아이디어를 모집합니다.',
    prize: '총 상금 2,000만원',
    evaluation: '환경 영향력(50%), 기술 완성도(30%), 경제성(20%)',
    schedule: [
      { time: '03-15', event: '아이디어 빌딩' },
      { time: '04-15', event: '프로토타입 제출' },
      { time: '04-20', event: '우수작 선정' },
    ],
    posterUrl: 'https://picsum.photos/seed/green/800/450'
  }
];

export const MOCK_TEAMS: Team[] = [
  {
    id: 't1',
    name: 'AI 어벤져스',
    intro: '딥러닝 전문가들이 모인 팀입니다. 함께 세상을 바꿀 분을 찾습니다.',
    isOpen: true,
    positions: ['Frontend', 'ML Engineer'],
    contactLink: 'https://open.kakao.com/o/example1',
    hackathonSlug: 'ai-innovation-2026',
    members: ['User1', 'User2']
  },
  {
    id: 't2',
    name: '블록체인 마스터즈',
    intro: '스마트 컨트랙트 보안 전문가 구함.',
    isOpen: false,
    positions: ['Smart Contract Auditor'],
    contactLink: 'https://open.kakao.com/o/example2',
    hackathonSlug: 'web3-future-builders',
    members: ['User3', 'User4', 'User5']
  },
  {
    id: 't3',
    name: '자유로운 영혼들',
    intro: '해커톤 상관없이 사이드 프로젝트 하실 분!',
    isOpen: true,
    positions: ['Designer', 'Backend'],
    contactLink: 'https://open.kakao.com/o/example3',
    members: ['User6']
  }
];

export const MOCK_RANKINGS: RankingUser[] = [
  { rank: 1, nickname: 'CodeMaster', points: 15400, lastActive: '2026-03-17T10:00:00Z' },
  { rank: 2, nickname: 'AI_Wizard', points: 14200, lastActive: '2026-03-16T15:00:00Z' },
  { rank: 3, nickname: 'Web3_Guru', points: 12800, lastActive: '2026-03-18T01:00:00Z' },
  { rank: 4, nickname: 'EcoWarrior', points: 11500, lastActive: '2026-03-15T09:00:00Z' },
  { rank: 5, nickname: 'Frontend_Ninja', points: 10200, lastActive: '2026-03-17T22:00:00Z' },
  { rank: 6, nickname: 'Rust_Lover', points: 9800, lastActive: '2026-03-14T12:00:00Z' },
  { rank: 7, nickname: 'Data_Scientist', points: 8500, lastActive: '2026-03-17T08:00:00Z' },
];
