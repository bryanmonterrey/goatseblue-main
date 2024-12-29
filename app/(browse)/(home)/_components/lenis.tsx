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
                  href="https://terminal.goatse.app"
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
            <div className='max-w-[60ch] h-full mx-auto space-y-7  my-auto flex flex-col items-center justify-center'>
              <div className="block items-center text-center justify-center mx-auto">
              <h1 className='text-2xl mx-auto font-medium text-center'>Roadmap</h1>
              </div>
              <p className='text-sm text-center p-2'>we are a leader in the AI space and we are building an all in one desktop app and web app for everything AI. we want to provide the most luxury rich experience for our users. our software is built completely in house. some of our features will range from full autonomous trading via tasked based AI agents and full autonomous AI trading from our own AI model. Our web app is its own AI agent infrastructure already. we've done our research quite well and cant compromise the details of it but noone is doing it like us. we currently have the one of the best full stack software developers in the world, frontend and backend. we are building in public and may eventually release our software through resellable and easily transferable blockchain powered license keys so our AI economy isnt infiltrated with bad actors any longer. we believe in open source protocols but not if it requires possibly risking value for more virality and engagement, our product is user focused. ultimately, our end goal is AGI which hasnt been done yet.</p>
              <div className='flex flex-col items-center justify-center space-y-5'>
              <div className='flex items-center justify-center'>
                <button onClick={handleCopy} className="copy-button text-center text-xs">
                  ca: 9kG8CWxdNeZzg8PLHTaFYmH6ihD1JMegRE1y6G8Dpump
                </button>
              </div>
              <div className='flex items-center justify-center'>
                <p className='-mt-4 text-xs'> click ca to copy address </p>
              </div>
              </div>
            </div>
        </div>
    </motion.div>
  )
}