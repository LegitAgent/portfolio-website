import './Contacts.css';
import { useEffect, useRef, useState } from 'react';
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
  if (type === 'cyber_security') {
    const hexRows = [
      ['48', '65', '6C', '6C', '6F', 'A3', 'F2', '19'],
      ['C7', '22', 'FF', '01', '3D', '9A', 'B8', '0E'],
      ['7F', 'F6', 'A2', '13', 'D4', '8C', '2B', '90'],
    ];

    return (
      <div className='interestVisual securityVisual' aria-hidden='true'>
        <div className='securityScan' />
        <div className='hexField'>
          {hexRows.map((row, rowIndex) => (
            <div key={rowIndex}>
              {row.map((byte, byteIndex) => (
                <span
                  className={(rowIndex + byteIndex) % 5 === 0 ? 'is-scrambling' : ''}
                  key={`${rowIndex}-${byte}`}
                  data-alt={['0x', 'AF', '7C', 'E1'][byteIndex % 4]}
                >
                  {byte}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className='hashTransform'>
          <span>password123</span>
          <i>SHA-256</i>
          <code>ef92b778bafe771e89245b89ecbc08a44...</code>
        </div>
        <div className='cryptoLegend'>
          <span>AES-256</span><span>TLS 1.3</span><span>RSA</span><span>0x7FF6A2</span>
        </div>
      </div>
    );
  }

  if (type === 'networking') {
    return (
      <div className='interestVisual networkVisual' aria-hidden='true'>
        <div className='osiRail'><span>APPLICATION</span><span>TRANSPORT</span><span>NETWORK</span><span>DATA LINK</span></div>
        <svg className='networkRoutes' viewBox='0 0 560 220' preserveAspectRatio='none' role='presentation'>
          <path id='network-route-a' d='M44 58 C150 18 188 168 286 110 S430 38 525 74' />
          <path id='network-route-b' d='M32 170 C132 110 218 202 310 145 S428 116 530 176' />
          <path id='network-route-c' d='M76 112 C160 104 205 54 292 62 S415 194 500 126' />
          <g className='networkNodes'>
            <circle cx='44' cy='58' r='7' /><circle cx='286' cy='110' r='9' /><circle cx='525' cy='74' r='7' />
            <circle cx='32' cy='170' r='6' /><circle cx='310' cy='145' r='8' /><circle cx='530' cy='176' r='6' />
          </g>
        </svg>
        <span className='networkPacket networkPacket--tcp'>TCP</span>
        <span className='networkPacket networkPacket--dns'>DNS</span>
        <span className='networkPacket networkPacket--ack'>ACK</span>
        <div className='packetInspector'>
          <span><b>SRC</b>192.168.1.24</span>
          <span><b>DST</b>104.18.32.47</span>
          <span><b>PROTO</b>TCP</span>
          <span><b>PORT</b>443</span>
        </div>
      </div>
    );
  }

  if (type === 'operating_systems') {
    const memoryCells = Array.from({ length: 20 });

    return (
      <div className='interestVisual osVisual' aria-hidden='true'>
        <div className='addressRail'>
          <span>0x7FFF2A01</span><span>0x7FFF2A09</span><span>0x00401000</span><span>0x00401120</span>
        </div>
        <div className='memoryMap'>
          {memoryCells.map((_, index) => (
            <i className={index % 3 !== 1 ? 'is-allocated' : ''} key={index} style={{ animationDelay: `${index * -230}ms` }} />
          ))}
        </div>
        <div className='scheduler'>
          <p><span>PID 1024</span><b className='processRunning'>RUNNING</b></p>
          <p><span>PID 1337</span><b>WAITING</b></p>
          <p><span>PID 2048</span><b>BLOCKED</b></p>
        </div>
        <div className='kernelTrace'><span>MMU</span><span>PAGE FAULT</span><span>SYSCALL</span><span>CONTEXT SWITCH</span></div>
      </div>
    );
  }

  if (type === 'fullstack_development') {
    return (
      <div className='interestVisual fullstackVisual' aria-hidden='true'>
        <div className='devBrowser'>
          <div className='browserChrome'><i /><i /><i /><span>localhost:5173/projects</span></div>
          <div className='browserCanvas'>
            <b>Projects</b>
            <span className='browserHero' />
            <div><i /><i /><i /></div>
          </div>
        </div>
        <div className='devEditor'>
          <div className='editorTab'>projects.tsx <span>TS</span></div>
          <pre><code><i>const</i> response = <b>await</b>{'\n'}  fetch(<em>"/api/projects"</em>);{'\n'}{'\n'}setProjects({'\n'}  <b>await</b> response.json(){'\n'});</code></pre>
          <div className='requestResult'><span>GET /api/projects</span><b>200 OK</b><i>42ms</i></div>
        </div>
        <span className='hotReloadPulse'>HMR update</span>
      </div>
    );
  }

  if (type === 'data_analytics') {
    const points = [
      [48, 154], [82, 139], [111, 144], [142, 112], [172, 121],
      [207, 88], [242, 97], [276, 65], [310, 72], [350, 42],
    ];

    return (
      <div className='interestVisual analyticsVisual' aria-hidden='true'>
        <svg className='analysisPlot' viewBox='0 0 400 205' preserveAspectRatio='none' role='presentation'>
          <path className='plotGrid' d='M34 18V180H382M34 58H382M34 98H382M34 138H382M104 18V180M174 18V180M244 18V180M314 18V180' />
          <path className='distributionArea' d='M40 172 C85 170 104 144 135 108 C168 68 194 40 225 74 C260 112 281 154 376 172 Z' />
          <path className='regressionPath' d='M42 166L370 34' />
          <g className='analysisPoints'>
            {points.map(([cx, cy], index) => <circle cx={cx} cy={cy} key={cx} r='4' style={{ animationDelay: `${index * 90}ms` }} />)}
          </g>
        </svg>
        <div className='analysisStats'><span>n = 120</span><span>μ = 64.2</span><span>σ = 8.7</span><span>r = 0.74</span><span>R² = .55</span></div>
        <div className='analysisMath'><span>E[X]</span><span>Var(X)</span><span>P(A|B)</span><span>∂f/∂x</span><span>∇f</span></div>
      </div>
    );
  }

  return (
    <div className='interestVisual scaleVisual' aria-hidden='true'>
      <div className='requestRate'><span>10 req/s</span><i /><span>1K req/s</span><i /><b>100K req/s</b></div>
      <div className='requestStream'>
        {Array.from({ length: 14 }).map((_, index) => <i key={index} style={{ animationDelay: `${index * -180}ms` }} />)}
      </div>
      <div className='proxyPlane'><span>NGINX</span><b>LOAD BALANCER</b></div>
      <div className='serviceFleet'><span>API 01</span><span>API 02</span><span>API 03</span><span>API 04</span></div>
      <div className='cacheRoute'><b>CACHE HIT</b><span>CACHE MISS</span></div>
      <div className='storagePlane'><span>SHARD 01</span><span>SHARD 02</span><span>REPLICA</span><span>QUEUE</span></div>
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
      name: 'Cybersecurity',
      description: 'Reliable software also has to survive hostile inputs and hostile users.',
      backstory: 'As more software is generated and shipped quickly from AI, I want to understand how to verify what we build rather than simply trust it. Cybersecurity also connects naturally to my interest in operating systems, networking, and the mathematics behind modern cryptography.',
      type: 'cyber_security',
    },
    {
      name: 'Networking',
      description: 'I like understanding what happens between one machine sending a request and another answering it.',
      backstory: 'The internet and Wi-Fi can feel invisible when they work, which makes understanding them even more interesting to me. Networking also connects nearly all of my other interests: systems, security, distributed services, and data-driven applications.',
      type: 'networking',
    },
    {
      name: 'Operating Systems',
      description: 'I want to understand what happens beneath applications: scheduling, memory, filesystems, and syscalls.',
      backstory: 'Learning how low-level systems work feels like looking underneath everything else I build. I find it fascinating that a set of core ideas can coordinate hardware and turn it into a platform for nearly every kind of software.',
      type: 'operating_systems',
    },
    {
      name: 'Full-stack Development',
      description: 'I like carrying an idea from its data model and API all the way to the interface people use.',
      backstory: 'One reason I started programming was the possibility of building products that genuinely help people. Full-stack work lets me follow an idea from its data model and services through to the user-facing experience, then judge whether all of those pieces work well together.',
      type: 'fullstack_development',
    },
    {
      name: 'Data Analytics',
      description: 'Statistics gives me a concrete way to turn messy observations into something I can reason about.',
      backstory: 'I did not enjoy mathematics when I was younger, but I returned to it during the pandemic and gradually became fond of it. Data analytics appeals to me because it combines that newer interest in applied mathematics with the computational work I already enjoy.',
      type: 'data_analytics',
    },
    {
      name: 'System Design',
      description: 'I like asking what breaks first when traffic grows, then designing around it.',
      backstory: 'I have always been curious about how products handle millions of users and connections. System design gives me a practical way to explore scaling, reliability, data flow, caching, queues, and the tradeoffs that appear as software grows.',
      type: 'system_design',
    },
  ];

  const availabilityStatus = ['red', 'yellow', 'green'] as const;

  const [selectedInterest, setSelectedInterest] = useState<number | null>(null);
  const [time, setTime] = useState<string>('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const copyResetTimer = useRef<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date();
      const formatDate = new Intl.DateTimeFormat('en-PH', {
        timeZone: 'Asia/Manila',
        timeStyle: 'medium'
      }).format(date);
      setTime(formatDate);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (copyResetTimer.current !== null) {
        window.clearTimeout(copyResetTimer.current);
      }
    };
  }, []);

  const copyEmail = async () => {
    if (copyResetTimer.current !== null) {
      window.clearTimeout(copyResetTimer.current);
    }

    try {
      await navigator.clipboard.writeText('albamartindarius@gmail.com');
      setCopyStatus('copied');
      copyResetTimer.current = window.setTimeout(() => setCopyStatus('idle'), 1600);
    } catch {
      setCopyStatus('error');
      copyResetTimer.current = window.setTimeout(() => setCopyStatus('idle'), 4000);
    }
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
          <button
            className={copyStatus === 'error' ? 'copyButton is-error' : 'copyButton'}
            type='button'
            onClick={copyEmail}
            aria-describedby={copyStatus === 'error' ? 'copy-email-error' : undefined}
          >
            {copyStatus === 'copied' ? 'Copied' : copyStatus === 'error' ? 'Try Copy Again' : 'Copy my Email'}
          </button>
          {copyStatus === 'error' && (
            <p className='copyFeedback' id='copy-email-error' role='alert'>
              Clipboard access was blocked. Please select and copy the email address manually.
            </p>
          )}
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
            <p>Technical interests</p>
            <h2>Areas of Interest</h2>
          </div>
        </header>
        <div className='interestMapIntro'>
          <p>Six fields I keep returning to, each for a different reason.</p>
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
                      <h3>{interestItem.name}</h3>
                      <span className='interestIndex'>{String(index + 1).padStart(2, '0')}</span>
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
                      <p className='interestBackLabel'>Why it stays on my radar</p>
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
