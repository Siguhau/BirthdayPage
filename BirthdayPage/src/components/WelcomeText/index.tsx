
import React, { useEffect, useState } from 'react';

interface WelcomeTextProps {
    userName: string;
    isBirthday: boolean;
}

const WelcomeText: React.FC<WelcomeTextProps> = ({ userName, isBirthday }) => {
    const [confetti, setConfetti] = useState<number[]>([]);

    useEffect(() => {
        if (isBirthday) {
            // Prevent scrolling on the body when it's birthday
            document.body.style.overflow = 'hidden';

            // Responsive confetti count based on screen width
            const getConfettiCount = () => {
                const width = window.innerWidth;
                if (width < 500) return 25;
                if (width < 800) return 40;
                if (width < 1200) return 55;
                return 70;
            };

            // Generate initial confetti particles
            const confettiArray = Array.from({ length: getConfettiCount() }, (_, i) => i + Math.random() * 100000);
            setConfetti(confettiArray);

            // Create waves every 1.5 seconds for balanced confetti
            const confettiInterval = setInterval(() => {
                const newConfetti = Array.from({ length: getConfettiCount() * 0.8 }, (_, i) => i + Math.random() * 100000);
                setConfetti(prev => [...prev, ...newConfetti]);
            }, 1500); // Every 1.5 seconds

            // Clean up old confetti particles much less frequently to allow natural fade-out
            const cleanupInterval = setInterval(() => {
                setConfetti(prev => prev.slice(-300)); // Keep many more particles
            }, 10000); // Clean up every 10 seconds

            // Optional: update confetti count on resize
            const handleResize = () => {
                setConfetti(prev => {
                    const newCount = getConfettiCount();
                    if (prev.length > newCount) {
                        return prev.slice(-newCount);
                    }
                    return prev;
                });
            };
            window.addEventListener('resize', handleResize);

            // Cleanup intervals and event listener when component unmounts or isBirthday changes
            return () => {
                clearInterval(confettiInterval);
                clearInterval(cleanupInterval);
                window.removeEventListener('resize', handleResize);
                // Restore scrolling when cleanup
                document.body.style.overflow = 'auto';
            };
        } else {
            // Reset when not birthday and restore scrolling
            setConfetti([]);
            document.body.style.overflow = 'auto';
        }
    }, [isBirthday]);

    return (
        <div style={{ 
            position: 'relative', 
            textAlign: 'center',
            width: '100%',
            height: isBirthday ? '100vh' : 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            {/* Confetti particles */}
            {isBirthday && confetti.map((particle) => (
                <div
                    key={particle}
                    style={{
                        position: 'absolute',
                        width: '10px',
                        height: '10px',
                        backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#1dd1a1', '#feca57', '#ff6348', '#c44569', '#786fa6'][Math.floor((particle * 17 + particle * 23) % 15)],
                        borderRadius: '50%',
                        left: `${(particle * 7 + particle * 13) % 100}%`,
                        top: '-10px',
                        animation: `fall ${8 + (particle % 4)}s ease-out forwards`,
                        animationDelay: `${(particle % 10) * 0.1}s`,
                    }}
                />
            ))}
            
            {/* Celebration styles */}
            <style>{`
                @keyframes fall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    80% {
                        transform: translateY(100vh) rotate(288deg);
                        opacity: 1;
                    }
                    90% {
                        transform: translateY(110vh) rotate(324deg);
                        opacity: 0.6;
                    }
                    95% {
                        transform: translateY(120vh) rotate(342deg);
                        opacity: 0.3;
                    }
                    100% {
                        transform: translateY(130vh) rotate(360deg);
                        opacity: 0;
                    }
                }
                
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {
                        transform: translateY(0);
                    }
                    40% {
                        transform: translateY(-80px);
                    }
                    60% {
                        transform: translateY(-40px);
                    }
                }
                
                @keyframes bigBounce {
                    0%, 20%, 50%, 80%, 100% {
                        transform: translateY(0) scale(1);
                    }
                    40% {
                        transform: translateY(-120px) scale(1.05);
                    }
                    60% {
                        transform: translateY(-60px) scale(1.02);
                    }
                }
                
                @keyframes pulse {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.1);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
                
                .celebration-text {
                    animation: bigBounce 2s infinite;
                    font-size: clamp(2rem, 8vw, 4rem);
                    font-weight: bold;
                    margin: 0;
                    padding: 20px;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                    display: inline-block;
                }
                
                .celebration-text-content {
                    background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #f9ca24, #6c5ce7);
                    background-size: 400% 400%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: gradientShift 3s ease-in-out infinite;
                }
                
                @keyframes gradientShift {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }
                
                .celebration-emoji {
                    animation: pulse 1s infinite;
                    font-size: clamp(2.5rem, 10vw, 5rem);
                    margin: 0 clamp(10px, 2vw, 20px);
                    display: inline-block;
                    filter: drop-shadow(0 0 10px rgba(255,255,255,0.5));
                }
            `}</style>

            {isBirthday ? (
                <h2 className="celebration-text">
                    <span className="celebration-emoji">🎉</span> 
                    <span className="celebration-text-content">
                        Gratulerer med dagen {userName}!
                    </span>
                    <span className="celebration-emoji">🎉</span>
                </h2>
            ) : (
                <h2>
                    Tid til {userName}'s bursdag
                </h2>
            )}
        </div>
    );
};

export default WelcomeText;