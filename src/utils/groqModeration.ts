/**
 * Groq AI Message Moderation
 *
 * Uses Groq's llama-guard-3-8b model to check messages for:
 *  - Sensitive personal information (credit cards, SSN, passwords)
 *  - Malicious content (phishing, scams, harassment)
 *  - Violent or harmful content
 *
 * Returns a moderation result with safe/unsafe flag, category, and description.
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

// Read API key from env — user should set VITE_GROQ_API_KEY in .env
const getApiKey = () => {
    const key = import.meta.env.VITE_GROQ_API_KEY
    if (!key) {
        console.warn("VITE_GROQ_API_KEY is not set. Message moderation is disabled.")
    }
    return key || ""
}

export interface ModerationResult {
    safe: boolean
    category: string
    description: string
    recommendation: string
}

/**
 * Check a message for suspicious / malicious content via Groq llama-guard.
 *
 * If the API key is missing or the call fails, we default to SAFE (don't block).
 */
export async function moderateMessage(message: string): Promise<ModerationResult> {
    const apiKey = getApiKey()

    // If no API key, skip moderation
    if (!apiKey) {
        return { safe: true, category: "", description: "", recommendation: "" }
    }

    // Short messages are unlikely to be harmful
    if (message.trim().length < 3) {
        return { safe: true, category: "", description: "", recommendation: "" }
    }

    try {
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "llama-guard-3-8b",
                messages: [
                    {
                        role: "user",
                        content: message,
                    },
                ],
            }),
        })

        if (!response.ok) {
            console.error("Groq moderation API error:", response.status)
            return { safe: true, category: "", description: "", recommendation: "" }
        }

        const data = await response.json()
        const output = data.choices?.[0]?.message?.content?.trim() || "safe"

        // llama-guard returns "safe" or "unsafe\n<category>"
        if (output.toLowerCase().startsWith("safe")) {
            return { safe: true, category: "", description: "", recommendation: "" }
        }

        // Parse unsafe response - format: "unsafe\nS1" or "unsafe\nS1,S2"
        const lines = output.split("\n")
        const categoryCode = lines[1]?.trim() || "Unknown"

        const categoryMap: Record<string, { label: string; description: string; recommendation: string }> = {
            S1: {
                label: "Violent Content",
                description: "This message may contain violent or threatening content.",
                recommendation: "Please report this user if you feel threatened.",
            },
            S2: {
                label: "Sexual Content",
                description: "This message may contain inappropriate sexual content.",
                recommendation: "Consider reporting this user for inappropriate behavior.",
            },
            S3: {
                label: "Criminal Planning",
                description: "This message may contain references to criminal activity.",
                recommendation: "Please report this conversation if you suspect criminal intent.",
            },
            S4: {
                label: "Firearms & Weapons",
                description: "This message contains references to weapons or firearms.",
                recommendation: "Report if this seems threatening.",
            },
            S5: {
                label: "Regulated Substances",
                description: "This message references controlled substances.",
                recommendation: "Report if illegal activity is suspected.",
            },
            S6: {
                label: "Suicide & Self-Harm",
                description: "This message may contain references to self-harm.",
                recommendation: "If you or someone you know needs help, contact a crisis hotline.",
            },
            S7: {
                label: "Sensitive Personal Information",
                description: "This message contains sensitive personal data (credit cards, SSN, passwords, etc.).",
                recommendation: "Never share personal financial or identity information in chat.",
            },
            S8: {
                label: "Intellectual Property",
                description: "This message may contain copyrighted or proprietary content.",
                recommendation: "Respect intellectual property rights.",
            },
            S9: {
                label: "Indiscriminate Weapons",
                description: "This message references dangerous weapons.",
                recommendation: "Report this content immediately.",
            },
            S10: {
                label: "Hate Speech",
                description: "This message may contain hateful or discriminatory language.",
                recommendation: "Report this user for hate speech.",
            },
            S11: {
                label: "Defamation",
                description: "This message may contain defamatory content.",
                recommendation: "Consider reporting if the statements are false and damaging.",
            },
            S12: {
                label: "Cyber Crime",
                description: "This message may reference phishing, hacking, or other cyber crimes.",
                recommendation: "Do not click any links. Report this user.",
            },
            S13: {
                label: "Elections & Politics",
                description: "This message contains potentially misleading political content.",
                recommendation: "Verify information from official sources.",
            },
            S14: {
                label: "Code Interpreter Abuse",
                description: "This message attempts to exploit system capabilities.",
                recommendation: "Report this content.",
            },
        }

        const info = categoryMap[categoryCode] || {
            label: "Suspicious Content",
            description: "This message was flagged as potentially unsafe.",
            recommendation: "Exercise caution when responding.",
        }

        return {
            safe: false,
            category: info.label,
            description: info.description,
            recommendation: info.recommendation,
        }
    } catch (error) {
        console.error("Groq moderation check failed:", error)
        // On error, default to safe to avoid blocking legitimate messages
        return { safe: true, category: "", description: "", recommendation: "" }
    }
}
