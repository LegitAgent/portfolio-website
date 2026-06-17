import './WrongPage.css';
import { useNavigate } from 'react-router-dom';

function WrongPage() {
  const navigate = useNavigate();

  return (
    <section className="wrong">
      <div className="wrong__scene" aria-hidden="true">
        <svg className="astronaut" viewBox="0 0 260 260">
          <g className="astronaut__tether">
            <path d="M41 196 C86 166 71 98 127 92 C171 87 184 137 224 113" />
          </g>
          <g className="astronaut__body">
            <circle className="astronaut__helmet" cx="132" cy="83" r="42" />
            <path className="astronaut__visor" d="M100 78 C110 55 151 53 165 77 C152 92 115 94 100 78Z" />
            <path className="astronaut__pack" d="M82 119 H58 C51 119 46 124 46 131 V179 C46 186 51 191 58 191 H83Z" />
            <path className="astronaut__suit" d="M91 119 H171 C183 119 192 129 190 141 L181 199 C180 208 172 214 163 214 H99 C90 214 82 208 81 199 L72 141 C70 129 79 119 91 119Z" />
            <path className="astronaut__panel" d="M108 137 H153 V166 H108Z" />
            <path className="astronaut__arm astronaut__arm--left" d="M76 137 C53 142 46 160 55 176 C61 187 76 188 85 178" />
            <path className="astronaut__arm astronaut__arm--right" d="M185 136 C211 134 224 149 220 166 C217 181 200 186 187 176" />
            <path className="astronaut__leg astronaut__leg--left" d="M105 211 L92 239 H120 L131 213" />
            <path className="astronaut__leg astronaut__leg--right" d="M154 213 L166 239 H194 L177 210" />
            <circle className="astronaut__light astronaut__light--one" cx="119" cy="151" r="3" />
            <circle className="astronaut__light astronaut__light--two" cx="140" cy="151" r="3" />
          </g>
        </svg>
        <span className="spaceBit spaceBit--one">404</span>
        <span className="spaceBit spaceBit--two">0x00</span>
        <span className="spaceBit spaceBit--three">lost_route</span>
      </div>

      <div className="wrong__content">
        <p className="wrong__eyebrow">route not found</p>
        <h1>Lost in orbit.</h1>
        <p>The page you tried to open drifted outside the site map.</p>
        <div className="wrong__actions">
          <button onClick={() => navigate(-1)}>Go Back</button>
          <button onClick={() => navigate('/')}>Home</button>
        </div>
      </div>
    </section>
  );
}

export default WrongPage;
