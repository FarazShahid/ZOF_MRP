"use client"
import { useRouter } from "next/navigation";
import { TiArrowBack } from "react-icons/ti";

const GoBackButton = () => {
    const router = useRouter();


    const handleGoBack = () => {
        router.back();
    }

    return (
        <button type='button' onClick={handleGoBack} className='text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1'>
            <TiArrowBack size={24} /> Go Back
        </button>
    )
}

export default GoBackButton