import './WorkDisplay.css';
import type { WorkDisplayProps } from '../../types/work.ts';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CLOUDFLARE_GATEWAY, CLOUDFLARE_R2_BUCKET } from '../../config/constants.ts';
import type { WorkResponse } from '../../types/work.ts';

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

function getInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

function getHighlights(content: string | null | undefined) {
  if (!content) {
    return [];
  }

  return content
    .split(/\r?\n/)
    .map((item) => item.replace(/^[-*•â€¢]\s*/, '').trim())
    .filter(Boolean)
    .slice(0, 3);
}

function normalizeExternalUrl(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function getArticleLabel(type: string, employmentType: string) {
  if (type === 'hackathon' || type === 'project') {
    return 'View Hackathon Story';
  }
  if (type === 'competition') {
    return 'View Competition Story';
  }
  if (['leadership', 'volunteer', 'organization', 'community', 'mentorship'].includes(type)) {
    return 'Open Field Note';
  }
  if (employmentType.toLowerCase().includes('freelance')) {
    return 'View Case Study';
  }
  return 'Read the Full Story';
}

function WorkDisplay({ work }: WorkDisplayProps) {
  const [logoFailed, setLogoFailed] = useState(false);
  const [details, setDetails] = useState<WorkResponse | null>(null);
  const imageUrl = work.company_logo_url ? new URL(work.company_logo_url, CLOUDFLARE_R2_BUCKET).toString() : null;
  const isCurrent = work.is_current === 1;
  const dateRange = `${formatWorkDate(work.start_date)} - ${isCurrent ? 'Present' : formatWorkDate(work.end_date)}`;
  const highlights = [
    ...getHighlights(details?.article?.achievements),
    ...getHighlights(details?.article?.responsibilities),
  ].slice(0, 3);
  const articleLabel = getArticleLabel(work.type, work.employment_type);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${CLOUDFLARE_GATEWAY}api/work_articles/${work.work_slug}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed ${response.status}`);
        }
        return response.json();
      })
      .then(setDetails)
      .catch(() => {
        // The overview remains useful even when optional article metadata is unavailable.
      });

    return () => controller.abort();
  }, [work.work_slug]);

  return (
    <article className={`workDisplay workDisplay--${work.type}${isCurrent ? ' is-current' : ''}`}>
      <div className='workArchiveLine'>
        <span className={`workType workType--${work.type}`}>{work.type.replace('_', ' ')}</span>
        {isCurrent && <span className='workCurrentBadge'>Current</span>}
      </div>
      <div className='workHeader'>
        {!logoFailed && imageUrl ? (
          <img className='workImage' src={imageUrl} alt={`${work.company_name} logo`} onError={() => setLogoFailed(true)} decoding='async' loading='lazy'/>
        ) : (
          <span className='workMonogram' aria-hidden='true'>
            {getInitials(work.company_name)}
          </span>
        )}
        <div className='workHeading'>
          <h3 className='workTitle'>{work.company_name}</h3>
          <p className='workRole'>{work.role_title}</p>
        </div>
      </div>
      <div className='workMeta'>
        <span className='workDate'>{dateRange}</span>
        {work.employment_type && <span>{work.employment_type}</span>}
        {work.location && <span>{work.location}</span>}
      </div>
      <div className='workTextContent'>
        <p className='workDescription'>{work.short_description}</p>
        {highlights.length > 0 && (
          <section className='workContributions' aria-label='Key contributions and outcomes'>
            <p>Contributions / outcomes</p>
            <ul>
              {highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </section>
        )}
        {details?.tags && details.tags.length > 0 && (
          <div className='workTech' aria-label='Technologies used'>
            {details.tags.slice(0, 6).map((technology) => (
              <span key={technology.tag_name}>{technology.tag_name}</span>
            ))}
          </div>
        )}
        <div className='workLinks'>
          <Link className='workLink' to={`/skills_experience/${work.work_slug}`} aria-label={`${articleLabel}: ${work.company_name}, ${work.role_title}`}>
            <span>{articleLabel}</span>
            <span className='workLinkArrow' aria-hidden='true'>→</span>
          </Link>
          {work.company_website && (
            <a className='workExternalLink' href={normalizeExternalUrl(work.company_website)} target='_blank' rel='noreferrer'>
              View organization <span aria-hidden='true'>↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default WorkDisplay;
