'use client';
import Image from "next/image";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import Lenis from 'lenis';
import { SnowEffect } from "@/components/snow";
import { Magnetic } from "@/components/core/magnetic";
import { ShoppingCart, Terminal, Twitter} from "lucide-react";
import { Inbox } from "lucide-react";
import AnimatedLink from "@/components/animatedcard";
import { TelegramIcon } from "@/components/icons/TelegramIcon";
import { DexScreenerIcon } from "@/components/icons/DexScreenerIcon";
import movie from '@/videos/movie.mp4';
import Video from 'next-video';
import { toast } from "@/hooks/use-toast";


export default function Home() {
  const container = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"]
  }) 

  useEffect( () => {
    const lenis = new Lenis()

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

  return (
    <main ref={container} className="relative h-[200vh]">
      <Section1 scrollYProgress={scrollYProgress}/>
      <Section2 scrollYProgress={scrollYProgress}/>
    </main>
  );
}

const Section1 = ({scrollYProgress}: { scrollYProgress: MotionValue<number> }) => {
    const springOptions = { bounce: 0.1 };

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -5])
  return (
    <motion.div style={{scale, rotate}} className="sticky top-0 h-screen bg-[#11111A] text-[3.5vw] flex flex-col items-center rounded-2xl justify-center space-y-5 text-white pb-[10vh]">
        <SnowEffect />
        <div className="w-full flex justify-between items-start z-[1059]">
              <h1 className="w-full text-2xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl font-inter tracking-tight text-white text-center">
                <span className='font-english'>g</span><span className='font-lumen'>o</span><span className='font-inter'>a</span><span className='font-inria'>t</span><span className='font-bookish'>s</span><span className='font-lumen'>e</span><span className='font-lumen'> singularity</span>
              </h1>
            </div>
            <div className="inset-0 flex items-center justify-center z-[1025]">
            <div className="max-w-xs mx-auto space-y-4">
              {/* Grid Section */}
              <div className="grid grid-cols-2 gap-4">
                {/* Spending Card - Full Width */}
                <Magnetic
                  intensity={0.2}
                  springOptions={springOptions}
                  actionArea='global'
                  range={200}
                  
                >
               <AnimatedLink 
                  href="https://console.goatse.app"
                  icon={Terminal}  // passing Twitter component as the icon prop
                  text="console"
                />
                </Magnetic>
                {/* Card 1 */}
                <Magnetic
                  intensity={0.2}
                  springOptions={springOptions}
                  actionArea='global'
                  range={200}     
                >
                  <AnimatedLink 
                  href="https://x.com/goatse_solana"
                  icon={Twitter}  // passing Twitter component as the icon prop
                  text="twitter"
                />
                </Magnetic>
                {/* Card 2 */}
                <Magnetic
                  intensity={0.2}
                  springOptions={springOptions}
                  actionArea='global'
                  range={200}
                  
                >
                <AnimatedLink 
                  href="https://t.me/goatse_singularity"
                  icon={TelegramIcon}
                  text="telegram"
                />
                </Magnetic>
                {/* Card 3 */}
                <Magnetic
                  intensity={0.2}
                  springOptions={springOptions}
                  actionArea='global'
                  range={200}                
                >
                <AnimatedLink 
                  href="https://dexscreener.com/solana/9kG8CWxdNeZzg8PLHTaFYmH6ihD1JMegRE1y6G8Dpump"
                  icon={DexScreenerIcon}
                  text="dexscreener"
                />
                </Magnetic>
                {/* Card 4 */}
                <Magnetic
                  intensity={0.2}
                  springOptions={springOptions}
                  actionArea='global'
                  range={200}                 
                >
                <AnimatedLink 
                  href="/buy"
                  icon={ShoppingCart}  // passing Twitter component as the icon prop
                  text="buy"
                />
                </Magnetic>
                <Magnetic
                  intensity={0.2}
                  springOptions={springOptions}
                  actionArea='global'
                  range={200}              
                >
                <AnimatedLink 
                  href="/g"
                  icon={Inbox}  // passing Twitter component as the icon prop
                  text="/g/&nbsp;board"
                />
                </Magnetic> 
              </div>
            </div>
            </div>  
    </motion.div>
  )
}

const Section2 = ({scrollYProgress}: { scrollYProgress: MotionValue<number> }) => {
const textToCopy = '9kG8CWxdNeZzg8PLHTaFYmH6ihD1JMegRE1y6G8Dpump';

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [5, 0])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Success",
        description: "Copied to clipboard!"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy text."
      });
    }
  };

  return (
    <motion.div style={{scale, rotate}} className="relative h-screen w-screen rounded-2xl border-zinc-900 border-2">
        <div className='space-y-7 items-center bg-[#11111A] rounded-2xl h-full w-full justify-center'>
            <div className='max-w-[60ch] h-full mx-auto space-y-4  my-auto flex flex-col items-center justify-center'>
              <h1 className='text-2xl mx-auto font-medium text-white text-center'>Who are we?</h1>
              <div className=''>
              <p className='text-base text-center p-2'>Goatse Singularity is redefining the AI space with an all-in-one desktop and web application offering a luxury-rich experience for everything AI. Built entirely in-house by some of the world’s top full-stack developers, our platform integrates cutting-edge AI agent infrastructure, autonomous trading with task-based agents, on-chain AI actions, and proprietary AI models for full autonomy.</p>

<p className='text-base text-center p-2'>Our web app serves as its own AI agent ecosystem, backed by rigorous research and a commitment to excellence. While our methods are proprietary, it’s clear no one else comes close.</p>

<p className='text-base text-center p-2'>Though we value open-source principles, we prioritize delivering real value over fleeting engagement. Our ultimate goal? Achieving AGI—a breakthrough yet to be realized. Goatse Singularity isn’t just software; it’s the future of AI.</p>
</div>
              <div className='flex flex-col items-center justify-center space-y-5'>
              <div className='flex items-center justify-center'>
                <button onClick={handleCopy} className="copy-button transition-all duration-300 hover:text-[#00FFA2] text-center text-sm">
                  ca: 9kG8CWxdNeZzg8PLHTaFYmH6ihD1JMegRE1y6G8Dpump
                </button>
              </div>
              <div className='flex items-center justify-center'>
                <p className='-mt-4 text-sm'> click ca to copy address </p>
              </div>
              </div>
            </div>
        </div>
    </motion.div>
  )
}
