"use client"

import {Metadata} from "next"
import Webcam from "react-webcam"
import {useRef, useState} from "react"




export default function Scan() {
    const webcamRef = useRef<Webcam>(null)
    const [image, setImage] = useState<string | null>(null)

    const direction = {
        facingMode: {ideal: 'environment'}
    }

    function takePicture() {
        const screenshot = webcamRef.current?.getScreenshot()

        if(screenshot) {
            setImage(screenshot)
        }
    }
    console.log("hello")
    return (
        <div className='h-screen w-screen flex flex-col items-center justify-center'>
            {!image?<Webcam
            className="w-full h-full object-cover"
            ref = {webcamRef}
            audio = {false}
            videoConstraints = {direction}
            onUserMedia={()=> console.log("camera opened")}
            onUserMediaError = {(error) => console.log("big error", error)}
            screenshotFormat="image/jpeg"/>:<img className='w-full h-full object-cover' src={image}/>}
            <button className="absolute absolute bottom-5" onClick={takePicture}><img className='w-18' src="pokeball.webp"/></button>
        </div>
    )
}