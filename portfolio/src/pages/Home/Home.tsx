import './Home.css';
import { useNavigate } from 'react-router-dom';
import { redirect } from '../../config/routing';
import { GITHUB_URL, LINKEDIN_URL, GITHUB_ICON, LINKEDIN_ICON, EMAIL_ICON, PROFILE_PICTURE } from '../../config/constants';

type HomeIcon = 'skills' | 'projects' | 'focus' | 'resume';

interface HomeCard {
  title: string;
  description: string;
  action?: string;
  path?: string;
  icon: HomeIcon;
}

function HomeCardIcon({ icon }: { icon: HomeIcon }) {
  if (icon === 'projects') {
    return (
      <svg viewBox='0 0 24 24' aria-hidden='true'>
        <path d='M4.75 5.5h14.5v10.25H4.75V5.5Zm0 10.25 4.25-4 3 2.7 2.35-2.15 4.9 3.45M8.5 19h7' />
      </svg>
    );
  }

  if (icon === 'focus') {
    return (
      <svg viewBox='0 0 24 24' aria-hidden='true'>
        <path d='M12 4.5v3M12 16.5v3M4.5 12h3M16.5 12h3M8.05 8.05l2.12 2.12M13.83 13.83l2.12 2.12M15.95 8.05l-2.12 2.12M10.17 13.83l-2.12 2.12' />
        <circle cx='12' cy='12' r='2.75' />
      </svg>
    );
  }

  if (icon === 'resume') {
    return (
      <svg viewBox='0 0 24 24' aria-hidden='true'>
        <path d='M7 3.75h7.25L18 7.5v12.75H7V3.75Z' />
        <path d='M14 3.75V7.8h4M9.5 11.5h5M9.5 14.5h5M9.5 17.5h3' />
      </svg>
    );
  }

  return (
    <svg viewBox='0 0 24 24' aria-hidden='true'>
      <path d='M7.5 5.25h9M7.5 9.75h9M7.5 14.25h9M5.25 5.25h.01M5.25 9.75h.01M5.25 14.25h.01' />
      <path d='M4 19h16' />
    </svg>
  );
}

function Home() {
  const navigate = useNavigate();

  const homeCards: HomeCard[] = [
    {
      title: 'Experience & Skills',
      description: 
        'Check out some of the technologies I have used, as well as some of my experience in the field. Still starting out, and still looking for new things to learn!',
      action: 'View Experience & Skills',
      path: '/skills_experience',
      icon: 'skills',
    },
    {
      title: 'Projects',
      description:
        'Check out some of the projects I have worked on and are currently working on!',
      action: 'View Projects',
      path: '/projects',
      icon: 'projects',
    },
    {
      title: 'Current Focus',
      description:
        'Right now, I am improving my full-stack skills through my projects. I am also learning system design and operating systems, and still finding my grounds as to which branch of Computer Science I want to take.',
      icon: 'focus',
    },
  ];

  return (
    <section className='hero'>
      <div className='introduction'>
        <div className='pictureWrap'>
          <img id='portfolioPicture' src={PROFILE_PICTURE} alt='Martin Darius Alba' />
        </div>
        <div className='introductionContent'>
          <div className='nameTitle'>
            <p>Martin Darius Alba</p>
          </div>

          <div className='currentRole'>Student</div>

          <div className='introContent'>
            I am a computer science student who likes building more practical software and experimenting with different kinds of projects. From websites and
            extensions to games, I am still open to learn new branches of computer science and I enjoy learning by making things that people can actually use.
          </div>

          <div className='contactLinks'>
            {/* must have arrow func for funcs with args in react */}
            <button onClick={() => redirect(GITHUB_URL)} className=' buttonContact'>
              <div className='contactLinkContent'>
                <img src={GITHUB_ICON} alt='GitHub' /> GitHub
              </div>
            </button>

            <button onClick={() => redirect(LINKEDIN_URL)} className=' buttonContact'>
              <div className='contactLinkContent'>
                <img src={LINKEDIN_ICON} alt='LinkedIn' /> LinkedIn
              </div>
            </button>

            <button onClick={() => navigate('/contacts')} className=' buttonContact'>
              <div className='contactLinkContent'>
                <img src={EMAIL_ICON} alt='Contacts' /> More contacts
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className='otherSection'>
        {homeCards.map((card) => {
          const cardContent = (
            <>
              <span className='homeCardIcon'>
                <HomeCardIcon icon={card.icon} />
              </span>
              <span className='homeCardTitle'>{card.title}</span>
              <span className='homeCardDescription'>{card.description}</span>
              {card.action && <span className='homeCardAction'>{card.action}</span>}
            </>
          );

          const path = card.path;

          if (path) {
            return (
              <button className='otherBox' onClick={() => navigate(path)} key={card.title}>
                {cardContent}
              </button>
            );
          }

          return (
            <article className='otherBox' key={card.title}>
              {cardContent}
            </article>
          );
        })}
      </div>

      <button onClick={() => navigate('/resume')} className='resumeViewer'>
        <span className='homeCardIcon'>
          <HomeCardIcon icon='resume' />
        </span>
        <span className='homeCardTitle'>Resume</span>
        <span className='homeCardDescription'>View my resume for a quick overview of my education, projects, technical skills, and experience.</span>
        <span className='homeCardAction'>Open Resume</span>
      </button>
    </section>
  );
}

export default Home;
