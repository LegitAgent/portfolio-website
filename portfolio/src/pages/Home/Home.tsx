import './Home.css'
// import Tilty from 'react-tilty'

function Home() {
  const redirect = (link:string) => {
    window.open(link, '_blank')
  };

  return (
    <section className="hero">
      
      <div className="introduction">
        <div className="pictureWrap">
          <img id="portfolioPicture" className="w-28 sm:w-32 md:w-50 lg:w-55" src="/portfolio_pic.png" alt="Portfolio Picture" />
        </div>
        <div className="introductionContent">
          <div className="nameTitle">
            <p>Martin Darius Alba</p>
            <div className="switching">
              switch me
            </div>
          </div>

            <div className="currentRole">
              Student
            </div>

            <div className="introContent">
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. 
              Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. 
              Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
            </div>
            {/* <div className="heroCard aboutMeContent text-justify aboutMeBox">
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. 
              Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. 
              Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
            </div> */}

          <div className="contactLinks">
            {/* must have arrow func for funcs with args in react */}
            <button onClick={() => redirect("https://github.com/LegitAgent")} className="cursor-pointer buttonContact">
              <div className="contactLinkContent">
                <img src="/github.svg" alt="GitHub" /> GitHub
              </div>
            </button>

            <button onClick={() => redirect("https://www.linkedin.com/in/martin-darius-alba-836826294/")} className="cursor-pointer buttonContact">
              <div className="contactLinkContent">
                <img src="/linkedin.svg" alt="GitHub" /> LinkedIn
              </div>
            </button>

            <button onClick={() => redirect("https://www.w3schools.com/React/react_events.asp")} className="cursor-pointer buttonContact">
              <div className="contactLinkContent">
                <img src="/email.svg" alt="GitHub" /> More contacts
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="otherSection">
        <div className="otherBox">
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
        </div>

        <div className="otherBox">
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
        </div>

        <div className="otherBox">
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
        </div>
      </div>
    </section>
  )
}

export default Home
