import { useState } from "react";
import GenerateImage from "./GenerateImage";
import GenerateText from "./GenerateText";
import { Tabs } from 'antd';
import MyGenerateImage from "./MyGenerateImage";
import LoadingGenerate from "./LoadingGenerate";

function ImageGenerator() {
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const items = [
        {
            key: '1',
            label: 'Created Artifacts',
            children: <GenerateImage imageUrl={imageUrl} />,
        },
        {
            key: '2',
            label: 'My Artworks',
            children: <MyGenerateImage imageUrl={imageUrl} />,
        },
    ];

    return (
        <div className='my-8 px-10 sm:px-10 md:px-20 lg:px-32 xl:px-56'>
            <div className='text-3xl font-semibold'>Create Image</div>
            <GenerateText setImageUrl={setImageUrl} setLoading={setLoading} />
            {!loading ?
                <Tabs defaultActiveKey="1" items={items} />
                :
                <LoadingGenerate />
            }
        </div>
    )
}

export default ImageGenerator;
