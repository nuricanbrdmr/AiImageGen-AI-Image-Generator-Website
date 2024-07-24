import { RxText } from "react-icons/rx";
import { IoIosArrowRoundForward, IoIosAnalytics } from "react-icons/io";
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { message } from 'antd';
import stablediffusion_logo from "../assets/stablediffusion_logo.jpg"
import modelslab_logo from "../assets/modelslab_logo.jpeg"
import runway_logo from "../assets/runway-logo.png"
import compvis_logo from "../assets/comp-vis-logo.png"
import prompthero_logo from "../assets/prompthero.webp"
import hugging_face_logo from "../assets/hugging-face-logo.png"
import playground_logo from "../assets/playground-logo.png"
import InstantID_logo from "../assets/InstantID-logo.webp"

function GenerateText({ setImageUrl, setLoading }) {
    const [isActiveText, setIsActiveText] = useState(false);
    const [isActiveModel, setIsActiveModel] = useState(false);
    const [value, setValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [model, setModel] = useState("openjourney-v4");

    const handleActiveText = () => {
        setIsActiveText(!isActiveText);
        setIsActiveModel(false);
    };

    const handleActiveModel = () => {
        setIsActiveModel(!isActiveModel);
        setIsActiveText(false);
    };

    const imageGenerate = async () => {
        try {
            setLoading(true);
            const resp = await fetch(`http://localhost:3000/api/generate-image/${model}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: value
                })
            });

            if (!resp.ok) {
                throw new Error(`HTTP error! status: ${resp.status}`);
            }

            const data = await resp.json();
            console.log(data);

            if (data && data.imageUrl) {
                setImageUrl(data.imageUrl);
                setErrorMessage('');
                const storedImages = JSON.parse(localStorage.getItem('generatedImages')) || [];
                storedImages.push(data.imageUrl);
                localStorage.setItem('generatedImages', JSON.stringify(storedImages));
                setValue("")
                handleActiveText();
                message.success("Image Generate Success.")
            } else {
                setErrorMessage('No image URL returned from API.');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error generating image:', error);
            setErrorMessage('Resim oluşturulurken bir hata oluştu.');
        }
    };

    const models = [
        {
            img: prompthero_logo,
            name: "PromptHero Midjourney v4",
            desc: "prompthero/open journey-v4",
            api: "openjourney-v4"
        },
        {
            img: hugging_face_logo,
            name: "Hugging Face Counterfeit-V2.5",
            desc: "gsdf/Counterfeit-V2.5",
            api: "Counterfeit-V2.5"
        },
        {
            img: stablediffusion_logo,
            name: "Stability.ai Stable diffusion 2_1",
            desc: "stabilityai/stable-diffusion-2-1",
            api: "stable-diffusion-2-1"

        },
        {
            img: InstantID_logo,
            name: "Linaqruf Animagine XL 3.0 ",
            desc: "Linaqruf/animagine-xl-3.0",
            api: "animagine-xl-3.0"

        },
        {
            img: stablediffusion_logo,
            name: "Stability AI Stable Cascade",
            desc: "stabilityai/stable-cascade",
            api: "stable-cascade"
        },
        {
            img: runway_logo,
            name: "Runway Stable Diffusion v1-5",
            desc: "runwayml/stable-diffusion-v1-5",
            api: "runwayml"
        },
        {
            img: playground_logo,
            name: "Playground v2.5 – 1024px Aesthetic",
            desc: "playgroundai/playground-v2.5-1024px-aesthetic",
            api: "playground-v2.5-1024px-aesthetic"
        },
        {
            img: compvis_logo,
            name: "Compvis Stable Diffusion v1-4",
            desc: "CompVis/stable-diffusion-v1-4",
            api: "comp-vis"
        },
        {
            img: modelslab_logo,
            name: "ModelsLab Text2img",
            desc: "ModelsLab/text2img",
            api: "modelslab"
        },
    ]

    return (
        <div className={`py-2 my-5 px-3  z-50 flex flex-col border shadow-lg bg-white ${isActiveText || isActiveModel ? 'h-auto rounded-xl' : 'h-auto rounded-full'}`}>
            <div className="flex items-center justify-between">
                <div className="w-full flex justify-between">
                    <div onClick={handleActiveText} className={`flex items-center  cursor-pointer w-full p-2 mr-2 rounded-full group gap-3 ${isActiveText ? 'bg-indigo-50' : 'bg-white transition-colors duration-300 hover:bg-indigo-50'}`}>
                        <div className={`rounded-full bg-gray-100 p-3 transition-colors duration-300 ${isActiveText ? '' : 'group-hover:bg-white'}`}>
                            <RxText className="w-5 h-5 text-gray-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium text-sm group-hover:text-indigo-500">Description *</span>
                            <span className="text-gray-400 font-thin text-[12px]">Explain what you want to create.</span>
                        </div>
                    </div>
                    <span className="border-r w-3"></span>
                    <div onClick={handleActiveModel} className={`flex items-center cursor-pointer w-full p-2 mr-2 ml-2 rounded-full group gap-3 ${isActiveModel ? 'bg-indigo-50' : 'bg-white transition-colors duration-300 hover:bg-indigo-50'}`}>
                        <div className={`rounded-full bg-gray-100 p-3 transition-colors duration-300 ${isActiveModel ? '' : 'group-hover:bg-white'}`}>
                            <IoIosAnalytics className="w-5 h-5 text-gray-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium text-sm group-hover:text-indigo-500">Model *</span>
                            <span className="text-gray-400 font-thin text-[12px]">Select the Image Generation model.</span>
                        </div>
                    </div>
                </div>
                <div>
                    <button onClick={imageGenerate} disabled={!isActiveText} className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white p-2 rounded-full flex justify-center gap-2 items-center">
                        <span className="text-[16px] font-sans">Generate</span>
                        <IoIosArrowRoundForward className="w-7 h-7" />
                    </button>
                </div>
            </div>
            {isActiveText && (
                <div className="my-6">
                    <TextArea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Ne oluşturmak istediğinizi açıklayın."
                        autoSize={{ minRows: 6, maxRows: 10 }}
                        className="transition-all duration-300"
                    />
                </div>
            )}
            {isActiveModel && (
                <div className="my-6">
                    <div className="flex justify-center items-center">
                        <div className=" sm:grid sm:grid-cols-1 gap-4 sm:items-center md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                            {models.map((item, index) => (
                                <div key={index} onClick={() => setModel(item.api)} className={`flex items-center shadow-xl gap-2 sm:mt-3 rounded-xl max-w-64 border ${model === item.api ? "border-2 border-indigo-500" : ""} hover:scale-105 transition-all cursor-pointer p-3`}>
                                    <img src={item.img} className="w-20 h-20 rounded-full" alt="stablediffusion" />
                                    <div className="ml-0">
                                        <span className="font-medium">{item.name}</span>
                                        <p className="text-sm  text-gray-400">{item.desc} </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {errorMessage && (
                <div className="mt-4 text-red-500">
                    {errorMessage}
                </div>
            )}
        </div>
    );
}

export default GenerateText;
