import './Resume.css'
import { redirect } from '../../imports/routing'
import { RESUME_NAME, RESUME_ICON } from '../../imports/constants'
import { useNavigate } from 'react-router-dom'

function Resume() {
  const resume:string = `${RESUME_NAME}#zoom=80%&pagemode=none`
  const navigate = useNavigate()

  return (
    <section className="resumeView">
      <div className="flex flex-row items-center gap-3">
        <h1 className="text-5xl">Resume</h1>
        <img src={RESUME_ICON} alt="Resume Image" className="w-15 h-15" /> 
      </div>

      <div className="update"> 
        Last updated: March 1, 2026
      </div>

      <div className="resumeBox">
        <div className="topContent">
          <button onClick={() => navigate(-1)}>Go Back</button>
          <button onClick={() => redirect(RESUME_NAME)}className="openPDFButton">Open PDF</button>
        </div>
        {/* if pass var in react, make sure val has {} */}
        <iframe
          className="resumeFrame"
          src={resume}
          title="Resume"
          loading="lazy"
        />
      </div>
    </section>
  )
}

export default Resume
