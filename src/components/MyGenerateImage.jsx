import { useEffect, useState } from "react";
import image1 from "../assets/image1.webp";
import image2 from "../assets/image2.webp";
import image3 from "../assets/image3.webp";
import image4 from "../assets/image4.webp";
import { AiFillCloseCircle } from "react-icons/ai";
import { ImDownload3 } from "react-icons/im";
import { MdDelete } from "react-icons/md";

function MyGenerateImage({ imageUrl }) {
    const [storedImages, setStoredImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const images = JSON.parse(localStorage.getItem('generatedImages')) || [];
        setStoredImages(images);
    }, [imageUrl]);

    const handleError = () => {
        setSelectedImage(image1);
    };

    const openModal = (url) => {
        setSelectedImage(url);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage('');
    };

    const deleteImage = (url) => {
        const filteredImages = storedImages.filter(image => image !== url);
        localStorage.setItem('generatedImages', JSON.stringify(filteredImages));
        setStoredImages(filteredImages);
    };

    return (
        <div className="flex justify-center items-center w-full my-3">
            <div className="sm:grid sm:grid-cols-1 gap-4 sm:items-center md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                {storedImages.length > 0 ? storedImages.map((url, index) => (
                    <div key={index} className="relative transition-all">
                        <img
                            src={url}
                            className="w-full h-96 object-fill hover:opacity-85  rounded-lg shadow-md cursor-pointer"
                            alt={`Generated ${index + 1}`}
                            onClick={() => openModal(url)}
                            onChange={handleError}
                        />
                        <a
                            href={url}
                            target="_blank"
                            download={`generated-image-${index + 1}.png`}
                            className="absolute bottom-2 right-2 bg-gray-800 hover:bg-gray-900 hover:text-white text-white px-2 py-1 rounded"
                            title="Download Image"
                        >
                            <ImDownload3 />
                        </a>
                        <button
                            className="absolute bottom-2 right-12 bg-white hover:bg-gray-300 rounded-full p-1 text-red-500 hover:text-red-600 transition-all"
                            onClick={() => deleteImage(url)}
                            title="Delete Image"
                        >
                            <MdDelete className="w-4 h-4" />
                        </button>
                    </div>
                ))
                    :
                    <>
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
                                <button
                                    className="absolute bottom-2 right-12 bg-white hover:bg-gray-300 rounded-full p-1 text-red-500 hover:text-red-600 transition-all"
                                    onClick={() => deleteImage(img)}
                                    title="Delete Image"
                                >
                                    <MdDelete />
                                </button>
                            </div>
                        ))}
                    </>
                }
            </div>

            {/* Modal için basit bir stil */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                    <div className="relative">
                        <img
                            src={selectedImage}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                            alt="Selected"
                        />
                        <button
                            className="absolute top-2 right-2 bg-white hover:bg-gray-300 rounded-full p-0.5 text-red-500 hover:text-red-600 transition-all"
                            onClick={closeModal}
                        >
                            <AiFillCloseCircle className='w-5 h-5 ' />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyGenerateImage;
