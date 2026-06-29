import './Contacts.css';
import { useEffect, useState } from 'react';
import {
  COLLAB_AVAILABILITY,
  POSITION_AVAILABILITY,
  FREELANCE_AVAILABILITY,
  COLLAB_DESC,
  EMAIL_ICON,
  POSITION_DESC,
  FREELANCE_DESC,
  GITHUB_ICON,
  GITHUB_URL,
  LINKEDIN_ICON,
  LINKEDIN_URL,
  RESUME_ICON,
  RESUME_NAME,
} from '../../config/constants';

interface ProfessionalLink {
  img_url: string;
  name: string;
  description: string;
  href: string;
  iconClass?: string;
}

interface ContactInterest {
  name: string;
  description: string;
  backstory: string;
  type: 'trains' | 'trains1' | 'trains2' | 'trains3' | 'trains4';
}

function Contacts() {
  const proLinks: Array<ProfessionalLink> = [
    {
      img_url: GITHUB_ICON,
      name: 'github',
      description: 'Repositories, experiments, and open-source activity.',
      href: GITHUB_URL,
      iconClass: 'linkIcon--invert',
    },
    {
      img_url: LINKEDIN_ICON,
      name: 'linkedin',
      description: 'Professional experience, background, and updates.',
      href: LINKEDIN_URL,
    },
    {
      img_url: RESUME_ICON,
      name: 'resume',
      description: 'A concise overview of my technical work and education.',
      href: RESUME_NAME,
      iconClass: 'linkIcon--invert',
    },
  ];

  const interest: Array<ContactInterest> = [
    { name: 'trains', description: 'I like trains', backstory: 'since kid, liked trains', type: 'trains' },
    { name: 'trains1', description: 'some other', backstory: 'yeah', type: 'trains1' },
    { name: 'trains2', description: 'stuff', backstory: 'yeah', type: 'trains2' },
    { name: 'trains3', description: 'things', backstory: 'yeah', type: 'trains3' },
    { name: 'trains4', description: 'yeah', backstory: 'yeah', type: 'trains4' },
  ];

  const availabilityStatus: Array<string> = ['red', 'yellow', 'green'];

  const [flippedCards, setFlippedCards] = useState<Array<boolean>>(new Array(interest.length).fill(false)); // init false array
  const [time, setTime] = useState<Date>(new Date());
  const [hasCopied, setHasCopied] = useState(false);

  const handleFlip = (index: number) => {
    setFlippedCards((array) => {
      return array.map((isFlipped, curIdx) => {
        return curIdx === index ? !isFlipped : isFlipped;
      });
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const copyEmail = async () => {
    await navigator.clipboard.writeText('albamartindarius@gmail.com');
    setHasCopied(true);
    window.setTimeout(() => setHasCopied(false), 1600);
  };

  return (
    <section className='contactContainer'>
      {/* Page header
          visual TODO:
            - Add a small animated status badge, like Available for collaboration or Open to opportunities.
            - Use a subtle glow or pulse effect for cooler animation.
       */}
      <header className='contactHeader'>
        <div className='contactStatusBadge'>
          <span />
          Open to collaboration
        </div>
        <h1>
          Contact <span>Me</span>
        </h1>
        <p className='contactName'>Martin Darius Alba</p>
        <p className='contactIntro'>Reach out for opportunities, collaborations, or questions about my projects.</p>
      </header>
      {/* primary contact
          visual TODO:
            - Add copy functionality and indicators for copying like changing the text briefly to copied.
      */}
      <section className='contactSection'>
        <header className='contactSectionHeader'>
          <span>01</span>
          <div>
            <p>Direct communication</p>
            <h2>Best Way To Reach Me</h2>
          </div>
        </header>
        <div className='emailCopy'>
          <div className='emailIdentity'>
            <i>
              <img src={EMAIL_ICON} alt='' aria-hidden='true' />
            </i>
            <p>
              <span>Email</span>
              albamartindarius@gmail.com
            </p>
          </div>
          <button className='copyButton' type='button' onClick={copyEmail}>
            {hasCopied ? 'Copied' : 'Copy my Email'}
          </button>
        </div>
        <p className='bestwayDescription'>
          {' '}
          Email is the best way to contact me for professional opportunities, collaboration, or questions about my work.
        </p>
      </section>
      {/* professional links 2 - electric boogaloo
          visual TODO:
            - Make each link a small interactive card.
            - On hover, can slightly lift the card and brighten the icon.
            - Should be simple and minimalistic.
      */}
      <section className='contactSection'>
        <header className='contactSectionHeader'>
          <span>02</span>
          <div>
            <p>Professional profiles</p>
            <h2>Professional Links</h2>
          </div>
        </header>
        <div className='linkBoxGroup'>
          {proLinks.map((linkItem) => {
            return (
              <a key={linkItem.name} className='linkBox' href={linkItem.href} target='_blank' rel='noreferrer'>
                <div className='linkBoxTop'>
                  <i>
                    <img className={linkItem.iconClass ?? ''} src={linkItem.img_url} alt='' aria-hidden='true' />
                  </i>
                  <svg viewBox='0 0 24 24' aria-hidden='true'>
                    <path d='M14 5h5v5' />
                    <path d='m10 14 9-9' />
                    <path d='M19 13v6H5V5h6' />
                  </svg>
                </div>
                <p className='contactlinkName'>{linkItem.name}</p>
                <p className='linkDesc'>{linkItem.description}</p>
              </a>
            );
          })}
        </div>
      </section>
      {/* interests in terms of job opportunities
          visual TODO
            - Make it look more appealing, all the CSS is temporary for now.
              It is only there to see if logic works. */}
      <section className='contactSection'>
        <header className='contactSectionHeader'>
          <span>03</span>
          <div>
            <p>Technical Interests</p>
            <h2>Interests</h2>
          </div>
        </header>
        <div className='interestsGroup'>
          {interest.map((interestItem, index) => {
            const isFlipped = flippedCards[index];
            return (
              <button
                key={interestItem.name}
                className={`card card--${interestItem.type} ${isFlipped ? 'flipped' : ''}`}
                type='button'
                aria-pressed={isFlipped}
                onClick={() => handleFlip(index)}
              >
                <div className='cardInner'>
                  <div className='cardFace cardFront'>
                    <small>{String(index + 1).padStart(2, '0')}</small>
                    <h3>{interestItem.name}</h3>
                    <p>{interestItem.description}</p>
                    <span>View more</span>
                  </div>

                  <div className='cardFace cardBack'>
                    <p>{interestItem.backstory}</p>
                    <span>Back</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>
      {/* availability 
          visual TODO
            - Make the availability bars look more appealing.
            - Make the availability status become more interactive.
      */}
      <section className='contactSection'>
        <header className='contactSectionHeader'>
          <span>04</span>
          <div>
            <p>Current status</p>
            <h2>Availability</h2>
          </div>
        </header>
        <p className='availabilityDescription'>I'm always open to learn new tech, feel free to reach out regardless of status!</p>
        <p className='status'>Status:</p>
        <div className='statusTable'>
          <ul>
            <li className={availabilityStatus[POSITION_AVAILABILITY]}>
              <span>Internship availability</span>
              <strong>{POSITION_DESC}</strong>
            </li>
            <li className={availabilityStatus[COLLAB_AVAILABILITY]}>
              <span>Collaboration availability</span>
              <strong>{COLLAB_DESC}</strong>
            </li>
            <li className={availabilityStatus[FREELANCE_AVAILABILITY]}>
              <span>Freelance availability</span>
              <strong>{FREELANCE_DESC}</strong>
            </li>
          </ul>
        </div>
      </section>
      {/* location */}
      <section className='contactSection'>
        <header className='contactSectionHeader'>
          <span>05</span>
          <div>
            <p>Local context</p>
            <h2>Location</h2>
          </div>
        </header>
        <p className='locationDescription'> currently residing in the philippines</p>
        <div className='clockBox'>
          Current time in where I live (UTC + 8): <br />
          {time.toLocaleString()}
        </div>
        <div className='locationMap'>
          <div className='locationMapHud' aria-hidden='true'>
            <span>14.7102° N</span>
            <strong>Caloocan · Metro Manila</strong>
            <span>120.9479° E</span>
          </div>
          <iframe
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d123489.34661088791!2d120.94785957731173!3d14.710212346670867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b1b519841b5f%3A0x5e770e225042d1a!2sCaloocan%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1782221355237!5m2!1sen!2sph'
            title='Map showing Caloocan, Metro Manila'
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
            allowFullScreen
          />
        </div>
      </section>
    </section>
  );
}
export default Contacts;
