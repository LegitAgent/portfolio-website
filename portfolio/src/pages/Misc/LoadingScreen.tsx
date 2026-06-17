import './LoadingScreen.css';

function LoadingScreen() {
  return (
    <section className="loadingScreen" aria-live="polite" aria-busy="true">
      <div className="loadingScreen__mark" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p className="loadingScreen__text">Loading</p>
    </section>
  );
}

export default LoadingScreen;
