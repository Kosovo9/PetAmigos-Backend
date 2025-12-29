/**
 * Hugging Face Service - Open Source AI Integration
 * Free/Low-cost AI for image generation and text processing
 */
import axios from 'axios';

class HuggingFaceService {
    constructor() {
        this.apiKey = process.env.HUGGINGFACE_API_KEY || '';
        this.baseURL = 'https://api-inference.huggingface.co/models';

        if (!this.apiKey) {
            console.warn('⚠️  HUGGINGFACE_API_KEY not configured. Get one free at https://huggingface.co/settings/tokens');
        }
    }

    /**
     * Generate image using Stable Diffusion models
     */
    async generateImage(prompt, options = {}) {
        try {
            const model = options.model || 'stabilityai/stable-diffusion-2-1';

            const requestBody = {
                inputs: prompt,
                parameters: {
                    negative_prompt: options.negativePrompt || 'blurry, bad quality, distorted, deformed',
                    num_inference_steps: options.steps || 30,
                    guidance_scale: options.guidance || 7.5,
                    width: options.width || 512,
                    height: options.height || 512
                }
            };

            console.log(`🎨 Generating image with model: ${model}`);

            const response = await axios.post(
                `${this.baseURL}/${model}`,
                requestBody,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    responseType: 'arraybuffer',
                    timeout: 60000 // 60 seconds timeout
                }
            );

            // Convert to base64
            const base64Image = Buffer.from(response.data).toString('base64');

            console.log('✅ Image generated successfully');

            return {
                success: true,
                data: `data:image/png;base64,${base64Image}`,
                model: model
            };
        } catch (error) {
            console.error('❌ Hugging Face Image Generation Error:', error.response?.data || error.message);

            // Handle model loading errors (first request may be slow)
            if (error.response?.status === 503) {
                return {
                    success: false,
                    error: 'Model is loading. Please try again in 20-30 seconds.',
                    code: 'MODEL_LOADING'
                };
            }

            return {
                success: false,
                error: 'Image generation failed',
                details: error.message
            };
        }
    }

    /**
     * Generate text using GPT-2 or similar models
     */
    async generateText(prompt, model = 'gpt2') {
        try {
            const response = await axios.post(
                `${this.baseURL}/${model}`,
                {
                    inputs: prompt,
                    parameters: {
                        max_length: 200,
                        temperature: 0.7,
                        top_p: 0.9,
                        do_sample: true,
                        return_full_text: false
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 30000
                }
            );

            const generatedText = response.data[0]?.generated_text || '';

            return {
                success: true,
                text: generatedText,
                model: model
            };
        } catch (error) {
            console.error('Hugging Face Text Generation Error:', error.response?.data || error.message);

            return {
                success: false,
                error: 'Text generation failed',
                details: error.message
            };
        }
    }

    /**
     * Analyze sentiment of text
     */
    async analyzeSentiment(text) {
        try {
            const model = 'distilbert-base-uncased-finetuned-sst-2-english';

            const response = await axios.post(
                `${this.baseURL}/${model}`,
                { inputs: text },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 15000
                }
            );

            return {
                success: true,
                sentiment: response.data
            };
        } catch (error) {
            console.error('Sentiment Analysis Error:', error.response?.data || error.message);

            return {
                success: false,
                error: 'Sentiment analysis failed'
            };
        }
    }

    /**
     * Translate text (English to Spanish)
     */
    async translate(text, sourceLang = 'en', targetLang = 'es') {
        try {
            const model = `Helsinki-NLP/opus-mt-${sourceLang}-${targetLang}`;

            const response = await axios.post(
                `${this.baseURL}/${model}`,
                { inputs: text },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 15000
                }
            );

            const translatedText = response.data[0]?.translation_text || '';

            return {
                success: true,
                translatedText: translatedText,
                sourceLang: sourceLang,
                targetLang: targetLang
            };
        } catch (error) {
            console.error('Translation Error:', error.response?.data || error.message);

            return {
                success: false,
                error: 'Translation failed'
            };
        }
    }

    /**
     * Summarize text
     */
    async summarize(text) {
        try {
            const model = 'facebook/bart-large-cnn';

            const response = await axios.post(
                `${this.baseURL}/${model}`,
                {
                    inputs: text,
                    parameters: {
                        max_length: 130,
                        min_length: 30,
                        do_sample: false
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 30000
                }
            );

            const summary = response.data[0]?.summary_text || '';

            return {
                success: true,
                summary: summary
            };
        } catch (error) {
            console.error('Summarization Error:', error.response?.data || error.message);

            return {
                success: false,
                error: 'Summarization failed'
            };
        }
    }

    /**
     * Check if service is configured
     */
    isConfigured() {
        return !!this.apiKey;
    }
}

// Export singleton instance
export default new HuggingFaceService();
