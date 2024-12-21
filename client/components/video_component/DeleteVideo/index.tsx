


import React, { useEffect, useState } from 'react'
import { VideoIcon } from '@/components/Icons'
import { Video } from '@/types'
import { Backdrop, Divider, Fade, Modal } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { videoService } from '@/services/video.service'
import useHookMutation from '@/hooks/useHookMutation'


export default function DeleteVideo({ video, onDeleteSuccess }: { video: Video, onDeleteSuccess: () => void }) {

    const [openModal, setOpenModal] = useState(false);
    const [videoData, setVideoData] = useState<Video>();

    const { data: dataVideo, isSuccess: isFetchVideoSuccess } = useQuery<Video>({
        queryKey: ["get-video-by-id", video],
        queryFn: () =>  videoService.getVideoById(video?.video_id),
        enabled: !!video
    });

    useEffect(() => {
        if (isFetchVideoSuccess) {
            setVideoData(dataVideo);
        }
    }, [isFetchVideoSuccess])

    const deleteVideoMutation = useHookMutation((video_id: string) => {
        return videoService.deleteVideoById(video_id);
    })

    const handleDeleteVideo = async () => {
        if (videoData?.video_id) {
            deleteVideoMutation.mutate(videoData.video_id, {
                onSuccess: () => {
                    onDeleteSuccess();
                }
            });
        }

    };

    return (
        <div className='flex flex-col pt-6 pb-2 px-5 min-w-[600px]'>
            <div className='flex flex-row pb-2'>
                <VideoIcon />
                <p className='font-bold px-2'>Xóa video</p>
            </div>
            <Divider />
            <form className="mx-auto py-4 w-full">
                <div className="relative z-0 w-full mb-5 group">
                    <input disabled value={videoData?.title || ''} type="text" name="title" className="block py-2.5 px-0 w-full text-base text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required />
                    <label htmlFor="title" className="peer-focus:font-medium absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Tên đăng nhập</label>
                </div>
                
                <div className='flex justify-end gap-4'>
                    <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                        Hủy
                    </button>
                    <button
                        type='button'
                        onClick={() => setOpenModal(true)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
                        Xóa
                    </button>
                </div>
            </form>
            <Modal
                open={openModal}
                onClose={() => {
                    setOpenModal(false);
                }}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        TransitionComponent: Fade,
                    },
                }}
            >

                <Fade in={openModal} timeout={{ enter: 300, exit: 200 }}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] flex flex-col bg-white p-2 rounded-lg">
                        <div className='flex-1'>
                            <p>Xác nhận xóa video {videoData?.title || ''}</p>
                        </div>
                        <div className='flex justify-end gap-4'>
                            <button
                                onClick={() => setOpenModal(false)}
                                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-base px-5 py-2.5  dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                            >
                                Hủy
                            </button>
                            <button
                                type='button'
                                onClick={handleDeleteVideo}
                                className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-base px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </Fade>
            </Modal>
        </div>
    )
}
