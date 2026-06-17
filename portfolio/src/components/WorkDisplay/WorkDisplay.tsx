import './WorkDisplay.css';
import type { WorkDisplayProps } from '../../types/work.ts';
import { Link } from 'react-router-dom';
import { CLOUDFLARE_R2_BUCKET } from '../../config/constants.ts';

function formatWorkDate(dateValue: string | null) {
  if (!dateValue) {
    return 'Present';
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function WorkDisplay({ work }: WorkDisplayProps) {
  const imageUrl = new URL(work.company_logo_url, CLOUDFLARE_R2_BUCKET).toString();
  const isCurrent = work.is_current === 1;
  const dateRange = `${formatWorkDate(work.start_date)} - ${isCurrent ? 'Present' : formatWorkDate(work.end_date)}`;

  return (
    <div className={isCurrent ? 'workDisplay is-current' : 'workDisplay'}>
      <div className="workHeader">
        <img className="workImage" src={imageUrl} alt={work.company_name} />
        <div className="workHeading">
          <p className="workTitle">{work.company_name}</p>
          <p className="workRole">{work.role_title}</p>
        </div>
      </div>
      <div className="workMeta">
        <span>{dateRange}</span>
        {work.employment_type && <span>{work.employment_type}</span>}
        {work.location && <span>{work.location}</span>}
        {isCurrent && <span className="workCurrentBadge">Current</span>}
      </div>
      <div className="workTextContent">
        <p className="workDescription">{work.short_description}</p>
        <div className="workLinks">
          {work.company_website && (
            <a href={work.company_website} target="_blank" rel="noreferrer">
              work link
            </a>
          )}
          <Link className="workLink" to={`/skills_experience/${work.work_slug}`} aria-label="Work Article">
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default WorkDisplay;
