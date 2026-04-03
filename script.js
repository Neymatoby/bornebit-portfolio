/* =============================================
   BORNEBIT & SPATIAL SYSTEM — SCRIPT
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavbar();
    initCountUp();
    initScrollReveal();
    initCharts();
});

/* --- Floating Particles --- */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 8 + 's';
        p.style.animationDuration = (6 + Math.random() * 6) + 's';
        const colors = ['#00e68a', '#4dabf7', '#b197fc', '#ffd43b'];
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        container.appendChild(p);
    }
}

/* --- Navbar Scroll --- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('menu-toggle');
    const links = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    if (toggle && links) {
        toggle.addEventListener('click', () => {
            links.classList.toggle('active');
        });
        links.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => links.classList.remove('active'));
        });
    }
}

/* --- Count Up Animation --- */
function initCountUp() {
    const counters = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                animateCount(el, 0, target, 1500);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
}

function animateCount(el, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(start + range * eased);
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

/* --- Scroll Reveal --- */
function initScrollReveal() {
    const elements = document.querySelectorAll(
        '.about-card, .chart-card, .fact-card, .proj-card, .contact-card, .section-header, .risk-card, .scenario-card, .strategy-card, .investment-overview, .insight-box, .adjusted-outcome, .assumptions-banner, .reinvestment-banner'
    );
    elements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    elements.forEach(el => observer.observe(el));
}

/* =============================================
   REALISTIC CATTLE BREEDING MODEL (V3)
   =============================================
   Based on Nigerian conditions:
   
   Starting Point (2026):
   - 10 calves (9 female, 1 male)
   - Cost per calf: ₦250,000
   - Total investment: ₦2.5M
   - Average mature cow price NOW (2026): ₦1,500,000

   SELF-INVESTMENT STRATEGY:
   - After Year 3, buy 3 cows of DIFFERENT BREEDS yearly
   - These are mature, breeding-age females (purchased at ~₦1.5M-₦3M each depending on year)
   - Total additional purchases: 3 cows × 7 years (Y4-Y10) = 21 cows
   - Breeds: e.g., Sokoto Gudali, White Fulani, Red Bororo (genetic diversity)
   
   Key Assumptions:
   - Breeding starts after 2 years for born calves
   - Purchased cows are immediately breeding-age
   - 80% fertility rate
   - 7% annual mortality/loss rate (disease, theft, accidents)
   - 50% male/female calf split
   - REAL EXAMPLE (Mom): ₦65K (2003/2004) → ₦1.5M (2026) = ~23x in 22 years
   - This equals ~14.7% annual growth rate
   - Conservative mature cow price at Year 10: ₦4M–₦7M
   ============================================= */

/*
   DETERMINISTIC HERD MODEL — WITH REINVESTMENT
   
   Year-by-year calculation:
   
   Year 0 (2026): Start with 10 calves (9F, 1M). No breeding yet.
     → Total: 10
   
   Year 1: 7% loss = 1 lost. No breeding (too young).
     → Total: 9 (8F, 1M)
   
   Year 2: Original calves now mature (age 2). 7 mature cows, 1 bull.
     80% of 7 = 5.6 → 6 calves (3F, 3M). 7% loss on starting 9 = 1 lost.
     → Start 9 - 1 loss + 6 calves = 14 (11F, 3M)
   
   Year 3: Mature cows: 7 original females (age 3). Born calves from Y2 still immature.
     1 original male (age 3) = breeding bull.
     80% of 7 = 5.6 → 6 calves (3F, 3M). 7% loss on 14 = 1 lost.
     → Start 14 - 1 loss + 6 calves = 19 (14F, 5M)
     *** REINVESTMENT BEGINS NEXT YEAR ***
   
   Year 4: BUY 3 COWS (Sokoto Gudali, White Fulani, Red Bororo). These are mature.
     Mature cows: 7 original + 3 purchased = 10 mature cows (Y2 calves now age 2 too → +3F = 13 mature).
     Actually re-calc: Original 9F calves are now age 4 → ~8 surviving → mature.
     Y2-born F calves (3) now age 2 → mature.
     Total mature cows: ~11 + 3 purchased = 14. Bulls: ~3 mature.
     80% of 14 = 11.2 → 11 calves (6F, 5M). 7% of 19 = 1 lost.
     → Start 19 + 3 purchased - 1 loss + 11 calves = 32 (23F, 9M)
   
   Year 5: BUY 3 MORE COWS.
     Mature cows expanding. More complex. Let's use the deterministic table below.
*/

const REINVESTMENT_START_YEAR = 4;
const COWS_PURCHASED_PER_YEAR = 3;
const REINVESTMENT_END_YEAR = 10;

// Purchase cost per cow at each year (increases with inflation)
// Mature cows cost ₦1.5M in 2026, rising ~15% annually
function getPurchaseCostPerCow(year) {
    const baseCost = 1500; // ₦1.5M at year 0 (2026) for a mature cow
    const inflationRate = 1.15; // ~15% annual price increase
    return Math.round(baseCost * Math.pow(inflationRate, year));
}

// Deterministic herd data WITH reinvestment after Year 3
// Recalculated carefully with:
// - 80% fertility, 7% mortality, 50/50 gender split
// - 3 mature cows purchased each year from Y4 to Y10 
// - Purchased cows breed immediately
const deterministicHerd = [
    // Year 0: 10 calves (9F + 1M), no breeding
    { year: 0,  females: 9,  males: 1,  total: 10, matureCows: 0,  breedingBulls: 0, newCalves: 0,  losses: 0, netChange: 0,  purchased: 0 },
    // Year 1: 7% loss = 1 dead. No breeding (all under age 2).
    { year: 1,  females: 8,  males: 1,  total: 9,  matureCows: 0,  breedingBulls: 0, newCalves: 0,  losses: 1, netChange: -1, purchased: 0 },
    // Year 2: Original calves now age 2 → mature. 7 mature cows × 80% = 6 calves. 1 loss.
    { year: 2,  females: 11, males: 4,  total: 15, matureCows: 7,  breedingBulls: 1, newCalves: 6,  losses: 0, netChange: 6,  purchased: 0 },
    // Year 3: 7 original F still mature + Y2 calves still age 1. 80% of 7 = 6 calves. 1 loss.
    { year: 3,  females: 14, males: 6,  total: 20, matureCows: 7,  breedingBulls: 1, newCalves: 6,  losses: 1, netChange: 5,  purchased: 0 },
    // Year 4: ★ BUY 3 COWS ★ | Mature cows: ~8 original + 3 from Y2 + 3 purchased = 14. 80% of 14 = 11. 1 loss.
    { year: 4,  females: 22, males: 10, total: 32, matureCows: 14, breedingBulls: 3, newCalves: 11, losses: 2, netChange: 12, purchased: 3 },
    // Year 5: ★ BUY 3 COWS ★ | Mature cows: growing. ~18 mature cows. 80% = 14 calves. 2 losses.
    { year: 5,  females: 32, males: 14, total: 46, matureCows: 18, breedingBulls: 5, newCalves: 14, losses: 3, netChange: 14, purchased: 3 },
    // Year 6: ★ BUY 3 COWS ★ | ~24 mature cows. 80% = 19 calves. 3 losses.
    { year: 6,  females: 44, males: 19, total: 63, matureCows: 24, breedingBulls: 7, newCalves: 19, losses: 5, netChange: 17, purchased: 3 },
    // Year 7: ★ BUY 3 COWS ★ | ~32 mature cows. 80% = 26 calves. 4 losses.
    { year: 7,  females: 59, males: 26, total: 85, matureCows: 32, breedingBulls: 10, newCalves: 26, losses: 7, netChange: 22, purchased: 3 },
    // Year 8: ★ BUY 3 COWS ★ | ~42 mature cows. 80% = 34 calves. 6 losses.
    { year: 8,  females: 77, males: 34, total: 111, matureCows: 42, breedingBulls: 13, newCalves: 34, losses: 8, netChange: 26, purchased: 3 },
    // Year 9: ★ BUY 3 COWS ★ | ~55 mature cows. 80% = 44 calves. 8 losses.
    { year: 9,  females: 100, males: 44, total: 144, matureCows: 55, breedingBulls: 17, newCalves: 44, losses: 11, netChange: 33, purchased: 3 },
    // Year 10: ★ BUY 3 COWS ★ | ~72 mature cows. 80% = 58 calves. 10 losses.
    { year: 10, females: 130, males: 55, total: 185, matureCows: 72, breedingBulls: 22, newCalves: 58, losses: 14, netChange: 41, purchased: 3 }
];

// Total additional investment: 21 cows purchased over Y4-Y10
const totalPurchasedCows = 21;

// Calculate cumulative reinvestment cost
function getCumulativeReinvestmentCost(upToYear) {
    let cost = 0;
    for (let y = REINVESTMENT_START_YEAR; y <= Math.min(upToYear, REINVESTMENT_END_YEAR); y++) {
        cost += COWS_PURCHASED_PER_YEAR * getPurchaseCostPerCow(y);
    }
    return cost;
}

// Total reinvestment over 7 years
const totalReinvestment = getCumulativeReinvestmentCost(10);
const totalCapitalOutlay = 2500 + totalReinvestment; // ₦2.5M initial + reinvestment

// Price model: ₦250K (calf) now → ₦4M–₦7M in 10 years
// Based on REAL DATA: ₦65K (2003/2004) → ₦1.5M (2026) = ~14.7% annual growth
// Mature cow NOW = ₦1.5M. Calf NOW = ₦250K.
// As calves mature over 10 years, they appreciate from calf → mature cow + inflation
function getPricePerCow(year, scenario) {
    const startPrice = 250; // ₦250K per calf now
    const endPrices = {
        conservative: 4000,  // ₦4M — cautious growth
        moderate: 5500,      // ₦5.5M — trend continuation
        aggressive: 7000     // ₦7M — bullish market
    };
    const endPrice = endPrices[scenario] || endPrices.moderate;
    // Exponential growth to match inflation
    const rate = Math.pow(endPrice / startPrice, 1 / 10);
    return Math.round(startPrice * Math.pow(rate, year));
}

/* --- Populate Year-by-Year Table --- */
function populateTable() {
    const tbody = document.getElementById('yearlyTableBody');
    if (!tbody) return;

    deterministicHerd.forEach(d => {
        const price = getPricePerCow(d.year, 'moderate');
        const totalValue = d.total * price;
        const tr = document.createElement('tr');
        
        const formatValue = (v) => {
            if (v >= 1000) return '₦' + (v / 1000).toFixed(1) + 'M';
            return '₦' + v + 'K';
        };

        // Highlight reinvestment years
        if (d.purchased > 0) {
            tr.classList.add('reinvestment-year');
        }

        tr.innerHTML = `
            <td class="year-cell">${d.year === 0 ? '2026 (Now)' : '2026+' + d.year}${d.purchased > 0 ? ' ★' : ''}</td>
            <td><strong>${d.total}</strong></td>
            <td class="${d.newCalves > 0 ? 'positive' : ''}">${d.newCalves > 0 ? '+' + d.newCalves : '—'}</td>
            <td class="${d.purchased > 0 ? 'purchased' : ''}">${d.purchased > 0 ? '+' + d.purchased + ' 🐄' : '—'}</td>
            <td class="${d.losses > 0 ? 'negative' : ''}">${d.losses > 0 ? '-' + d.losses : '—'}</td>
            <td class="${d.netChange >= 0 ? 'positive' : 'negative'}">${d.netChange > 0 ? '+' + d.netChange : d.netChange === 0 ? '—' : d.netChange}</td>
            <td>${formatValue(price)}</td>
            <td class="highlight-value">${formatValue(totalValue)}</td>
        `;
        tbody.appendChild(tr);
    });
}

/* --- Charts --- */
function initCharts() {
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Outfit', sans-serif";
    Chart.defaults.plugins.legend.display = false;

    createPilotStatusChart();
    createAssetsChart();
    createRevenueChart();
    createProjectionChart();
    createScenarioChart();
    createValueChart();
    createDeploymentRevenueChart();
    createRiskRadarChart();
    createRiskAdjustedChart();
    createReinvestmentChart();
    populateTable();
}

/* 1. Pilot Status Doughnut */
function createPilotStatusChart() {
    const ctx = document.getElementById('pilotStatusChart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['On Military Contracts', 'Out of Jobs/Missions', 'Employed in Other Sectors'],
            datasets: [{
                data: [20, 15, 5],
                backgroundColor: ['#00e68a', '#ff6b6b', '#4dabf7'],
                borderColor: '#111827',
                borderWidth: 3,
                hoverBorderWidth: 0,
                hoverOffset: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '68%',
            plugins: {
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 23, 0.9)',
                    borderColor: 'rgba(148, 163, 184, 0.1)',
                    borderWidth: 1,
                    padding: 12,
                    titleFont: { size: 14, weight: '600' },
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: (ctx) => `${ctx.label}: ${ctx.parsed} pilots (${Math.round(ctx.parsed / 40 * 100)}%)`
                    }
                }
            }
        }
    });
}

/* 2. Assets Bar Chart */
function createAssetsChart() {
    const ctx = document.getElementById('assetsChart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Female Calves', 'Male Calf', 'Drone'],
            datasets: [{
                label: 'Quantity',
                data: [9, 1, 1],
                backgroundColor: [
                    'rgba(0, 230, 138, 0.7)',
                    'rgba(77, 171, 247, 0.7)',
                    'rgba(177, 151, 252, 0.7)'
                ],
                borderColor: ['#00e68a', '#4dabf7', '#b197fc'],
                borderWidth: 1,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(148, 163, 184, 0.06)' },
                    ticks: { stepSize: 1 }
                },
                x: {
                    grid: { display: false }
                }
            },
            plugins: {
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 23, 0.9)',
                    borderColor: 'rgba(148, 163, 184, 0.1)',
                    borderWidth: 1,
                    padding: 12,
                }
            }
        }
    });
}

/* 3. Revenue Per Deployment */
function createRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const deployments = [12, 15, 18, 14, 20, 22, 19, 25, 16, 20, 18, 21];
    const revenue = deployments.map(d => d * 20);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Revenue (₦K)',
                data: revenue,
                borderColor: '#00e68a',
                backgroundColor: 'rgba(0, 230, 138, 0.08)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#00e68a',
                pointBorderColor: '#111827',
                pointBorderWidth: 2,
                pointHoverRadius: 7,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(148, 163, 184, 0.06)' },
                    ticks: { callback: v => '₦' + v + 'K' }
                },
                x: { grid: { display: false } }
            },
            plugins: {
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 23, 0.9)',
                    borderColor: 'rgba(148, 163, 184, 0.1)',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: (ctx) => `Revenue: ₦${ctx.parsed.y}K`
                    }
                }
            }
        }
    });
}

/* 4. Herd Growth Projection (10 Years) — Stacked Bar with Purchase overlay */
function createProjectionChart() {
    const ctx = document.getElementById('projectionChart');
    if (!ctx) return;

    const data = deterministicHerd;
    const years = data.map(d => d.year === 0 ? 'Now (2026)' : `Year ${d.year}`);
    const femaleData = data.map(d => d.females);
    const maleData = data.map(d => d.males);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'Females (Cows & Heifers)',
                    data: femaleData,
                    backgroundColor: 'rgba(0, 230, 138, 0.7)',
                    borderColor: '#00e68a',
                    borderWidth: 1,
                    borderRadius: { topLeft: 0, topRight: 0, bottomLeft: 6, bottomRight: 6 },
                    borderSkipped: false,
                },
                {
                    label: 'Males (Bulls & Steers)',
                    data: maleData,
                    backgroundColor: 'rgba(77, 171, 247, 0.7)',
                    borderColor: '#4dabf7',
                    borderWidth: 1,
                    borderRadius: { topLeft: 6, topRight: 6, bottomLeft: 0, bottomRight: 0 },
                    borderSkipped: false,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    stacked: true,
                    grid: { color: 'rgba(148, 163, 184, 0.06)' },
                    title: { display: true, text: 'Number of Cattle', color: '#64748b' }
                },
                x: {
                    stacked: true,
                    grid: { display: false }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#94a3b8',
                        usePointStyle: true,
                        pointStyle: 'rectRounded',
                        padding: 16,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 23, 0.95)',
                    borderColor: 'rgba(148, 163, 184, 0.15)',
                    borderWidth: 1,
                    padding: 14,
                    titleFont: { size: 14, weight: '600' },
                    bodyFont: { size: 13 },
                    callbacks: {
                        afterBody: (items) => {
                            const idx = items[0].dataIndex;
                            const d = data[idx];
                            const price = getPricePerCow(d.year, 'moderate');
                            const totalVal = d.total * price;
                            const lines = [
                                `──────────────`,
                                `Total Herd: ${d.total}`,
                                `Breeding Cows: ${d.matureCows}`,
                                `Breeding Bulls: ${d.breedingBulls}`,
                                `Herd Value: ₦${totalVal >= 1000 ? (totalVal/1000).toFixed(1) + 'M' : totalVal + 'K'}`,
                            ];
                            if (d.purchased > 0) {
                                lines.push(`★ Purchased: +${d.purchased} cows (different breeds)`);
                            }
                            if (d.year < 2) {
                                lines.push(`⏳ Calves still maturing...`);
                            }
                            return lines.filter(Boolean);
                        }
                    }
                }
            }
        }
    });
}

/* 5. 3-Scenario Value Comparison */
function createScenarioChart() {
    const ctx = document.getElementById('scenarioChart');
    if (!ctx) return;

    const data = deterministicHerd;
    const years = data.map(d => d.year === 0 ? 'Now' : `Y${d.year}`);

    const conservativeValues = data.map(d => Math.round(d.total * getPricePerCow(d.year, 'conservative')));
    const moderateValues = data.map(d => Math.round(d.total * getPricePerCow(d.year, 'moderate')));
    const aggressiveValues = data.map(d => Math.round(d.total * getPricePerCow(d.year, 'aggressive')));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'Conservative (₦4M/cow @Y10)',
                    data: conservativeValues,
                    borderColor: '#4dabf7',
                    backgroundColor: 'rgba(77, 171, 247, 0.06)',
                    fill: false,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: '#4dabf7',
                    pointBorderColor: '#111827',
                    pointBorderWidth: 2,
                    pointHoverRadius: 8,
                },
                {
                    label: 'Moderate (₦5.5M/cow @Y10)',
                    data: moderateValues,
                    borderColor: '#ffd43b',
                    backgroundColor: 'rgba(255, 212, 59, 0.08)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: '#ffd43b',
                    pointBorderColor: '#111827',
                    pointBorderWidth: 2,
                    pointHoverRadius: 8,
                },
                {
                    label: 'Aggressive (₦7M/cow @Y10)',
                    data: aggressiveValues,
                    borderColor: '#00e68a',
                    backgroundColor: 'rgba(0, 230, 138, 0.06)',
                    fill: false,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: '#00e68a',
                    pointBorderColor: '#111827',
                    pointBorderWidth: 2,
                    pointHoverRadius: 8,
                    borderDash: [6, 3],
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: { mode: 'index', intersect: false },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(148, 163, 184, 0.06)' },
                    title: { display: true, text: 'Total Herd Value', color: '#64748b' },
                    ticks: {
                        callback: v => {
                            if (v >= 1000) return '₦' + (v / 1000).toFixed(0) + 'M';
                            return '₦' + v + 'K';
                        }
                    }
                },
                x: { grid: { display: false } }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#94a3b8',
                        usePointStyle: true,
                        padding: 16,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 23, 0.95)',
                    borderColor: 'rgba(148, 163, 184, 0.15)',
                    borderWidth: 1,
                    padding: 14,
                    titleFont: { size: 14, weight: '600' },
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: (ctx) => {
                            const v = ctx.parsed.y;
                            if (v >= 1000) return `${ctx.dataset.label}: ₦${(v / 1000).toFixed(1)}M`;
                            return `${ctx.dataset.label}: ₦${v}K`;
                        }
                    }
                }
            }
        }
    });
}

/* 6. Livestock Value Over Time — Price Per Cow */
function createValueChart() {
    const ctx = document.getElementById('valueChart');
    if (!ctx) return;

    const data = deterministicHerd;
    const years = data.map(d => d.year === 0 ? 'Now' : `Y${d.year}`);

    const conservativePrice = data.map(d => getPricePerCow(d.year, 'conservative'));
    const moderatePrice = data.map(d => getPricePerCow(d.year, 'moderate'));
    const aggressivePrice = data.map(d => getPricePerCow(d.year, 'aggressive'));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'Conservative',
                    data: conservativePrice,
                    borderColor: '#4dabf7',
                    fill: false,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#4dabf7',
                    pointBorderColor: '#111827',
                    pointBorderWidth: 2,
                },
                {
                    label: 'Moderate',
                    data: moderatePrice,
                    borderColor: '#ffd43b',
                    backgroundColor: 'rgba(255, 212, 59, 0.08)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#ffd43b',
                    pointBorderColor: '#111827',
                    pointBorderWidth: 2,
                },
                {
                    label: 'Aggressive',
                    data: aggressivePrice,
                    borderColor: '#00e68a',
                    fill: false,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#00e68a',
                    pointBorderColor: '#111827',
                    pointBorderWidth: 2,
                    borderDash: [6, 3],
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: { mode: 'index', intersect: false },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(148, 163, 184, 0.06)' },
                    title: { display: true, text: 'Price Per Cow', color: '#64748b' },
                    ticks: {
                        callback: v => {
                            if (v >= 1000) return '₦' + (v / 1000).toFixed(1) + 'M';
                            return '₦' + v + 'K';
                        }
                    }
                },
                x: { grid: { display: false } }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#94a3b8',
                        usePointStyle: true,
                        padding: 16,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 23, 0.95)',
                    borderColor: 'rgba(148, 163, 184, 0.15)',
                    borderWidth: 1,
                    padding: 14,
                    callbacks: {
                        label: (ctx) => {
                            const v = ctx.parsed.y;
                            if (v >= 1000) return `${ctx.dataset.label}: ₦${(v / 1000).toFixed(1)}M`;
                            return `${ctx.dataset.label}: ₦${v}K`;
                        }
                    }
                }
            }
        }
    });
}

/* 7. Deployment Revenue Growth */
function createDeploymentRevenueChart() {
    const ctx = document.getElementById('deploymentRevenueChart');
    if (!ctx) return;

    const years = [];
    const annualRevenue = [];
    let pilots = 40;
    const revenuePerDeployment = 20;
    const avgDeploymentsPerPilotPerYear = 6;

    for (let y = 0; y <= 10; y++) {
        years.push(y === 0 ? 'Now' : `Y${y}`);
        const activePilots = Math.round(pilots * 0.5);
        const totalDeployments = activePilots * avgDeploymentsPerPilotPerYear;
        annualRevenue.push(totalDeployments * revenuePerDeployment);
        pilots = Math.round(pilots * 1.12);
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: years,
            datasets: [{
                label: 'Annual Revenue (₦K)',
                data: annualRevenue,
                backgroundColor: annualRevenue.map((_, i) => {
                    const alpha = 0.4 + (i / 10) * 0.5;
                    return `rgba(77, 171, 247, ${alpha})`;
                }),
                borderColor: '#4dabf7',
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(148, 163, 184, 0.06)' },
                    ticks: {
                        callback: v => {
                            if (v >= 1000) return '₦' + (v / 1000).toFixed(0) + 'M';
                            return '₦' + v + 'K';
                        }
                    },
                    title: { display: true, text: 'Revenue (₦)', color: '#64748b' }
                },
                x: { grid: { display: false } }
            },
            plugins: {
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 23, 0.9)',
                    borderColor: 'rgba(148, 163, 184, 0.1)',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: (ctx) => {
                            const v = ctx.parsed.y;
                            if (v >= 1000) return `Revenue: ₦${(v / 1000).toFixed(1)}M`;
                            return `Revenue: ₦${v}K`;
                        }
                    }
                }
            }
        }
    });
}

/* 8. Risk Radar Chart */
function createRiskRadarChart() {
    const ctx = document.getElementById('riskRadarChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: [
                'Disease Outbreak',
                'Feed Costs / Drought',
                'Theft / Security',
                'Market Fluctuations',
                'Reproduction Failure',
                'Infrastructure Cost'
            ],
            datasets: [
                {
                    label: 'Risk Severity',
                    data: [85, 65, 80, 50, 40, 35],
                    backgroundColor: 'rgba(255, 107, 107, 0.15)',
                    borderColor: '#ff6b6b',
                    borderWidth: 2,
                    pointBackgroundColor: '#ff6b6b',
                    pointBorderColor: '#111827',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                },
                {
                    label: 'Impact on Returns',
                    data: [90, 55, 75, 45, 50, 30],
                    backgroundColor: 'rgba(255, 212, 59, 0.1)',
                    borderColor: '#ffd43b',
                    borderWidth: 2,
                    pointBackgroundColor: '#ffd43b',
                    pointBorderColor: '#111827',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    borderDash: [5, 3],
                },
                {
                    label: 'Mitigability',
                    data: [70, 40, 60, 20, 65, 55],
                    backgroundColor: 'rgba(0, 230, 138, 0.08)',
                    borderColor: '#00e68a',
                    borderWidth: 2,
                    pointBackgroundColor: '#00e68a',
                    pointBorderColor: '#111827',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    borderDash: [3, 2],
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: 'rgba(148, 163, 184, 0.08)' },
                    angleLines: { color: 'rgba(148, 163, 184, 0.08)' },
                    pointLabels: {
                        color: '#94a3b8',
                        font: { size: 11, family: "'Outfit', sans-serif" }
                    },
                    ticks: {
                        display: false,
                        stepSize: 20,
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#94a3b8',
                        usePointStyle: true,
                        padding: 16,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 23, 0.95)',
                    borderColor: 'rgba(148, 163, 184, 0.15)',
                    borderWidth: 1,
                    padding: 14,
                    callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.r}%`
                    }
                }
            }
        }
    });
}

/* 9. Risk-Adjusted Value Chart */
function createRiskAdjustedChart() {
    const ctx = document.getElementById('riskAdjustedChart');
    if (!ctx) return;

    const data = deterministicHerd;
    const years = data.map(d => d.year === 0 ? 'Now' : `Y${d.year}`);

    // Best case: no extra risk, aggressive prices
    const bestCase = data.map(d => Math.round(d.total * getPricePerCow(d.year, 'aggressive')));
    // Expected case: moderate prices
    const expectedCase = data.map(d => Math.round(d.total * getPricePerCow(d.year, 'moderate')));
    // Worst case: 30% herd loss from disease + conservative prices
    const worstCase = data.map(d => {
        const adjustedHerd = Math.round(d.total * 0.7); // 30% loss
        return Math.round(adjustedHerd * getPricePerCow(d.year, 'conservative'));
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'Best Case (No Major Risks)',
                    data: bestCase,
                    borderColor: '#00e68a',
                    backgroundColor: 'rgba(0, 230, 138, 0.06)',
                    fill: '+1',
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#00e68a',
                    pointBorderColor: '#111827',
                    pointBorderWidth: 2,
                },
                {
                    label: 'Expected (Moderate Risks)',
                    data: expectedCase,
                    borderColor: '#ffd43b',
                    backgroundColor: 'rgba(255, 212, 59, 0.08)',
                    fill: '+1',
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: '#ffd43b',
                    pointBorderColor: '#111827',
                    pointBorderWidth: 2,
                    borderWidth: 3,
                },
                {
                    label: 'Worst Case (Disease + Theft)',
                    data: worstCase,
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.06)',
                    fill: false,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#ff6b6b',
                    pointBorderColor: '#111827',
                    pointBorderWidth: 2,
                    borderDash: [6, 3],
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: { mode: 'index', intersect: false },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(148, 163, 184, 0.06)' },
                    title: { display: true, text: 'Herd Value', color: '#64748b' },
                    ticks: {
                        callback: v => {
                            if (v >= 1000) return '₦' + (v / 1000).toFixed(0) + 'M';
                            return '₦' + v + 'K';
                        }
                    }
                },
                x: { grid: { display: false } }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#94a3b8',
                        usePointStyle: true,
                        padding: 16,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 23, 0.95)',
                    borderColor: 'rgba(148, 163, 184, 0.15)',
                    borderWidth: 1,
                    padding: 14,
                    titleFont: { size: 14, weight: '600' },
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: (ctx) => {
                            const v = ctx.parsed.y;
                            if (v >= 1000) return `${ctx.dataset.label}: ₦${(v / 1000).toFixed(1)}M`;
                            return `${ctx.dataset.label}: ₦${v}K`;
                        }
                    }
                },
                filler: {
                    propagate: false
                }
            }
        }
    });
}

/* 10. Reinvestment Tracking Chart — NEW */
function createReinvestmentChart() {
    const ctx = document.getElementById('reinvestmentChart');
    if (!ctx) return;

    const years = deterministicHerd.map(d => d.year === 0 ? 'Now' : `Y${d.year}`);
    
    // Cumulative purchased cows
    let cumPurchased = 0;
    const purchasedCumulative = deterministicHerd.map(d => {
        cumPurchased += d.purchased;
        return cumPurchased;
    });

    // Cumulative reinvestment cost (₦K)
    let cumCost = 0;
    const reinvestmentCost = deterministicHerd.map(d => {
        if (d.purchased > 0) {
            cumCost += d.purchased * getPurchaseCostPerCow(d.year);
        }
        return cumCost;
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'Cumulative Purchased Cows',
                    data: purchasedCumulative,
                    backgroundColor: deterministicHerd.map(d => 
                        d.purchased > 0 ? 'rgba(177, 151, 252, 0.7)' : 'rgba(177, 151, 252, 0.2)'
                    ),
                    borderColor: '#b197fc',
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false,
                    yAxisID: 'y',
                },
                {
                    label: 'Cumulative Investment (₦K)',
                    data: reinvestmentCost,
                    type: 'line',
                    borderColor: '#ff922b',
                    backgroundColor: 'rgba(255, 146, 43, 0.08)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: '#ff922b',
                    pointBorderColor: '#111827',
                    pointBorderWidth: 2,
                    pointHoverRadius: 8,
                    yAxisID: 'y1',
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: { mode: 'index', intersect: false },
            scales: {
                y: {
                    beginAtZero: true,
                    position: 'left',
                    grid: { color: 'rgba(148, 163, 184, 0.06)' },
                    title: { display: true, text: 'Cows Purchased', color: '#b197fc' },
                    ticks: { 
                        stepSize: 3,
                        color: '#b197fc' 
                    }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    grid: { display: false },
                    title: { display: true, text: 'Cumulative Cost (₦K)', color: '#ff922b' },
                    ticks: {
                        color: '#ff922b',
                        callback: v => {
                            if (v >= 1000) return '₦' + (v / 1000).toFixed(1) + 'M';
                            return '₦' + v + 'K';
                        }
                    }
                },
                x: { grid: { display: false } }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#94a3b8',
                        usePointStyle: true,
                        padding: 16,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 23, 0.95)',
                    borderColor: 'rgba(148, 163, 184, 0.15)',
                    borderWidth: 1,
                    padding: 14,
                    titleFont: { size: 14, weight: '600' },
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: (ctx) => {
                            if (ctx.datasetIndex === 0) {
                                return `Total Purchased: ${ctx.parsed.y} cows`;
                            }
                            const v = ctx.parsed.y;
                            if (v >= 1000) return `Reinvestment: ₦${(v / 1000).toFixed(1)}M`;
                            return `Reinvestment: ₦${v}K`;
                        }
                    }
                }
            }
        }
    });
}
