"use client"

import { Metadata } from "next"
import Webcam from "react-webcam"
import { useRef, useState } from "react"
import ResultUI from '@/components/Pokedex'
import Centering from '@/components/Centering'




export default function Scan() {
    const webcamRef = useRef<Webcam>(null)
    const [image, setImage] = useState<Blob | null>(null)

    const videoConstraints = {
        facingMode: { ideal: "environment" },
        width: { ideal: 4096 },
        height: { ideal: 2160 }
    }

    async function takePicture() {
        navigator.vibrate?.(50)
        const screenshot = webcamRef.current?.getScreenshot()

        if (screenshot) {
            const img = await fetch(screenshot)
            const blob = await img.blob()
            setImage(blob)
        }
    }

    return (
        <div className='h-screen w-screen flex flex-col items-center justify-center overflow-hidden'>
            {!image ? <Centering/>:null}
            {!image ? <Webcam
                className="w-full h-full object-cover"
                ref={webcamRef}
                audio={false}
                videoConstraints={videoConstraints}
                onUserMedia={() => console.log("camera opened")}
                onUserMediaError={(error) => console.log("big error", error)}
                screenshotQuality={1}
                screenshotFormat="image/jpeg" /> : <ResultUI blob = {image}/>}
            <button className="absolute absolute bottom-5 transition-all duration-50 ease-linear active:scale-90" onClick={takePicture}><img className='w-18' src="pokeball.webp" /></button>
        </div>
    )
}