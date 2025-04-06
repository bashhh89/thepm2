export interface ModelCapabilities {
  reasoning?: boolean;
  vision?: boolean;
  audio?: boolean;
  censored?: boolean;
  uncensored?: boolean;
}

export interface ModelInfo {
  id: string;
  name: string;
  type: string;
  description: string;
  baseModel?: boolean;
  provider?: string;
  maxTokens?: number;
  voices?: string[];
  reasoning?: boolean;
  vision?: boolean;
  audio?: boolean;
  censored?: boolean;
  uncensored?: boolean;
  inputModalities?: string[];
  outputModalities?: string[];
}

// Type helper to extract model properties from the literal array type
export type TextModelInfo = typeof MODEL_LIST.TEXT[number];
export type ImageModelInfo = typeof MODEL_LIST.IMAGE[number];

export const MODEL_LIST = {
  TEXT: [
    {
      id: "openai",
      name: "OpenAI GPT-4o-mini",
      type: "chat",
      censored: true,
      description: "OpenAI GPT-4o-mini, provider: Azure",
      baseModel: true,
      vision: true,
      provider: "Azure",
      inputModalities: ["text", "image"],
      outputModalities: ["text"]
    },
    {
      id: "openai-large",
      name: "OpenAI GPT-4o",
      type: "chat",
      censored: true,
      description: "OpenAI GPT-4o, provider: Azure",
      baseModel: true,
      vision: true,
      provider: "Azure",
      inputModalities: ["text", "image"],
      outputModalities: ["text"]
    },
    {
      id: "openai-reasoning",
      name: "OpenAI o3-mini",
      type: "chat",
      censored: true,
      description: "OpenAI o3-mini, reasoning: true, provider: Azure",
      baseModel: true,
      reasoning: true,
      provider: "Azure",
      inputModalities: ["text"],
      outputModalities: ["text"]
    },
    {
      id: "qwen-coder",
      name: "Qwen 2.5 Coder 32B",
      type: "chat",
      censored: true,
      description: "Qwen 2.5 Coder 32B, provider: Scaleway",
      baseModel: true,
      provider: "Scaleway",
      inputModalities: ["text"],
      outputModalities: ["text"]
    },
    {
      id: "llama",
      name: "Llama 3.3 70B",
      type: "chat",
      censored: true,
      description: "Llama 3.3 70B, provider: Cloudflare",
      baseModel: true,
      provider: "Cloudflare",
      inputModalities: ["text"],
      outputModalities: ["text"]
    },
    {
      id: "mistral",
      name: "Mistral Small 3",
      type: "chat",
      censored: true,
      description: "Mistral Small 3, provider: Scaleway",
      baseModel: true,
      provider: "Scaleway",
      vision: true,
      inputModalities: ["text", "image"],
      outputModalities: ["text"]
    },
    {
      id: "unity",
      name: "Unity Mistral Large",
      type: "chat",
      censored: false,
      uncensored: true,
      description: "Unity Mistral Large, provider: Scaleway, uncensored: true",
      baseModel: true,
      provider: "Scaleway",
      vision: true,
      inputModalities: ["text", "image"],
      outputModalities: ["text"]
    },
    {
      id: "midijourney",
      name: "Midijourney",
      type: "chat",
      censored: true,
      description: "Midijourney, provider: Azure",
      baseModel: true,
      provider: "Azure",
      inputModalities: ["text"],
      outputModalities: ["text"]
    },
    {
      id: "rtist",
      name: "Rtist",
      type: "chat",
      censored: true,
      description: "Rtist, provider: Azure",
      baseModel: true,
      provider: "Azure",
      inputModalities: ["text"],
      outputModalities: ["text"]
    },
    {
      id: "searchgpt",
      name: "SearchGPT",
      type: "chat",
      censored: true,
      description: "SearchGPT, provider: Azure",
      baseModel: true,
      provider: "Azure",
      vision: true,
      inputModalities: ["text", "image"],
      outputModalities: ["text"]
    },
    {
      id: "evil",
      name: "Evil",
      type: "chat",
      censored: false,
      uncensored: true,
      description: "Evil, provider: Scaleway, uncensored: true",
      baseModel: true,
      provider: "Scaleway",
      vision: true,
      inputModalities: ["text", "image"],
      outputModalities: ["text"]
    },
    {
      id: "deepseek-reasoning",
      name: "DeepSeek-R1 Distill Qwen 32B",
      type: "chat",
      censored: true,
      description: "DeepSeek-R1 Distill Qwen 32B, reasoning: true, provider: Cloudflare",
      baseModel: true,
      reasoning: true,
      provider: "Cloudflare",
      inputModalities: ["text"],
      outputModalities: ["text"]
    },
    {
      id: "deepseek-reasoning-large",
      name: "DeepSeek R1 - Llama 70B",
      type: "chat",
      censored: true,
      description: "DeepSeek R1 - Llama 70B, reasoning: true, provider: Scaleway",
      baseModel: true,
      reasoning: true,
      provider: "Scaleway",
      inputModalities: ["text"],
      outputModalities: ["text"]
    },
    {
      id: "llamalight",
      name: "Llama 3.1 8B Instruct",
      type: "chat",
      censored: true,
      description: "Llama 3.1 8B Instruct, provider: Cloudflare",
      baseModel: true,
      provider: "Cloudflare",
      inputModalities: ["text"],
      outputModalities: ["text"]
    },
    {
      id: "phi",
      name: "Phi-4 Instruct",
      type: "chat",
      censored: true,
      description: "Phi-4 Instruct, provider: Cloudflare",
      baseModel: true,
      provider: "Cloudflare",
      vision: true,
      audio: true,
      inputModalities: ["text", "image", "audio"],
      outputModalities: ["text"]
    },
    {
      id: "llama-vision",
      name: "Llama 3.2 11B Vision",
      type: "chat",
      censored: true,
      description: "Llama 3.2 11B Vision, provider: Cloudflare",
      baseModel: true,
      provider: "Cloudflare",
      vision: true,
      inputModalities: ["text", "image"],
      outputModalities: ["text"]
    },
    {
      id: "pixtral",
      name: "Pixtral 12B",
      type: "chat",
      censored: true,
      description: "Pixtral 12B, provider: Scaleway",
      baseModel: true,
      provider: "Scaleway",
      vision: true,
      inputModalities: ["text", "image"],
      outputModalities: ["text"]
    },
    {
      id: "gemini",
      name: "Gemini 2.0 Flash",
      type: "chat",
      censored: true,
      description: "Gemini 2.0 Flash, provider: Azure",
      baseModel: true,
      provider: "Azure",
      vision: true,
      audio: true,
      inputModalities: ["text", "image", "audio"],
      outputModalities: ["audio", "text"]
    },
    {
      id: "gemini-reasoning",
      name: "Gemini 2.0 Flash Thinking",
      type: "chat",
      censored: true,
      description: "Gemini 2.0 Flash Thinking, reasoning: true, provider: Azure",
      baseModel: true,
      reasoning: true,
      provider: "Azure",
      vision: true,
      audio: true,
      inputModalities: ["text", "image", "audio"],
      outputModalities: ["audio", "text"]
    },
    {
      id: "hormoz",
      name: "Hormoz 8b",
      type: "chat",
      censored: true,
      description: "Hormoz 8b, provider: Modal",
      baseModel: true,
      provider: "Modal",
      inputModalities: ["text"],
      outputModalities: ["text"]
    },
    {
      id: "hypnosis-tracy",
      name: "Hypnosis Tracy 7B",
      type: "chat",
      censored: true,
      description: "Hypnosis Tracy 7B, provider: Azure",
      baseModel: true,
      provider: "Azure",
      audio: true,
      inputModalities: ["text", "audio"],
      outputModalities: ["audio", "text"]
    },
    {
      id: "mistral-roblox",
      name: "Mistral Roblox",
      type: "chat",
      censored: false,
      uncensored: true,
      description: "Mistral Roblox on Scaleway, provider: Scaleway, uncensored: true",
      baseModel: true,
      provider: "Scaleway",
      vision: true,
      inputModalities: ["text", "image"],
      outputModalities: ["text"]
    },
    {
      id: "roblox-rp",
      name: "Roblox Roleplay Assistant",
      type: "chat",
      censored: true,
      description: "Roblox Roleplay Assistant, provider: Azure",
      baseModel: true,
      provider: "Azure",
      inputModalities: ["text"],
      outputModalities: ["text"]
    },
    {
      id: "deepseek",
      name: "DeepSeek-V3",
      type: "chat",
      censored: true,
      description: "DeepSeek-V3, provider: DeepSeek",
      baseModel: true,
      provider: "DeepSeek",
      inputModalities: ["text"],
      outputModalities: ["text"]
    },
    {
      id: "qwen-reasoning",
      name: "Qwen QWQ 32B - Advanced Reasoning",
      type: "chat",
      censored: true,
      description: "Qwen QWQ 32B - Advanced Reasoning, provider: Groq, reasoning: true",
      baseModel: true,
      reasoning: true,
      provider: "Groq",
      inputModalities: ["text"],
      outputModalities: ["text"]
    },
    {
      id: "sur",
      name: "Sur AI Assistant (Mistral)",
      type: "chat",
      censored: true,
      description: "Sur AI Assistant (Mistral), provider: Scaleway",
      baseModel: true,
      provider: "Scaleway",
      vision: true,
      inputModalities: ["text", "image"],
      outputModalities: ["text"]
    },
    {
      id: "llama-scaleway",
      name: "Llama (Scaleway)",
      type: "chat",
      censored: false,
      uncensored: true,
      description: "Llama (Scaleway), provider: Scaleway, uncensored: true",
      baseModel: true,
      provider: "Scaleway",
      inputModalities: ["text"],
      outputModalities: ["text"]
    },
    {
      id: "openai-audio",
      name: "OpenAI GPT-4o-audio-preview",
      type: "chat",
      censored: true,
      description: "OpenAI GPT-4o-audio-preview, voices: alloy,echo,fable,onyx,nova,shimmer,coral,verse,ballad,ash,sage,amuch,dan, provider: Azure",
      baseModel: true,
      provider: "Azure",
      vision: true,
      audio: true,
      inputModalities: ["text", "image", "audio"],
      outputModalities: ["audio", "text"],
      voices: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer', 'coral', 'verse', 'ballad', 'ash', 'sage', 'amuch', 'dan']
    }
  ],
  IMAGE: [
    {
      id: "flux",
      name: "Flux",
      type: "image",
      description: "Flux Image Generation",
      baseModel: true
    },
    {
      id: "turbo",
      name: "Turbo",
      type: "image",
      description: "Turbo Image Generation",
      baseModel: true
    }
  ]
}

export type TextModel = TextModelInfo["id"];
export type ImageModel = ImageModelInfo["id"]; 