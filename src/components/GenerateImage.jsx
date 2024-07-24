import { useEffect, useState } from 'react';
import image1 from "../assets/image1.webp";
import image2 from "../assets/image2.webp";
import image3 from "../assets/image3.webp";
import image4 from "../assets/image4.webp";
import { AiFillCloseCircle } from "react-icons/ai";
import { ImDownload3 } from "react-icons/im";
import { TbReload } from "react-icons/tb";

function GenerateImage({ imageUrl }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (imageUrl) {
            setTimeout(() => {
                setSelectedImage(imageUrl);
            }, 100);
        }
    }, [imageUrl]);

    const openModal = (url) => {
        setSelectedImage(url);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const reloadImage = () => {
        setSelectedImage(null); // Seçili resmi kaldır
        setTimeout(() => setSelectedImage(imageUrl), 100); // Yeniden yükle
    };

    return (
        <div className="flex justify-center items-center w-full my-3">
            {selectedImage ? (
                <div className="relative">
                    <a
                        href={selectedImage}
                        download="generated-image.webp"
                        className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-900 hover:text-white text-white px-2 py-1 rounded z-10"
                        title="Download Image"
                    >
                        <ImDownload3 />
                    </a>
                    <img
                        src={selectedImage}
                        className="w-96 h-96 object-cover rounded-lg shadow-md cursor-pointer"
                        alt="Generated"
                        onClick={() => openModal(selectedImage)}
                    />
                    <button
                        onClick={reloadImage}
                        className="absolute bottom-2 right-2 bg-gray-800 hover:bg-gray-900 hover:text-white text-white px-2 py-1 rounded z-10"
                        title="Reload Image"
                    >
                        <TbReload className='hover:animate-spin' />
                    </button>
                </div>
            ) : (
                <div className="sm:grid sm:grid-cols-1 gap-4 sm:items-center md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                    {[image1, image2, image3, image4].map((img, index) => (
                        <div key={index} className="relative hover:opacity-85 transition-all">
                            <img
                                src={img}
                                className="w-full h-96 object-fill rounded-lg shadow-md cursor-pointer"
                                alt={`image${index + 1}`}
                                onClick={() => openModal(img)}
                            />
                            <a
                                href={img}
                                download={`image${index + 1}.webp`}
                                className="absolute bottom-2 right-2 bg-gray-800 hover:bg-gray-900 hover:text-white text-white px-2 py-1 rounded"
                            >
                                <ImDownload3 />
                            </a>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                    <div className="relative">
                        <img
                            src={selectedImage}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                            alt="Selected"
                        />
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-red-600 transition-all p-2 rounded"
                            onClick={closeModal}
                        >
                            <AiFillCloseCircle className='w-5 h-5' />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GenerateImage;
