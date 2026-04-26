import './Hero.css'
import Tilty from 'react-tilty'

function Hero() {
  return (
    <section className="hero">
      <div className="introduction">
        <div className="pictureWrap">
          <img id="portfolioPicture" className="w-28 sm:w-32 md:w-36 lg:w-50" src="/portfolio_pic.png" alt="Portfolio Picture" />
        </div>
        <div className="introductionContent">
          <div className="nameTitle">
            <p>Hello, I am Martin Darius Alba</p>
          </div>
          <Tilty
            className="heroTilt w-full max-w-[360px] sm:max-w-[380px] md:max-w-[420px] lg:max-w-[460px] xl:max-w-[500px] 2xl:max-w-[540px] min-h-[220px] md:min-h-0 md:aspect-[10/4]"
            perspective={800}
            easing="cubic-bezier(0.03,0.98,0.52,0.99)"
            speed={1000}
          >
            <div className="heroCard">
              <p className="aboutMeContent">
                Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
              </p>
            </div>
          </Tilty>
        </div>
      </div>
    </section>
  )
}

export default Hero
