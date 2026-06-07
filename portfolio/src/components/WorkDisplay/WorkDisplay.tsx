import './WorkDisplay.css';
import type { WorkDisplayProps } from '../../types/work.ts';
import { Link } from 'react-router-dom';
import { CLOUDFLARE_R2_BUCKET } from '../../config/constants.ts';



function WorkDisplay({work}: WorkDisplayProps) {
  const imageUrl = new URL(work.company_logo_url, CLOUDFLARE_R2_BUCKET).toString();

  return(
    <div className='workDisplay'>
      <img className='workImage' src={imageUrl} alt={work.company_name}/>
      <p className='workTitle'>{work.company_name}</p>
      <div className='workTextContent'>
        <p className='workDescription'>{work.short_description}</p>
        <div className='workLinks'>
          {work.company_website && (
            <a href={work.company_website} target="_blank" rel="noreferrer">
              work link
            </a>
          )}
          <Link className='workLink' to={`/skills_experience/${work.work_slug}`} aria-label='Work Article' >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default WorkDisplay;