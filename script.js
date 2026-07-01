/* ===== BORNEBIT INTELLIGENCE ENGINE ===== */
/*
   REALISTIC CATTLE PROJECTION MODEL
   - Purchase: 8 female + 2 male calves in Year 1 (2026)
   - Cattle develop for 2-3 years, start reproducing at age 3 (first calves born Year 4)
   - From Year 3 (2028): owner adds +3 female calves annually to the herd
   - Risks: disease, theft, drought modeled via mortality rate
   - Surplus males sold once mature, keeping 2 breeding bulls
   - Conservative price growth (8%) reflects Nigerian cattle market
*/

const BASE_YEAR = 2026;
const HORIZON = 10;
const MATURE_AGE = 2;       // Cattle mature ~15-18 months, first calf born at age 2 (Year 3)
const MAX_AGE = 12;
const ADDITION_START_OFFSET = 2; // Year 3 = 2028, owner starts adding 3 female calves/yr

const defaultSettings = {
    fertilityRate: 0.70,      // 70% — conservative for mixed-age herd
    mortalityRate: 0.08,      // 8% — accounts for disease, drought, theft
    priceGrowthRate: 0.08,    // 8% — conservative annual cattle price growth
    annualCalfAdditions: 3,
    matureCowPrice: 1200000,  // ₦1.2M baseline mature cow price (2026)
    calfPrice: 250000,        // ₦250K per calf
    femaleBirthRatio: 0.52    // ~52% of births are female (slightly above 50:50)
};

// Drone operations constants
const DRONE_OPS = {
    totalPilots: 40,
    militaryActive: 20,
    oilGasActive: 2,
    feePerPilot: 20000
};
DRONE_OPS.available = DRONE_OPS.totalPilots - DRONE_OPS.militaryActive - DRONE_OPS.oilGasActive;
DRONE_OPS.deployedTotal = DRONE_OPS.militaryActive + DRONE_OPS.oilGasActive;
DRONE_OPS.monthlyRevenue = DRONE_OPS.deployedTotal * DRONE_OPS.feePerPilot;
DRONE_OPS.annualRevenue = DRONE_OPS.monthlyRevenue * 12;
DRONE_OPS.fullCapacityAnnual = DRONE_OPS.totalPilots * DRONE_OPS.feePerPilot * 12;

const state = {
    settings: { ...defaultSettings },
    adjustments: {},
    salesPlan: {},
    priceOverrides: {},
    latestProjection: null,
    chartInstances: {},
    chatHistory: [],
    livePulse: 1,
    livePulseTrend: 0,
    aiConfigured: false
};

// Initialize additions: +3 female calves from Year 3 (2028) onward
function resetAdjustments() {
    state.adjustments = {};
    for (let year = BASE_YEAR + ADDITION_START_OFFSET; year <= BASE_YEAR + HORIZON; year++) {
        state.adjustments[year] = { adultFemale: 0, adultMale: 0, calfFemale: state.settings.annualCalfAdditions, calfMale: 0 };
    }
}
resetAdjustments();

const elements = {};

document.addEventListener("DOMContentLoaded", async () => {
    cacheElements();
    initVisionQuote();
    initTopbar();
    initControls();
    initPromptChips();
    initChat();
    initCharts();
    initPanels();
    initMobileMenu();
    initPilots();
    initNigeriaIntel();
    initThesisButtons();
    await checkAiHealth();
    renderAll();
    seedChat();
    startLivePulse();
});

function initLoader() {
    const loader = document.getElementById("appLoader");
    setTimeout(() => { loader.classList.add("hidden"); }, 2000);
}

/* ===== VISION QUOTE OVERLAY ===== */
const VISION_QUOTES = [
    {
        icon: "🌍",
        text: 'Nigeria will add <strong>160 million mouths</strong> to feed by 2050. Every one of them will need protein. You\'re not just building a farm — <strong>you\'re building the answer.</strong>',
        source: "— UN World Population Prospects, 2024"
    },
    {
        icon: "🥩",
        text: '<strong>65% of Nigeria\'s livestock is imported.</strong> That\'s over <strong>$2 billion leaving the country every year.</strong> You\'re building what brings it back.',
        source: "— Federal Ministry of Livestock Development, 2026"
    },
    {
        icon: "🚀",
        text: '<strong>242 million people. 60% under 30.</strong> The world\'s fastest-growing consumer base is hungry — literally. <strong>You saw the opportunity first.</strong>',
        source: "— UN Population Data, 2024"
    },
    {
        icon: "📈",
        text: 'Beef prices have <strong>doubled in Nigerian markets.</strong> The average Nigerian eats only <strong>15kg of meat/year</strong> vs the global <strong>64kg.</strong> The demand curve hasn\'t even started.',
        source: "— FAOSTAT / NBS Consumer Price Index"
    },
    {
        icon: "🎯",
        text: 'Nigeria\'s <strong>₦3.2 trillion untapped</strong> red meat market isn\'t waiting. The question isn\'t whether this market will explode — <strong>it\'s who will be ready when it does.</strong>',
        source: "— FMLD Policy Brief, 2026"
    },
    {
        icon: "💎",
        text: 'A <strong>$4.87 billion beef market</strong> growing at <strong>5% per year.</strong> A dairy import bill of <strong>$1.5 billion.</strong> The numbers don\'t just justify your vision — <strong>they demand it.</strong>',
        source: "— Expert Market Research / FAO"
    },
    {
        icon: "⚡",
        text: 'The government has earmarked <strong>5+ million hectares</strong> for livestock and is offering <strong>tax holidays.</strong> The infrastructure is being laid. <strong>Your timing is perfect.</strong>',
        source: "— National Livestock Growth Acceleration Strategy"
    },
    {
        icon: "🌱",
        text: 'Nigerian cattle yield <strong>1-2 litres of milk/day.</strong> Improved breeds yield <strong>15-20 litres.</strong> That\'s a <strong>10x productivity revolution</strong> waiting for someone bold enough to build it.',
        source: "— FAO / USDA Agricultural Reports"
    }
];

function initVisionQuote() {
    const overlay = document.getElementById("visionOverlay");
    const enterBtn = document.getElementById("visionEnterBtn");
    const loader = document.getElementById("appLoader");
    if (!overlay || !enterBtn) return;

    // Pick a random quote
    const quote = VISION_QUOTES[Math.floor(Math.random() * VISION_QUOTES.length)];
    const iconEl = document.getElementById("visionIcon");
    const textEl = document.getElementById("visionQuote");
    const sourceEl = document.getElementById("visionSource");
    if (iconEl) iconEl.textContent = quote.icon;
    if (textEl) textEl.innerHTML = quote.text;
    if (sourceEl) sourceEl.textContent = quote.source;

    // Keep loader hidden until quote is dismissed
    if (loader) loader.style.display = "none";

    enterBtn.addEventListener("click", () => {
        overlay.classList.add("fade-out");
        // Show and start loader after quote fades
        setTimeout(() => {
            overlay.style.display = "none";
            if (loader) {
                loader.style.display = "";
                initLoader();
            }
        }, 800);
    });
}

function cacheElements() {
    const ids = [
        "aiStatusPill", "chatModeBadge", "chatLog", "chatForm", "chatInput",
        "chatSubmitButton", "projectionTableBody", "resetModelButton",
        "heroHerd", "heroValue", "heroProjection", "heroProjectionText",
        "termSignal", "termFemaleBirths", "termMaleBirths", "termRetained", "termSold",
        "fertilitySlider", "mortalitySlider", "priceGrowthSlider", "purchaseSlider",
        "femaleBirthRatioSlider",
        "fertilityValue", "mortalityValue", "priceGrowthValue", "purchaseValue",
        "femaleBirthRatioValue",
        "thesisText", "liveSignalText",
        "engineHorizon", "engineCapital", "engineCagr", "engineBillionYear",
        "droneMonthlyRev", "droneAnnualRev", "dronePotentialRev"
    ];
    ids.forEach(id => { elements[id] = document.getElementById(id); });
}

function initTopbar() {
    const topbar = document.getElementById("topbar");
    window.addEventListener("scroll", () => {
        topbar.classList.toggle("scrolled", window.scrollY > 20);
    });
}

function initControls() {
    elements.fertilitySlider.value = defaultSettings.fertilityRate * 100;
    elements.mortalitySlider.value = defaultSettings.mortalityRate * 100;
    elements.priceGrowthSlider.value = defaultSettings.priceGrowthRate * 100;
    elements.purchaseSlider.value = defaultSettings.annualCalfAdditions;
    elements.femaleBirthRatioSlider.value = defaultSettings.femaleBirthRatio * 100;

    elements.fertilitySlider.addEventListener("input", (e) => {
        state.settings.fertilityRate = Number(e.target.value) / 100;
        renderAll();
    });

    elements.mortalitySlider.addEventListener("input", (e) => {
        state.settings.mortalityRate = Number(e.target.value) / 100;
        renderAll();
    });

    elements.priceGrowthSlider.addEventListener("input", (e) => {
        state.settings.priceGrowthRate = Number(e.target.value) / 100;
        renderAll();
    });

    elements.purchaseSlider.addEventListener("input", (e) => {
        const val = Number(e.target.value);
        state.settings.annualCalfAdditions = val;
        for (let year = BASE_YEAR + ADDITION_START_OFFSET; year <= BASE_YEAR + HORIZON; year++) {
            const existing = state.adjustments[year] || { adultFemale: 0, adultMale: 0, calfFemale: 0, calfMale: 0 };
            state.adjustments[year] = { ...existing, calfFemale: val };
        }
        renderAll();
    });

    elements.femaleBirthRatioSlider.addEventListener("input", (e) => {
        state.settings.femaleBirthRatio = Number(e.target.value) / 100;
        renderAll();
    });

    elements.resetModelButton.addEventListener("click", () => {
        state.settings = { ...defaultSettings };
        state.salesPlan = {};
        state.priceOverrides = {};
        resetAdjustments();
        elements.fertilitySlider.value = defaultSettings.fertilityRate * 100;
        elements.mortalitySlider.value = defaultSettings.mortalityRate * 100;
        elements.priceGrowthSlider.value = defaultSettings.priceGrowthRate * 100;
        elements.purchaseSlider.value = defaultSettings.annualCalfAdditions;
        elements.femaleBirthRatioSlider.value = defaultSettings.femaleBirthRatio * 100;
        appendChatMessage("system", "Model reset to baseline Bornebit configuration.");
        renderAll();
    });
}

function initPromptChips() {
    document.querySelectorAll(".prompt-chip").forEach(btn => {
        btn.addEventListener("click", () => {
            elements.chatInput.value = btn.textContent.trim();
            elements.chatInput.focus();
        });
    });
}

function initChat() {
    elements.chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const prompt = elements.chatInput.value.trim();
        if (!prompt) return;

        appendChatMessage("user", prompt);
        elements.chatInput.value = "";
        elements.chatSubmitButton.disabled = true;
        elements.chatSubmitButton.textContent = "Thinking...";

        const action = applyPromptToState(prompt);
        renderAll();

        const response = await requestAiAnalysis(prompt, action);
        appendChatMessage("assistant", response);
        elements.chatSubmitButton.disabled = false;
        elements.chatSubmitButton.textContent = "Send";
    });
}

function seedChat() {
    appendChatMessage(
        "assistant",
        "Bornebit AI is live. I can model herd scenarios, adjust risk parameters, estimate sell windows, and calculate the path to ₦1B. Try adjusting the sliders above or ask me anything."
    );
}

function appendChatMessage(role, content) {
    state.chatHistory.push({ role, content });
    const msg = document.createElement("div");
    msg.className = `chat-message ${role}`;
    msg.textContent = content;
    elements.chatLog.appendChild(msg);
    elements.chatLog.scrollTop = elements.chatLog.scrollHeight;
}

async function checkAiHealth() {
    try {
        const res = await fetch("/api/health");
        const data = await res.json();
        state.aiConfigured = Boolean(data.aiConfigured);
        elements.aiStatusPill.innerHTML = `<span class="status-dot"></span>${state.aiConfigured ? `AI: ${data.model}` : "System: Simulation"}`;
        elements.chatModeBadge.textContent = state.aiConfigured ? "OpenAI live" : "Simulation mode";
    } catch {
        state.aiConfigured = false;
        elements.aiStatusPill.innerHTML = `<span class="status-dot"></span>System: Offline`;
        elements.chatModeBadge.textContent = "Simulation mode";
    }
}

function startLivePulse() {
    setInterval(() => {
        const drift = (Math.random() - 0.5) * 0.014;
        state.livePulseTrend = clamp(state.livePulseTrend + drift, -0.04, 0.04);
        state.livePulse = 1 + state.livePulseTrend;
        // Only update terminal signal text, don't re-render everything (fixes flickering)
        if (elements.termSignal) {
            elements.termSignal.textContent =
                `Mortality ${formatPercent(state.settings.mortalityRate * 100)} · Pulse ${state.livePulseTrend >= 0 ? "+" : ""}${formatPercent(Math.abs(state.livePulseTrend * 100))}`;
        }
    }, 6000);
}

/* ===== RENDER ===== */
function renderAll(rebuildTable = true) {
    const projection = buildProjection();
    state.latestProjection = projection;
    updateControlLabels();
    updateMetricCards(projection);
    updateHero(projection);
    updateWorkspace(projection);
    updateCharts(projection);
    if (rebuildTable) renderProjectionTable(projection);
}

/* ===========================================================
   PROJECTION ENGINE — Fixed: opening→events→closing flow
   =========================================================== */
function buildProjection() {
    const rows = [];

    // Age arrays track the fractional count of animals at each age (0…MAX_AGE)
    const femaleAges = new Array(MAX_AGE + 1).fill(0);
    const maleAges   = new Array(MAX_AGE + 1).fill(0);

    // Start: 8 female calves + 2 male calves, all age 0
    femaleAges[0] = 8;
    maleAges[0]   = 2;

    let cumulativeInvestment = 10 * state.settings.calfPrice;
    let cumulativeRevenue = 0;
    let cumulativeMalesSold = 0;

    for (let offset = 0; offset <= HORIZON; offset++) {
        const year = BASE_YEAR + offset;

        // ── 1. OPENING ── snapshot the arrays BEFORE anything happens this year
        const openingHerd = Math.round(sumArray(femaleAges) + sumArray(maleAges));

        // Year 0 (2026): acquisition year — no events
        let femaleBirths = 0;
        let maleBirths   = 0;
        let additionsCount = 0;
        let losses = 0;
        let soldTotal = 0;
        let breedingFemales = 0;

        if (offset > 0) {
            // ── 2. ADDITIONS ── new calves introduced this year (integers)
            const adj = getAdjustment(year);
            const addCalfFemale = Math.round(adj.calfFemale);
            const addCalfMale = Math.round(adj.calfMale);
            const addAdultFemale = Math.round(adj.adultFemale);
            const addAdultMale = Math.round(adj.adultMale);

            femaleAges[0]          += addCalfFemale;
            maleAges[0]            += addCalfMale;
            femaleAges[MATURE_AGE] += addAdultFemale;
            maleAges[MATURE_AGE]   += addAdultMale;
            additionsCount = addCalfFemale + addCalfMale + addAdultFemale + addAdultMale;

            cumulativeInvestment += (addCalfFemale + addCalfMale) * state.settings.calfPrice;
            cumulativeInvestment += (addAdultFemale + addAdultMale) * currentMaturePrice(offset);

            // ── 3. BIRTHS ── only from females age ≥ MATURE_AGE (integers)
            breedingFemales = Math.round(sumArray(femaleAges.slice(MATURE_AGE)));
            const totalBirths = Math.round(breedingFemales * state.settings.fertilityRate);
            femaleBirths = Math.round(totalBirths * state.settings.femaleBirthRatio);
            maleBirths   = totalBirths - femaleBirths;
            femaleAges[0] += femaleBirths;
            maleAges[0]   += maleBirths;

            // ── 4. MORTALITY ── applied to the total herd as integers, removing from oldest first
            const totalFemales = sumArray(femaleAges);
            const totalMales = sumArray(maleAges);
            const femaleDeaths = Math.round(totalFemales * state.settings.mortalityRate);
            const maleDeaths = Math.round(totalMales * state.settings.mortalityRate);
            
            losses = femaleDeaths + maleDeaths;
            removeFromAges(femaleAges, femaleDeaths);
            removeFromAges(maleAges, maleDeaths);

            // ── 5. SELL SURPLUS MALES ── keep 2 breeding bulls, sell the rest (integers)
            const matureMales = Math.round(sumArray(maleAges.slice(MATURE_AGE)));
            const surplusToSell = Math.max(0, matureMales - 2);
            if (surplusToSell > 0) {
                const sold = removeFromAges(maleAges, surplusToSell);
                soldTotal += sold;
                cumulativeMalesSold += sold;
                cumulativeRevenue += sold * getYearPrice(offset) * 0.94 * 1.05;
            }

            // Additional manual sales from the chat / table
            const plan = state.salesPlan[year] || { male: 0, female: 0 };
            if (plan.male > 0) {
                const sold = removeFromAges(maleAges, Math.round(plan.male));
                soldTotal += sold;
                cumulativeMalesSold += sold;
                cumulativeRevenue += sold * getYearPrice(offset) * 0.94 * 1.05;
            }
            if (plan.female > 0) {
                const sold = removeFromAges(femaleAges, Math.round(plan.female));
                soldTotal += sold;
                cumulativeRevenue += sold * getYearPrice(offset) * 0.94;
            }
        }

        // ── 6. CLOSING ── snapshot the arrays AFTER all events
        const closingFemale = Math.round(sumArray(femaleAges));
        const closingMale   = Math.round(sumArray(maleAges));
        const closingHerd   = closingFemale + closingMale;

        // ── 7. VALUATION
        const pricePerCow = getYearPrice(offset);
        const femaleValue  = valueAges(femaleAges, pricePerCow, false);
        const maleValue    = valueAges(maleAges, pricePerCow, true);
        const totalValue   = femaleValue + maleValue;
        const roi = cumulativeInvestment === 0 ? 0
            : ((totalValue + cumulativeRevenue - cumulativeInvestment) / cumulativeInvestment) * 100;

        rows.push({
            year, offset,
            openingHerd,
            femaleBirths, maleBirths,
            additionsCount, losses, soldTotal,
            closingHerd,
            pricePerCow, totalValue,
            femaleValue, maleValue,
            femaleHead: closingFemale,
            maleHead: closingMale,
            breedingFemales,
            cumulativeInvestment, cumulativeRevenue, roi,
            cumulativeMalesSold
        });

        // ── 8. AGE FORWARD ── shift all animals 1 year older for the next cycle
        //    (does not change total count; just redistributes across age buckets)
        ageForward(femaleAges);
        ageForward(maleAges);
    }

    const current   = rows[0];
    const finalYear = rows[rows.length - 1];
    const cagr = current.totalValue > 0
        ? (Math.pow(finalYear.totalValue / current.totalValue, 1 / HORIZON) - 1) * 100
        : 0;

    const oneBillionYear = rows.find(r => r.totalValue >= 1_000_000_000)?.year || null;

    return { rows, current, finalYear, cagr, oneBillionYear };
}

function getAdjustment(year) {
    return {
        adultFemale: 0, adultMale: 0,
        calfFemale: 0, calfMale: 0,
        ...(state.adjustments[year] || {})
    };
}

function currentMaturePrice(offset) {
    return state.settings.matureCowPrice * Math.pow(1 + state.settings.priceGrowthRate, offset);
}

function getYearPrice(offset) {
    if (state.priceOverrides[BASE_YEAR + offset]) {
        return state.priceOverrides[BASE_YEAR + offset];
    }
    // Removed livePulse factor — it caused constant metric flickering
    return currentMaturePrice(offset);
}

function ageForward(ages) {
    for (let i = ages.length - 1; i > 0; i--) {
        ages[i] = ages[i - 1];
    }
    ages[0] = 0;
}

function valueAges(ages, maturePrice, isMale) {
    return ages.reduce((total, count, age) => {
        const maturityWeight = age === 0
            ? state.settings.calfPrice / Math.max(maturePrice, 1)
            : age === 1 ? 0.45
            : age === 2 ? 0.72
            : 1;
        const sexPremium = isMale ? 1.07 : 1;
        return total + count * maturePrice * maturityWeight * sexPremium;
    }, 0);
}

/* ===== UPDATE UI ===== */
function updateControlLabels() {
    elements.fertilityValue.textContent = formatPercent(state.settings.fertilityRate * 100);
    elements.mortalityValue.textContent = formatPercent(state.settings.mortalityRate * 100);
    elements.priceGrowthValue.textContent = formatPercent(state.settings.priceGrowthRate * 100);
    elements.purchaseValue.textContent = `${state.settings.annualCalfAdditions} calves`;
    elements.femaleBirthRatioValue.textContent = formatPercent(state.settings.femaleBirthRatio * 100);

    // Drone revenues
    if (elements.droneMonthlyRev) elements.droneMonthlyRev.textContent = formatCurrencyShort(DRONE_OPS.monthlyRevenue);
    if (elements.droneAnnualRev) elements.droneAnnualRev.textContent = formatCurrencyShort(DRONE_OPS.annualRevenue);
    if (elements.dronePotentialRev) elements.dronePotentialRev.textContent = formatCurrencyShort(DRONE_OPS.fullCapacityAnnual);
}

function updateMetricCards(projection) {
    const current = projection.current;
    const final = projection.finalYear;
    animateMetric("currentHerd", current.closingHerd, "int");
    animateMetric("assetValue", current.totalValue, "currency");
    animateMetric("femaleBirths", current.femaleBirths, "int");
    animateMetric("maleBirths", current.maleBirths, "int");
    animateMetric("retainedBulls", Math.min(2, current.maleHead), "int");
    animateMetric("projection10", final.totalValue, "currency");
    animateMetric("roi", final.roi, "percent");
    animateMetric("malesSold", final.cumulativeMalesSold, "int");

    setText("metricCurrentHerdNote", `${formatNumber(current.femaleHead)} female · ${formatNumber(current.maleHead)} male`);
    setText("metricAssetValueNote", `Capital: ${formatCurrencyShort(current.cumulativeInvestment)}`);
    setText("metricFemaleBirthsNote", `${formatNumber(current.breedingFemales)} breeders`);
    setText("metricMaleBirthsNote", "Sale pipeline");
    setText("metricRetainedBullsNote", "High-genetic core");
    setText("metricProjectionNote", `${final.year} horizon`);
    setText("metricRoiNote", `By ${final.year}`);
    setText("metricMalesSoldNote", "Cumulative sold");
}

function updateHero(projection) {
    const current = projection.current;
    const final = projection.finalYear;
    elements.heroHerd.textContent = formatNumber(current.closingHerd);
    elements.heroValue.textContent = formatCurrencyShort(current.totalValue);
    elements.heroProjection.textContent = formatCurrencyShort(final.totalValue);
    if (elements.heroProjectionText) {
        elements.heroProjectionText.textContent = formatCurrencyShort(final.totalValue) + "+";
    }

    // Terminal
    if (elements.termSignal) {
        elements.termSignal.textContent =
            `Mortality ${formatPercent(state.settings.mortalityRate * 100)} · Pulse ${state.livePulseTrend >= 0 ? "+" : ""}${formatPercent(Math.abs(state.livePulseTrend * 100))}`;
    }
    if (elements.termFemaleBirths) elements.termFemaleBirths.textContent = formatNumber(current.femaleBirths);
    if (elements.termMaleBirths) elements.termMaleBirths.textContent = formatNumber(current.maleBirths);
    if (elements.termRetained) elements.termRetained.textContent = formatNumber(Math.min(2, current.maleHead));
    if (elements.termSold) elements.termSold.textContent = formatNumber(final.cumulativeMalesSold);
}

function updateWorkspace(projection) {
    const current = projection.current;
    const final = projection.finalYear;
    const recommendation = state.settings.mortalityRate > 0.10
        ? "High mortality is eroding retained value. Prioritize veterinary care and security."
        : state.settings.mortalityRate > 0.06
        ? "Mortality is manageable. Focus on female retention and selective bull exits."
        : "Herd health is strong. Lean into breeding expansion.";

    elements.thesisText.textContent =
        `Bornebit compounds from ${formatNumber(current.closingHerd)} head to ${formatCurrencyShort(final.totalValue)} over ${HORIZON} years by retaining breeding females, maintaining a 2-bull core, and monetizing surplus males.`;
    elements.liveSignalText.textContent = recommendation;
    elements.engineHorizon.textContent = `${BASE_YEAR}–${BASE_YEAR + HORIZON}`;
    elements.engineCapital.textContent = formatCurrencyShort(current.cumulativeInvestment);
    elements.engineCagr.textContent = formatPercent(projection.cagr);
    elements.engineBillionYear.textContent = projection.oneBillionYear || "Beyond";
}

/* ===== CHARTS ===== */
function initCharts() {
    Chart.defaults.color = "rgba(232, 232, 236, 0.5)";
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.borderColor = "rgba(255,255,255,0.04)";
}

function updateCharts(projection) {
    const labels = projection.rows.map(r => String(r.year));
    const herdData = projection.rows.map(r => rd(r.closingHerd, 0));
    const femaleData = projection.rows.map(r => rd(r.femaleHead, 0));
    const valueData = projection.rows.map(r => rd(r.totalValue / 1e6, 2));
    const priceData = projection.rows.map(r => rd(r.pricePerCow / 1e6, 2));
    const cashFlowData = projection.rows.map(r => rd((r.cumulativeRevenue - r.cumulativeInvestment) / 1e6, 2));

    syncChart("herdGrowthChart", {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "Total Herd",
                    data: herdData,
                    borderColor: "#00e87b",
                    backgroundColor: "rgba(0,232,123,0.08)",
                    fill: true, tension: 0.4, borderWidth: 2,
                    pointBackgroundColor: "#00e87b",
                    pointRadius: 3, pointHoverRadius: 6
                },
                {
                    label: "Females",
                    data: femaleData,
                    borderColor: "#a78bfa",
                    backgroundColor: "rgba(167,139,250,0.06)",
                    fill: false, tension: 0.4, borderWidth: 2,
                    borderDash: [6, 4],
                    pointRadius: 2
                }
            ]
        },
        options: chartOptions("Animals")
    });

    syncChart("assetValueChart", {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "₦M",
                data: valueData,
                backgroundColor: (ctx) => {
                    const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
                    g.addColorStop(0, "rgba(0,232,123,0.7)");
                    g.addColorStop(1, "rgba(56,189,248,0.3)");
                    return g;
                },
                borderRadius: 6, borderSkipped: false
            }]
        },
        options: chartOptions("₦M")
    });

    syncChart("priceCurveChart", {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "₦M",
                data: priceData,
                borderColor: "#38bdf8",
                backgroundColor: "rgba(56,189,248,0.08)",
                fill: true, tension: 0.4, borderWidth: 2,
                pointRadius: 3, pointHoverRadius: 6
            }]
        },
        options: chartOptions("₦M")
    });

    syncChart("riskScenarioChart", {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "Downside (–20%)",
                    data: projection.rows.map(r => rd(r.totalValue * 0.80 / 1e6, 2)),
                    borderColor: "#f87171", tension: 0.3, borderWidth: 2,
                    borderDash: [4, 4], pointRadius: 2
                },
                {
                    label: "Base Case",
                    data: valueData,
                    borderColor: "#fbbf24", tension: 0.3, borderWidth: 2,
                    pointRadius: 3
                },
                {
                    label: "Upside (+20%)",
                    data: projection.rows.map(r => rd(r.totalValue * 1.20 / 1e6, 2)),
                    borderColor: "#00e87b", tension: 0.3, borderWidth: 2,
                    borderDash: [4, 4], pointRadius: 2
                }
            ]
        },
        options: chartOptions("₦M")
    });

    syncChart("genderContributionChart", {
        type: "bar",
        data: {
            labels,
            datasets: [
                {
                    label: "Female (₦M)",
                    data: projection.rows.map(r => rd(r.femaleValue / 1e6, 2)),
                    backgroundColor: "rgba(0,232,123,0.6)",
                    stack: "v", borderRadius: 4
                },
                {
                    label: "Bull (₦M)",
                    data: projection.rows.map(r => rd(r.maleValue / 1e6, 2)),
                    backgroundColor: "rgba(251,191,36,0.5)",
                    stack: "v", borderRadius: 4
                }
            ]
        },
        options: chartOptions("₦M", true)
    });

    syncChart("cashFlowChart", {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Net (₦M)",
                data: cashFlowData,
                borderColor: "#ff6b35",
                backgroundColor: "rgba(255,107,53,0.08)",
                fill: true, tension: 0.4, borderWidth: 2,
                pointRadius: 3, pointHoverRadius: 6
            }]
        },
        options: chartOptions("₦M")
    });
}

function chartOptions(axisLabel, stacked = false) {
    return {
        responsive: true,
        maintainAspectRatio: true,
        interaction: { mode: "index", intersect: false },
        plugins: {
            legend: {
                display: true,
                labels: { boxWidth: 10, boxHeight: 10, padding: 16 }
            },
            tooltip: {
                backgroundColor: "rgba(14, 14, 18, 0.95)",
                borderColor: "rgba(255,255,255,0.1)",
                borderWidth: 1, padding: 14,
                titleFont: { weight: 700, size: 13 },
                bodyFont: { size: 12 },
                cornerRadius: 10,
                callbacks: {
                    afterBody: function(context) {
                        if (!state.latestProjection) return '';
                        const yearLabel = context[0].label;
                        const row = state.latestProjection.rows.find(r => String(r.year) === yearLabel);
                        if (!row) return '';
                        const lines = [''];
                        if (row.offset === 0) {
                            lines.push('\u{1F404} Purchased 8 female + 2 male calves');
                            lines.push(`Herd: ${Math.round(row.closingHerd)} head \u00B7 Value: ${formatCurrencyShort(row.totalValue)}`);
                        } else {
                            if (Math.round(row.breedingFemales) > 0) {
                                lines.push(`\u{1F404} ${Math.round(row.breedingFemales)} breeding females in herd`);
                            }
                            if (Math.round(row.femaleBirths) > 0 || Math.round(row.maleBirths) > 0) {
                                lines.push(`\u{1F423} Born: ${Math.round(row.femaleBirths)} female + ${Math.round(row.maleBirths)} male calves`);
                            } else if (row.offset <= 1) {
                                lines.push('\u23F3 No births yet \u2014 cattle still maturing');
                            }
                            if (Math.round(row.additionsCount) > 0) {
                                lines.push(`\u2795 ${Math.round(row.additionsCount)} calves added by owner`);
                            }
                            if (Math.round(row.losses) > 0) {
                                lines.push(`\u26A0\uFE0F Losses (disease/theft): ${Math.round(row.losses)}`);
                            }
                            if (Math.round(row.soldTotal) > 0) {
                                lines.push(`\u{1F4B0} Surplus males sold: ${Math.round(row.soldTotal)}`);
                            }
                            lines.push(`Herd: ${Math.round(row.closingHerd)} (${Math.round(row.femaleHead)}F + ${Math.round(row.maleHead)}M) \u00B7 ${formatCurrencyShort(row.totalValue)}`);
                        }
                        return lines;
                    }
                }
            }
        },
        scales: {
            x: { stacked, grid: { display: false }, ticks: { font: { size: 11 } } },
            y: {
                stacked, beginAtZero: true,
                title: { display: true, text: axisLabel, font: { size: 11 } },
                grid: { color: "rgba(255,255,255,0.03)" },
                ticks: { font: { size: 11 } }
            }
        }
    };
}

function syncChart(id, config) {
    const ctx = document.getElementById(id);
    if (!ctx) return;
    const existing = state.chartInstances[id];
    if (existing) {
        existing.data = config.data;
        existing.options = config.options;
        existing.update();
        return;
    }
    state.chartInstances[id] = new Chart(ctx, config);
}

/* ===== PROJECTION TABLE =====
   Display uses back-calculated losses so the numbers ALWAYS balance:
   closing = opening + births + additions - losses - sold
*/
function renderProjectionTable(projection) {
    const fragment = document.createDocumentFragment();

    projection.rows.forEach(row => {
        const displayOpening   = Math.round(row.openingHerd);
        const displayFBirths   = Math.round(row.femaleBirths);
        const displayMBirths   = Math.round(row.maleBirths);
        const displayBirths    = displayFBirths + displayMBirths;
        const displayAdditions = Math.round(row.additionsCount);
        const displaySold      = Math.round(row.soldTotal);
        const displayClosing   = Math.round(row.closingHerd);

        // Back-calculate displayed losses so the row balances perfectly
        const displayLosses = Math.max(0, displayOpening + displayBirths + displayAdditions - displaySold - displayClosing);

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${row.year}</strong></td>
            <td>${displayOpening}</td>
            <td class="positive">${displayFBirths}</td>
            <td class="positive">${displayMBirths}</td>
            <td></td>
            <td class="negative">${displayLosses > 0 ? displayLosses : "—"}</td>
            <td>${displaySold > 0 ? displaySold : "—"}</td>
            <td><strong>${displayClosing}</strong></td>
            <td></td>
            <td><strong>${formatCurrencyShort(row.totalValue)}</strong></td>
        `;

        // Additions input
        const addCell = tr.children[4];
        const addInput = document.createElement("input");
        addInput.type = "number"; addInput.className = "table-input";
        addInput.min = "0"; addInput.step = "1";
        addInput.value = rd(getAdjustment(row.year).calfFemale, 0);
        addInput.addEventListener("change", e => {
            const v = Number(e.target.value) || 0;
            const adj = getAdjustment(row.year);
            state.adjustments[row.year] = { ...adj, calfFemale: v };
            renderAll();
        });
        addCell.appendChild(addInput);

        // Price input
        const priceCell = tr.children[8];
        const priceInput = document.createElement("input");
        priceInput.type = "number"; priceInput.className = "table-input";
        priceInput.min = "0"; priceInput.step = "50000";
        priceInput.value = rd(state.priceOverrides[row.year] || row.pricePerCow, 0);
        priceInput.addEventListener("change", e => {
            const v = Number(e.target.value) || row.pricePerCow;
            state.priceOverrides[row.year] = v;
            renderAll();
        });
        priceCell.appendChild(priceInput);

        fragment.appendChild(tr);
    });

    elements.projectionTableBody.replaceChildren(fragment);
}

/* ===== ANIMATED METRICS (flickering fix) ===== */
function animateMetric(key, nextValue, formatter) {
    const el = document.querySelector(`[data-metric="${key}"]`);
    if (!el) return;
    const prev = Number(el.dataset.rawValue || 0);

    // FIX: Skip animation if value hasn't changed (prevents flickering)
    const threshold = formatter === "currency" ? 100 : formatter === "percent" ? 0.1 : 0.5;
    if (Math.abs(prev - nextValue) < threshold) {
        el.dataset.rawValue = String(nextValue);
        return;
    }

    // Cancel any ongoing animation for this element
    if (el._animFrameId) cancelAnimationFrame(el._animFrameId);

    const start = performance.now();
    const duration = 500;

    const render = v => {
        if (formatter === "currency") el.textContent = formatCurrencyShort(v);
        else if (formatter === "percent") el.textContent = `${rd(v, 0)}%`;
        else el.textContent = formatNumber(v);
    };

    const frame = ts => {
        const p = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        render(prev + (nextValue - prev) * eased);
        if (p < 1) {
            el._animFrameId = requestAnimationFrame(frame);
        } else {
            el.dataset.rawValue = String(nextValue);
            el._animFrameId = null;
        }
    };
    el._animFrameId = requestAnimationFrame(frame);
}

/* ===== CHAT AI ===== */
function applyPromptToState(prompt) {
    const lower = prompt.toLowerCase();
    const action = { type: "analysis", summary: "No state change." };

    const addMatch = lower.match(/add\s+(\d+)\s+(female|male)?\s*(calves|cows|bulls)?(?:\s+in\s+(\d{4}))?/);
    if (addMatch) {
        const qty = Number(addMatch[1]);
        const sex = addMatch[2] || "female";
        const animal = addMatch[3] || "calves";
        const year = Number(addMatch[4] || BASE_YEAR + 1);
        const adj = getAdjustment(year);
        if (animal.includes("calf")) {
            if (sex === "male") adj.calfMale += qty;
            else adj.calfFemale += qty;
        } else if (animal.includes("bull") || sex === "male") {
            adj.adultMale += qty;
        } else {
            adj.adultFemale += qty;
        }
        state.adjustments[year] = adj;
        action.type = "update";
        action.summary = `Added ${qty} ${sex} ${animal} in ${year}.`;
        return action;
    }

    const mortMatch = lower.match(/(?:set|use|reduce)\s+(?:mortality\s+)?(?:to\s+)?(\d+(?:\.\d+)?)%/);
    if (mortMatch && (lower.includes("mort") || lower.includes("risk") || lower.includes("loss"))) {
        state.settings.mortalityRate = Number(mortMatch[1]) / 100;
        elements.mortalitySlider.value = state.settings.mortalityRate * 100;
        action.type = "update";
        action.summary = `Mortality set to ${mortMatch[1]}%.`;
        return action;
    }

    const sellMatch = lower.match(/sell\s+(\d+)\s+bulls?(?:\s+(?:in|next year)\s*(\d{4})?)?/);
    if (sellMatch) {
        const qty = Number(sellMatch[1]);
        const year = Number(sellMatch[2] || BASE_YEAR + 1);
        state.salesPlan[year] = { ...(state.salesPlan[year] || { male: 0, female: 0 }), male: qty };
        action.type = "update";
        action.summary = `Modeled sale of ${qty} bulls in ${year}.`;
        return action;
    }

    if (lower.includes("1 billion") || lower.includes("1b") || lower.includes("how do i reach")) {
        action.type = "strategy";
        action.summary = "Requested path-to-₦1B strategy.";
    }

    return action;
}

async function requestAiAnalysis(prompt, action) {
    const snapshot = createSnapshot();
    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, action, snapshot, history: state.chatHistory.slice(-8) })
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        return data.text;
    } catch {
        return buildLocalFallback(prompt, action, snapshot);
    }
}

function createSnapshot() {
    const p = state.latestProjection;
    return {
        metrics: {
            currentHerd: rd(p.current.closingHerd, 0),
            currentValue: rd(p.current.totalValue, 0),
            valueFinal: rd(p.finalYear.totalValue, 0),
            roiFinal: rd(p.finalYear.roi, 1),
            cagr: rd(p.cagr, 2),
            billionYear: p.oneBillionYear
        },
        settings: {
            fertilityRate: rd(state.settings.fertilityRate * 100, 1),
            mortalityRate: rd(state.settings.mortalityRate * 100, 1),
            priceGrowthRate: rd(state.settings.priceGrowthRate * 100, 1),
            annualCalfAdditions: state.settings.annualCalfAdditions
        },
        droneOps: DRONE_OPS,
        yearRows: p.rows.map(r => ({
            year: r.year, closingHerd: rd(r.closingHerd, 0),
            totalValue: rd(r.totalValue, 0), pricePerCow: rd(r.pricePerCow, 0),
            roi: rd(r.roi, 1)
        }))
    };
}

function buildLocalFallback(prompt, action, snapshot) {
    const p = state.latestProjection;
    const lower = prompt.toLowerCase();

    if (action.type === "update") {
        return `${action.summary} Current herd: ${formatNumber(p.current.closingHerd)} head · ${p.finalYear.year} projection: ${formatCurrencyShort(p.finalYear.totalValue)} · ROI: ${formatPercent(p.finalYear.roi)}`;
    }

    const yearMatch = lower.match(/(\d{4})/);
    if (lower.includes("show") && lower.includes("value") && yearMatch) {
        const row = p.rows.find(r => r.year === Number(yearMatch[1]));
        if (!row) return `Year ${yearMatch[1]} is outside the ${BASE_YEAR}–${BASE_YEAR + HORIZON} horizon.`;
        return `${row.year}: ${formatCurrencyShort(row.totalValue)} with ${formatNumber(row.closingHerd)} head · ROI: ${formatPercent(row.roi)}`;
    }

    if (lower.includes("1 billion") || lower.includes("1b")) {
        if (p.oneBillionYear) {
            return `The model reaches ₦1B by ${p.oneBillionYear}. Keep mortality below 6%, add more females before ${BASE_YEAR + 6}, and sell bulls at premium windows.`;
        }
        return `₦1B is beyond the current ${HORIZON}-year horizon. To close the gap: increase calf additions above 3/yr, push fertility above 75%, and keep mortality under 6%.`;
    }

    if (lower.includes("drone") || lower.includes("pilot")) {
        return `Bornebit manages ${DRONE_OPS.totalPilots} DJI licensed pilots. ${DRONE_OPS.deployedTotal} deployed (${DRONE_OPS.militaryActive} military, ${DRONE_OPS.oilGasActive} oil & gas). ${DRONE_OPS.available} available. Revenue: ${formatCurrencyShort(DRONE_OPS.annualRevenue)}/yr at ₦20K/pilot. Full capacity: ${formatCurrencyShort(DRONE_OPS.fullCapacityAnnual)}/yr.`;
    }

    return `Live model: ${formatNumber(p.current.closingHerd)} head · ${formatCurrencyShort(p.current.totalValue)} current · ${formatCurrencyShort(p.finalYear.totalValue)} by ${p.finalYear.year}. Key lever: ${state.settings.mortalityRate > 0.08 ? "cutting mortality" : "scaling retained females"}.`;
}

/* ===== SHADER ===== */
function initShader() {
    const canvas = document.getElementById("shaderCanvas");
    const ctx = canvas.getContext("2d");

    const resize = () => {
        canvas.width = canvas.clientWidth * window.devicePixelRatio;
        canvas.height = canvas.clientHeight * window.devicePixelRatio;
        ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const blobs = [
        { x: 0.15, y: 0.2, r: 220, color: "rgba(0, 232, 123, 0.12)", dx: 0.0004, dy: 0.0006 },
        { x: 0.75, y: 0.18, r: 260, color: "rgba(56, 189, 248, 0.08)", dx: -0.0003, dy: 0.0004 },
        { x: 0.5, y: 0.7, r: 200, color: "rgba(167, 139, 250, 0.07)", dx: -0.0004, dy: -0.0005 },
        { x: 0.85, y: 0.6, r: 180, color: "rgba(255, 107, 53, 0.06)", dx: 0.0003, dy: -0.0003 },
        { x: 0.3, y: 0.85, r: 160, color: "rgba(251, 191, 36, 0.05)", dx: -0.0002, dy: 0.0003 }
    ];

    const frame = () => {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        ctx.clearRect(0, 0, w, h);

        const bg = ctx.createLinearGradient(0, 0, w, h);
        bg.addColorStop(0, "#030305");
        bg.addColorStop(0.5, "#050608");
        bg.addColorStop(1, "#040406");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);

        blobs.forEach(b => {
            b.x += b.dx; b.y += b.dy;
            if (b.x < 0.05 || b.x > 0.95) b.dx *= -1;
            if (b.y < 0.05 || b.y > 0.95) b.dy *= -1;
            const grad = ctx.createRadialGradient(w * b.x, h * b.y, 0, w * b.x, h * b.y, b.r);
            grad.addColorStop(0, b.color);
            grad.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
        });

        // Subtle grid
        ctx.strokeStyle = "rgba(255,255,255,0.015)";
        ctx.lineWidth = 0.5;
        for (let i = 0; i < w; i += 60) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
        for (let i = 0; i < h; i += 60) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

        requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
}

/* ===== HELPERS ===== */
function sumArray(arr) { return arr.reduce((s, v) => s + v, 0); }

function removeFromAges(ages, qty) {
    let remaining = qty, removed = 0;
    for (let i = ages.length - 1; i >= 0; i--) {
        if (remaining <= 0) break;
        const take = Math.min(ages[i], remaining);
        ages[i] -= take;
        remaining -= take;
        removed += take;
    }
    return removed;
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function formatCurrencyShort(v) {
    if (v >= 1e9) return `₦${rd(v / 1e9, 2)}B`;
    if (v >= 1e6) return `₦${rd(v / 1e6, 2)}M`;
    if (v >= 1e3) return `₦${rd(v / 1e3, 0)}K`;
    return `₦${rd(v, 0)}`;
}

function formatNumber(v) {
    return Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(rd(v, 0));
}

function formatPercent(v) { return `${rd(v, 1)}%`; }
function rd(v, d) { const f = 10 ** d; return Math.round(v * f) / f; }
function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

/* ===== SLIDE PANELS ===== */
function initPanels() {
    const overlay = document.getElementById('panelOverlay');

    // Open panel buttons (nav + hero + mobile menu)
    document.querySelectorAll('[data-panel]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const panelId = btn.getAttribute('data-panel');
            openPanel(panelId);
            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu) mobileMenu.classList.remove('open');
            const openIcon = document.getElementById('menuIconOpen');
            const closeIcon = document.getElementById('menuIconClose');
            if (openIcon) openIcon.style.display = '';
            if (closeIcon) closeIcon.style.display = 'none';
        });
    });

    // Close buttons inside panels
    document.querySelectorAll('[data-close-panel]').forEach(btn => {
        btn.addEventListener('click', closeAllPanels);
    });

    // Click overlay to close
    if (overlay) overlay.addEventListener('click', closeAllPanels);

    // Escape key closes panels
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllPanels();
    });
}

function openPanel(panelId) {
    closeAllPanels();
    const panel = document.getElementById(panelId);
    const overlay = document.getElementById('panelOverlay');
    if (panel) {
        panel.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    if (overlay) overlay.classList.add('active');

    // Initialize map if pilot panel
    if (panelId === 'pilot-panel' && !state.pilotMapInit) {
        setTimeout(initMap, 200);
    }
}

function closeAllPanels() {
    document.querySelectorAll('.slide-panel.open').forEach(p => p.classList.remove('open'));
    const overlay = document.getElementById('panelOverlay');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

/* ===== MOBILE MENU ===== */
function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('mobileMenu');
    const openIcon = document.getElementById('menuIconOpen');
    const closeIcon = document.getElementById('menuIconClose');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('open');
        if (openIcon) openIcon.style.display = isOpen ? 'none' : '';
        if (closeIcon) closeIcon.style.display = isOpen ? '' : 'none';
    });

    // Close menu when clicking a scroll link
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
            if (openIcon) openIcon.style.display = '';
            if (closeIcon) closeIcon.style.display = 'none';
        });
    });
}

/* ===== PILOT MANAGEMENT ===== */
function initPilots() {
    state.pilots = JSON.parse(localStorage.getItem('bornebit_pilots') || '[]');
    state.pilotMapInit = false;

    const form = document.getElementById('pilotForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('pilotName').value.trim();
        const location = document.getElementById('pilotLocation').value.trim();
        const cvInput = document.getElementById('pilotCV');
        const cvName = cvInput.files.length ? cvInput.files[0].name : null;

        if (!name || !location) return;

        const pilot = { id: Date.now(), name, location, cvName, lat: null, lng: null };

        // Geocode location via Nominatim
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location + ', Nigeria')}&limit=1`);
            const data = await res.json();
            if (data.length > 0) {
                pilot.lat = parseFloat(data[0].lat);
                pilot.lng = parseFloat(data[0].lon);
            }
        } catch { /* fallback: no coordinates */ }

        state.pilots.push(pilot);
        localStorage.setItem('bornebit_pilots', JSON.stringify(state.pilots));
        renderPilotList();
        addPilotMarker(pilot);
        form.reset();
    });

    renderPilotList();
}

function renderPilotList() {
    const container = document.getElementById('pilotList');
    if (!container) return;
    container.innerHTML = '';

    state.pilots.forEach(pilot => {
        const card = document.createElement('div');
        card.className = 'pilot-card';
        card.innerHTML = `
            <div class="pilot-avatar">${pilot.name.charAt(0).toUpperCase()}</div>
            <div class="pilot-info">
                <div class="pilot-name">${pilot.name}</div>
                <div class="pilot-loc">${pilot.location}${pilot.cvName ? ' · ' + pilot.cvName : ''}</div>
            </div>`;
        card.addEventListener('click', () => {
            if (pilot.lat && pilot.lng && state.pilotMap) {
                state.pilotMap.flyTo([pilot.lat, pilot.lng], 10);
            }
        });
        container.appendChild(card);
    });
}

function initMap() {
    if (state.pilotMapInit || typeof L === 'undefined') return;
    const mapEl = document.getElementById('pilotMap');
    if (!mapEl) return;

    state.pilotMap = L.map('pilotMap').setView([9.082, 8.6753], 6);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 18
    }).addTo(state.pilotMap);

    state.pilotMarkers = L.layerGroup().addTo(state.pilotMap);
    state.pilotMapInit = true;

    // Add existing pilots
    state.pilots.forEach(addPilotMarker);

    // Force resize after panel animation
    setTimeout(() => state.pilotMap.invalidateSize(), 400);
}

function addPilotMarker(pilot) {
    if (!pilot.lat || !pilot.lng || !state.pilotMap || !state.pilotMarkers) return;
    const marker = L.circleMarker([pilot.lat, pilot.lng], {
        radius: 7, fillColor: '#00e87b', color: '#00e87b',
        weight: 2, opacity: 0.9, fillOpacity: 0.6
    });
    marker.bindPopup(`<strong>${pilot.name}</strong><br>${pilot.location}${pilot.cvName ? '<br>CV: ' + pilot.cvName : ''}`);
    state.pilotMarkers.addLayer(marker);
}

/* ===== NIGERIA MARKET INTELLIGENCE ENGINE ===== */
const NIGERIA_NUGGETS = [
    { icon: "🇳🇬", text: 'Nigeria adds <strong>~5 million people every year</strong>. By 2050, it will be the world\'s 3rd most populous country at <strong>400M+</strong> — every one of them needs protein.', source: "UN World Population Prospects, 2024" },
    { icon: "🥩", text: '<strong>65% of livestock consumed</strong> in Nigeria is imported. That\'s a <strong>$2B+ annual market</strong> waiting for domestic producers to capture.', source: "Federal Ministry of Livestock Development, 2026" },
    { icon: "📊", text: 'Nigeria\'s red meat market is valued at <strong>$4.87 billion</strong> and growing at <strong>~5% CAGR</strong>. The runway is massive and mostly untapped.', source: "Expert Market Research, 2024" },
    { icon: "🐄", text: 'Nigerian cattle produce only <strong>1–2 litres of milk/day</strong> vs. <strong>15–20 litres</strong> for improved breeds. That\'s a <strong>10x productivity upside</strong> waiting to be unlocked.', source: "FAO/USDA Agricultural Reports" },
    { icon: "🥛", text: 'Nigeria imports <strong>60–65% of its dairy</strong>, spending <strong>$1.5 billion/year</strong> in forex. Only <strong>8.7L/person/year</strong> consumed vs. WHO\'s recommended <strong>210L</strong>.', source: "NBS Nigeria / FAO" },
    { icon: "💰", text: 'The untapped red meat export market is worth <strong>₦3.2 trillion/year</strong> according to Nigeria\'s own Ministry of Livestock Development.', source: "FMLD Policy Brief, 2026" },
    { icon: "🍖", text: 'The average Nigerian eats only <strong>15kg of meat/year</strong>. The global average is <strong>64kg</strong>. As incomes rise, demand will <strong>explode</strong>.', source: "FAOSTAT" },
    { icon: "📈", text: 'Beef prices have <strong>doubled</strong> in some Nigerian markets between 2025–2026, now at <strong>₦7,200–₦8,200/kg</strong>. Producers are earning more than ever.', source: "NBS Consumer Price Index" },
    { icon: "🌍", text: '<strong>60%+ of Nigeria\'s 242M people are under 30</strong>. Median age: <strong>18.3 years</strong>. This is the world\'s fastest-growing consumer engine.', source: "UN Population Data, 2024" },
    { icon: "🏗️", text: 'Government has earmarked <strong>5+ million hectares</strong> for livestock, plus <strong>tax holidays</strong> and <strong>low-interest loans</strong> for producers.', source: "National Livestock Growth Acceleration Strategy" },
    { icon: "🔬", text: 'Nigeria\'s livestock subsector output hit <strong>₦1.57 trillion in Q1 2026</strong> alone. The government targets growing this from <strong>$32B to $74B</strong> within a decade.', source: "NBS GDP Report Q1 2026" },
    { icon: "🛡️", text: 'Nigeria\'s food import bill reached <strong>₦7.65 trillion in 2025</strong>. Every naira spent on imports is a naira that should stay in the domestic food chain.', source: "NBS Trade Data, 2025" },
    { icon: "⚡", text: 'Food inflation in Nigeria sits at <strong>17.8% YoY</strong> (May 2026). Producers who scale NOW ride the pricing wave while building long-term supply infrastructure.', source: "NBS CPI Report, May 2026" },
    { icon: "🎯", text: 'Agriculture contributes <strong>18.11% of Nigeria\'s GDP</strong> but livestock is only <strong>5%</strong>. The gap between potential and output is your opportunity.', source: "NBS GDP Report Q1 2026" },
    { icon: "🌱", text: 'A healthy diet in Nigeria now costs <strong>₦1,589/adult/day</strong> — up 4.74% YoY. Affordable protein production isn\'t just business, it\'s <strong>nation-building</strong>.', source: "Cost of Diet Analysis, April 2026" }
];

let nuggetIndex = 0;
let nuggetInterval = null;

function initNigeriaIntel() {
    const slideEl = document.getElementById("nuggetSlide");
    const dotsEl = document.getElementById("nuggetDots");
    const prevBtn = document.getElementById("nuggetPrev");
    const nextBtn = document.getElementById("nuggetNext");
    if (!slideEl || !dotsEl) return;

    // Build dots
    NIGERIA_NUGGETS.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.className = `nugget-dot${i === 0 ? " active" : ""}`;
        dot.type = "button";
        dot.addEventListener("click", () => showNugget(i));
        dotsEl.appendChild(dot);
    });

    // Show first nugget
    showNugget(0);

    // Auto-rotate every 8 seconds
    nuggetInterval = setInterval(() => {
        showNugget((nuggetIndex + 1) % NIGERIA_NUGGETS.length);
    }, 8000);

    // Nav buttons
    if (prevBtn) prevBtn.addEventListener("click", () => {
        showNugget((nuggetIndex - 1 + NIGERIA_NUGGETS.length) % NIGERIA_NUGGETS.length);
        resetNuggetInterval();
    });
    if (nextBtn) nextBtn.addEventListener("click", () => {
        showNugget((nuggetIndex + 1) % NIGERIA_NUGGETS.length);
        resetNuggetInterval();
    });

    // Build population vs demand chart
    buildPopulationDemandChart();
}

function showNugget(index) {
    nuggetIndex = index;
    const nugget = NIGERIA_NUGGETS[index];
    const iconEl = document.getElementById("nuggetIcon");
    const textEl = document.getElementById("nuggetText");
    const sourceEl = document.getElementById("nuggetSource");
    const slideEl = document.getElementById("nuggetSlide");

    // Animate transition
    if (slideEl) {
        slideEl.style.animation = "none";
        slideEl.offsetHeight; // trigger reflow
        slideEl.style.animation = "nuggetFadeIn 0.6s ease both";
    }

    if (iconEl) iconEl.textContent = nugget.icon;
    if (textEl) textEl.innerHTML = nugget.text;
    if (sourceEl) sourceEl.textContent = nugget.source;

    // Update dots
    document.querySelectorAll(".nugget-dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
    });
}

function resetNuggetInterval() {
    if (nuggetInterval) clearInterval(nuggetInterval);
    nuggetInterval = setInterval(() => {
        showNugget((nuggetIndex + 1) % NIGERIA_NUGGETS.length);
    }, 8000);
}

function buildPopulationDemandChart() {
    const ctx = document.getElementById("populationDemandChart");
    if (!ctx) return;

    const years = ["2024", "2026", "2028", "2030", "2032", "2034", "2036"];
    // Population in millions (UN WPP projections)
    const population = [223, 242, 255, 262, 275, 287, 295];
    // Beef demand in thousand metric tons (population × per capita demand growth)
    // Currently ~360K MT produced, demand grows with population + income rise
    const beefDemand = [520, 580, 660, 750, 860, 990, 1140];
    // Domestic production (slowly growing but lagging)
    const beefProduction = [350, 360, 375, 390, 410, 435, 460];

    new Chart(ctx, {
        type: "line",
        data: {
            labels: years,
            datasets: [
                {
                    label: "Population (M)",
                    data: population,
                    borderColor: "#00e87b",
                    backgroundColor: "rgba(0, 232, 123, 0.08)",
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2.5,
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    pointBackgroundColor: "#00e87b",
                    yAxisID: "y"
                },
                {
                    label: "Beef Demand ('000 MT)",
                    data: beefDemand,
                    borderColor: "#fbbf24",
                    backgroundColor: "rgba(251, 191, 36, 0.06)",
                    fill: false,
                    tension: 0.4,
                    borderWidth: 2.5,
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    pointBackgroundColor: "#fbbf24",
                    yAxisID: "y1"
                },
                {
                    label: "Domestic Production ('000 MT)",
                    data: beefProduction,
                    borderColor: "#f87171",
                    backgroundColor: "rgba(248, 113, 113, 0.06)",
                    fill: false,
                    tension: 0.4,
                    borderWidth: 2,
                    borderDash: [6, 4],
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    pointBackgroundColor: "#f87171",
                    yAxisID: "y1"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: { mode: "index", intersect: false },
            plugins: {
                legend: {
                    display: true,
                    labels: { boxWidth: 10, boxHeight: 10, padding: 16 }
                },
                tooltip: {
                    backgroundColor: "rgba(14, 14, 18, 0.95)",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderWidth: 1, padding: 14,
                    titleFont: { weight: 700, size: 13 },
                    bodyFont: { size: 12 },
                    cornerRadius: 10,
                    callbacks: {
                        afterBody: function(context) {
                            const idx = context[0].dataIndex;
                            const gap = beefDemand[idx] - beefProduction[idx];
                            const gapPct = Math.round((gap / beefDemand[idx]) * 100);
                            return [`\n⚠️ Supply Gap: ${gap}K MT (${gapPct}% unmet)`, `🎯 This gap is YOUR opportunity`];
                        }
                    }
                }
            },
            scales: {
                x: { grid: { display: false }, ticks: { font: { size: 11 } } },
                y: {
                    type: "linear",
                    display: true,
                    position: "left",
                    title: { display: true, text: "Population (Millions)", font: { size: 11 } },
                    grid: { color: "rgba(255,255,255,0.03)" },
                    ticks: { font: { size: 11 } }
                },
                y1: {
                    type: "linear",
                    display: true,
                    position: "right",
                    title: { display: true, text: "Beef ('000 MT)", font: { size: 11 } },
                    grid: { drawOnChartArea: false },
                    ticks: { font: { size: 11 } }
                }
            }
        }
    });
}

function initThesisButtons() {
    document.querySelectorAll(".thesis-ask-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const panelId = btn.getAttribute("data-panel");
            const prefill = btn.getAttribute("data-prefill");
            if (panelId) openPanel(panelId);
            if (prefill && elements.chatInput) {
                elements.chatInput.value = prefill;
                elements.chatInput.focus();
            }
        });
    });
}
