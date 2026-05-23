import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractText, getDocumentProxy } from "unpdf";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const question = formData.get("question") as string | null;

        if (!file || !question) {
            return NextResponse.json(
                { error: "Both a PDF file and a question are required." },
                { status: 400 }
            );
        }

        // Extract text from PDF using unpdf (no worker setup needed)
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await getDocumentProxy(new Uint8Array(arrayBuffer));
        const { text } = await extractText(pdf, { mergePages: true });
        const syllabusText = Array.isArray(text) ? text.join("\n") : text;

        // Build the prompt
        const prompt = `You are a strict Teaching Assistant. Answer the user's QUESTION using ONLY the SYLLABUS TEXT provided below. If the answer is not in the text, say exactly: I cannot find this in the syllabus.\n\nSYLLABUS TEXT:\n${syllabusText}\n\nQUESTION:\n${question}`;

        // Call Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const response = result.response;
        const answer = response.text();

        return NextResponse.json({ answer });
    } catch (error: unknown) {
        console.error("Chat API error:", error);
        const message =
            error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
