import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage("fadeOut");
    }
  }, [location, displayLocation]);

  const handleAnimationEnd = () => {
    if (transitionStage === "fadeOut") {
      setTransitionStage("fadeIn");
      setDisplayLocation(location);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div
      className={`page-transition ${transitionStage}`}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
      <style jsx>{`
        .page-transition {
          position: relative;
          min-height: 100vh;
        }
        
        .fadeIn {
          animation: fadeIn 0.6s ease-in-out forwards;
        }
        
        .fadeOut {
          animation: fadeOut 0.6s ease-in-out forwards;
        }
        
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeOut {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px);
          }
        }
        
        /* Add wood grain overlay for luxury effect */
        .page-transition::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          background-image: url('https://images.unsplash.com/photo-1608501078713-8e445a709b39?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80');
          background-size: cover;
          opacity: 0.03;
          z-index: -1;
        }
        
        /* Add a decorative border during transition */
        .fadeOut::after,
        .fadeIn::after {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0px solid rgba(139, 69, 19, 0.8);
          pointer-events: none;
          box-sizing: border-box;
          z-index: 9999;
          transition: border-width 0.6s ease;
        }
        
        .fadeOut::after {
          border-width: 15px;
        }
      `}</style>
    </div>
  );
};

export default PageTransition; 