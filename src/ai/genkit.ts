import { genkit } from 'genkit';
import { openAI } from 'genkitx-openai';
import * as fs from 'fs';
import * as path from 'path';

// Manually read .env file to get OPENAI_API_KEY
function getOpenAIKey(): string {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const match = content.match(/^OPENAI_API_KEY=(.+)$/m);
      if (match && match[1]) {
        const key = match[1].trim();
        console.log('✅ OPENAI_API_KEY loaded from .env file');
        return key;
      }
    }
    // Fallback to process.env
    if (process.env.OPENAI_API_KEY) {
      return process.env.OPENAI_API_KEY;
    }
    console.error('❌ OPENAI_API_KEY not found in .env or process.env');
    return '';
  } catch (e) {
    console.error('Error reading .env:', e);
    return process.env.OPENAI_API_KEY || '';
  }
}

const apiKey = getOpenAIKey();

// OpenAI GPT-4 configuration
export const ai = genkit({
  plugins: [
    openAI({
      apiKey: apiKey,
    }),
  ],
  model: 'openai/gpt-4o-mini',
});





