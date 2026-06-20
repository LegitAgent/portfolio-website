import './ErrorScreen.css';

function ErrorScreen() {
  return (
    <section className="errorScreen" role="alert">
      <div className="errorScreen__status" aria-hidden="true">
        <span />
        Request failed
      </div>

      <div className="errorScreen__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M12 8v5" />
          <path d="M12 17.01 12.01 17" />
          <path d="M10.3 3.9 2.7 17.1A2 2 0 0 0 4.43 20h15.14a2 2 0 0 0 1.73-2.9L13.7 3.9a2 2 0 0 0-3.4 0Z" />
        </svg>
      </div>

      <h1>Something went wrong.</h1>
      <p>The requested data could not be loaded. Refresh the page to try again.</p>

      <button className="errorScreen__retry" onClick={() => window.location.reload()}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 11a8.1 8.1 0 1 0 .1 3" />
          <path d="M20 4v7h-7" />
        </svg>
        <span>Refresh page</span>
      </button>
    </section>
  );
}

export default ErrorScreen;
