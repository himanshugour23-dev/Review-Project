import {GoogleGenAI} from "@google/genai";
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

export async function avatarModration( buffer : Buffer, mimeType: string):Promise<boolean>{
    const prompt = `
        You are an image moderation system for profile avatars.
        Check the attached image against these rules.
        REJECT images containing:
        - Nudity or sexually explicit content
        - Pornographic or sexualized imagery
        - Hate symbols or hateful imagery
        - Extremely disturbing or abusive content
        ALLOW:
        - Normal human portraits and selfies
        - Fully clothed people
        - Anime, game characters and illustrations
        - Harmless memes and ordinary artwork
        Return ONLY JSON: {"allowed": true} or {"allowed": false}
        If prohibited content is present or you cannot confidently
        determine whether the image is safe, return false. `;
        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: [
            { text: prompt },
            {
                inlineData: {
                mimeType,
                data: buffer.toString("base64"),
                },
            },
            ],
            config: {
            responseMimeType: "application/json",
            },
        });
        const result = JSON.parse(response.text ?? "{}");
        return result.allowed==true
}