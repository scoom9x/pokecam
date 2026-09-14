import { useState } from 'react'


interface Data {
    blob: Blob,
    className?: null | string,
    retake: any
}

type screen = "preview" | "loading" | "result"


export default function Pokedex({ blob, className, retake }: Data) {
    const [page, setPage] = useState<screen>("preview")
    const [data, setData] = useState<object[]>([])
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

        setData(respJSON['data'])
        setPage('result')




    }

    return (
        <div className={'w-100 h-140 bg-[#E21C25] absolute flex items-center justify-center rounded-[10px] flex-col ' + className} >

            {page == "preview" ? (<>
                <div className='w-60 h-80 overflow-hidden flex items-center justify-center bg-[#dedede] rounded-[20px] absolute top-1/5 -translate-y-1/5'>
                    <div className='absolute top-[9px] left-[40%] bg-[#dc092a] rounded-[50%] w-2 h-2 border border-black' />
                    <div className='absolute top-[9px] left-[59%] bg-[#dc092a] rounded-[50%] w-2 h-2 border border-black' />
                    <img className='w-[75%] h-[75%] object-contain scale-[110%]' src={URL.createObjectURL(blob)} />
                </div>
                <div className='absolute bottom-30 flex gap-5'>
                    <button className=' bg-[#2ba9fd] px-5 py-2 rounded-[10px] transition-all duration-50 ease-linear active:scale-[110%]' onClick={retake}>Retake</button>
                    <button className=' bg-[#2ba9fd] px-5 py-2 rounded-[10px] transition-all duration-50 ease-linear active:scale-[110%]' onClick={scan}>Scan</button>
                </div>
                <h1 className='absolute bottom-15'>
                    {errorMessage}
                </h1></>) : null}

            {page == 'loading' ? <>
                <img className='absolute' src='loading.gif' />
                <img className='absolute bottom-5 left-[15%]' src='running.gif'></img>

            </> : null}

            {page == 'result' ? <>

                <h1 className='text-center absolute top-5 left-[50%] -translate-x-1/2'>Results</h1>
                <div className='flex flex-col overflow-y-auto h-100 w-80 border overflow-hidden gap-4'>
                    {data.map((item: any, i) => (
                        <div className='border flex gap-2 rounded-[5px]'>
                            <img className='w-[100] object-fit rounded-[5px]' key={i} src={item['image']} />
                            <ul className='w-full overflow-hidden'>
                                <li className='text-center pb-3 font-bold'>{item['name'] ?? 'Not Found'}</li>
                                <li className='text-[13px]'>set code: {item['set_code'] ?? 'Not Found'}</li>
                                <li className='text-[13px]'>set id: {item?.['set_id'] ?? 'Not Found'}</li>
                                <li><div className='text-[13px] overflow-x-auto whitespace-nowrap flex scrollbar-none'>set name: {item?.['set_name'] ?? 'Not Found'}</div></li>
                                <button className='bg-[#21c6e9] px-2 py-2 rounded-[10px] ml-[50%] transition-all ease-linear duration-50 -translate-x-1/2 hover:scale-[110%] active:scale-[110%]'>More Info</button>
                            </ul>
                        </div>

                    ))}
                </div>
            </>
                : null}

        </div>
    )
}