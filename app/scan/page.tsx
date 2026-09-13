"use client"

import { Metadata } from "next"
import Webcam from "react-webcam"
import { useRef, useState } from "react"




export default function Scan() {
    const webcamRef = useRef<Webcam>(null)
    const [image, setImage] = useState<string | null>(null)
    const [response, setResponse] = useState<string | null>(null)

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

            const formData = new FormData()
            formData.append("image", blob, "card.jpg")

            const result = await fetch("https://luminance-extras-oyster.ngrok-free.dev/scan", {
                method: 'post',
                body: formData
            })

            const data = await result.json()
            setResponse(JSON.stringify(data))
            console.log(data)
        }
    }
    console.log("hello")
    return (
        <div className='h-screen w-screen flex flex-col items-center justify-center'>
            {!image ? <Webcam
                className="w-full h-full object-cover"
                ref={webcamRef}
                audio={false}
                videoConstraints={videoConstraints}
                onUserMedia={() => console.log("camera opened")}
                onUserMediaError={(error) => console.log("big error", error)}
                screenshotQuality={1}
                screenshotFormat="image/jpeg" /> : <img className='w-full h-full object-cover' src={image} />}
            <h1>{response}</h1>
            <button className="absolute absolute bottom-5 transition-all duration-50 ease-linear hover:scale-90" onClick={takePicture}><img className='w-18' src="pokeball.webp" /></button>
        </div>
    )
}