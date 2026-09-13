import { useState } from 'react'


interface Data {
    blob: Blob,
    className?: null | string
}

type screen = "preview" | "loading" | "result"


export default function Pokedex({ blob, className }: Data) {
    const [page, setPage] = useState<screen>("preview")
    const [data, setData] = useState(null)
    const [errorMessage, setErrorMessage] = useState<null | string>(null)

    async function scan() {
        setPage('loading')
        
        const formdata = new FormData()
        formdata.append('image', blob, 'card.jpg')

        const request = await fetch('https://luminance-extras-oyster.ngrok-free.dev/scan', {
            method: 'post',
            body: formdata
        })
        
        const respJSON = await request.json()
        if (respJSON['status'] != 200) {
            setErrorMessage('An error occured! Try taking a better picture!')
            return setPage('preview')
        }
        
        setData(respJSON)
        setPage('result')

        


    }

    return (
        <div className={'w-100 h-140 bg-[#E21C25] absolute flex items-center justify-center rounded-[10px] flex-col ' + className} >

            {page == "preview" ? (<>
                <div className='w-60 h-80 overflow-hidden flex items-center justify-center bg-[#dedede] rounded-[20px] absolute top-1/5 -translate-y-1/5'>
                    <div className='absolute top-[9px] left-[40%] bg-[#dc092a] rounded-[50%] w-2 h-2 border border-black' />
                    <div className='absolute top-[9px] left-[59%] bg-[#dc092a] rounded-[50%] w-2 h-2 border border-black' />
                    <img className='w-[75%] h-[75%] object-cover scale-[110%]' src={URL.createObjectURL(blob)} />
                </div>
                <div className='absolute bottom-30 flex gap-5'>
                    <button className=' bg-[#2ba9fd] px-5 py-2 rounded-[10px] transition-all duration-50 ease-linear active:scale-[110%]'>Retake</button>
                    <button className=' bg-[#2ba9fd] px-5 py-2 rounded-[10px] transition-all duration-50 ease-linear active:scale-[110%]' onClick={scan}>Scan</button>
                </div>
                <h1 className='absolute bottom-15'>
                    {errorMessage}
                    </h1></>) : null}

            {page == 'loading' ? <>
                <img className='absolute' src='loading.gif' />

            </> : null}

            {page == 'result' ? <h1>
                {JSON.stringify(data)}
            </h1>: null}

        </div>
    )
}