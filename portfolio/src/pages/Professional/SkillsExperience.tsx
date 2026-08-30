import './SkillsExperience.css';
import {
  AWS,
  CLOUDFLARE,
  CLOUDFLARE_GATEWAY,
  CPP,
  CSS,
  DJANGO,
  DOCKER,
  GIT,
  GITHUB_ICON,
  GRAPHQL,
  HTML,
  JAVA,
  JAVASCRIPT,
  LARAVEL,
  NODEJS,
  PHP,
  POSTGRESQL,
  PYTHON,
  REACT,
  REST,
  SQL,
  TAILWIND,
  TYPESCRIPT,
  VITE,
  NO_IMAGE,
} from '../../config/constants.ts';
import { useEffect, useRef, useState } from 'react';
import WorkDisplay from '../../components/WorkDisplay/WorkDisplay.tsx';
import ErrorScreen from '../Misc/ErrorScreen';
import LoadingScreen from '../Misc/LoadingScreen';
import type { SkillType, Tag, TagsResponse } from '../../types/tag.ts';
import type { WorkExperience, WorkExperienceResponse } from '../../types/work.ts';

const tagsGatewayURL = CLOUDFLARE_GATEWAY + 'api/db/tags'; // path to tags db
const workGatewayURL = CLOUDFLARE_GATEWAY + 'api/db/work'; // path to work db

const skillIconSources: Record<string, string> = {
  AWS,
  Cloudflare: CLOUDFLARE,
  'C++': CPP,
  CSS,
  Django: DJANGO,
  Docker: DOCKER,
  Git: GIT,
  GitHub: GITHUB_ICON,
  GraphQL: GRAPHQL,
  HTML,
  Java: JAVA,
  JavaScript: JAVASCRIPT,
  Laravel: LARAVEL,
  'Node.js': NODEJS,
  NodeJS: NODEJS,
  PHP,
  PostgreSQL: POSTGRESQL,
  Python: PYTHON,
  React: REACT,
  REST,
  'REST API': REST,
  SQL,
  Tailwind: TAILWIND,
  'Tailwind CSS': TAILWIND,
  TypeScript: TYPESCRIPT,
  Vite: VITE,
  default: NO_IMAGE,
};

function SkillTag({ skill }: { skill: Tag }) {
  const iconSrc = skillIconSources[skill.tag_name] ?? skillIconSources.default;
  const needsContrastInversion = ['GitHub', 'AWS'].includes(skill.tag_name);
  const iconClassName = needsContrastInversion ? 'tagIcon tagIcon--contrast-invert' : 'tagIcon';

  return (
    <div className='tag' key={skill.tag_name}>
      <img className={iconClassName} src={iconSrc} alt='' aria-hidden='true' loading='lazy' />
      <span>{skill.tag_name}</span>
    </div>
  );
}

type JourneyFilter = 'all' | 'work' | 'internships' | 'hackathons' | 'competitions' | 'community';

const journeyFilters: Array<{ value: JourneyFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'work', label: 'Work' },
  { value: 'internships', label: 'Internships' },
  { value: 'hackathons', label: 'Hackathons' },
  { value: 'competitions', label: 'Competitions' },
  { value: 'community', label: 'Community' },
];

function getJourneyCategory(work: WorkExperience): Exclude<JourneyFilter, 'all'> {
  const employment = work.employment_type.toLowerCase();
  if (work.type === 'internship' || employment.includes('intern')) {
    return 'internships';
  }
  if (work.type === 'hackathon' || (work.type === 'project' && employment.includes('hackathon'))) {
    return 'hackathons';
  }
  if (work.type === 'competition') {
    return 'competitions';
  }
  if (work.type === 'open_source') {
    return 'community';
  }
  if (['leadership', 'volunteer', 'organization', 'community', 'mentorship'].includes(work.type)) {
    return 'community';
  }
  return 'work';
}

function getPhaseCopy(year: number, entries: WorkExperience[]) {
  const categories = new Set(entries.map(getJourneyCategory));

  if (entries.some((entry) => entry.is_current === 1)) {
    return {
      title: 'Active Practice',
      description: 'Current work, evolving responsibilities, and the systems shaping how I build today.',
    };
  }

  if (categories.has('hackathons') || categories.has('competitions')) {
    return {
      title: 'Building Under Pressure',
      description: 'Time-boxed challenges where collaboration, judgment, and delivery mattered.',
    };
  }

  if (categories.has('work') || categories.has('internships')) {
    return {
      title: 'Building in Teams',
      description: 'Learning through shipped work, shared codebases, and real technical constraints.',
    };
  }

  return {
    title: 'Exploration & Community',
    description: `A chapter of learning, contributing, and finding direction through the technical community in ${year}.`,
  };
}

function getNodeSymbol(category: Exclude<JourneyFilter, 'all'>, workType: WorkExperience['type']) {
  if (workType === 'open_source') {
    return '⬢';
  }
  if (category === 'hackathons') {
    return '◆';
  }
  if (category === 'competitions') {
    return '★';
  }
  if (category === 'community') {
    return '■';
  }
  if (category === 'internships') {
    return '⬡';
  }
  return '●';
}

function SkillsExperience() {
  const [isLoadingTag, setIsLoadingTag] = useState<boolean>(true);
  const [tag, setTag] = useState<TagsResponse | null>(null);
  const [hasErrorTag, setHasErrorTag] = useState<boolean>(false);

  const findSkill = (skillType: SkillType, skills: TagsResponse): Tag[] => {
    return skills.tags.filter((tagItem) => tagItem.skill_type === skillType);
  };

  useEffect(() => {
    fetch(tagsGatewayURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        setTag(json);
        setIsLoadingTag(false);
      })
      .catch(() => {
        setHasErrorTag(true);
        setIsLoadingTag(false);
      });
  }, []);

  const [isLoadingWork, setIsLoadingWork] = useState<boolean>(true);
  const [work, setWork] = useState<WorkExperienceResponse | null>(null);
  const [hasErrorWork, setHasErrorWork] = useState<boolean>(false);
  const [activeWorkIndex, setActiveWorkIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<JourneyFilter>('all');
  const workItemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const workListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch(workGatewayURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        setWork(json);
        setIsLoadingWork(false);
      })
      .catch(() => {
        setHasErrorWork(true);
        setIsLoadingWork(false);
      });
  }, []);

  const orderedWork = [...(work?.results ?? [])].sort((first, second) => first.display_order - second.display_order);
  const visibleWork = orderedWork.filter((entry) => activeFilter === 'all' || getJourneyCategory(entry) === activeFilter);
  const workByYear = visibleWork.reduce<Record<string, WorkExperience[]>>((groups, entry) => {
    const parsedYear = new Date(entry.start_date).getUTCFullYear();
    const year = Number.isNaN(parsedYear) ? 'Archive' : String(parsedYear);
    groups[year] = [...(groups[year] ?? []), entry];
    return groups;
  }, {});
  const orderedYears = Object.keys(workByYear).sort((a, b) => (b === 'Archive' ? -1 : Number(b) - Number(a)));
  const timelineWork = orderedYears.flatMap((year) => workByYear[year]);

  // Illuminate the closest milestone and draw timeline progress as the visitor scrolls.
  useEffect(() => {
    if (!timelineWork.length) {
      return;
    }

    let animationFrameId = 0;

    const updateActiveWork = () => {
      const isAtPageBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

      if (isAtPageBottom) {
        setActiveWorkIndex(timelineWork.length - 1);
        return;
      }

      const focusY = window.innerHeight * 0.5;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      workItemRefs.current.forEach((item, index) => {
        if (!item) {
          return;
        }

        const rect = item.getBoundingClientRect();
        const itemCenterY = rect.top + rect.height / 2;
        const distance = Math.abs(itemCenterY - focusY);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveWorkIndex(closestIndex);
    };

    const requestUpdate = () => {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = window.requestAnimationFrame(updateActiveWork);
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [timelineWork.length, activeFilter]);

  useEffect(() => {
    let animationFrameId = 0;

    const updateProgress = () => {
      const timeline = workListRef.current;
      if (!timeline) {
        return;
      }

      const isAtPageBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      if (isAtPageBottom) {
        timeline.style.setProperty('--journey-progress', '1');
        return;
      }

      const rect = timeline.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.72 - rect.top) / Math.max(rect.height, 1)));
      timeline.style.setProperty('--journey-progress', String(progress));
    };

    const requestUpdate = () => {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = window.requestAnimationFrame(updateProgress);
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [activeFilter, timelineWork.length]);

  if (hasErrorTag || hasErrorWork) {
    return <ErrorScreen />;
  }

  if (isLoadingTag || !tag || isLoadingWork) {
    return <LoadingScreen />;
  }

  const language = findSkill('Language', tag);
  const frontend = findSkill('Frontend', tag);
  const backend = findSkill('Backend', tag);
  const database = findSkill('Database', tag);
  const cloud = findSkill('Cloud', tag);
  const developerTool = findSkill('Developer Tool', tag);

  const skillGroups = [
    { title: 'Languages', skills: language },
    { title: 'Front-End', skills: frontend },
    { title: 'Back-End', skills: [...backend, ...database, ...cloud] },
    { title: 'DevOps', skills: developerTool },
  ].filter((group) => group.skills.length > 0);

  return (
    <section className='seContainer'>
      <section className='skillsContainer'>
        <h2>Technical Skills</h2>
        <p className='skillsDescription'>
          Here are some of the frameworks, languages, and infrastructure tools I use to design, build, and deploy reliable software, and I'm always
          learning more.
        </p>
        <section className='technicalSkills'>
          {skillGroups.map((group) => {
            return (
              <div className='skillGroup' key={group.title}>
                <p className='skillType'>{group.title}</p>
                <div className='skillContainer'>
                  {group.skills.map((skill) => (
                    <SkillTag skill={skill} key={skill.tag_name} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      </section>

      <section className='experienceContainer' aria-labelledby='journey-title'>
        <header className='journeyHeader'>
          <h1 id='journey-title'>Industry &amp; Technical Journey</h1>
        <p className='experienceDescription'>
          A record of the teams, systems, competitions, and technical communities that shaped how I build software.
        </p>
        </header>

        <div className='journeyControls'>
          <div className='journeyControlsLabel' aria-hidden='true'>
            <span>Archive index</span>
            <span>{String(visibleWork.length).padStart(2, '0')} entries</span>
          </div>
          <div className='journeyFilters' role='group' aria-label='Filter experience by category'>
            {journeyFilters.map((filter) => (
              <button
                className={activeFilter === filter.value ? 'journeyFilter is-active' : 'journeyFilter'}
                type='button'
                aria-pressed={activeFilter === filter.value}
                onClick={() => {
                  setActiveFilter(filter.value);
                  setActiveWorkIndex(0);
                  workItemRefs.current = [];
                }}
                key={filter.value}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <section className='workTree'>
          <div className='workList' ref={workListRef}>
            {visibleWork.length === 0 && (
              <div className='journeyEmpty'>
                <span>NO MATCHING RECORDS</span>
                <p>This archive does not have an entry in that category yet.</p>
              </div>
            )}
            {orderedYears.map((year) => {
              const phase = getPhaseCopy(Number(year), workByYear[year]);
              return (
                <section className='journeyPhase' aria-labelledby={`journey-year-${year}`} key={year}>
                  <header className='journeyPhaseHeader'>
                    <span className='journeyPhaseTick' aria-hidden='true'></span>
                    <p className='journeyYear'>{year}</p>
                    <div>
                      <h2 id={`journey-year-${year}`}>{phase.title}</h2>
                      <p>{phase.description}</p>
                    </div>
                  </header>
                  {workByYear[year].map((workStuff) => {
                    const index = timelineWork.findIndex((entry) => entry.work_id === workStuff.work_id);
                    const category = getJourneyCategory(workStuff);
                    const isActive = index === activeWorkIndex;
                    const itemClassName = `workMapItem workMapItem--${category} ${index % 2 === 0 ? 'workMapItem--left' : 'workMapItem--right'} ${isActive ? 'is-active' : ''}`;

                    return (
                      <div
                        className={itemClassName}
                        data-work-index={index}
                        key={workStuff.work_id}
                        ref={(element) => {
                          workItemRefs.current[index] = element;
                        }}
                      >
                        <span className='workMapCurve' aria-hidden='true'></span>
                        <span className='workMapNode' aria-hidden='true'>
                          <span>{getNodeSymbol(category, workStuff.type)}</span>
                        </span>
                        <WorkDisplay work={workStuff} />
                      </div>
                    );
                  })}
                </section>
              );
            })}
          </div>
        </section>
      </section>

      <button className='seBackToTop' type='button' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label='Back to top'>
        <span>Back to top</span>
        <svg viewBox='0 0 24 24' aria-hidden='true'>
          <path d='m6 15 6-6 6 6' />
        </svg>
      </button>
    </section>
  );
}

export default SkillsExperience;
