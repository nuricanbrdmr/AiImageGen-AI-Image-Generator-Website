import loadingImg from "../assets/loadingImg.gif"

function LoadingGenerate() {
    return (
        <div className="flex justify-center items-center w-full mt-8">
            <div className="relative shadow-xl">
                <img
                    src={loadingImg}
                    className="w-96 h-96 object-cover rounded-lg shadow-md"
                    alt="Generated"
                />
            </div>
        </div>
    )
}

export default LoadingGenerate