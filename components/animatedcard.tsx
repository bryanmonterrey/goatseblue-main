import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, LucideIcon } from 'lucide-react';

const Vector101 = () => (
  <svg 
    width="97" 
    height="65" 
    viewBox="0 0 97 65" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ 
      position: 'absolute',
      bottom: '0',
      right: '0'
    }}
  >
    <path d="M0.910998 49.8955L54.4896 64.9627C54.5777 64.9874 54.6688 65 54.7603 65H96C96.5523 65 97 64.5523 97 64V11.7104C97 11.285 96.7309 10.9062 96.3292 10.7661L67.6456 0.764786C66.8169 0.475833 66.0445 1.31831 66.4042 2.11886L73.8589 18.7109C74.227 19.5301 73.4124 20.3816 72.5777 20.0501L47.7904 10.2077C46.8201 9.82245 45.9827 10.995 46.662 11.7878L57.327 24.2343C57.9784 24.9945 57.2325 26.134 56.2752 25.8413L24.7002 16.1846C23.8804 15.9339 23.1458 16.7635 23.4939 17.5469L24.3797 19.5407C24.4501 19.6992 24.5606 19.8367 24.7002 19.9397L50.7985 39.1761C51.0893 39.3905 51.1497 39.8008 50.9329 40.0899C50.7501 40.3338 50.7611 40.6719 50.9594 40.9033L51.0416 40.9992C51.4632 41.4912 51.163 42.2545 50.5192 42.3275L1.06895 47.9393C-0.0213952 48.063 -0.145373 49.5985 0.910998 49.8955Z" fill="#00FF93"/>
  </svg>
);

const Vector102 = () => (
  <svg 
    width="52" 
    height="34" 
    viewBox="0 0 52 34" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ 
      position: 'absolute',
      bottom: '0',
      right: '0'
    }}
  >
    <path d="M1.45851 5.98364L18.805 34.5194C18.9864 34.8178 19.3103 35 19.6595 35H52C52.5523 35 53 34.5523 53 34V9.21508C53 8.58957 52.4322 8.1176 51.8172 8.23192L45.3297 9.43794C45.1536 9.47068 44.972 9.45552 44.8037 9.39404L21.1831 0.762281C20.3736 0.466448 19.594 1.2649 19.9091 2.06713L23.0166 9.97835C23.33 10.7762 22.5601 11.5727 21.7521 11.2866L2.6468 4.52155C1.76023 4.20762 0.969966 5.17997 1.45851 5.98364Z" fill="#6DECB6" stroke="black" strokeLinejoin="round"/>
  </svg>
);

interface AnimatedLinkProps {
  href: string;
  icon: LucideIcon | React.ComponentType<{ className?: string; strokeWidth?: number }>;
  text: string;
}

const AnimatedLink: React.FC<AnimatedLinkProps> = ({ href, icon: Icon, text }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div 
      className="w-[139px] h-[84px] relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={href}>
        <div className="border-zinc-900 hover:border-[#00FFA2] transition-colors ease-in-out duration-250 w-full h-full font-medium cursor-pointer bg-[#0D0E15] border-2 rounded-lg text-white relative overflow-hidden">
          <AnimatePresence>
            {isHovered && (
              <>
                <motion.div 
                  className="absolute bottom-0 right-0"
                  initial={{ x: 30, y: 30, opacity: 0 }}
                  animate={{ x: 0, y: 0, opacity: 1 }}
                  exit={{ x: 30, y: 30, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Vector101 />
                </motion.div>
                
                <motion.div 
                  className="absolute bottom-0 right-0"
                  initial={{ x: 30, y: 30, opacity: 0 }}
                  animate={{ x: 0, y: 0, opacity: 1 }}
                  exit={{ x: 30, y: 30, opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Vector102 />
                </motion.div>

                <motion.div 
                  className="absolute bottom-1 right-2"
                  initial={{ x: 30, y: 30, opacity: 0 }}
                  animate={{ x: 0, y: 0, opacity: 1 }}
                  exit={{ x: 30, y: 30, opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <ArrowRight className="w-5 h-5 text-[#11111A]" strokeWidth={2.5} />
                </motion.div>
              </>
            )}
          </AnimatePresence>
            <motion.div 
            className="absolute top-5 left-3"
            animate={isHovered ? { scale: 0.95, y: -2 } : { scale: 1.3, y: 0 }}
            transition={{ duration: 0.2 }}
            >
            <div className="relative">
                <Icon 
                className="w-4 h-4 text-[#DDDDDD] absolute -top-1" 
                strokeWidth={2.5}
                />
                <span className="text-[12px] font-geist absolute top-4">
                {text}
                </span>
            </div>
            </motion.div>
        </div>
      </Link>
    </div>
  );
};

export default AnimatedLink;