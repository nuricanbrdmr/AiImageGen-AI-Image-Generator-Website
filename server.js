import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';

// Çevresel değişkenlerin yüklenmesi
dotenv.config();

const app = express();
app.use(express.json());

// CORS yapılandırması
app.use(cors({
    origin: 'http://localhost:5173',
}));

const MAX_RETRIES = 20;
const RETRY_DELAY = 10000;

// Resim oluşturma fonksiyonu
const generateImageModelslab = async (prompt) => {
    const options = {
        method: 'POST',
        url: 'https://modelslab.com/api/v6/realtime/text2img',
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            key: process.env.MODELSLAB_API_KEY,
            prompt: prompt,
            negative_prompt: "bad quality",
            width: "512",
            height: "512",
            safety_checker: false,
            seed: null,
            samples: 1,
            base64: false,
            webhook: null,
            track_id: null
        },
    };

    try {
        const response = await axios(options);
        if (response.status === 200) {
            console.log('response.data:', response.data);
            return response.data;
        } else {
            throw new Error(`HTTP error! status: ${response.status}, details: ${response.data}`);
        }
    } catch (error) {
        throw new Error(`Error generating image: ${error.message}`);
    }
};

const generateImageStableDiffusion = async (prompt, retries = 0) => {
    const data = {
        inputs: prompt,
    };

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            if (response.status === 503 && retries < MAX_RETRIES) {
                const retryAfter = RETRY_DELAY;
                console.log(`Model is loading or unavailable. Retrying in ${retryAfter / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, retryAfter));
                return generateImageStableDiffusion(prompt, retries + 1);
            }
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
        }

        const result = await response.blob();
        const buffer = await result.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
        return `data:image/png;base64,${base64Image}`;
    } catch (error) {
        throw new Error(`Error generating image: ${error.message}`);
    }
};

const generateImageRunwayML = async (prompt, retries = 0) => {
    const data = {
        inputs: prompt,
    };

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            if (response.status === 503 && retries < MAX_RETRIES) {
                const retryAfter = RETRY_DELAY;
                console.log(`Model is loading or unavailable. Retrying in ${retryAfter / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, retryAfter));
                return generateImageRunwayML(prompt, retries + 1);
            }
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
        }

        const result = await response.blob();
        const buffer = await result.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
        return `data:image/png;base64,${base64Image}`;
    } catch (error) {
        throw new Error(`Error generating image: ${error.message}`);
    }
};

const generateImageCompVis = async (prompt, retries = 0) => {
    const data = {
        inputs: prompt,
    };

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4",
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            if (response.status === 503 && retries < MAX_RETRIES) {
                const retryAfter = RETRY_DELAY;
                console.log(`Model is loading or unavailable. Retrying in ${retryAfter / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, retryAfter));
                return generateImageCompVis(prompt, retries + 1);
            }
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
        }

        const result = await response.blob();
        const buffer = await result.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
        return `data:image/png;base64,${base64Image}`;
    } catch (error) {
        throw new Error(`Error generating image: ${error.message}`);
    }
};

const generateImageOpenJourney = async (data, retries = 0) => {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/prompthero/openjourney-v4",
        {
            headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) {
        if (response.status === 503 && retries < MAX_RETRIES) {
            const retryAfter = (await response.json()).estimated_time || RETRY_DELAY;
            console.log(`Model is loading. Retrying in ${retryAfter / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, retryAfter));
            return generateImageOpenJourney(data, retries + 1);
        }
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
    }

    const result = await response.blob();
    return result;
};

const generateImageCounterfeit = async (data, retries = 0) => {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/gsdf/Counterfeit-V2.5",
        {
            headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) {
        if (response.status === 503 && retries < MAX_RETRIES) {
            const retryAfter = (await response.json()).estimated_time || RETRY_DELAY;
            console.log(`Model is loading. Retrying in ${retryAfter / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, retryAfter));
            return generateImageCounterfeit(data, retries + 1);
        }
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
    }

    const result = await response.blob();
    return result;
};

const generateImageStableCascade = async (prompt) => {
    try {
        const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1", {
            headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ inputs: prompt }), // Correct format
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`HTTP error! status: ${response.status}, details: ${errorText}`);
            throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
        }

        const result = await response.arrayBuffer();
        return Buffer.from(result); // Convert ArrayBuffer to Buffer
    } catch (error) {
        console.error(`Error generating image: ${error.message}`);
        throw new Error(`Error generating image: ${error.message}`);
    }
};

const generateImagePlaygroundAI = async (prompt, retries = 0) => {
    const data = {
        inputs: prompt,
    };

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/playgroundai/playground-v2.5-1024px-aesthetic",
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            if (response.status === 503 && retries < MAX_RETRIES) {
                console.log(`Model is loading or unavailable. Retrying in ${RETRY_DELAY / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                return generateImagePlaygroundAI(prompt, retries + 1);
            }
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
        }

        const result = await response.arrayBuffer();
        const base64Image = Buffer.from(result).toString('base64');
        return `data:image/png;base64,${base64Image}`;
    } catch (error) {
        throw new Error(`Error generating image: ${error.message}`);
    }
};


const generateImageAnimagineXl = async (prompt) => {
    try {
        const response = await fetch("https://api-inference.huggingface.co/models/Linaqruf/animagine-xl-3.0", {
            headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ inputs: prompt }), // Correct format
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`HTTP error! status: ${response.status}, details: ${errorText}`);
            throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
        }

        const result = await response.arrayBuffer();
        return Buffer.from(result); // Convert ArrayBuffer to Buffer
    } catch (error) {
        console.error(`Error generating image: ${error.message}`);
        throw new Error(`Error generating image: ${error.message}`);
    }
};


// /api/generate-image endpoint'i
app.post('/api/generate-image/modelslab', async (req, res) => {
    const { prompt } = req.body;
    try {
        const result = await generateImageModelslab(prompt);
        console.log('result:', result);
        const imageUrl = result.output[0] || result.proxy_links[0];
        res.json({ imageUrl });
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/generate-image/stable-diffusion-2-1', async (req, res) => {
    const { prompt } = req.body;
    try {
        const imageUrl = await generateImageStableDiffusion(prompt);
        res.json({ imageUrl });
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/generate-image/runwayml', async (req, res) => {
    const { prompt } = req.body;
    try {
        const imageUrl = await generateImageRunwayML(prompt);
        res.json({ imageUrl });
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/generate-image/comp-vis', async (req, res) => {
    const { prompt } = req.body;
    try {
        const imageUrl = await generateImageCompVis(prompt);
        res.json({ imageUrl });
    } catch (error) {
        console.error('Error generating image:', error);
        if (error.message.includes('HTTP error! status: 503')) {
            res.status(503).json({ error: 'Service temporarily unavailable. Please try again later.' });
        } else {
            res.status(500).json({ error: 'Server error' });
        }
    }
});

app.post('/api/generate-image/openjourney-v4', async (req, res) => {
    const { prompt } = req.body;
    try {
        const blob = await generateImageOpenJourney({ inputs: prompt });
        const buffer = Buffer.from(await blob.arrayBuffer());

        // Convert the buffer to a base64 string
        const base64Image = buffer.toString('base64');

        // Create a data URL
        const imageUrl = `data:image/jpeg;base64,${base64Image}`;
        res.json({ imageUrl });
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/generate-image/Counterfeit-V2.5', async (req, res) => {
    const { prompt } = req.body;
    try {
        const blob = await generateImageCounterfeit({ inputs: prompt });
        const buffer = Buffer.from(await blob.arrayBuffer());

        // Convert the buffer to a base64 string
        const base64Image = buffer.toString('base64');

        // Create a data URL
        const imageUrl = `data:image/jpeg;base64,${base64Image}`;
        res.json({ imageUrl });
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/generate-image/stable-cascade', async (req, res) => {
    const { prompt } = req.body;
    try {
        const buffer = await generateImageStableCascade(prompt);
        const base64Image = buffer.toString('base64');
        const imageUrl = `data:image/jpeg;base64,${base64Image}`;
        res.json({ imageUrl });
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/generate-image/playground-v2.5-1024px-aesthetic', async (req, res) => {
    const { prompt } = req.body;

    try {
        const imageUrl = await generateImagePlaygroundAI(prompt);
        res.json({ imageUrl });
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


app.post('/api/generate-image/animagine-xl-3.0', async (req, res) => {
    const { prompt } = req.body;
    try {
        const buffer = await generateImageAnimagineXl(prompt);
        const base64Image = buffer.toString('base64');
        const imageUrl = `data:image/jpeg;base64,${base64Image}`;
        res.json({ imageUrl });
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Sunucu başlatma
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
