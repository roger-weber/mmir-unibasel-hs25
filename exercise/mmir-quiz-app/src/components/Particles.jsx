import { useMemo } from 'react';
import './Particles.css';

const ParticlesBackground = (props) => {
  // ensure props.count is set, otherwise default to 40
  const count = props.count || 40;
  
  // Generate particle data once and memoize it
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${(Math.random() * 10 + 10)}s`,
      animationName: `float-${Math.floor(Math.random() * 4) + 1}`
    }));
  }, [count]);

  return (
    <div className="particles-container">
      {particles.map((particle, index) => (
        <div 
          key={index}
          className="particle"
          style={particle}
        />
      ))}
    </div>
  );
};

export default ParticlesBackground;