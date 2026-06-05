import './Contacts.css';
import { useEffect, useState } from 'react';
import { COLLAB_AVAILABILITY, POSITION_AVAILABILITY, FREELANCE_AVAILABILITY,
         COLLAB_DESC, POSITION_DESC, FREELANCE_DESC } from '../../imports/constants';

interface ProfessionalLink {
  img_url: string;
  name: string;
  description: string;
}

interface ContactInterest {
  name: string;
  description: string;
  backstory: string;
}

function Contacts() {
  const proLinks: Array<ProfessionalLink> = [
    {img_url: 'temp.jpg', name: 'github', description: 'github is great since i can share stuff.'},
    {img_url: 'temp.jpg', name: 'linkedin', description: 'linkedin is great since i can share stuff.'},
    {img_url: 'temp.jpg', name: 'resume', description: 'my resume is great since its cool.'},
  ];

  const interest: Array<ContactInterest> = [
    {name: 'trains', description: 'I like trains', backstory: 'since kid, liked trains'},
    {name: 'trains1', description: 'some other', backstory: 'yeah'},
    {name: 'trains2', description: 'stuff', backstory: 'yeah'},
    {name: 'trains3', description: 'things', backstory: 'yeah'},
    {name: 'trains4', description: 'yeah', backstory: 'yeah'},
  ];

  const availabilityStatus: Array<string> = [
    'red',
    'yellow',
    'green',
  ];

  const [flippedCards, setFlippedCards] = useState<Array<boolean>>(new Array(interest.length).fill(false)); // init false array
  const [time, setTime] = useState<Date>(new Date());

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

  return (
    <section className='contactContainer'>
      {/* Page header
          visual TODO:
            - Add a small animated status badge, like Available for collaboration or Open to opportunities.
            - Use a subtle glow or pulse effect for cooler animation.
       */}
      <header className='contactHeader'>
        <h1>Contact</h1>
        <p className='contactName'>Martin Darius Alba</p>
        <p className='contactIntro'>
          Reach out for opportunities, collaborations, or questions about my projects.
        </p>
      </header>
      {/* primary contact
          visual TODO:
            - Add copy functionality and indicators for copying like changing the text briefly to copied.
      */}
      <section className='contactSection'>
        <h2>Best Way To Reach Me</h2>
        <div className='emailCopy'>
          <p> Email: albamartindarius@gmail.com </p>
          <button className='copyButton'> Copy my Email</button>
        </div>
        <p className='bestwayDescription'> Email is the best way to contact me for professional opportunities, collaboration, or questions about my work.</p>
      </section>
      {/* professional links 2 - electric boogaloo
          visual TODO:
            - Make each link a small interactive card.
            - On hover, can slightly lift the card and brighten the icon.
            - Should be simple and minimalistic.
      */}
      <section className='contactSection'>
        <h2>Professional Links</h2>
        <div className='linkBoxGroup'>
          {proLinks.map((linkItem) => {
            return (
              <div key={linkItem.name} className='linkBox'>
                <img src={linkItem.img_url} alt='temp image'/>
                <p className='linkName'>{linkItem.name}</p>
                <p className='linkDesc'>{linkItem.description}</p>
              </div>
            );
          })}
        </div>
      </section>
      {/* interests in terms of job opportunities
          visual TODO
            - Make it look more appealing, all the CSS is temporary for now.
              It is only there to see if logic works. */}
      <section className='contactSection'>
        <h2>Interests</h2>
        <div className='interestsGroup'>
          {interest.map((interestItem, index) => {
            const isFlipped = flippedCards[index];
            return (
              <button
                key={interestItem.name}
                className={`card ${isFlipped ? 'flipped' : ''}`}
                onClick={() => handleFlip(index)}>
                
                <div className='cardInner'>
                  <div className='cardFace cardFront'>
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
        <h2>Availability </h2>
        <p className='availabilityDescription'>I'm always open to learn new tech, feel free to reach out regardless of status!</p>
        <p className='status'>Status:</p>
        <div className='statusTable'>
          <ul>
            <li className={availabilityStatus[POSITION_AVAILABILITY]}>Internship availability: {POSITION_DESC}</li>
            <li className={availabilityStatus[COLLAB_AVAILABILITY]}>Collaboration availability: {COLLAB_DESC}</li>
            <li className={availabilityStatus[FREELANCE_AVAILABILITY]}>Free-lancing availability: {FREELANCE_DESC}</li>
          </ul>
        </div>
      </section>
      {/* location */}
      <section className='contactSection'>
        <h2>Location</h2>
        <p className='locationDescription'> currently residing in the philippines</p>
        <div className='clockBox'>
          Current time in where I live (UTC + 8): <br />
          {time.toLocaleString()}
        </div>
      </section>

    </section>
  );
}
export default Contacts;