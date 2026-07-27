import './Contacts.css';
import { useEffect, useState } from 'react';
import {
  AVAILABILITY_LABELS,
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
  type: 'operating_systems' | 'cyber_security' | 'system_design' | 'data_analytics' | 'fullstack_development' | 'networking';
}

function InterestArtifact({ type }: Pick<ContactInterest, 'type'>) {
  if (type === 'operating_systems') {
    return (
      <div className='artifact artifact--terminal' aria-hidden='true'>
        <div className='terminalBar'><span /><span /><span /><b>~/interests/os</b></div>
        <div className='terminalBody'>
          <p><i>martin@portfolio</i>:~/interests/os$ ./explore</p>
          <p><b>status:</b> actively_exploring</p>
          <p><b>focus:</b> processes memory filesystems</p>
          <div className='processRow'><span>PID</span><span>STATE</span><span>LAYER</span></div>
          <div className='processRow processRow--active'><span>2020</span><span>RUN</span><span>user -&gt; kernel</span></div>
          <p className='terminalNote'># tracing how software meets hardware<span className='shellCursor' /></p>
        </div>
      </div>
    );
  }

  if (type === 'cyber_security') {
    return (
      <div className='artifact artifact--security' aria-hidden='true'>
        <div className='artifactTitle'><span>security_check()</span><b>ALLOW</b></div>
        <div className='securityFlow'>
          <span>input</span><i>101101</i><span>validate</span><i>r-x</i><span>protected</span>
        </div>
        <div className='auditTree'>
          <p>├─ input validation <b>pass</b></p>
          <p>├─ authorization <b>pass</b></p>
          <p>├─ transport / TLS <b>pass</b></p>
          <p>└─ IoT device trust <em>review</em></p>
        </div>
        <small>more generated software means more surfaces to verify</small>
      </div>
    );
  }

  if (type === 'system_design') {
    return (
      <div className='artifact artifact--architecture' aria-hidden='true'>
        <div className='architectureScale'><span>1 user</span><i /><span>1M+ requests</span></div>
        <div className='architectureMap'>
          <div className='archNode'>client</div>
          <div className='archNode'>load balancer</div>
          <div className='archNode archNode--api'>api <span>01 / 02</span></div>
          <div className='archNode archNode--cache'>cache <b>hit</b></div>
          <div className='archNode'>database</div>
          <div className='archBranch'><i /><span>queue -&gt; worker</span></div>
          <span className='requestDot' />
        </div>
        <div className='architectureNotes'><span>request path</span><span>cache before storage</span><span>async work branches from API</span></div>
      </div>
    );
  }

  if (type === 'data_analytics') {
    return (
      <div className='artifact artifact--analytics' aria-hidden='true'>
        <div className='analyticsTop'>
          <div className='chartWrap'>
            <svg viewBox='0 0 240 105' role='presentation'>
              <path className='chartAxis' d='M22 8v78h208' />
              <path className='chartGrid' d='M22 26h208M22 50h208M22 74h208' />
              <path className='regressionLine' d='M30 76L218 21' />
              <g className='dataPoints'>
                <circle cx='40' cy='72' r='3' /><circle cx='65' cy='68' r='3' /><circle cx='89' cy='55' r='3' />
                <circle cx='112' cy='60' r='3' /><circle cx='138' cy='43' r='3' /><circle cx='164' cy='38' r='3' />
                <circle cx='190' cy='31' r='3' /><circle cx='213' cy='18' r='3' />
              </g>
            </svg>
            <span>study time</span><i>score</i>
          </div>
          <div className='statBlock'><span>n = 120</span><span>μ = 64.2</span><span>σ = 8.7</span><span>r = 0.74</span></div>
        </div>
        <div className='mathJourney'><span>before 2020<br /><b>avoided math</b></span><i /><span>now<br /><b>computation + applied math</b></span></div>
      </div>
    );
  }

  if (type === 'fullstack_development') {
    return (
      <div className='artifact artifact--fullstack' aria-hidden='true'>
        <div className='stackPane stackPane--ui'>
          <small>Product UI</small>
          <div className='miniBrowser'><span /><span /><p>Useful project</p><button tabIndex={-1}>View details</button></div>
        </div>
        <div className='requestPath'><span>GET</span><i /><span>200</span></div>
        <div className='stackPane stackPane--code'>
          <small>API + data</small>
          <code><i>const</i> project = <b>await</b><br /> db.projects.find(id);<br /><em>return</em> project;</code>
        </div>
      </div>
    );
  }

  return (
    <div className='artifact artifact--network' aria-hidden='true'>
      <div className='networkBoundary networkBoundary--lan'>LOCAL NETWORK</div>
      <div className='networkBoundary networkBoundary--wan'>INTERNET</div>
      <div className='networkMap'>
        <div className='networkNode networkNode--laptop'><b>laptop</b><span>192.168.1.14</span></div>
        <div className='networkNode networkNode--router'><b>router</b><span>Wi-Fi / DNS</span></div>
        <div className='networkNode networkNode--shield'><b>security</b><span>TLS :443</span></div>
        <div className='networkNode networkNode--server'><b>app server</b><span>HTTP / TCP</span></div>
        <div className='networkNode networkNode--data'><b>data</b><span>query / analyze</span></div>
        <span className='packet packet--one'>01</span><span className='packet packet--two'>02</span>
      </div>
    </div>
  );
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
    { 
      name: 'Operating Systems', 
      description: 'I am exploring how software interacts with processes, memory, filesystems, and hardware.', 
      backstory: 'Learning how low-level systems work feels like looking underneath everything else I build. I find it fascinating that a set of core ideas can coordinate hardware and turn it into a platform for nearly every kind of software.', 
      type: 'operating_systems' 
    },
    { 
      name: 'Cybersecurity', 
      description: 'Security interests me because reliable software must also protect the people and systems that depend on it.', 
      backstory: 'As more software is generated and shipped quickly from AI, I want to understand how to verify what we build rather than simply trust it. Cybersecurity also connects naturally to my interest in operating systems, networking, and the mathematics behind modern cryptography.',
      type: 'cyber_security' 
    },
    { 
      name: 'System Design', 
      description: 'I like thinking about how software changes as it moves from one user and one service to a much larger system.', 
      backstory: 'I have always been curious about how products handle millions of users and connections. System design gives me a practical way to explore scaling, reliability, data flow, caching, queues, and the tradeoffs that appear as software grows.', 
      type: 'system_design' 
    },
    { 
      name: 'Data Analytics', 
      description: 'Data analytics brings together statistics, computation, and the process of turning observations into useful decisions.', 
      backstory: 'I did not enjoy mathematics when I was younger, but I returned to it during the pandemic and gradually became fond of it. Data analytics appeals to me because it combines that newer interest in applied mathematics with the computational work I already enjoy.', 
      type: 'data_analytics' 
    },
    { 
      name: 'Full-stack Development', 
      description: 'Building end to end helps me connect backend decisions to interfaces that people can understand and use.', 
      backstory: 'One reason I started programming was the possibility of building products that genuinely help people. Full-stack work lets me follow an idea from its data model and services through to the user-facing experience, then judge whether all of those pieces work well together.', 
      type: 'fullstack_development' 
    },
    {
      name: 'Networking',
      description: 'Networking explains how the devices, applications, and infrastructure behind modern software communicate.',
      backstory: 'The internet and Wi-Fi can feel invisible when they work, which makes understanding them even more interesting to me. Networking also connects nearly all of my other interests: systems, security, distributed services, and data-driven applications.',
      type: 'networking'
    }
  ];

  const availabilityStatus = ['red', 'yellow', 'green'] as const;

  const [selectedInterest, setSelectedInterest] = useState<number | null>(null);
  const [time, setTime] = useState<Date>(new Date());
  const [hasCopied, setHasCopied] = useState(false);

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
      <header className='contactHeader'>
        <div className='contactStatusBadge'>
          <span />
          Open to conversations and collaborations
        </div>
        <h1>
          My Contacts
        </h1>
        <p className='contactName'>Martin Darius Alba</p>
        <p className='contactIntro'>Reach out about software opportunities, project collaborations, or any of the engineering work documented in this portfolio.</p>
      </header>
      
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
          Email is the most reliable way to contact me about professional opportunities, collaborations, or questions about my work.
        </p>
        <h3 className='professionalLinksHeading'>Professional links:</h3>
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

      <section className='contactSection'>
        <header className='contactSectionHeader'>
          <span>02</span>
          <div>
            <p>Technical interests · an active learning map</p>
            <h2>Areas of Interest</h2>
          </div>
        </header>
        <div className='interestMapIntro'>
          <p>These are the systems, tools, and ideas I keep returning to, not necessarily a list of mastered skills, but a map of what I am learning and how the pieces connect.</p>
          <div className='interestTrail' aria-label='A loose connection between my areas of interest'>
            <span>systems</span><i /><span>security</span><i /><span>networks</span><i /><span>products</span><i /><span>data</span>
          </div>
        </div>
        <div className='interestsWorkbench'>
          {interest.map((interestItem, index) => {
            const isSelected = selectedInterest === index;
            const panelId = `interest-detail-${interestItem.type}`;
            return (
              <article
                key={interestItem.name}
                className={`interestModule interestModule--${interestItem.type} ${isSelected ? 'is-selected' : ''}`}
              >
                <div className='interestModuleInner'>
                  <div className='interestModuleFace interestModuleFront' aria-hidden={isSelected}>
                    <div className='interestModuleHeader'>
                      <div>
                        <small>FIELD_{String(index + 1).padStart(2, '0')} · CURRENTLY EXPLORING</small>
                        <h3>{interestItem.name}</h3>
                      </div>
                      <span className='learningStatus'><i /> actively exploring</span>
                    </div>
                    <p className='interestDescription'>{interestItem.description}</p>
                    <InterestArtifact type={interestItem.type} />
                    <button
                      className='interestDetailToggle'
                      type='button'
                      aria-label={`Show why ${interestItem.name} matters to me`}
                      tabIndex={isSelected ? -1 : 0}
                      onClick={() => setSelectedInterest(index)}
                    >
                      <span>Why this matters to me</span>
                      <i aria-hidden='true'>↗</i>
                    </button>
                  </div>
                  <div className='interestModuleFace interestModuleBack' id={panelId} aria-hidden={!isSelected}>
                    <div>
                      <small>FIELD_{String(index + 1).padStart(2, '0')} · NOTES FROM THE JOURNEY</small>
                      <p className='interestBackLabel'>Why {interestItem.name} matters to me</p>
                      <h3>{interestItem.name}</h3>
                    </div>
                    <blockquote>{interestItem.backstory}</blockquote>
                    <button
                      className='interestDetailToggle interestDetailToggle--back'
                      type='button'
                      aria-label={`Return to the ${interestItem.name} overview`}
                      tabIndex={isSelected ? 0 : -1}
                      onClick={() => setSelectedInterest(null)}
                    >
                      <span>Back to overview</span>
                      <i aria-hidden='true'>↙</i>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className='contactSection'>
        <header className='contactSectionHeader'>
          <span>03</span>
          <div>
            <p>Current status</p>
            <h2>Availability</h2>
          </div>
        </header>
        <p className='availabilityDescription'>I am always open to thoughtful conversations and new technical perspectives, regardless of the status below.</p>
        <p className='status'>Status:</p>
        <div className='statusTable'>
          <ul>
            <li className={availabilityStatus[POSITION_AVAILABILITY]}>
              <div className='availabilityHeading'>
                <span>Internship availability</span>
                <span className='availabilityStatusBadge'>
                  <i aria-hidden='true' />
                  {AVAILABILITY_LABELS[POSITION_AVAILABILITY]}
                </span>
              </div>
              <strong>{POSITION_DESC}</strong>
            </li>
            <li className={availabilityStatus[COLLAB_AVAILABILITY]}>
              <div className='availabilityHeading'>
                <span>Collaboration availability</span>
                <span className='availabilityStatusBadge'>
                  <i aria-hidden='true' />
                  {AVAILABILITY_LABELS[COLLAB_AVAILABILITY]}
                </span>
              </div>
              <strong>{COLLAB_DESC}</strong>
            </li>
            <li className={availabilityStatus[FREELANCE_AVAILABILITY]}>
              <div className='availabilityHeading'>
                <span>Freelance availability</span>
                <span className='availabilityStatusBadge'>
                  <i aria-hidden='true' />
                  {AVAILABILITY_LABELS[FREELANCE_AVAILABILITY]}
                </span>
              </div>
              <strong>{FREELANCE_DESC}</strong>
            </li>
          </ul>
        </div>
      </section>

      {/* location */}
      <section className='contactSection'>
        <header className='contactSectionHeader'>
          <span>04</span>
          <div>
            <p>Local context</p>
            <h2>Location</h2>
          </div>
        </header>
        <p className='locationDescription'> I am currently residing and studying in the Philippines.</p>
        <div className='clockBox'>
          Current time in where I live (UTC + 8): <br />
          {time.toLocaleString()}
        </div>
        <div className='locationMap'>
          <iframe
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d123489.34661088791!2d120.94785957731173!3d14.710212346670867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b1b519841b5f%3A0x5e770e225042d1a!2sCaloocan%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1782221355237!5m2!1sen!2sph'
            title='Map showing Caloocan, Metro Manila'
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
            allowFullScreen
          />
        </div>
      </section>

      <button className='contactBackToTop' type='button' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label='Back to top'>
        <span>Back to top</span>
        <svg viewBox='0 0 24 24' aria-hidden='true'>
          <path d='m6 15 6-6 6 6' />
        </svg>
      </button>
    </section>
  );
}
export default Contacts;
