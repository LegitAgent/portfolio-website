import './SkillsExperience.css';
import {
  AWS,
  CLOUDFLARE,
  CLOUDFLARE_GATEWAY,
  CPP,
  CSS,
  DJANGO,
  GIT,
  GITHUB_ICON,
  GRAPHQL,
  HTML,
  JAVA,
  JAVASCRIPT,
  LARAVEL,
  NODEJS,
  NPM,
  PHP,
  PIP,
  POSTGRESQL,
  PYTHON,
  REACT,
  REST,
  SQL,
  TAILWIND,
  TYPESCRIPT,
  VITE,
} from '../../config/constants.ts';
import { useEffect, useRef, useState } from 'react';
import WorkDisplay from '../../components/WorkDisplay/WorkDisplay.tsx';
import ErrorScreen from '../Misc/ErrorScreen';
import LoadingScreen from '../Misc/LoadingScreen';
import type { Tag, TagsResponse } from '../../types/tag.ts';
import type { WorkExperienceResponse } from '../../types/work.ts';

const tagsGatewayURL = CLOUDFLARE_GATEWAY + 'api/db/tags'; // path to tags db
const workGatewayURL = CLOUDFLARE_GATEWAY + 'api/db/work'; // path to work db

const skillIconSources: Record<string, string> = {
  default: '/temp.svg',
  AWS,
  'AWS Lambda': AWS,
  Cloudflare: CLOUDFLARE,
  'C++': CPP,
  CPP,
  CSS,
  Django: DJANGO,
  Git: GIT,
  GitHub: GITHUB_ICON,
  GraphQL: GRAPHQL,
  HTML,
  Java: JAVA,
  JavaScript: JAVASCRIPT,
  Laravel: LARAVEL,
  'Node.js': NODEJS,
  NodeJS: NODEJS,
  npm: NPM,
  NPM,
  PHP,
  pip: PIP,
  PIP,
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
};

function SkillTag({ skill }: { skill: Tag }) {
  const iconSrc = skillIconSources[skill.tag_name] ?? skillIconSources.default;

  return (
    <div className="tag" key={skill.tag_name}>
      <img className="tagIcon" src={iconSrc} alt="" aria-hidden="true" />
      <span>{skill.tag_name}</span>
    </div>
  );
}

function SkillsExperience() {
  const [isLoadingTag, setIsLoadingTag] = useState<boolean>(true);
  const [tag, setTag] = useState<TagsResponse | null>(null);
  const [hasErrorTag, setHasErrorTag] = useState<boolean>(false);

  const findSkill = (skill_type: string, skills: TagsResponse): Tag[] => {
    return skills.tags.filter((tag) => tag.skill_type === skill_type);
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
  const workItemRefs = useRef<Array<HTMLDivElement | null>>([]);

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

  // for the green button light up
  useEffect(() => {
    if (!work?.results?.length) {
      return;
    }

    let animationFrameId = 0;

    const updateActiveWork = () => {
      const isAtPageBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

      if (isAtPageBottom) {
        setActiveWorkIndex(work.results.length - 1);
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
  }, [work?.results?.length]);

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
  const orderedWork = [...(work?.results ?? [])].sort((first, second) => first.display_order - second.display_order);

  return (
    <section className="seContainer">
      <section className="skillsContainer">
        <h1>Technical Skills</h1>
        <p className="skillsDescription">Here are some of the frameworks, languages, and infrastructure tools I use to design, build, and deploy reliable software, and I'm always learning more.</p>
        <section className="technicalSkills">
          {skillGroups.map((group) => {
            return (
              <div className="skillGroup" key={group.title}>
                <p className="skillType">{group.title}</p>
                <div className="skillContainer">
                  {group.skills.map((skill) => {
                    return <SkillTag skill={skill} key={skill.tag_name} />;
                  })}
                </div>
              </div>
            );
          })}
        </section>
      </section>

      <section className="experienceContainer">
        <h1>Work Experience</h1>
        <p className="experienceDescription">I’m looking for opportunities that push my boundaries and expand my technical toolkit. I am still early in my journey, but I am incredibly excited to get more exposure, tackle fresh challenges, and build cool software!</p>
        <section className="workTree">
          <div className="workList">
            {orderedWork.map((workStuff, index) => {
              const isActive = index === activeWorkIndex;
              const itemClassName = `workMapItem ${index % 2 === 0 ? 'workMapItem--left' : 'workMapItem--right'} ${isActive ? 'is-active' : ''}`;

              return (
                <div
                  className={itemClassName}
                  data-work-index={index}
                  key={workStuff.work_id}
                  ref={(element) => {
                    workItemRefs.current[index] = element;
                  }}
                >
                  <span className="workMapCurve" aria-hidden="true"></span>
                  <span className="workMapNode" aria-hidden="true">
                    <span></span>
                  </span>
                  <WorkDisplay work={workStuff} />
                </div>
              );
            })}
          </div>
        </section>
      </section>
    </section>
  );
}

export default SkillsExperience;
