import './Home.css';
import { Link } from 'react-router-dom';
import { EMAIL_ICON, GITHUB_ICON, GITHUB_URL, LINKEDIN_ICON, LINKEDIN_URL, PROFILE_PICTURE } from '../../config/constants';

function Home() {
  return (
    <main className='hero'>
      <section className='introduction' aria-labelledby='home-title'>
        <div className='pictureWrap'>
          <img id='portfolioPicture' src={PROFILE_PICTURE} alt='Martin Darius Alba' decoding='async' loading='lazy'/>
        </div>

        <div className='introductionContent'>
          <h1 id='home-title'>Martin Darius Alba</h1>
          <p className='currentRole'>Aspiring Software Developer · CS Student</p>
          <p className='introContent'>
            Hello! I like building tools and software that can help other people 
          </p>

          <div className='contactLinks' aria-label='Primary links'>
            <a href={GITHUB_URL} target='_blank' rel='noreferrer' className='buttonContact'>
              <img src={GITHUB_ICON} alt='' aria-hidden='true' />
              GitHub
            </a>
            <a href={LINKEDIN_URL} target='_blank' rel='noreferrer' className='buttonContact'>
              <img src={LINKEDIN_ICON} alt='' aria-hidden='true' />
              LinkedIn
            </a>
            <Link to='/contacts' className='buttonContact'>
              <img src={EMAIL_ICON} alt='' aria-hidden='true' />
              Contact
            </Link>
          </div>
        </div>
      </section>

      <section className='homeOverview' aria-label='Portfolio overview'>
        <article className='homeFeature'>
          <div>
            <p className='homeFeatureLabel'>Currently building</p>
            <h2>A portfolio powered by a real full-stack architecture</h2>
            <p>
              This site combines React with a Cloudflare Worker, D1, R2, caching, rate limiting, and live GitHub and LeetCode data. It is also where I
              document the engineering decisions behind my work.
            </p>
          </div>
          <div className='homeFeatureFooter'>
            <ul aria-label='Current stack'>
              <li>React</li>
              <li>TypeScript</li>
              <li>Cloudflare</li>
              <li>D1</li>
            </ul>
            <Link to='/projects'>
              Explore the work
              <span aria-hidden='true'>→</span>
            </Link>
          </div>
        </article>

        <div className='homeQuickLinks'>
          <Link to='/skills_experience'>
            <span>Experience</span>
            <strong>Work, tools, and technical scope</strong>
            <p>See the technologies I use and the responsibilities behind my recent experience.</p>
            <i aria-hidden='true'>01</i>
          </Link>
          <Link to='/projects'>
            <span>Projects</span>
            <strong>Products and engineering decisions</strong>
            <p>Browse applications, experiments, case studies, source code, and live demos.</p>
            <i aria-hidden='true'>02</i>
          </Link>
        </div>
      </section>

      <Link to='/resume' className='resumeViewer'>
        <div>
          <span>Resume</span>
          <strong>A concise overview of my education, technical work, and experience.</strong>
        </div>
        <span aria-hidden='true'>Open resume →</span>
      </Link>
    </main>
  );
}

export default Home;
