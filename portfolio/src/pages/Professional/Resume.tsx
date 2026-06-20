import './Resume.css';
import { redirect } from '../../config/routing';
import { RESUME_NAME, RESUME_ICON } from '../../config/constants';
import { useNavigate } from 'react-router-dom';

function Resume() {
  const resume: string = `${RESUME_NAME}#zoom=80%&pagemode=none`;
  const navigate = useNavigate();

  return (
    <section className="resumeView">
      <header className="resumeHeader">
        <div className="resumeHeading">
          <img src={RESUME_ICON} alt="" className="resumeIcon" />
          <div>
            <p className="resumeEyebrow">Professional profile</p>
            <h1>Resume</h1>
          </div>
        </div>
        <p className="update">
          <span aria-hidden="true" />
          Last updated March 1, 2026
        </p>
      </header>

      <div className="resumeBox">
        <div className="topContent">
          <button className="resumeAction" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span>Go Back</span>
          </button>

          <span className="resumeDocumentLabel">PDF preview</span>

          <button
            className="resumeAction resumeAction--primary"
            onClick={() => redirect(RESUME_NAME)}
          >
            <span>Open PDF</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14 5h5v5" />
              <path d="m10 14 9-9" />
              <path d="M19 13v6H5V5h6" />
            </svg>
          </button>
        </div>

        <div className="resumeFrameShell">
          <iframe className="resumeFrame" src={resume} title="Resume" loading="lazy" />
        </div>
      </div>
    </section>
  );
}

export default Resume;
