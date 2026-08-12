import './Background.css';

function Background() {
  
  const grid = (gridAmount: number) => {
    for (let i = 0; i < gridAmount; i++) {
      console.log(i);
    }
  };

  return (
    <div className='gradient-bg' aria-hidden='true' />
  );
}

export default Background;
