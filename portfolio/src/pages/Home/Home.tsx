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
            I like building software that help other people in either doing the smallest things, or addressing larger, more complex
            problems that can improve how people work or live. I like taking an idea or problem, breaking it down, and making it into something practical
            that people can actually use.
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
            <p className='homeFeatureLabel'>What I really like doing</p>
            <h2>About me</h2>
            <p>
              When it comes to making software or almost anything in life, I like the journey more than anything. The problems I encounter, the bugs to fix, the time spent researching, learning
              and banging my head against a wall trying to see where it went wrong. 
              <br />
              <br />
              I love quoting Homer's idea that life’s greatest obstacle isn't pain, but comfort. It is a paradox of life that the most familiar environments are often the ones that breed stagnation. 
              That is why I intentionally learn new and unfamiliar things with every new project, not that it's painful, but tedious and slow, especially since I am still new in the tech industry.
              I deliberately choose the path of most resistance, knowing that the true reward lies entirely in the struggle of figuring it out.
            </p>
          </div>
        </article>

        <div className='homeQuickLinks'>
          <Link to='/skills_experience'>
            <span>Work, tools, and technical scope</span>
            <strong>Skills and Experience</strong>
            <p>See the technologies I have used and are currently using, together with some of my experience in the industry</p>
            <div className='homeQuickLinkFooter'>
              Explore <span aria-hidden='true'>→</span>
            </div>
          </Link>
          <Link to='/projects'>
            <span>Products and engineering decisions</span>
            <strong>Projects</strong>
            <p>
              Check out some of the notable projects I have made, each involving their different technologies, challenges, and some of 
              the lessons learned along the way.
            </p>
            <div className='homeQuickLinkFooter'>
              Explore the work <span aria-hidden='true'>→</span>
            </div>
          </Link>
        </div>
      </section>

      <Link to='/resume' className='resumeViewer'>
        <div>
          <span>Resume</span>
          <strong>A closer look to my education, technical experience, professional work, and some of the skills I have gained along the way.</strong>
        </div>
        <span aria-hidden='true'>Open resume →</span>
      </Link>
    </main>
  );
}

export default Home;
