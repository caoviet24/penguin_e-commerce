import { CardData } from "@/types";


function Card({ cardData }: { cardData: CardData }) {
    return (
        <div className="bg-white py-4 px-5 h-40 flex flex-col">
            <div className="flex-1 flex flex-col justify-center">
                {cardData?.icon}
                <p className="font-bold text-2xl mt-3">
                    {cardData?.total}
                </p>
                <p>
                    {cardData?.title}
                </p>
            </div>


            <div className="flex items-center justify-end mr-2">
                <svg
                    className={`ml-2 ${cardData?.rate > 0 ? 'text-green-500' : 'text-red-500'} mb-1`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="currentColor"
                        d={cardData?.rate > 0 ? "M12 4v16m8-8l-8 8-8-8" : "M12 4l-8 8 8 8"}
                    />
                </svg>
                <p className={`font-bold ${cardData?.rate > 0 ? 'text-green-500' : 'text-red-500'}`}>{cardData?.rate}%</p>
            </div>

        </div>
    );
}

export default Card;