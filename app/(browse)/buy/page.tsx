"use client";

import JupiterTerminal from "@/components/jupTerm";
import { Button } from "@/components/ui/button";
import { Link } from 'next-view-transitions'

export default function Home() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4">
            <div className='absolute right-3 top-3 mb-6'>
            <Link href="/">
                <Button className='border border-zinc-800 py-1 px-4 rounded-md text-white hover:text-white hover:italic font-inter mx-auto'>
                    
                        back to Home
                    
                </Button>
                </Link>
            </div>
            <div className="block justify-center items-center">
                <JupiterTerminal />
                <div className="max-w-[350px] flex items-center justify-center">
                    <h1 className="text-white text-sm font-inter">
                        disclosure: use of this Jupiter swap terminal requires Phantom app or other Solana wallet apps via their in-app browsers. Also available on Google Chrome browser by downloading Solana Wallet extensions (ex: phantom, magic eden, etc)
                    </h1>
                </div>
            </div>
        </div>
    );
}