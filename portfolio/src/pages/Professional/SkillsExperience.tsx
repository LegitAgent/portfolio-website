import './SkillsExperience.css';
import { CLOUDFLARE_GATEWAY } from '../../config/constants.ts';
import { useEffect, useState } from 'react';
import WorkDisplay from '../../components/WorkDisplay/WorkDisplay.tsx';
import ErrorScreen from '../Misc/ErrorScreen';
import LoadingScreen from '../Misc/LoadingScreen';
import type { Tag, TagsResponse } from '../../types/tag.ts';
import type { WorkExperienceResponse } from '../../types/work.ts';

const tagsGatewayURL = CLOUDFLARE_GATEWAY + 'api/db/tags'; // path to tags db
const workGatewayURL = CLOUDFLARE_GATEWAY + 'api/db/work'; // path to work db

function SkillsExperience() {
  const [isLoadingTag, setIsLoadingTag] = useState<boolean>(true);
  const [tag, setTag] = useState<TagsResponse | null>(null);
  const [hasErrorTag, setHasErrorTag] = useState<boolean>(false);

  const findSkill = (skill_type: string, skills: TagsResponse): Tag[] => {
    return skills.tags.filter(tag => tag.skill_type === skill_type);
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
      setHasErrorTag(true);
      setHasErrorWork(false);
    });
  }, []);

  if (hasErrorTag || hasErrorWork) {
    return (<ErrorScreen />);
  }

  if (isLoadingTag || !tag || isLoadingWork) {
    return (<LoadingScreen />);
  }

  const language = findSkill('Language', tag);
  const frontend = findSkill('Frontend', tag);
  const backend = findSkill('Backend', tag);
  const database = findSkill('Database', tag);
  const cloud = findSkill('Cloud', tag);
  const developerTool = findSkill('Developer Tool', tag);
  const systems = findSkill('Systems', tag);
  const gameDevelopment = findSkill('Game Development', tag);
  const apiIntegration = findSkill('API / Integration', tag);
  
  return (
    <section className='seContainer'>
      <section className='skillsContainer'>
        <h1>Technical Skills</h1>
        <p className='skillsDescription'>these are my skills gang</p>
        <section className='technicalSkills'>

          <p className='skillType'>Languages</p>
          <div className='skillContainer'>
            {language.map((tag) => {
              return (
                <div className='tag' key={tag.tag_name}>{tag.tag_name}</div>
              );
            })}
          </div>

          <p className='skillType'>Front-End</p>
          <div className='skillContainer'>
            {frontend.map((tag) => {
              return (
                <div className='tag' key={tag.tag_name}>{tag.tag_name}</div>
              );
            })}
          </div>

          <p className='skillType'>Back-End</p>
          <div className='skillContainer'>
            {backend.map((tag) => {
              return (
                <div className='tag' key={tag.tag_name}>{tag.tag_name}</div>
              );
            })}
          </div>
        
          <p className='skillType'>Database</p>
          <div className='skillContainer'>
            {database.map((tag) => {
              return (
                <div className='tag' key={tag.tag_name}>{tag.tag_name}</div>
              );
            })}
          </div>

          <p className='skillType'>Cloud</p>  
          <div className='skillContainer'>
            {cloud.map((tag) => {
              return (
                <div className='tag' key={tag.tag_name}>{tag.tag_name}</div>
              );
            })}
          </div>

          <p className='skillType'>Developer Tools</p>
          <div className='skillContainer'>
            {developerTool.map((tag) => {
              return (
                <div className='tag' key={tag.tag_name}>{tag.tag_name}</div>
              );
            })}
          </div>

          <p className='skillType'>Systems</p>
          <div className='skillContainer'>
            {systems.map((tag) => {
              return (
                <div className='tag' key={tag.tag_name}>{tag.tag_name}</div>
              );
            })}
          </div>

          <p className='skillType'>Game Development</p>
          <div className='skillContainer'>
            {gameDevelopment.map((tag) => {
              return (
                <div className='tag' key={tag.tag_name}>{tag.tag_name}</div>
              );
            })}
          </div>
          
          <p className='skillType'>API / Integration</p>
          <div className='skillContainer'>
              {apiIntegration.map((tag) => {
                return (
                  <div className='tag' key={tag.tag_name}>{tag.tag_name}</div>
                );
              })}
          </div>

        </section>
      </section>

      <section className='experienceContainer'>
        <h1>Work Experience</h1>
        <p className='experienceDescription'>these are my work experiences vrodie</p>
        <section className='workTree'>
          <div className='workList'>
            {work?.results?.map((workStuff) => {
              return (
                <WorkDisplay key={workStuff.work_id} work={workStuff}/>
              );
            })}
          </div>
        </section>
      </section>
    </section>
  );
}

export default SkillsExperience;
