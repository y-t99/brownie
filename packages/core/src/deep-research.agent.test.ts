/* eslint-disable turbo/no-undeclared-env-vars */
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { Tool } from "ai";
import { describe, expect, it } from "vitest";
import { createActor, waitFor } from "xstate";

import { answer, generateQueries, reflection, webResearch } from "./actor";
import { createResearchAgentMachine } from "./deep-research.agent";
import { ResearchMachineContext } from "./state";
import { serpSearchApiTool, ToolName } from "./tool";

describe("test query generation", () => {
  it.only("should generate queries - kimi2", async () => {
    const state = {
      messages: [{ role: "user", content: "I want to know about France." }],
      initialSearchQueryCount: 3,
    } as ResearchMachineContext;

  const provider = createOpenAICompatible({
    name: "openai-compatible",
    baseURL: process.env.OPENAI_BASE_URL!,
    apiKey: process.env.OPENAI_API_KEY!,
  });

  const languageModel = provider(process.env.OPENAI_DEFAULT_MODEL!);

    const queries = await generateQueries({
      messages: state.messages,
      numberQueries: state.initialSearchQueryCount,
      languageModel,
    });

    expect(queries).toBeDefined();
  });
});

describe("test web research", () => {
  it.only("should find France's rationale", async () => {
    const state = {
      queries: [
        {
          queries: [
            "France current economic indicators 2025",
            "France social issues June 2025",
            "France technological advancements mid-2025",
          ],
          rationale:
            "The initial topic is broad, covering France as a whole. To ensure comprehensive coverage, three distinct aspects are targeted: economic data for quantitative insights, social developments reflecting societal trends, and technological progress to capture innovation. Each query specifies '2025' or 'mid-2025' to prioritize the most current information available in June 2025, avoiding overlap by focusing on separate domains.",
        },
      ],
    } as ResearchMachineContext;

    const tools = {
      [ToolName.SearchTool]: serpSearchApiTool(process.env.SERP_API_KEY!),
    };

      const provider = createOpenAICompatible({
    name: "openai-compatible",
    baseURL: process.env.OPENAI_BASE_URL!,
    apiKey: process.env.OPENAI_API_KEY!,
  });

  const languageModel = provider(process.env.OPENAI_DEFAULT_MODEL!);

    const results = await webResearch({
      queries: state.queries[0],
      languageModel,
      tools,
    });

    expect(results).toBeDefined();
  });
});

describe("test reflection", () => {
  it.only("should reflect on the web research", async () => {
    const state = {
      messages: [{ role: "user", content: "I want to know about France." }],
      webResearchResults: [
        '\n### France Current Economic Indicators 2025  \n*Synthesized from verified sources as of June 19, 2025*  \n\n#### 1. **GDP Growth**  \n- **Q1 2025 Growth**: +0.2% quarter-on-quarter (q/q), driven by increased consumer spending and exports.  \n  *Source: INSEE (National Institute of Statistics and Economic Studies), "Quarterly National Accounts – Q1 2025," published May 30, 2025*  \n- **2025 Annual Forecast**: Revised to 0.8% (from 1.0% in late 2024) due to persistent industrial slowdown.  \n  *Source: Banque de France, "Economic Projections – June 2025 Update," June 12, 2025*  \n\n#### 2. **Inflation**  \n- **May 2025 Rate**: 2.1% year-on-year (y/y), down from 2.4% in April, reflecting easing energy and food prices.  \n  *Source: Eurostat, "Harmonised Index of Consumer Prices – May 2025," June 4, 2025*  \n- **Core Inflation (ex-food/energy)**: 2.3% y/y, indicating lingering service-sector price pressures.  \n  *Source: INSEE, "Consumer Price Index – May 2025," June 13, 2025*  \n\n#### 3. **Unemployment**  \n- **Q1 2025 Rate**: 7.2%, unchanged from Q4 2024, marking a 15-year low but signaling stagnation in job creation.  \n  *Source: INSEE, "Labour Market Report – Q1 2025," May 22, 2025*  \n- **Youth Unemployment (Under 25)**: 16.8%, slightly elevated due to reduced hiring in manufacturing.  \n  *Source: French Ministry of Labour, "Employment Dashboard – May 2025," June 6, 2025*  \n\n#### 4. **Public Finances**  \n- **Budget Deficit**: Projected at 4.2% of GDP for 2025, above the EU’s 3% target, driven by green transition investments.  \n  *Source: French Treasury, "Stability Programme Update 2025," April 16, 2025*  \n- **Public Debt**: Stabilizing at 110% of GDP, supported by stronger-than-expected tax revenues.  \n  *Source: European Commission, "France Country Report 2025," May 28, 2025*  \n\n#### 5. **Trade Balance**  \n- **April 2025 Deficit**: €5.1 billion, narrowing by 12% from March due to aerospace and pharmaceutical exports.  \n  *Source: Customs Directorate (DGDDI), "Monthly Trade Report – April 2025," June 10, 2025*  \n\n#### 6. **Business Climate**  \n- **May 2025 Business Confidence**: 99.0 (long-term avg: 100), reflecting cautious optimism in services but manufacturing pessimism.  \n  *Source: INSEE, "Business Climate Indicator – May 2025," May 27, 2025*  \n\n#### Key Risks Highlighted by Sources:  \n- **Industrial Weakness**: Auto and chemical sectors face competitive pressures from Asia.  \n  *Source: OECD, "France Economic Snapshot – June 2025," June 3, 2025*  \n- **Fiscal Pressures**: Pension and healthcare reforms could widen the deficit if growth underperforms.  \n  *Source: IMF, "Article IV Consultation – France," May 20, 2025*  \n\n---\n\n### Sources Verification  \nAll data is attributed to primary institutions (INSEE, Banque de France, Eurostat) and vetted international bodies (OECD, IMF, EU Commission). No speculative or unreferenced claims are included. For real-time validation:  \n- [INSEE Publications](https://www.insee.fr)  \n- [Banque de France Reports](https://www.banque-france.fr)  \n- [Eurostat Database](https://ec.europa.eu/eurostat)',
        '\n### Report: Key Social Issues in France - June 2025  \n*Compiled from verified sources as of June 19, 2025*  \n\n---\n\n#### 1. **Pension Reform Protests Escalate**  \n**Summary:** Nationwide strikes and demonstrations have intensified in response to the government\'s proposed increase of the retirement age to 64. Unions argue this disproportionately affects low-income workers.  \n- **Source:** *Le Monde* (June 12, 2025)  \n  - [Link](https://www.lemonde.fr/politique/article/2025/06/12/manifestations-contre-la-reforme-des-retraites_6234879_823448.html)  \n  - Details: Protests in Paris, Marseille, and Lyon drew over 500,000 participants, with clashes reported between police and demonstrators.  \n\n#### 2. **Cost-of-Living Crisis Worsens**  \n**Summary:** Inflation (5.2% YoY) continues to strain households, driven by food prices (+7.1%) and energy costs. The government’s "Solidarity Voucher" program faces criticism for inadequate coverage.  \n- **Source:** *France 24* (June 5, 2025)  \n  - [Link](https://www.france24.com/fr/france/20250605-inflation-france-pouvoir-d-achat-crise)  \n  - Details: 62% of low-income families report skipping meals, per a National Institute of Statistics (INSEE) survey.  \n\n#### 3. **Immigration Policy Tensions**  \n**Summary:** Parliament debates stricter asylum rules, including expedited deportations and reduced healthcare access. NGOs warn of humanitarian risks.  \n- **Source:** *Reuters* (June 15, 2025)  \n  - [Link](https://www.reuters.com/world/europe/france-tightens-immigration-rules-amid-rising-tensions-2025-06-15/)  \n  - Details: Protests occurred outside the National Assembly, with Amnesty International condemning the bill as "xenophobic."  \n\n#### 4. **Youth Unemployment and Education Reforms**  \n**Summary:** Unemployment for under-25s remains high at 18.3%. Controversial vocational education cuts have sparked student walkouts.  \n- **Source:** *BFM TV* (June 10, 2025)  \n  - [Link](https://www.bfmtv.com/economie/emploi/chomage-jeunes-france-reforme-education_AD-202506100123.html)  \n  - Details: The "France Travail" program failed to meet job-placement targets, per the Labor Ministry.  \n\n#### 5. **Climate Activism and Green Policy Backlash**  \n**Summary:** Environmental groups stage sit-ins opposing new fossil fuel subsidies. Farmers protest EU agricultural regulations, citing economic hardship.  \n- **Source:** *The Local France* (June 8, 2025)  \n  - [Link](https://www.thelocal.fr/20250608/climate-farmers-france-protests-green-deal)  \n  - Details: 200+ arrests during a Paris "Die-In" by Extinction Rebellion.  \n\n#### 6. **Healthcare Access in Rural Areas**  \n**Summary:** Hospital closures in regions like Auvergne exacerbate "medical deserts." Doctors demand urgent funding for rural clinics.  \n- **Source:** *Libération* (June 17, 2025)  \n  - [Link](https://www.liberation.fr/societe/sante/deserts-medicaux-hopitaux-ruraux-france_20250617_HFDS34/)  \n  - Details: 30% of rural residents travel >45 minutes for emergency care (Health Ministry data).  \n\n---\n\n### Methodology  \n- **Searches Conducted:**  \n  - "France pension reform protests June 2025"  \n  - "France inflation cost of living June 2025"  \n  - "France immigration policy changes 2025"  \n  - "Youth unemployment France June 2025"  \n  - "Climate protests France June 2025"  \n  - "Rural healthcare crisis France 2025"  \n- **Sources Verified:** Major international news agencies (Reuters), French national outlets (*Le Monde*, *Libération*), and statistical bodies (INSEE).  \n- **Date Restrictions:** Queries filtered for results from June 1–19, 2025.  \n\n*Note: All sources are publicly accessible as of June 19, 2025. Figures and events are cross-referenced with multiple reports.*',
        '\n### Summary of France\'s Technological Advancements (Mid-2025)  \n*Compiled from verified sources as of June 19, 2025*  \n\n---\n\n#### **1. Quantum Computing & AI**  \n- **Quantum Initiative:** France launched the **"Quantum 2030"** plan in April 2025, investing €500M to develop a 1,000-qubit quantum computer by 2030. Early prototypes from the *Paris-Saclay Quantum Lab* achieved error-correction breakthroughs in May 2025.  \n  *Source: [Le Monde, "France Unveils Quantum 2030 Roadmap," April 3, 2025](https://www.lemonde.fr/sciences/article/2025/04/03/quantum-2030-france-invests-500-million-euros_6224101_1650684.html)*  \n\n- **AI Ethics Framework:** The French Data Protection Authority (CNIL) released binding guidelines for generative AI in public services, mandating transparency in algorithms used by government agencies (effective June 2025).  \n  *Source: [CNIL Official Press Release, June 5, 2025](https://www.cnil.fr/en/news/cnil-publishes-new-rules-generative-ai-public-sector)*  \n\n---\n\n#### **2. Green Technology**  \n- **Nuclear Fusion:** The *ITER project* in Cadarache achieved a sustained plasma reaction lasting 300 seconds in May 2025—a European record. France committed an additional €200M to support commercial fusion startups.  \n  *Source: [ITER Organization News, May 15, 2025](https://www.iter.org/newsline/-/3925)*  \n\n- **Hydrogen Infrastructure:** The first phase of France’s **"H2 Corridor"** opened in Calais, deploying 50 hydrogen refueling stations for heavy transport along the Calais-Marseille route.  \n  *Source: [Clean Energy Wire, "France Activates H2 Freight Network," June 2, 2025](https://www.cleanenergywire.org/news/france-activates-h2-freight-network)*  \n\n---\n\n#### **3. Aerospace & Defense**  \n- **Reusable Rockets:** *ArianeGroup* successfully landed its reusable **MaiaSpace M0 rocket** after a suborbital test in Kourou (June 10, 2025), targeting orbital flights by late 2025.  \n  *Source: [European Space Agency, "MaiaSpace Reusability Milestone," June 11, 2025](https://www.esa.int/Enabling_Support/Space_Transportation/MaiaSpace)*  \n\n- **AI-Powered Surveillance:** The French Air Force deployed **AIDEFNET**, an AI system for real-time airspace threat analysis, integrated with the EU’s Sky Shield initiative.  \n  *Source: [Ministry of Armed Forces, France, June 1, 2025](https://www.defense.gouv.fr/air/aidefnet-ai-air-defense)*  \n\n---\n\n#### **4. Health Tech**  \n- **Neuroprosthetics:** Researchers at *Clinatec* (Grenoble) implanted a brain-computer interface in May 2025 enabling quadriplegic patients to control exoskeletons via neural signals.  \n  *Source: [Nature Biomedical Engineering, "BCI Advancements at Clinatec," May 29, 2025](https://www.nature.com/articles/s41551-025-0067-z)*  \n\n- **Vaccine Innovation:** The Pasteur Institute developed a **universal flu vaccine** using mRNA-LNP technology, entering Phase II trials in June 2025.  \n  *Source: [Institut Pasteur Press Room, June 12, 2025](https://www.pasteur.fr/en/press-room)*  \n\n---\n\n#### **5. Digital Sovereignty**  \n- **Cloud Infrastructure:** The state-backed **"Bleu" cloud platform** (joint venture by Capgemini/Orange) became operational for government data in May 2025, complying with EU’s Gaia-X standards.  \n  *Source: [Le Figaro, "Bleu Cloud Secures French Data," May 20, 2025](https://www.lefigaro.fr/secteur/high-tech/bleu-cloud-gouvernement-20250520)*  \n\n- **Semiconductor Sovereignty:** France inaugurated a €3B semiconductor R&D facility in Grenoble, focusing on FD-SOI chips for IoT devices.  \n  *Source: [Reuters, "France Opens Chip Research Hub," April 25, 2025](https://www.reuters.com/technology/france-semiconductor-grenoble-2025-04-25/)*  \n\n---\n\n### Verification Notes:  \n- All sources are government agencies, peer-reviewed journals, or major news outlets.  \n- Dates confirm information is from **January–June 2025**.  \n- Cross-referenced with multiple reports (e.g., ITER progress confirmed by *Science Magazine*; quantum funding by *French Treasury*).  \n\n*Compiled on June 19, 2025.*',
      ],
    } as ResearchMachineContext;

  const provider = createOpenAICompatible({
    name: "openai-compatible",
    baseURL: process.env.OPENAI_BASE_URL!,
    apiKey: process.env.OPENAI_API_KEY!,
  });

  const languageModel = provider(process.env.OPENAI_DEFAULT_MODEL!);

    const results = await reflection({ ...state, languageModel });

    /*
    example output:
    {
      isSufficient: false,
      knowledgeGap: "The summaries extensively cover France's economic indicators, social issues, and technological advancements as of mid-2025, but they lack several fundamental aspects typically expected in a general overview of a country. Specifically missing are: (1) Basic geographical and demographic context (location, size, population figures, key cities); (2) Political structure and system of governance; (3) Historical background or cultural significance; (4) Overview of key industries beyond technology; (5) Educational system framework; and (6) Cultural attributes like language, cuisine, or arts. These gaps are critical for a holistic understanding of France, especially since the user's broad request ('about France') inherently demands foundational knowledge alongside contemporary updates.",
      followUpQueries: [
        'What are the key geographical features, population demographics, and political structure of France?',
        "Provide an overview of France's cultural heritage, major historical events, and essential aspects of French society.",
        "What are France's main traditional industries and education system structure beyond the technological advances reported for 2025?"
      ]
    }
    */
    expect(results).toBeDefined();
  });
});

describe("test finalizeAnswer", () => {
  it.only("should finalize the answer", async () => {
    const state = {
      messages: [{ role: "user", content: "I want to know about France." }],
      webResearchResults: [
        '\n### France Current Economic Indicators 2025  \n*Synthesized from verified sources as of June 19, 2025*  \n\n#### 1. **GDP Growth**  \n- **Q1 2025 Growth**: +0.2% quarter-on-quarter (q/q), driven by increased consumer spending and exports.  \n  *Source: INSEE (National Institute of Statistics and Economic Studies), "Quarterly National Accounts – Q1 2025," published May 30, 2025*  \n- **2025 Annual Forecast**: Revised to 0.8% (from 1.0% in late 2024) due to persistent industrial slowdown.  \n  *Source: Banque de France, "Economic Projections – June 2025 Update," June 12, 2025*  \n\n#### 2. **Inflation**  \n- **May 2025 Rate**: 2.1% year-on-year (y/y), down from 2.4% in April, reflecting easing energy and food prices.  \n  *Source: Eurostat, "Harmonised Index of Consumer Prices – May 2025," June 4, 2025*  \n- **Core Inflation (ex-food/energy)**: 2.3% y/y, indicating lingering service-sector price pressures.  \n  *Source: INSEE, "Consumer Price Index – May 2025," June 13, 2025*  \n\n#### 3. **Unemployment**  \n- **Q1 2025 Rate**: 7.2%, unchanged from Q4 2024, marking a 15-year low but signaling stagnation in job creation.  \n  *Source: INSEE, "Labour Market Report – Q1 2025," May 22, 2025*  \n- **Youth Unemployment (Under 25)**: 16.8%, slightly elevated due to reduced hiring in manufacturing.  \n  *Source: French Ministry of Labour, "Employment Dashboard – May 2025," June 6, 2025*  \n\n#### 4. **Public Finances**  \n- **Budget Deficit**: Projected at 4.2% of GDP for 2025, above the EU’s 3% target, driven by green transition investments.  \n  *Source: French Treasury, "Stability Programme Update 2025," April 16, 2025*  \n- **Public Debt**: Stabilizing at 110% of GDP, supported by stronger-than-expected tax revenues.  \n  *Source: European Commission, "France Country Report 2025," May 28, 2025*  \n\n#### 5. **Trade Balance**  \n- **April 2025 Deficit**: €5.1 billion, narrowing by 12% from March due to aerospace and pharmaceutical exports.  \n  *Source: Customs Directorate (DGDDI), "Monthly Trade Report – April 2025," June 10, 2025*  \n\n#### 6. **Business Climate**  \n- **May 2025 Business Confidence**: 99.0 (long-term avg: 100), reflecting cautious optimism in services but manufacturing pessimism.  \n  *Source: INSEE, "Business Climate Indicator – May 2025," May 27, 2025*  \n\n#### Key Risks Highlighted by Sources:  \n- **Industrial Weakness**: Auto and chemical sectors face competitive pressures from Asia.  \n  *Source: OECD, "France Economic Snapshot – June 2025," June 3, 2025*  \n- **Fiscal Pressures**: Pension and healthcare reforms could widen the deficit if growth underperforms.  \n  *Source: IMF, "Article IV Consultation – France," May 20, 2025*  \n\n---\n\n### Sources Verification  \nAll data is attributed to primary institutions (INSEE, Banque de France, Eurostat) and vetted international bodies (OECD, IMF, EU Commission). No speculative or unreferenced claims are included. For real-time validation:  \n- [INSEE Publications](https://www.insee.fr)  \n- [Banque de France Reports](https://www.banque-france.fr)  \n- [Eurostat Database](https://ec.europa.eu/eurostat)',
        '\n### Report: Key Social Issues in France - June 2025  \n*Compiled from verified sources as of June 19, 2025*  \n\n---\n\n#### 1. **Pension Reform Protests Escalate**  \n**Summary:** Nationwide strikes and demonstrations have intensified in response to the government\'s proposed increase of the retirement age to 64. Unions argue this disproportionately affects low-income workers.  \n- **Source:** *Le Monde* (June 12, 2025)  \n  - [Link](https://www.lemonde.fr/politique/article/2025/06/12/manifestations-contre-la-reforme-des-retraites_6234879_823448.html)  \n  - Details: Protests in Paris, Marseille, and Lyon drew over 500,000 participants, with clashes reported between police and demonstrators.  \n\n#### 2. **Cost-of-Living Crisis Worsens**  \n**Summary:** Inflation (5.2% YoY) continues to strain households, driven by food prices (+7.1%) and energy costs. The government’s "Solidarity Voucher" program faces criticism for inadequate coverage.  \n- **Source:** *France 24* (June 5, 2025)  \n  - [Link](https://www.france24.com/fr/france/20250605-inflation-france-pouvoir-d-achat-crise)  \n  - Details: 62% of low-income families report skipping meals, per a National Institute of Statistics (INSEE) survey.  \n\n#### 3. **Immigration Policy Tensions**  \n**Summary:** Parliament debates stricter asylum rules, including expedited deportations and reduced healthcare access. NGOs warn of humanitarian risks.  \n- **Source:** *Reuters* (June 15, 2025)  \n  - [Link](https://www.reuters.com/world/europe/france-tightens-immigration-rules-amid-rising-tensions-2025-06-15/)  \n  - Details: Protests occurred outside the National Assembly, with Amnesty International condemning the bill as "xenophobic."  \n\n#### 4. **Youth Unemployment and Education Reforms**  \n**Summary:** Unemployment for under-25s remains high at 18.3%. Controversial vocational education cuts have sparked student walkouts.  \n- **Source:** *BFM TV* (June 10, 2025)  \n  - [Link](https://www.bfmtv.com/economie/emploi/chomage-jeunes-france-reforme-education_AD-202506100123.html)  \n  - Details: The "France Travail" program failed to meet job-placement targets, per the Labor Ministry.  \n\n#### 5. **Climate Activism and Green Policy Backlash**  \n**Summary:** Environmental groups stage sit-ins opposing new fossil fuel subsidies. Farmers protest EU agricultural regulations, citing economic hardship.  \n- **Source:** *The Local France* (June 8, 2025)  \n  - [Link](https://www.thelocal.fr/20250608/climate-farmers-france-protests-green-deal)  \n  - Details: 200+ arrests during a Paris "Die-In" by Extinction Rebellion.  \n\n#### 6. **Healthcare Access in Rural Areas**  \n**Summary:** Hospital closures in regions like Auvergne exacerbate "medical deserts." Doctors demand urgent funding for rural clinics.  \n- **Source:** *Libération* (June 17, 2025)  \n  - [Link](https://www.liberation.fr/societe/sante/deserts-medicaux-hopitaux-ruraux-france_20250617_HFDS34/)  \n  - Details: 30% of rural residents travel >45 minutes for emergency care (Health Ministry data).  \n\n---\n\n### Methodology  \n- **Searches Conducted:**  \n  - "France pension reform protests June 2025"  \n  - "France inflation cost of living June 2025"  \n  - "France immigration policy changes 2025"  \n  - "Youth unemployment France June 2025"  \n  - "Climate protests France June 2025"  \n  - "Rural healthcare crisis France 2025"  \n- **Sources Verified:** Major international news agencies (Reuters), French national outlets (*Le Monde*, *Libération*), and statistical bodies (INSEE).  \n- **Date Restrictions:** Queries filtered for results from June 1–19, 2025.  \n\n*Note: All sources are publicly accessible as of June 19, 2025. Figures and events are cross-referenced with multiple reports.*',
        '\n### Summary of France\'s Technological Advancements (Mid-2025)  \n*Compiled from verified sources as of June 19, 2025*  \n\n---\n\n#### **1. Quantum Computing & AI**  \n- **Quantum Initiative:** France launched the **"Quantum 2030"** plan in April 2025, investing €500M to develop a 1,000-qubit quantum computer by 2030. Early prototypes from the *Paris-Saclay Quantum Lab* achieved error-correction breakthroughs in May 2025.  \n  *Source: [Le Monde, "France Unveils Quantum 2030 Roadmap," April 3, 2025](https://www.lemonde.fr/sciences/article/2025/04/03/quantum-2030-france-invests-500-million-euros_6224101_1650684.html)*  \n\n- **AI Ethics Framework:** The French Data Protection Authority (CNIL) released binding guidelines for generative AI in public services, mandating transparency in algorithms used by government agencies (effective June 2025).  \n  *Source: [CNIL Official Press Release, June 5, 2025](https://www.cnil.fr/en/news/cnil-publishes-new-rules-generative-ai-public-sector)*  \n\n---\n\n#### **2. Green Technology**  \n- **Nuclear Fusion:** The *ITER project* in Cadarache achieved a sustained plasma reaction lasting 300 seconds in May 2025—a European record. France committed an additional €200M to support commercial fusion startups.  \n  *Source: [ITER Organization News, May 15, 2025](https://www.iter.org/newsline/-/3925)*  \n\n- **Hydrogen Infrastructure:** The first phase of France’s **"H2 Corridor"** opened in Calais, deploying 50 hydrogen refueling stations for heavy transport along the Calais-Marseille route.  \n  *Source: [Clean Energy Wire, "France Activates H2 Freight Network," June 2, 2025](https://www.cleanenergywire.org/news/france-activates-h2-freight-network)*  \n\n---\n\n#### **3. Aerospace & Defense**  \n- **Reusable Rockets:** *ArianeGroup* successfully landed its reusable **MaiaSpace M0 rocket** after a suborbital test in Kourou (June 10, 2025), targeting orbital flights by late 2025.  \n  *Source: [European Space Agency, "MaiaSpace Reusability Milestone," June 11, 2025](https://www.esa.int/Enabling_Support/Space_Transportation/MaiaSpace)*  \n\n- **AI-Powered Surveillance:** The French Air Force deployed **AIDEFNET**, an AI system for real-time airspace threat analysis, integrated with the EU’s Sky Shield initiative.  \n  *Source: [Ministry of Armed Forces, France, June 1, 2025](https://www.defense.gouv.fr/air/aidefnet-ai-air-defense)*  \n\n---\n\n#### **4. Health Tech**  \n- **Neuroprosthetics:** Researchers at *Clinatec* (Grenoble) implanted a brain-computer interface in May 2025 enabling quadriplegic patients to control exoskeletons via neural signals.  \n  *Source: [Nature Biomedical Engineering, "BCI Advancements at Clinatec," May 29, 2025](https://www.nature.com/articles/s41551-025-0067-z)*  \n\n- **Vaccine Innovation:** The Pasteur Institute developed a **universal flu vaccine** using mRNA-LNP technology, entering Phase II trials in June 2025.  \n  *Source: [Institut Pasteur Press Room, June 12, 2025](https://www.pasteur.fr/en/press-room)*  \n\n---\n\n#### **5. Digital Sovereignty**  \n- **Cloud Infrastructure:** The state-backed **"Bleu" cloud platform** (joint venture by Capgemini/Orange) became operational for government data in May 2025, complying with EU’s Gaia-X standards.  \n  *Source: [Le Figaro, "Bleu Cloud Secures French Data," May 20, 2025](https://www.lefigaro.fr/secteur/high-tech/bleu-cloud-gouvernement-20250520)*  \n\n- **Semiconductor Sovereignty:** France inaugurated a €3B semiconductor R&D facility in Grenoble, focusing on FD-SOI chips for IoT devices.  \n  *Source: [Reuters, "France Opens Chip Research Hub," April 25, 2025](https://www.reuters.com/technology/france-semiconductor-grenoble-2025-04-25/)*  \n\n---\n\n### Verification Notes:  \n- All sources are government agencies, peer-reviewed journals, or major news outlets.  \n- Dates confirm information is from **January–June 2025**.  \n- Cross-referenced with multiple reports (e.g., ITER progress confirmed by *Science Magazine*; quantum funding by *French Treasury*).  \n\n*Compiled on June 19, 2025.*',
      ],
    } as ResearchMachineContext;


  const provider = createOpenAICompatible({
    name: "openai-compatible",
    baseURL: process.env.OPENAI_BASE_URL!,
    apiKey: process.env.OPENAI_API_KEY!,
  });

  const languageModel = provider(process.env.OPENAI_DEFAULT_MODEL!);

    const results = await answer({ ...state, languageModel });

    /*
      {
        message: '\n' +
          "Here is a comprehensive overview of France's current economic, social, and technological landscape as of June 2025, based on the latest verified data:\n" +
          '\n' +
          '### **Economic Indicators**  \n' +
          '1. **GDP Growth**:  \n' +
          '   - Q1 2025 growth reached **+0.2% quarter-on-quarter**, driven by consumer spending and exports. The 2025 annual forecast was revised downward to **0.8%** due to industrial slowdowns (INSEE, May 30, 2025; Banque de France, June 12, 2025).  \n' +
          '\n' +
          '2. **Inflation**:  \n' +
          '   - Fell to **2.1% year-on-year in May 2025** (down from 2.4% in April), though core inflation (excluding food/energy) remained elevated at **2.3%** (Eurostat, June 4, 2025; INSEE, June 13, 2025).  \n' +
          '\n' +
          '3. **Unemployment**:  \n' +
          '   - Held at **7.2% in Q1 2025**, a 15-year low but stagnant. Youth unemployment (under 25) stood at **16.8%**, linked to manufacturing sector struggles (INSEE, May 22, 2025; French Ministry of Labour, June 6, 2025).  \n' +
          '\n' +
          '4. **Public Finances**:  \n' +
          '   - The budget deficit is projected at **4.2% of GDP for 2025**, exceeding EU targets, while public debt stabilized at **110% of GDP** (French Treasury, April 16, 2025; European Commission, May 28, 2025).  \n' +
          '\n' +
          '5. **Trade & Business Climate**:  \n' +
          '   - The trade deficit narrowed to **€5.1 billion in April 2025**, aided by aerospace exports. Business confidence dipped to **99.0** (below the 100 average), reflecting manufacturing pessimism (Customs Directorate, June 10, 2025; INSEE, May 27, 2025).  \n' +
          '\n' +
          '**Key Risks**: Industrial competition from Asia (OECD, June 3, 2025) and fiscal pressures from social reforms (IMF, May 20, 2025).  \n' +
          '\n' +
          '---\n' +
          '\n' +
          '### **Social Landscape**  \n' +
          '1. **Pension Reforms**:  \n' +
          '   - Nationwide protests erupted over raising the retirement age to **64**, with 500,000 participants in major cities (*Le Monde*, June 12, 2025).  \n' +
          '\n' +
          '2. **Cost-of-Living Crisis**:  \n' +
          '   - **62% of low-income families** report skipping meals due to high food inflation (**+7.1% YoY**). Government aid programs face criticism for inadequate coverage (*France 24*, June 5, 2025; INSEE survey).  \n' +
          '\n' +
          '3. **Immigration & Youth Unemployment**:  \n' +
          '   - Stricter asylum rules sparked NGO protests, labeled "xenophobic" by Amnesty International. Youth unemployment hit **18.3%**, exacerbated by vocational education cuts (*Reuters*, June 15, 2025; BFM TV, June 10, 2025).  \n' +
          '\n' +
          '4. **Climate & Healthcare**:  \n' +
          '   - Environmental activists staged "Die-Ins" against fossil fuel subsidies (**200+ arrests** in Paris). Rural "medical deserts" force **30% of residents** to travel >45 minutes for emergency care (*The Local France*, June 8, 2025; *Libération*, June 17, 2025).  \n' +
          '\n' +
          '---\n' +
          '\n' +
          '### **Technological Advancements**  \n' +
          '1. **Quantum & AI**:  \n' +
          '   - **€500M "Quantum 2030"** initiative aims for a 1,000-qubit computer by 2030. The CNIL mandated transparency for AI in public services (*Le Monde*, April 3, 2025; CNIL, June 5, 2025).  \n' +
          '\n' +
          '2. **Green Tech**:  \n' +
          '   - The ITER project achieved a **300-second plasma reaction** (European record). The **"H2 Corridor"** launched 50 hydrogen stations for freight transport (ITER Organization, May 15, 2025; Clean Energy Wire, June 2, 2025).  \n' +
          '\n' +
          '3. **Aerospace & Health**:  \n' +
          '   - **MaiaSpace M0** reusable rocket completed a suborbital test. Grenoble researchers enabled quadriplegics to control exoskeletons via brain implants. The Pasteur Institute advanced a **universal flu vaccine** to Phase II trials (European Space Agency, June 11, 2025; *Nature*, May 29, 2025; Institut Pasteur, June 12, 2025).  \n' +
          '\n' +
          '4. **Digital Sovereignty**:  \n' +
          '   - The **"Bleu"** cloud platform secured government data, while a **€3B semiconductor R&D hub** opened in Grenoble (*Le Figaro*, May 20, 2025; Reuters, April 25, 2025).  \n' +
          '\n' +
          'France balances innovation leadership with social challenges, navigating economic headwinds through strategic tech investments and contentious reforms.'
      }
     */

    expect(results).toBeDefined();
  });
});

describe("test agent", () => {
  it.only("should generate agent state", async () => {

    const provider = createOpenAICompatible({
      name: "openai-compatible",
      baseURL: process.env.OPENAI_BASE_URL!,
      apiKey: process.env.OPENAI_API_KEY!,
    });

    const languageModel = provider(process.env.OPENAI_DEFAULT_MODEL!);

    const machine = createResearchAgentMachine({
      queryGeneratorModel: languageModel,
      reflectionModel: languageModel,
      answerModel: languageModel,
      numberOfInitialQueries: 3,
      maxResearchLoops: 1,
      tools: {
        [ToolName.SearchTool]: serpSearchApiTool(process.env.SERP_API_KEY!),
      } as Record<ToolName, Tool>,
    });

    const actor = createActor(machine);

    actor.start();

    actor.send({
      type: "START_RESEARCH",
      messages: [
        {
          role: "user",
          content: "I want to know about France.",
        },
      ],
    });

    await waitFor(actor, (snapshot) => snapshot.status === "done");

    const finalSnapshot = actor.getSnapshot();
    expect(finalSnapshot.status).toBe("done");
  });
});
