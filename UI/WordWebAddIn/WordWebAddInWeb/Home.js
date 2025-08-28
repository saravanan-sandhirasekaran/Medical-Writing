const SectionIdEnum = {
    BIN: "BackgroundInformation",
    BRA: "BenefitRiskAssessment",
    PEP: "PrimaryEndpoint",
    SEP: "SecondaryEndpoint",
    PEO: "PrimaryObjectives",
    SEO: "SecondaryObjectives",
    KSE: "KeySecondaryEndpoint",
    KSO: "KeySecondaryObjective",    
    OSD: "OverallStudyDesign",
    DOS: "DurationOfStudy",
    SCOM: "StudyCompletion",
    SPOP: "StudyPopulation",
    SDO: "StudyDrugOverview",
    DPSA: "DrugPreparationStorageAccountability",
    BAU: "BlindingAndUnblinding",
    DMAD: "DoseModificationAndDiscontinuation",
    CTHE: "ConcomitantTherapy"
};

const sections = [
    {
        "title": "Background Information",
        "id": SectionIdEnum.BIN,
        "prompt": "Summarize the background of the clinical study, including the medical condition being addressed, the scientific or therapeutic rationale, and any relevant epidemiological or clinical context. Use regulatory-appropriate language in 2–3 paragraphs to set the stage for the study.\n\nSuggested Structure:\n• Brief disease/condition overview\n• Gaps in treatment or unmet needs\n• Why this drug/intervention now?\n• Public health relevance (optional)\n\nExample Output:\nHeart failure with reduced ejection fraction (HFrEF) remains a major contributor to cardiovascular morbidity, despite the availability of guideline-based therapies. Many patients experience progressive symptoms and repeat hospitalizations. Emerging evidence suggests that SGLT2 inhibitors like dapagliflozin may offer additional benefits in reducing heart failure events. This study explores its efficacy in this high-risk population.\n\nPurpose: Describes the medical and scientific context for the study"
    },
    {
        "title": "Benefit/Risk Assessment",
        "id": SectionIdEnum.BRA,
        "prompt": "Summarize the anticipated benefits and potential risks of the investigational product as described in the protocol. Highlight the expected clinical outcomes, known or potential safety concerns, and how the benefit-risk profile supports the conduct of the study. Use a neutral and regulatory-aligned tone.\n\nSuggested Structure\n\nExpected clinical benefit(s) or therapeutic impact\n\nKnown safety risks or adverse event concerns\n\nWhy benefit outweighs risk in this study population\n\nOptional: mention regulatory or ethical safeguards\n\nExample Output\n\nDapagliflozin has demonstrated cardiovascular and renal benefits in patients with diabetes, and emerging data suggest similar benefits in heart failure irrespective of glycemic status. While known risks include volume depletion and genitourinary infections, these are generally manageable with monitoring. The anticipated reduction in heart failure events and mortality is expected to outweigh the safety risks. Conducting this study in a controlled clinical setting ensures appropriate oversight and risk mitigation.\n\nPurpose: Explains expected benefits vs risks of the study drug"

    },
    {
        "title": "Primary Endpoint",
        "id": SectionIdEnum.PEP,
        "prompt": "This section summarizes the main clinical measurement used to evaluate the efficacy of the treatment. It should describe how the primary endpoint was defined, measured, and analyzed, including statistical significance and relevance to the study objective.\n\nSuggested Structure:\n- Define the primary endpoint clearly (e.g., % change in blood pressure, survival rate)\n- Specify time point(s) at which it was measured (e.g., Week 12)\n- Include statistical results (mean difference, p-value, confidence interval)"
    },
    {
        "title": "Secondary Endpoint",
        "id": SectionIdEnum.SEP,
        "prompt": "Outlines additional endpoints beyond the primary one. These often measure secondary efficacy signals, patient-reported outcomes, safety trends, or exploratory clinical benefits. The summary should include how these endpoints were defined, measured, and interpreted"
    },
    {
        "title": "Primary Objectives",
        "id": SectionIdEnum.PEO,
        "prompt": "State the primary objective of the study, clearly identifying the main therapeutic or clinical outcome being investigated. Use regulatory-appropriate phrasing in 1–2 concise sentences that align with the primary endpoint.\n\nSuggested Structure \n\nClear definition of objective (what is being measured) \n\nTarget population \n\nIntervention (and comparator, if relevant) \n\nExample Output \n\nThe primary objective is to evaluate the effect of dapagliflozin compared with placebo on the incidence of cardiovascular death or hospitalization for heart failure in patients with HFrEF.\n\nPurpose \n\nClearly defines the main goal of the clinical study, directly linked to the primary endpoint."
    },
    {
        "title": "Secondary Objectives",
        "id": SectionIdEnum.SEO,
        "prompt": "List the secondary objectives of the study, summarizing additional therapeutic, functional, or safety outcomes of interest. If applicable, include exploratory objectives such as biomarker analyses or patient-reported outcomes. Phrase the summary in 2–4 bullet points using regulatory-appropriate language.\n\nSuggested Structure \n\nBullet points for each objective \n\nStart with secondary clinical goals \n\nAdd exploratory goals at the end \n\nInclude scope of measurement if mentioned (e.g., QoL score, biomarker, subgroup) \n\nExample Output \n\nSecondary Objectives \n• To evaluate the effect of dapagliflozin on quality of life using the Kansas City Cardiomyopathy Questionnaire (KCCQ) \n• To assess the impact of treatment on worsening heart failure events\n\nPurpose \n\nCaptures all non-primary goals that may support labeling, subgroup understanding, or future studies."
    },
    {
        "title": "Key Secondary Endpoint",
        "id": SectionIdEnum.KSE,
        "prompt": "Summarize the key secondary endpoint that corresponds to the objective. Clearly describe what is being measured (e.g., symptom severity, biomarker), the method of assessment (e.g., scale or test), and the timeframe. Use 1–2 sentences with regulatory precision.\n\nSuggested Structure \n\nChange in [clinical domain] \n\nMeasured by [instrument/method] \n\nAt [specified timepoint] \n\nExample Output \nChange in severity of heart failure symptoms as measured by the Kansas City Cardiomyopathy Questionnaire (KCCQ) at Week 12. \n\nPurpose \nThis endpoint quantifies the clinical impact of the study drug on a meaningful outcome, often ranked second in statistical hierarchy after the primary endpoint."
    },
    {
        "title": "Key Secondary Objective",
        "id": SectionIdEnum.KSO,
        "prompt": "To further evaluate the effect of the study drug beyond the primary objective, summarize the key secondary objective as stated in the protocol. Focus on important clinical symptoms, functional domains, or biomarker outcomes. Phrase in one sentence using regulatory-appropriate language.\n\nSuggested Structure\n\nTo further evaluate the impact of [drug] on [clinical domain] \n\nShould be short and directional \n\nAvoid stating measurement methods here (reserved for endpoint prompt) \n\nExample Output \nTo further evaluate the impact of dapagliflozin on symptoms of heart failure. \n\nPurpose \nCaptures the main clinical intent beyond the primary objective, often tied to regulatory labeling or clinical value demonstration."
    },
    {
        "title": "Overall Study Design",
        "id": SectionIdEnum.OSD,
        "prompt": "Summarize the study design as outlined in Sections 4.1.1 to 4.1.7. Include all critical design elements: participant flow, screening and baseline activities, dose titration, stable dose treatment, open-label extension, early termination procedures, and unscheduled visits. Preserve the subheading structure and write in a clear, regulatory-appropriate format.\n\nSuggested Structure \n\n• 4.1.1 Screening and Baseline \n• 4.1.2 Dose Titration Period \n• 4.1.3 Flexible/Stable Dose Period \n• 4.1.4 Open-Label Extension \n• 4.1.5 Early Termination Visit \n• 4.1.6 Safety Follow-Up Telephone Contacts \n• 4.1.7 Unscheduled Visits and Assessments \n\nExample Output \n\n4.1.1 Screening and Baseline \nParticipants will undergo a screening and baseline assessment period of up to 28 days to confirm eligibility and collect baseline data. Key activities include medical history, laboratory testing, ECG, and informed consent. \n\n4.1.2 Dose Titration Period \nEligible participants will enter a 4-week dose titration phase where dosing will be escalated based on predefined tolerability criteria. Investigators will assess safety and adjust doses accordingly. \n\n4.1.3 Flexible/Stable Dose Period \nAfter titration, participants will enter a fixed-dose treatment phase continuing through Day 26. Dose adjustments are restricted unless clinically justified. Assessments for efficacy and tolerability occur at scheduled visits. \n\n4.1.4 Open-Label Extension \nParticipants completing the double-blind phase may transition into an optional open-label extension where all subjects receive active treatment under continued monitoring. \n\n4.1.5 Early Termination Visit \nParticipants who withdraw early will complete an early termination visit that includes safety assessments, study drug reconciliation, and final efficacy evaluations. \n\n4.1.6 Safety Follow-Up Telephone Contacts \nSafety follow-up calls will be conducted on Day 30 and Day 45 post-final dose to assess for delayed adverse events and ensure participant well-being. \n\n4.1.7 Unscheduled Visits and Assessments \nUnscheduled visits may be performed as needed to evaluate adverse events or protocol deviations. All procedures will be documented in the electronic case report form (eCRF). \n\nPurpose \nProvides a detailed breakdown of the clinical study structure across treatment phases and visit types. Helps auto-populate CSPs while maintaining traceable alignment with the protocol’s logic."
    },
    {
        "title": "Duration Of Study",
        "id": SectionIdEnum.DOS,
        "prompt": "Summarize the expected duration of participant involvement in the clinical trial. Include the length of each study phase (e.g., screening, treatment, follow-up), total participation time, and conditions that may alter duration. Phrase in regulatory-appropriate language suitable for protocol documentation.\n\nSuggested Structure \n\n• Screening period duration \n• Dose titration and fixed-dose treatment duration \n• Follow-up schedule \n• Optional open-label extension (brief mention if affects duration) \n• Total expected duration per participant \n• Any visit window flexibility or exception criteria \n\nExample Output \n\nEach participant is expected to participate in the study for approximately 12 weeks, including all required phases. The study includes: \n\nA Screening and Baseline period of up to 28 days \n\nA 4-week Dose Titration period \n\nA Stable Dose Treatment period through Day 26 \n\nSafety Follow-Up via phone calls at Day 30 and Day 45 post-final dose \n\nParticipants who discontinue early will exit following an Early Termination Visit, and those eligible may transition into a long-term open-label extension study. Total participation time (excluding extension) is approximately 10 to 12 weeks, depending on timing of unscheduled visits or early exit criteria. \n\nPurpose \n\nProvides a concise overview of the complete participant timeline to support regulatory planning, scheduling guidance, and downstream automation in CSP and site tools."
    },
    {
        "title": "Study Completion",
        "id": SectionIdEnum.SCOM,
        "prompt": "Summarize how study completion is defined for participants and for the overall clinical trial. Clarify the criteria for completion vs. withdrawal, and describe any formal definitions outlined in the protocol. Write in a format appropriate for CSP documentation.\n\nSuggested Structure \n\n• Participant-level completion criteria \n• End-of-treatment visit definition \n• Trial-level completion (e.g., last visit of last participant) \n• Reference to follow-up, OLE, or discontinuation transition \n• Distinction from early withdrawal \n\nExample Output \n\nParticipant-level study completion is defined as completion of all scheduled study visits through Day 45 post-final dose, including follow-up safety calls. Participants who exit the study prior to Day 45 are considered early withdrawals unless formally transitioned to the open-label extension. \n\nStudy completion (trial-level) is defined as the date of the last scheduled contact (e.g., Day 45 follow-up) for the last enrolled participant in the double-blind portion of the trial. \n\nParticipants who complete the study may be eligible for enrollment in a subsequent long-term safety extension, as detailed in Section 4.1.4. Discontinuations prior to protocol-defined endpoints will be documented separately in the eCRF. \n\nPurpose \n\nDefines when participants and the overall study are considered “complete” for documentation, compliance, and reporting purposes. Helps distinguish study exit from protocol deviations or early withdrawal."
    },
    {
        "title": "Study Population",
        "id": SectionIdEnum.SPOP,
        "prompt": "Generate a structured summary for the Study Population section, covering inclusion and exclusion criteria, lifestyle considerations, and protocol handling of participants who fail eligibility. Use subheadings (5.1 to 5.4) and maintain a clinical and regulatory tone.\n\nSuggested Output Format:\n\n5.1 Inclusion Criteria   \nParticipants must be adults (≥18 years) with documented heart failure and LVEF ≤40%. Additional eligibility includes NYHA Class II–IV symptoms and stable guideline-directed therapy. \n\n5.2 Exclusion Criteria   \nKey exclusions include eGFR <30 mL/min/1.73m², type 1 diabetes, recent DKA, active malignancy, or known hypersensitivity to dapagliflozin. \n\n5.3 Lifestyle Considerations   \nParticipants must agree to abstain from excessive alcohol intake and avoid unapproved over-the-counter medications or supplements throughout the study. \n\n5.4 Participants Not Meeting Eligibility Criteria   \nSubjects who fail screening will be documented with a screening log. These individuals will not proceed to randomization and no study drug will be dispensed. \n\nPurpose\nTo generate a complete Study Population section in one go, including eligibility and lifestyle guidelines."
    },
    {
        "title": "Study Drug Overview",
        "id": SectionIdEnum.SDO,
        "prompt": "Summarize the description of the study drug, including its name, formulation, strength, and pharmacological classification. Mention the route of administration, physical characteristics (e.g., color, dosage form), and any reference to its mechanism of action if relevant. Use concise regulatory-aligned language suitable for CSP documentation.\n\nSuggested Structure \n\nName and active ingredient \n\nDosage form and strength \n\nPharmacological class \n\nRoute of administration \n\nOptional: physical description or color \n\nOptional: brief mechanism of action \n\nShape \n\nExample Output \n\nThe investigational product is dapagliflozin, a selective sodium-glucose co-transporter 2 (SGLT2) inhibitor. It is formulated as a 10 mg oral tablet, white to off-white in color, to be administered once daily with or without food. Dapagliflozin functions by reducing glucose reabsorption in the kidney, with potential cardiovascular and renal protective effects. \n\nShape \n\nPurpose \n\nDescribes the study drug’s identity, form, class, and delivery method for CSP readers and regulatory reviewers."

    },
    {
        "title": "Drug Preparation Storage Accountability",
        "id": SectionIdEnum.DPSA,
        "prompt": "Generate a structured summary covering how the study drug will be prepared, labeled, packaged, stored, and accounted for during the clinical trial. Include subsection headers (6.2.1 to 6.2.4) and describe the procedures according to good clinical practice (GCP) and regulatory requirements.\n\nSuggested Structure \n\n6.2.1 Preparation and Dispensing   \n\nDescribe who prepares the drug (e.g., pharmacy), where it’s dispensed, and any instructions before administration (e.g., dilution, reconstitution, blinding steps). \n\n6.2.2 Packaging and Labeling   \n\nExplain how the drug is packaged (e.g., blister packs, bottles), label contents (e.g., protocol number, storage instructions), and compliance with local/global regulations. \n\n6.2.3 Storage Conditions   \n\nDescribe required storage temperature, humidity, protection from light, and how deviations are tracked. \n\n6.2.4 Accountability   \n\nExplain how the site maintains records of drug receipt, use, returns, and destruction. Mention tools like drug accountability logs or reconciliation forms. \n\nExample Output \n\n6.2.1 Preparation and Dispensing \nThe investigational product will be dispensed by the study pharmacist at each site and does not require reconstitution or manipulation prior to use. \n\n6.2.2 Packaging and Labeling \nDapagliflozin will be provided in white blister packs with protocol-specific labeling, including batch number, expiry date, and storage instructions in compliance with ICH GCP and local regulations. \n\n6.2.3 Storage Conditions \nStudy drug must be stored at 20–25°C, protected from light and moisture. Storage temperatures will be monitored continuously, and deviations will be reported to the sponsor. \n\n6.2.4 Accountability \nDrug accountability logs will be maintained at each site. All investigational product dispensed, returned, or destroyed will be recorded, and reconciliation performed at study closeout. \n\nPurpose \n\nDefines logistics for safe handling, labeling, storage, and traceability of the study drug at clinical sites."
    },
    {
        "title": "Blinding And Unblinding",
        "id": SectionIdEnum.BAU,
        "prompt": "Summarize the blinding strategy for this clinical trial, including who is blinded (e.g., participants, investigators), how blinding is maintained throughout the study, and the procedures for unblinding in case of emergencies. Phrase the content in 2–3 concise, regulatory-aligned paragraphs.\n\nSuggested Structure \n\nType of blinding (e.g., double-blind, single-blind) \n\nWho is blinded (participants, site staff, sponsor) \n\nHow blinding is maintained (e.g., identical appearance, IWRS) \n\nEmergency unblinding process (when, how, who approves) \n\nWhere unblinding events are documented \n\nExample Output \n\nThis study will be conducted in a double-blind manner, where both participants and study site personnel will remain unaware of treatment assignments. The investigational product and placebo are identical in appearance, packaging, and labeling to maintain the blind. \n\nBlinding will be maintained using an Interactive Web Response System (IWRS), which will also handle randomization. Emergency unblinding may be performed by the site investigator only when knowledge of the treatment is essential for clinical decision-making. All unblinding events must be documented in the electronic case report form (eCRF) and immediately reported to the sponsor. \n\nPurpose \n\nDetails the mechanisms to ensure unbiased conduct of the trial, with clear documentation of exceptions."

    },
    {
        "title": "Dose Modification And Discontinuation",
        "id": SectionIdEnum.DMAD,
        "prompt": "Summarize the protocol’s guidance on dose modification and treatment discontinuation. Include criteria for reducing or interrupting the dose due to adverse events, clinical thresholds that require discontinuation, and any rules for resuming treatment. Phrase the content in clear, structured CSP language.\n\nSuggested Structure \n\nWhen dose reduction or interruption is allowed \n\nAE thresholds that trigger modifications \n\nDiscontinuation criteria (e.g., toxicity grade, non-compliance, pregnancy) \n\nProtocol steps if drug is stopped (e.g., notify sponsor, follow-up visits) \n\nRe-initiation rules (if any) \n\nExample Output \n\nDose modification is not routinely permitted in this study; however, temporary treatment interruption is allowed in the event of adverse events such as hypotension, dehydration, or acute kidney injury. Treatment should be resumed once symptoms resolve and safety parameters normalize. \n\nPermanent discontinuation is required if a participant develops severe hypersensitivity to the study drug, experiences a Grade 4 adverse event deemed related to treatment, or becomes pregnant. All discontinuations must be documented in the eCRF, and the investigator must inform the sponsor within 24 hours. \n\nPurpose \n\nEnsures consistent safety-based drug administration decisions and documentation across sites."
    },
    {
        "title": "Concomitant Therapy",
        "id": SectionIdEnum.CTHE,
        "prompt": "Summarize the protocol’s requirements and restrictions regarding prior and concomitant medications. Include rules for permitted, prohibited, or conditionally allowed therapies before and during the trial. Mention how medications are recorded and any washout requirements\n\nSuggested Structure \n\nAllowed medications (e.g., SOC drugs, supportive care) \n\nProhibited drugs (e.g., interfering with PK, efficacy) \n\nConditional medications (e.g., permitted if stable) \n\nWashout periods or restrictions before enrollment \n\nDocumentation requirements (eCRF, medication logs) \n\nExample Output \n\nParticipants may continue guideline-directed medical therapy for heart failure, including beta-blockers, ACE inhibitors, and mineralocorticoid receptor antagonists, provided the regimen is stable for at least four weeks prior to randomization. \n\nUse of SGLT2 inhibitors other than dapagliflozin is prohibited during the study. Medications known to significantly affect renal clearance or study endpoints must be discontinued or avoided. All prior and concomitant therapies will be documented in the electronic case report form (eCRF), including start and stop dates, dosage, and indication. \n\nPurpose \n\nOutlines medication management during the trial to prevent confounding effects and ensure patient safety."
    }
];

Office.onReady().then(() => {
    window.onload = async () => {
        renderSections();
        await loadExistingContent();
    };
});

function renderSections() {
    const container = document.getElementById("sectionsContainer");
    container.innerHTML = "";

    sections.forEach((sec, index) => {
        const id = `section${sec.id}`;
        container.innerHTML += `
          <div class="accordion mb-4" id="accordion${id}">
            <div class="accordion-item">
              <h2 class="accordion-header" id="heading${id}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${id}" aria-expanded="false">
                  ${sec.title}
                </button>
              </h2>
              <div id="collapse${id}" class="accordion-collapse collapse">
                <div class="accordion-body">
                  <label class="form-label">Prompt:</label>
                  <textarea class="form-control mb-3" rows="6" readonly id="prompt-${id}">${sec.prompt}</textarea>

                  <label class="form-label">Generated Content:</label>
                  <textarea class="form-control mb-3" rows="8" id="content-${id}" placeholder="Click Generate"></textarea>

                  <label class="form-label">New Prompt:</label>
                  <textarea class="form-control mb-3" rows="6" id="instruction-${id}" placeholder="Optionally refine the prompt..."></textarea>

                  <div class="d-flex gap-3">
                    <button class="btn btn-primary" id="generateBtn-${id}" onclick="generateSection('${sec.id}')">
                      <span class="spinner-border spinner-border-sm me-2 d-none" id="spinner-${id}" role="status" aria-hidden="true"></span>
                      Generate
                    </button>
                    <button class="btn btn-success" onclick="insertSection('${sec.id}')">Update</button>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
    });
}

async function generateSection(index) {
    const id = `section${index}`;
    const spinner = document.getElementById(`spinner-${id}`);
    const prompt = document.getElementById(`prompt-${id}`).value.trim();
    const original = document.getElementById(`content-${id}`).value.trim();
    const instruction = document.getElementById(`instruction-${id}`).value.trim();
    spinner.classList.remove('d-none');
    const button = document.getElementById(`generateBtn-${id}`);
    button.classList.add('generate-loading');
    try {
        const response = await fetch("https://localhost:7206/api/ai/SearchPrompt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                initialPrompt: prompt,
                originalContent: original,
                instruction: instruction,
                sectionID: index
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API error:", errorText);
            alert("Failed to generate section. Please check the API response.");
            return;
        }

        const newText = await response.text();
        const formattedText = newText
            .replace(/\\n/g, '\n')
            .replace(/\\t/g, '\t')
            .replace(/\r/g, '')
            .replace(/\\\"/g, '"')
            .replace(/\\"/g, '"')
            .replace(/\*\*/g, '');

        document.getElementById(`content-${id}`).value = formattedText;
    } catch (error) {
        console.error("Unexpected error:", error);
        alert("An error occurred while generating the section.");
    } finally {
        spinner.classList.add('d-none');
        button.classList.remove('generate-loading');
    }
}


async function insertSection(index) {
    const id = `section${index}`;
    const content = document.getElementById(`content-${id}`).value.trim();
    const section = sections.find(section => section.id === index);
    const tag = section.id;

    if (!content) {
        alert("Please generate content first.");
        return;
    }

    try {
        await Word.run(async (context) => {
            const contentControls = context.document.contentControls;
            context.load(contentControls, 'items,tag');
            await context.sync();

            let existingControl = null;
            for (let cc of contentControls.items) {
                if (cc.tag === tag) {
                    existingControl = cc;
                    break;
                }
            }

            if (existingControl) {
                //existingControl.insertText(`${tag}\n${content}`, Word.InsertLocation.replace);
                existingControl.insertText(`${content}`, Word.InsertLocation.replace);
                //existingControl.appearance = "hidden";
                //existingControl.title = "";
                /* existingControl.removeWhenEdited = false;*/
            } else {
                //const range = context.document.body.insertText(`${tag}\n${content}`, Word.InsertLocation.end);
                const range = context.document.body.insertText(`${content}`, Word.InsertLocation.end);
                const newControl = range.insertContentControl();
                newControl.tag = tag;
                //newControl.title = "";
                //newControl.appearance = "hidden";
                //newControl.removeWhenEdited = false;
            }

            await context.sync();
        });
    } catch (error) {
        console.error("Word insert error:", error);
        alert("An error occurred while inserting content into Word.");
    }
}


async function loadExistingContent() {
    try {
        await Word.run(async (context) => {
            const tagToIndexMap = {};
            sections.forEach((s, i) => tagToIndexMap[s.id] = s.id);

            const controls = context.document.contentControls;
            context.load(controls, 'items,tag,paragraphs');
            await context.sync();

            for (let cc of controls.items) {
                const index = tagToIndexMap[cc.tag];
                if (index !== undefined) {
                    const id = `section${index}`;
                    context.load(cc.paragraphs, 'text');
                    await context.sync();

                    const paras = cc.paragraphs.items;
                    if (paras.length > 1) {
                        const bodyOnly = paras.slice(1).map(p => p.text).join('\n');
                        document.getElementById(`content-${id}`).value = bodyOnly;
                    } else if (paras.length === 1 && paras[0].text !== cc.tag) {
                        document.getElementById(`content-${id}`).value = paras[0].text;
                    }
                }

                cc.appearance = "hidden";
                cc.title = "";
                cc.removeWhenEdited = false;
            }
        });
    } catch (error) {
        console.error("Error reading Word content:", error);
    }
}
