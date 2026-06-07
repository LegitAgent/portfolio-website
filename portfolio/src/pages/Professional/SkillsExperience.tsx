import './SkillsExperience.css';
import { CLOUDFLARE_GATEWAY } from '../../imports/constants';
import { useEffect, useState } from 'react';
import ErrorScreen from '../Misc/ErrorScreen';
import LoadingScreen from '../Misc/LoadingScreen';

interface Tags {
  tag_name: string;
  skill_type: string;
}

interface TagsResponse {
  tags: Tags[];
}

const tagsGatewayURL = CLOUDFLARE_GATEWAY + 'api/db/tags'; // path to project db

function SkillsExperience() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tag, setTag] = useState<TagsResponse | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);

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
      setIsLoading(false);
    })
    .catch(() => {
      setHasError(true);
      setIsLoading(false);
    });
  }, []);

  if (hasError) {
    return (<ErrorScreen />);
  }

  if (isLoading) {
    return (<LoadingScreen />);
  }


  return (
    <section className='seContainer'>
      <section className='skillsContainer'>
        <h1>Skills</h1>
        {tag?.tags[0]?.skill_type}
        <p className='skillsDescription'>these are my skills gang</p>
        <section className='technicalSkills'>
          <h2>Technical Skills</h2>
        </section>
      </section>
      <section className='experienceContainer'>
        these are my experiences
      </section>
    </section>
  );
}

export default SkillsExperience;
