import { chatWithAI } from './puter-ai';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'nl' | 'ru' | 'zh' | 'ja' | 'ko';

export const LANGUAGES: Record<Language, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  nl: 'Dutch',
  ru: 'Russian',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean'
};

export async function translateContent(
  content: string,
  targetLanguage: Language,
  sourceLanguage: Language = 'en'
): Promise<string> {
  try {
    const response = await chatWithAI(
      `Translate this content from ${LANGUAGES[sourceLanguage]} to ${LANGUAGES[targetLanguage]}:\n\n${content}`
    );
    return response.message?.content || content;
  } catch (error) {
    console.error('Translation failed:', error);
    throw error;
  }
}

export async function translateBlock(
  block: any,
  targetLanguage: Language,
  sourceLanguage: Language = 'en'
): Promise<any> {
  try {
    switch (block.type) {
      case 'text':
        const translatedText = await translateContent(block.content, targetLanguage, sourceLanguage);
        return {
          ...block,
          content: translatedText
        };

      case 'data':
        const data = JSON.parse(block.content);
        if (data.headers) {
          const translatedHeaders = await Promise.all(
            data.headers.map((header: string) => translateContent(header, targetLanguage, sourceLanguage))
          );
          return {
            ...block,
            content: JSON.stringify({
              ...data,
              headers: translatedHeaders
            })
          };
        }
        return block;

      case 'chart':
        const chartData = JSON.parse(block.content);
        if (chartData.title) {
          const translatedTitle = await translateContent(chartData.title, targetLanguage, sourceLanguage);
          return {
            ...block,
            content: JSON.stringify({
              ...chartData,
              title: translatedTitle,
              options: {
                ...chartData.options,
                title: {
                  ...chartData.options?.title,
                  text: translatedTitle
                }
              }
            })
          };
        }
        return block;

      default:
        return block;
    }
  } catch (error) {
    console.error('Block translation failed:', error);
    throw error;
  }
}

export async function translateDocument(
  blocks: any[],
  targetLanguage: Language,
  sourceLanguage: Language = 'en'
): Promise<any[]> {
  try {
    return await Promise.all(
      blocks.map(block => translateBlock(block, targetLanguage, sourceLanguage))
    );
  } catch (error) {
    console.error('Document translation failed:', error);
    throw error;
  }
}

export async function detectLanguage(text: string): Promise<Language> {
  try {
    const response = await chatWithAI(
      `Detect the language of this text and return just the language code (en, es, fr, etc):\n\n${text}`
    );
    return (response.message?.content?.trim() || 'en') as Language;
  } catch (error) {
    console.error('Language detection failed:', error);
    return 'en';
  }
}

export async function localizeForCulture(
  content: string,
  targetCulture: string,
  contentType: 'formal' | 'casual' | 'marketing'
): Promise<string> {
  try {
    const response = await chatWithAI(
      `Adapt this content for ${targetCulture} audience using ${contentType} style. Consider cultural nuances, idioms, and preferences:\n\n${content}`
    );
    return response.message?.content || content;
  } catch (error) {
    console.error('Cultural localization failed:', error);
    throw error;
  }
}