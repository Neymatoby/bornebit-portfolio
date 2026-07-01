const path = require("path");
const express = require("express");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const port = Number(process.env.PORT || 3000);
const model = process.env.OPENAI_MODEL || "gpt-5.2";
const hasApiKey = Boolean(process.env.OPENAI_API_KEY);
const client = hasApiKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname));

app.get("/api/health", (_request, response) => {
    response.json({
        aiConfigured: hasApiKey,
        model
    });
});

app.post("/api/chat", async (request, response) => {
    const { prompt, action, snapshot, history } = request.body || {};
    if (!prompt || !snapshot) {
        response.status(400).json({ error: "Missing prompt or snapshot." });
        return;
    }

    if (!client) {
        response.json({
            mode: "simulation",
            text: buildFallbackReply(prompt, action, snapshot)
        });
        return;
    }

    try {
        const input = [
            ...(Array.isArray(history) ? history.slice(-6).map((message) => ({
                role: message.role === "assistant" ? "assistant" : "user",
                content: [{ type: "input_text", text: String(message.content) }]
            })) : []),
            {
                role: "user",
                content: [
                    {
                        type: "input_text",
                        text: [
                            `User prompt: ${prompt}`,
                            `Action summary: ${action?.summary || "No model change."}`,
                            `Live snapshot: ${JSON.stringify(snapshot)}`
                        ].join("\n")
                    }
                ]
            }
        ];

        const aiResponse = await client.responses.create({
            model,
            instructions: [
                "You are Borne AI, the investor-facing intelligence layer for BORNE FARMS AI OS.",
                "Use the supplied herd/financial snapshot AND Nigeria macro-economic context.",
                "KEY CONTEXT: Nigeria population 242M (2026), projected 400M+ by 2050 (3rd largest globally). 65% livestock imported ($2B+/yr). Red meat market $4.87B at 5% CAGR. Dairy imports $1.5B/yr (60-65% imported). Beef prices ₦7,200-₦8,200/kg, doubled recently. 60% under 30, median age 18.3. Food inflation 17.8%. Meat consumption 15kg/person vs 64kg global average. Government targeting livestock growth from $32B to $74B. ₦3.2T untapped red meat export opportunity.",
                "Answer in concise, premium operating language.",
                "When the prompt changes the model, explicitly state the updated implication.",
                "When giving recommendations, refer to years, herd counts, ROI, value, AND Nigeria market opportunity using the supplied data.",
                "When asked about the food market or Nigeria economy, provide compelling data-driven insights about why cattle farming in Nigeria is a massive opportunity."
            ].join(" "),
            input
        });

        response.json({
            mode: "live",
            text: aiResponse.output_text || buildFallbackReply(prompt, action, snapshot)
        });
    } catch (error) {
        response.json({
            mode: "fallback",
            text: buildFallbackReply(prompt, action, snapshot)
        });
    }
});

app.get("/api/nuggets", async (_request, response) => {
    if (!client) {
        response.json({ mode: "simulation", nuggets: getBuiltInNuggets() });
        return;
    }
    try {
        const aiResponse = await client.responses.create({
            model,
            instructions: [
                "You are an expert on Nigeria's economy, agriculture, livestock, and food security.",
                "Generate 5 compelling, data-driven insights about Nigeria's beef/dairy/food market opportunity.",
                "Each insight should be 1-2 sentences with specific numbers.",
                "Focus on: population growth, beef demand gap, milk deficit, youth demographics, investment opportunity.",
                "Return ONLY a JSON array of objects with keys: icon (emoji), text (the insight with key numbers wrapped in **bold**), source (data source)."
            ].join(" "),
            input: [{ role: "user", content: [{ type: "input_text", text: "Generate 5 fresh Nigeria food economy intelligence nuggets for today." }] }]
        });
        try {
            const nuggets = JSON.parse(aiResponse.output_text);
            response.json({ mode: "live", nuggets });
        } catch {
            response.json({ mode: "simulation", nuggets: getBuiltInNuggets() });
        }
    } catch {
        response.json({ mode: "simulation", nuggets: getBuiltInNuggets() });
    }
});

function getBuiltInNuggets() {
    return [
        { icon: "🇳🇬", text: "Nigeria adds **~5 million people every year**. By 2050, it will be the world's 3rd most populous country at **400M+** — every one of them needs protein.", source: "UN World Population Prospects, 2024" },
        { icon: "🥩", text: "**65% of livestock consumed** in Nigeria is imported. That's a **$2B+ annual market** waiting for domestic producers to capture.", source: "Federal Ministry of Livestock Development, 2026" },
        { icon: "📊", text: "Nigeria's red meat market is valued at **$4.87 billion** and growing at **~5% CAGR**. The runway is massive and mostly untapped.", source: "Expert Market Research, 2024" },
        { icon: "🐄", text: "Nigerian cattle produce only **1–2 litres of milk/day** vs. **15–20 litres** for improved breeds. That's a **10x productivity upside** waiting to be unlocked.", source: "FAO/USDA Agricultural Reports" },
        { icon: "🥛", text: "Nigeria imports **60–65% of its dairy**, spending **$1.5 billion/year** in forex. Only **8.7L/person/year** consumed vs. WHO's recommended **210L**.", source: "NBS Nigeria / FAO" },
        { icon: "💰", text: "The untapped red meat export market is worth **₦3.2 trillion/year** according to Nigeria's own Ministry of Livestock Development.", source: "FMLD Policy Brief, 2026" },
        { icon: "🍖", text: "The average Nigerian eats only **15kg of meat/year**. The global average is **64kg**. As incomes rise, demand will **explode**.", source: "FAOSTAT" },
        { icon: "📈", text: "Beef prices have **doubled** in some Nigerian markets between 2025–2026, now at **₦7,200–₦8,200/kg**. Producers are earning more than ever.", source: "NBS Consumer Price Index" },
        { icon: "🌍", text: "**60%+ of Nigeria's 242M people are under 30**. Median age: **18.3 years**. This is the world's fastest-growing consumer engine.", source: "UN Population Data, 2024" },
        { icon: "🏗️", text: "Government has earmarked **5+ million hectares** for livestock, plus **tax holidays** and **low-interest loans** for producers.", source: "National Livestock Growth Acceleration Strategy" },
        { icon: "🔬", text: "Nigeria's livestock subsector output hit **₦1.57 trillion in Q1 2026** alone. The government targets growing this from **$32B to $74B** within a decade.", source: "NBS GDP Report Q1 2026" },
        { icon: "🛡️", text: "Nigeria's food import bill reached **₦7.65 trillion in 2025**. Every naira spent on imports is a naira that should stay in the domestic food chain.", source: "NBS Trade Data, 2025" },
        { icon: "⚡", text: "Food inflation in Nigeria sits at **17.8% YoY** (May 2026). Producers who scale NOW ride the pricing wave while building long-term supply infrastructure.", source: "NBS CPI Report, May 2026" },
        { icon: "🎯", text: "Agriculture contributes **18.11% of Nigeria's GDP** but livestock is only **5%**. The gap between potential and output is your opportunity.", source: "NBS GDP Report Q1 2026" },
        { icon: "🌱", text: "A healthy diet in Nigeria now costs **₦1,589/adult/day** — up 4.74% YoY. Affordable protein production isn't just business, it's **nation-building**.", source: "Cost of Diet Analysis, April 2026" }
    ];
}

app.listen(port, () => {
    console.log(`Borne Farms AI OS running on http://localhost:${port}`);
});

function buildFallbackReply(prompt, action, snapshot) {
    const lower = prompt.toLowerCase();
    const yearMatch = lower.match(/(\d{4})/);
    const row = yearMatch ? snapshot.yearRows.find((item) => item.year === Number(yearMatch[1])) : null;

    if (action?.type === "update") {
        return `${action.summary} The refreshed base case now models ${snapshot.metrics.currentHerd} head currently and ${formatCurrencyShort(snapshot.metrics.value2036)} by 2036, with ${snapshot.metrics.roi2036}% ROI.`;
    }

    if (lower.includes("show herd value") && row) {
        return `${row.year} is currently marked at ${formatCurrencyShort(row.totalValue)} with ${row.closingHerd} head and ${row.roi}% ROI.`;
    }

    if (lower.includes("sell or hold")) {
        return snapshot.metrics.billionYear
            ? `Hold the breeding base unless you need liquidity. The model still reaches ₦1B by ${snapshot.metrics.billionYear}, so the smarter move is selective bull sales rather than broad herd reduction.`
            : "Hold breeding females and sell only mature bulls opportunistically. The compounding engine is still more valuable than an early broad liquidation.";
    }

    if (lower.includes("1 billion") || lower.includes("1b")) {
        return snapshot.metrics.billionYear
            ? `The current model already reaches ₦1B by ${snapshot.metrics.billionYear}. Keep mortality down, retain females, and avoid selling your breeder base too early.`
            : "To reach ₦1B faster, add more females before 2032, tighten mortality controls, and layer in premium exits for mature bulls instead of selling the herd broadly.";
    }

    if (lower.includes("profit") && lower.includes("bull") && row) {
        return `At ${row.year} pricing, the modeled bull sale economics are strong enough to create liquidity without breaking the growth curve, provided you keep the breeding females intact.`;
    }

    return `The live model shows ${snapshot.metrics.currentHerd} head today, ${formatCurrencyShort(snapshot.metrics.currentValue)} in current asset value, and ${formatCurrencyShort(snapshot.metrics.value2036)} by 2036. The key lever right now is ${snapshot.riskScores.disease > 55 ? "mortality reduction" : "scaling retained females with discipline"}.`;
}

function formatCurrencyShort(value) {
    if (value >= 1000000000) {
        return `₦${roundNumber(value / 1000000000, 2)}B`;
    }
    if (value >= 1000000) {
        return `₦${roundNumber(value / 1000000, 2)}M`;
    }
    if (value >= 1000) {
        return `₦${roundNumber(value / 1000, 0)}K`;
    }
    return `₦${roundNumber(value, 0)}`;
}

function roundNumber(value, digits) {
    const factor = 10 ** digits;
    return Math.round(value * factor) / factor;
}
