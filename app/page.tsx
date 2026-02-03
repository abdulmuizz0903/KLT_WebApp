"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Client } from "@gradio/client";
import { ArrowRightLeft, Volume2, Play, Pause, Loader2, Info, X } from "lucide-react";

// @ts-ignore
import logo from "../assets/logo.png";
// @ts-ignore
import loader from "../assets/loader.webp";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    setAudioUrl(null);
    setTranslatedText("");

    try {
      // Connect to the HF Space
      const app = await Client.connect("GAASH-Lab/Matcha-TTS-Kashmiri-Demo");
      
      // Call the pipeline endpoint
      const result = await app.predict("/pipeline", { 		
        text: inputText, 
        is_eng: isEnglish, 
        spk_id: Math.floor(Math.random() * 420) + 1, 
      }) as { data: [string, any] };

      // Handle translation text (data[0])
      if (result.data && result.data[0]) {
        setTranslatedText(result.data[0]);
      }

      // Handle audio (data[1])
      if (result.data && result.data[1]) {
        // The audio object from Gradio client usually contains a 'url' property
        // or sometimes we might need to construct it if it's returning a different structure
        const audioData = result.data[1];
        if (audioData.url) {
          setAudioUrl(audioData.url);
        }
      }
    } catch (err: any) {
      console.error("Translation error:", err);
      setError("Failed to translate. The model might be sleeping or busy.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.src = audioUrl;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => {
        console.error("Audio playback error", e);
      });
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <main className="min-h-screen bg-blue-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative">
      <button 
        onClick={() => setShowInfo(true)}
        className="fixed top-6 right-6 p-3 rounded-full bg-white text-gray-500 hover:text-indigo-600 shadow-sm border border-gray-100 hover:shadow-md transition-all z-40"
        title="Usage Instructions"
      >
        <Info className="w-5 h-5" />
      </button>

      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        onEnded={handleAudioEnded}
        className="hidden"
      />

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 transition-all" onClick={() => setShowInfo(false)}>
          <div className="bg-white rounded-[28px] shadow-xl max-w-sm w-full p-8 relative animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center">
              <h3 className="text-2xl font-medium text-gray-900 mb-2">How to use</h3>
              <p className="text-gray-500 text-sm mb-6">
                Here are a few tips to get the best translations.
              </p>
            </div>
            
            <div className="space-y-5 text-gray-600 text-sm">
              <div className="flex gap-4 items-start text-left">
                <div className="min-w-[4px] h-full bg-indigo-100 rounded-full mt-1"></div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">Input Language</p>
                  <p className="leading-relaxed">You can input text in <strong>almost any language</strong>! Just ensure the "Input is English" toggle is <strong>ON</strong>.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start text-left">
                 <div className="min-w-[4px] h-full bg-indigo-100 rounded-full mt-1"></div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">Best Performance</p>
                  <p className="leading-relaxed">Although the system is flexible, this model works best for <strong>English-Urdu</strong> translation tasks.</p>
                </div>
              </div>

               <div className="flex gap-4 items-start text-left">
                 <div className="min-w-[4px] h-full bg-indigo-100 rounded-full mt-1"></div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">Audio</p>
                  <p className="leading-relaxed">Click the speaker icon after translation to hear the result.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center w-full">
              <button 
                onClick={() => setShowInfo(false)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-full transition-colors shadow-sm active:scale-[0.98]"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 text-center relative w-full max-w-xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-2">
          <Image 
            src={logo} 
            alt="Kashmiri AI Logo" 
            width={60} 
            height={60} 
            className="w-16 h-16 object-contain drop-shadow-sm" 
          />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight text-center">Kashmiri AI Translator and Audio Generator</h1>
        </div>
        <p className="text-gray-500 font-medium">Developed at Gaash Lab</p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row min-h-[500px]">
        
        {/* Left: Input */}
        <div className="flex-1 flex flex-col p-6 border-b md:border-b-0 md:border-r border-gray-100 relative group">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              {isEnglish ? "English" : "Kashmiri (Input)"}
            </h2>
            
            {/* Control: Input Type Toggle */}
            <label className="flex items-center cursor-pointer select-none">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={isEnglish} 
                  onChange={(e) => setIsEnglish(e.target.checked)} 
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${isEnglish ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isEnglish ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <div className="ml-3 text-xs font-medium text-gray-500">
                Input is English
              </div>
            </label>
          </div>


          <textarea
            className="flex-1 w-full resize-none border-0 focus:ring-0 p-0 text-xl text-gray-800 placeholder-gray-300 focus:outline-none"
            placeholder={isEnglish ? "Enter English text here..." : "Kashmiri text input..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <div className="mt-6 flex justify-between items-center bg-white">
            <div className="text-xs text-gray-400">
              {inputText.length} chars
            </div>
            <button
              onClick={handleTranslate}
              disabled={isLoading || !inputText}
              className={`flex items-center px-6 py-2.5 rounded-full text-white font-medium shadow-md transition-all 
                ${isLoading || !inputText 
                  ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:scale-95'}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Translate <ArrowRightLeft className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Output */}
        <div className="flex-1 flex flex-col p-6 bg-gray-50/50 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Kashmiri</h2>
            {audioUrl && (
              <button 
                onClick={togglePlay}
                className="p-2 rounded-full hover:bg-gray-200 text-indigo-600 transition-colors focus:outline-none"
                title="Play Audio"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            )}
          </div>

          <div className="flex-1 relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10 rounded-xl">
                <div className="flex flex-col items-center gap-4 p-6">
                  <div className="relative w-24 h-24">
                    <Image 
                      src={loader} 
                      alt="Preparing Nun Chai..." 
                      fill
                      className="object-contain animate-pulse" 
                      unoptimized
                    />
                  </div>
                  <span className="text-gray-600 font-medium animate-pulse text-lg text-center">
                    Have some Nun Chai till we get your results
                  </span>
                </div>
              </div>
            ) : error ? (
               <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                <div className="text-red-500 bg-red-50 px-4 py-3 rounded-lg text-sm border border-red-100">
                  {error}
                </div>
              </div>
            ) : translatedText ? (
              <div className="h-full overflow-auto">
                {/* 
                  Applying the Noto Nastaliq Urdu font via the CSS variable defined in tailwind.config.ts 
                  and layout.tsx.
                  Leading-loose is often good for Nastaliq to prevent overlap.
                */}
                <p 
                  className="text-2xl sm:text-3xl text-gray-800 text-right font-kashmiri leading-[2.5]" 
                  dir="rtl"
                  style={{ lineHeight: '2.5' }} 
                >
                  {translatedText}
                </p>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-gray-300 text-xl font-kashmiri opacity-50">Translation will appear here</p>
              </div>
            )}
          </div>
          
          {/* Action footer for copying/etc could go here */}
          <div className="mt-4 flex justify-end gap-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Copy button placeholder */}
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center text-gray-400 text-sm">
        <p>© 2026 GAASH Lab, National Institute of Technology Srinagar</p>
      </footer>
    </main>
  );
}
