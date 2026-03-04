-- ============================================================
-- Expanded seed data for diseases table
-- 55+ diseases covering respiratory, infectious, digestive,
-- neurological, skin, metabolic, and vector-borne conditions.
-- This data is the "training corpus" for the KNN model.
-- Run this in your Supabase SQL editor (Project → SQL Editor).
-- ============================================================

-- Clear existing data so re-runs are idempotent
TRUNCATE public.epidemic_alerts CASCADE;
TRUNCATE public.disease_reports CASCADE;
TRUNCATE public.diseases CASCADE;

-- ============================================================
-- 1.  RESPIRATORY / UPPER-AIRWAY
-- ============================================================
INSERT INTO public.diseases (name, description, symptoms, precautions, medications, severity, is_communicable, transmission_rate) VALUES

('Common Cold',
 'A mild viral infection of the upper respiratory tract.',
 ARRAY['runny nose','sneezing','sore throat','cough','congestion','mild fever','watery eyes','hoarseness'],
 ARRAY['rest','stay hydrated','wash hands frequently','avoid close contact with sick people'],
 ARRAY['paracetamol','antihistamines','decongestants','vitamin C'],
 'mild', true, 0.85),

('Influenza (Flu)',
 'A contagious respiratory illness caused by influenza viruses.',
 ARRAY['high fever','chills','severe body aches','fatigue','cough','headache','sore throat','runny nose','sweating'],
 ARRAY['get annual flu vaccine','wash hands','stay home when sick','cover coughs and sneezes'],
 ARRAY['oseltamivir (Tamiflu)','paracetamol','ibuprofen','rest and fluids'],
 'moderate', true, 0.70),

('COVID-19',
 'Respiratory illness caused by SARS-CoV-2 coronavirus.',
 ARRAY['dry cough','fever','shortness of breath','fatigue','loss of taste','loss of smell','body aches','sore throat','diarrhea'],
 ARRAY['wear mask','maintain social distance','isolation if positive','get vaccinated','wash hands'],
 ARRAY['paracetamol','antivirals','oxygen therapy for severe cases'],
 'severe', true, 0.95),

('Pneumonia',
 'Infection that inflames air sacs in one or both lungs.',
 ARRAY['chest pain','cough with phlegm','fever','chills','difficulty breathing','fatigue','nausea','vomiting','rapid heartbeat'],
 ARRAY['get vaccinated (pneumococcal vaccine)','quit smoking','avoid sick contacts'],
 ARRAY['amoxicillin','azithromycin','cefuroxime','paracetamol'],
 'severe', true, 0.40),

('Bronchitis',
 'Inflammation of the lining of bronchial tubes.',
 ARRAY['cough with mucus','chest tightness','shortness of breath','mild fever','fatigue','sore throat','wheezing'],
 ARRAY['avoid cigarette smoke','wear a mask in polluted areas','stay hydrated'],
 ARRAY['cough expectorants','bronchodilators','paracetamol'],
 'moderate', true, 0.35),

('Asthma',
 'Chronic condition causing airway inflammation and narrowing.',
 ARRAY['wheezing','shortness of breath','chest tightness','cough (especially at night)','breathlessness on exertion'],
 ARRAY['identify and avoid triggers','keep inhaler handy','monitor peak flow','air purifier indoors'],
 ARRAY['salbutamol inhaler','beclomethasone inhaler','montelukast','corticosteroids'],
 'moderate', false, 0.00),

('Tuberculosis (TB)',
 'Bacterial infection primarily affecting the lungs.',
 ARRAY['persistent cough (3+ weeks)','coughing blood','night sweats','fever','weight loss','fatigue','chest pain','loss of appetite'],
 ARRAY['complete full course of antibiotics','wear mask','improve ventilation','BCG vaccination'],
 ARRAY['isoniazid','rifampicin','ethambutol','pyrazinamide'],
 'critical', true, 0.30),

('Whooping Cough (Pertussis)',
 'Highly contagious bacterial respiratory infection.',
 ARRAY['severe coughing fits','whooping sound when breathing in','runny nose','mild fever','vomiting after coughing','fatigue'],
 ARRAY['vaccination (DTaP)','isolate infected persons','hand hygiene'],
 ARRAY['azithromycin','clarithromycin','trimethoprim-sulfamethoxazole'],
 'severe', true, 0.80),

('Sinusitis',
 'Inflammation of the sinuses due to infection or allergy.',
 ARRAY['facial pain or pressure','nasal congestion','thick nasal discharge','loss of smell','headache','toothache','bad breath'],
 ARRAY['saline nasal irrigation','steam inhalation','stay hydrated','manage allergies'],
 ARRAY['amoxicillin','nasal corticosteroid spray','decongestants','antihistamines'],
 'mild', false, 0.10),

('Tonsillitis',
 'Inflammation of the tonsils caused by infection.',
 ARRAY['sore throat','difficulty swallowing','swollen tonsils','red tonsils','white or yellow patches on tonsils','fever','bad breath','ear pain'],
 ARRAY['rest','gargle warm salt water','avoid cold drinks','avoid close contact'],
 ARRAY['amoxicillin','ibuprofen','paracetamol'],
 'mild', true, 0.50),

-- ============================================================
-- 2.  VECTOR-BORNE / TROPICAL
-- ============================================================

('Malaria',
 'Parasitic disease transmitted by the bite of infected female Anopheles mosquito.',
 ARRAY['high fever','chills','shaking','sweating','headache','nausea','vomiting','muscle pain','anaemia'],
 ARRAY['use mosquito nets','wear long-sleeved clothing','use insect repellent','take antimalarial prophylaxis when travelling'],
 ARRAY['artemether-lumefantrine','chloroquine','primaquine','quinine'],
 'severe', false, 0.00),

('Dengue Fever',
 'Viral disease spread by Aedes mosquitoes in tropical regions.',
 ARRAY['sudden high fever','severe headache','pain behind eyes','joint pain','muscle pain','skin rash','mild bleeding','nausea','fatigue'],
 ARRAY['eliminate standing water','use mosquito repellent','wear protective clothing','window/door screens'],
 ARRAY['paracetamol (avoid NSAIDs)','oral rehydration','platelet transfusion if needed'],
 'severe', false, 0.00),

('Chikungunya',
 'Viral disease transmitted by Aedes mosquitoes.',
 ARRAY['sudden fever','severe joint pain','joint swelling','muscle pain','headache','rash','fatigue'],
 ARRAY['use insect repellent','wear long sleeves','eliminate standing water'],
 ARRAY['paracetamol','naproxen','physiotherapy for joint pain'],
 'moderate', false, 0.00),

('Zika Virus',
 'Viral disease spread by Aedes mosquitoes, dangerous in pregnancy.',
 ARRAY['mild fever','rash','conjunctivitis','joint pain','muscle pain','headache'],
 ARRAY['mosquito protection','condom use','avoid pregnancy while infected'],
 ARRAY['paracetamol','rest','fluids'],
 'mild', true, 0.30),

('Japanese Encephalitis',
 'Viral encephalitis transmitted by Culex mosquitoes.',
 ARRAY['high fever','headache','stiff neck','vomiting','confusion','neurological symptoms','tremors','seizures'],
 ARRAY['get vaccinated','use mosquito repellent','sleep under mosquito net'],
 ARRAY['supportive care','anticonvulsants','corticosteroids'],
 'critical', false, 0.00),

('Leishmaniasis',
 'Parasitic disease spread by the bite of infected sandflies.',
 ARRAY['skin sores','fever','weight loss','enlarged spleen','enlarged liver','anaemia','weakness'],
 ARRAY['insect repellent','protective clothing','fine mesh bed nets','avoid sandfly bites'],
 ARRAY['amphotericin B','miltefosine','sodium stibogluconate'],
 'severe', false, 0.00),

-- ============================================================
-- 3.  GASTROINTESTINAL / DIGESTIVE
-- ============================================================

('Food Poisoning',
 'Illness caused by consuming contaminated food or water.',
 ARRAY['nausea','vomiting','diarrhea','stomach cramps','fever','musculoskeletal weakness'],
 ARRAY['eat thoroughly cooked food','refrigerate food properly','wash hands before eating','avoid raw shellfish'],
 ARRAY['oral rehydration salts','probiotics','antiemetics','antibiotics if bacterial'],
 'mild', false, 0.00),

('Cholera',
 'Acute diarrheal infection caused by Vibrio cholerae.',
 ARRAY['profuse watery diarrhea','vomiting','leg cramps','dehydration','rapid heart rate','low blood pressure','thirst'],
 ARRAY['drink safe water','proper food hygiene','hand washing','oral cholera vaccine'],
 ARRAY['oral rehydration solution','doxycycline','azithromycin','IV fluids in severe cases'],
 'critical', true, 0.60),

('Typhoid Fever',
 'Bacteral infection caused by Salmonella typhi.',
 ARRAY['prolonged high fever','fatigue','stomach pain','constipation','headache','loss of appetite','rose spots on skin','diarrhea'],
 ARRAY['drink treated water','proper food sanitation','hand washing','typhoid vaccination'],
 ARRAY['ciprofloxacin','azithromycin','ceftriaxone'],
 'moderate', true, 0.20),

('Hepatitis A',
 'Highly contagious liver infection caused by the hepatitis A virus.',
 ARRAY['fatigue','nausea','abdominal pain','loss of appetite','jaundice','dark urine','pale stools','low grade fever','itching'],
 ARRAY['hepatitis A vaccination','wash hands','avoid contaminated food and water'],
 ARRAY['supportive care','rest','adequate nutrition','avoid alcohol'],
 'moderate', true, 0.45),

('Hepatitis B',
 'Serious liver infection caused by the hepatitis B virus.',
 ARRAY['abdominal pain','dark urine','jaundice','joint pain','nausea','vomiting','weakness','fatigue'],
 ARRAY['get vaccinated','use protection during sex','do not share needles','screen blood products'],
 ARRAY['tenofovir','entecavir','pegylated interferon alfa'],
 'severe', true, 0.50),

('Hepatitis C',
 'Liver disease caused by hepatitis C virus, often chronic.',
 ARRAY['jaundice','fatigue','abdominal pain','nausea','clay-colored stools','dark urine','loss of appetite'],
 ARRAY['do not share needles','ensure sterile medical equipment','screening'],
 ARRAY['sofosbuvir','ledipasvir','glecaprevir','pibrentasvir'],
 'severe', true, 0.40),

('Gastroenteritis',
 'Inflammation of stomach and intestines, commonly called stomach flu.',
 ARRAY['diarrhea','vomiting','stomach cramps','nausea','mild fever','headache','muscle aches'],
 ARRAY['hand washing','safe food handling','rotavirus vaccine for infants'],
 ARRAY['oral rehydration salts','ondansetron','probiotics'],
 'mild', true, 0.55),

('Peptic Ulcer',
 'Sores that develop on the lining of the stomach or small intestine.',
 ARRAY['burning stomach pain','nausea','loss of appetite','bloating','burping','weight loss','vomiting blood','dark tarry stools'],
 ARRAY['avoid NSAIDs','avoid alcohol','eat smaller meals','avoid spicy food','manage H. pylori'],
 ARRAY['proton pump inhibitors','antacids','amoxicillin (for H. pylori)','clarithromycin'],
 'moderate', false, 0.00),

('Appendicitis',
 'Inflammation of the appendix, requiring urgent surgical attention.',
 ARRAY['sudden pain around navel','pain moving to lower right abdomen','nausea','vomiting','fever','loss of appetite','abdominal bloating','pain on walking'],
 ARRAY['seek immediate medical care','do not apply heat to abdomen','avoid pain killers before diagnosis'],
 ARRAY['surgical removal (appendectomy)','IV antibiotics pre-surgery'],
 'critical', false, 0.00),

-- ============================================================
-- 4.  SKIN / DERMATOLOGICAL
-- ============================================================

('Chickenpox (Varicella)',
 'Highly contagious viral infection causing itchy blister rash.',
 ARRAY['itchy blister rash','fever','tiredness','loss of appetite','headache','red spots on skin','scabbing'],
 ARRAY['vaccination','isolate infected person','trim nails short','cool baths with baking soda'],
 ARRAY['acyclovir','calamine lotion','antihistamines','paracetamol'],
 'moderate', true, 0.90),

('Measles',
 'Highly contagious viral infection spread by respiratory droplets.',
 ARRAY['high fever','cough','runny nose','red eyes','white spots in mouth (Koplik spots)','skin rash starting on face','sensitivity to light'],
 ARRAY['MMR vaccination','isolate for 4 days after rash appears','Vitamin A supplementation'],
 ARRAY['paracetamol','Vitamin A','supportive care'],
 'severe', true, 0.90),

('Scabies',
 'Skin infestation caused by the mite Sarcoptes scabiei.',
 ARRAY['intense itching (worse at night)','thin irregular burrow lines','skin rash','sores from scratching','blisters'],
 ARRAY['treat all household members','wash bedding in hot water','avoid skin-to-skin contact with infected person'],
 ARRAY['permethrin cream','ivermectin','antihistamines for itching'],
 'mild', true, 0.60),

('Ringworm (Tinea)',
 'Fungal skin infection causing ring-shaped rash.',
 ARRAY['ring-shaped skin rash','itching','scaly skin','redness','circular patches','hair loss in affected area'],
 ARRAY['keep skin clean and dry','do not share personal items','wear sandals in public showers'],
 ARRAY['clotrimazole cream','terbinafine','miconazole','fluconazole (oral)'],
 'mild', true, 0.40),

('Psoriasis',
 'Autoimmune condition causing rapid skin cell buildup.',
 ARRAY['red patches with silvery scales','dry cracked skin','itching','burning','soreness','thick nails','joint swelling'],
 ARRAY['keep skin moisturized','avoid triggers (stress/alcohol)','avoid scratching'],
 ARRAY['topical corticosteroids','vitamin D analogs','methotrexate','biologics'],
 'moderate', false, 0.00),

('Eczema (Atopic Dermatitis)',
 'Chronic skin condition causing inflammation and itching.',
 ARRAY['itching','dry skin','redness','skin rash','small raised bumps','thickened skin','raw skin from scratching'],
 ARRAY['moisturize skin regularly','avoid triggers','use mild soaps','avoid overheating'],
 ARRAY['topical corticosteroids','calcineurin inhibitors','antihistamines','dupilumab'],
 'mild', false, 0.00),

('Leprosy (Hansens Disease)',
 'Chronic infection caused by Mycobacterium leprae affecting skin and nerves.',
 ARRAY['pale or reddish skin patches','decreased sensation in patches','muscle weakness','numbness in hands and feet','eye problems','nasal congestion'],
 ARRAY['early diagnosis and treatment','avoid close contact with untreated patient','complete multidrug therapy'],
 ARRAY['dapsone','rifampicin','clofazimine (multidrug therapy)'],
 'severe', true, 0.10),

-- ============================================================
-- 5.  NEUROLOGICAL
-- ============================================================

('Migraine',
 'Neurological condition causing severe recurring headaches.',
 ARRAY['throbbing headache (one side)','nausea','vomiting','sensitivity to light','sensitivity to sound','visual aura','dizziness'],
 ARRAY['identify and avoid triggers','regular sleep schedule','manage stress','stay hydrated'],
 ARRAY['sumatriptan','rizatriptan','ibuprofen','paracetamol','topiramate (preventive)'],
 'moderate', false, 0.00),

('Meningitis',
 'Inflammation of membranes surrounding the brain and spinal cord.',
 ARRAY['severe headache','stiff neck','high fever','sensitivity to light','sensitivity to sound','nausea','vomiting','confusion','seizures'],
 ARRAY['meningococcal vaccination','avoid sharing utensils','wash hands','seek emergency care immediately'],
 ARRAY['penicillin','ceftriaxone','dexamethasone','supportive ICU care'],
 'critical', true, 0.25),

('Epilepsy',
 'Neurological disorder causing recurrent unprovoked seizures.',
 ARRAY['recurrent seizures','temporary confusion','staring spells','loss of consciousness','uncontrollable jerking','fear and anxiety before seizure'],
 ARRAY['take medications as prescribed','avoid triggers (flashing lights/alcohol)','wear medical ID','do not drive during uncontrolled seizures'],
 ARRAY['sodium valproate','lamotrigine','levetiracetam','carbamazepine'],
 'moderate', false, 0.00),

('Stroke',
 'Brain cell damage caused by interrupted blood supply.',
 ARRAY['sudden numbness in face/arm/leg','confusion','trouble speaking','vision problems','severe headache','loss of balance','dizziness'],
 ARRAY['control blood pressure','quit smoking','control diabetes','seek emergency help immediately (FAST)'],
 ARRAY['tPA (clot-buster)','aspirin','anticoagulants','blood pressure medications','rehab therapy'],
 'critical', false, 0.00),

('Parkinson''s Disease',
 'Progressive nervous system disorder affecting movement.',
 ARRAY['tremors','muscle stiffness','slowness of movement','impaired balance','speech changes','writing changes','masked face'],
 ARRAY['regular exercise','physical and occupational therapy','fall prevention measures'],
 ARRAY['levodopa-carbidopa','dopamine agonists','MAO-B inhibitors'],
 'severe', false, 0.00),

-- ============================================================
-- 6.  CARDIOVASCULAR / METABOLIC
-- ============================================================

('Type 2 Diabetes',
 'Chronic condition affecting regulation of blood sugar (glucose).',
 ARRAY['increased thirst','frequent urination','increased hunger','fatigue','blurred vision','slow healing of wounds','frequent infections','numbness in hands/feet','dark skin patches'],
 ARRAY['eat healthy diet','exercise regularly','monitor blood sugar','maintain healthy weight','quit smoking'],
 ARRAY['metformin','sitagliptin','empagliflozin','insulin','glipizide'],
 'moderate', false, 0.00),

('Hypertension',
 'Chronic condition with persistently elevated blood pressure.',
 ARRAY['severe headache','shortness of breath','nosebleeds','flushing','dizziness','chest pain','visual changes (in hypertensive crisis)'],
 ARRAY['reduce salt intake','exercise regularly','maintain healthy weight','limit alcohol','quit smoking','manage stress'],
 ARRAY['amlodipine','lisinopril','losartan','hydrochlorothiazide','atenolol'],
 'moderate', false, 0.00),

('Coronary Artery Disease',
 'Narrowing of arteries supplying blood to the heart.',
 ARRAY['chest pain (angina)','shortness of breath','heart attack symptoms','fatigue','weakness'],
 ARRAY['eat heart-healthy diet','exercise regularly','quit smoking','control cholesterol and blood pressure'],
 ARRAY['aspirin','statins','nitroglycerin','beta-blockers','ACE inhibitors'],
 'severe', false, 0.00),

('Heart Failure',
 'Condition where the heart does not pump blood efficiently.',
 ARRAY['shortness of breath','fatigue','swollen legs and ankles','rapid heartbeat','reduced ability to exercise','persistent cough','weight gain from fluid retention'],
 ARRAY['limit salt and fluid intake','weigh yourself daily','take medications as prescribed','avoid alcohol'],
 ARRAY['furosemide','spironolactone','enalapril','carvedilol','digoxin'],
 'critical', false, 0.00),

('Anaemia',
 'Deficiency of healthy red blood cells or haemoglobin.',
 ARRAY['fatigue','weakness','pale skin','shortness of breath','dizziness','cold hands and feet','irregular heartbeat','headache'],
 ARRAY['eat iron-rich foods','vitamin C to improve iron absorption','treat underlying cause'],
 ARRAY['iron supplements','folic acid','vitamin B12 injections','erythropoietin'],
 'moderate', false, 0.00),

('Hypothyroidism',
 'Underactive thyroid gland producing insufficient thyroid hormone.',
 ARRAY['fatigue','weight gain','cold intolerance','constipation','dry skin','puffy face','muscle weakness','slowed heart rate','depression'],
 ARRAY['regular thyroid function tests','take medication consistently','avoid excessive iodine intake'],
 ARRAY['levothyroxine'],
 'moderate', false, 0.00),

('Hyperthyroidism',
 'Overactive thyroid gland producing excessive thyroid hormone.',
 ARRAY['weight loss','rapid heartbeat','anxiety','tremors','sweating','heat intolerance','increased appetite','frequent bowel movements','enlarged thyroid (goiter)'],
 ARRAY['regular thyroid monitoring','avoid excess iodine','manage stress'],
 ARRAY['carbimazole','propylthiouracil','propranolol','radioiodine therapy'],
 'moderate', false, 0.00),

-- ============================================================
-- 7.  INFECTIOUS / BACTERIAL
-- ============================================================

('HIV/AIDS',
 'Viral infection attacking the body''s immune system.',
 ARRAY['flu-like illness in early stage','fever','swollen lymph nodes','sore throat','rash','night sweats','weight loss','chronic diarrhea','opportunistic infections'],
 ARRAY['use condoms','do not share needles','PrEP for high-risk individuals','regular HIV testing'],
 ARRAY['antiretroviral therapy (ART)','tenofovir','emtricitabine','dolutegravir'],
 'critical', true, 0.60),

('Rabies',
 'Fatal viral disease spread through bites of infected animals.',
 ARRAY['fever','headache','anxiety','confusion','agitation','hallucinations','excess salivation','fear of water (hydrophobia)','paralysis'],
 ARRAY['vaccinate pets','avoid stray animals','get post-exposure prophylaxis immediately after bite'],
 ARRAY['rabies post-exposure prophylaxis (PEP)','rabies immunoglobulin','wound cleaning'],
 'critical', false, 0.00),

('Leptospirosis',
 'Bacterial infection spread through animal urine and contaminated water.',
 ARRAY['high fever','headache','muscle aches','vomiting','jaundice','red eyes','abdominal pain','diarrhea','rash'],
 ARRAY['avoid floodwater','cover wounds','rodent control','protective clothing'],
 ARRAY['doxycycline','amoxicillin','penicillin G','ceftriaxone'],
 'severe', false, 0.00),

('Tetanus',
 'Bacterial infection causing muscle stiffness due to nerve toxins.',
 ARRAY['jaw cramping (lockjaw)','muscle spasms','stiffness','difficulty swallowing','seizures','headache','fever','sweating'],
 ARRAY['tetanus vaccination','clean all wounds promptly','booster shot every 10 years'],
 ARRAY['tetanus immunoglobulin','metronidazole','diazepam for spasms','magnesium'],
 'critical', false, 0.00),

('Urinary Tract Infection (UTI)',
 'Infection in any part of the urinary system.',
 ARRAY['burning sensation when urinating','frequent urination','cloudy urine','blood in urine','strong urine odor','pelvic pain','lower back pain','fever'],
 ARRAY['drink plenty of water','urinate after sex','wipe from front to back','avoid irritating feminine products'],
 ARRAY['nitrofurantoin','trimethoprim-sulfamethoxazole','ciprofloxacin','fosfomycin'],
 'mild', false, 0.00),

('Gonorrhoea',
 'Sexually transmitted bacterial infection.',
 ARRAY['burning urination','discharge','testicular pain','pelvic pain','rectal pain','sore throat'],
 ARRAY['use condoms','regular STI testing','limit number of sexual partners'],
 ARRAY['ceftriaxone','azithromycin','dual antibiotic therapy'],
 'moderate', true, 0.70),

('Syphilis',
 'Sexually transmitted bacterial infection with multiple stages.',
 ARRAY['painless sore (chancre)','rash on palms and soles','flu-like symptoms','swollen lymph nodes','fatigue','neurological symptoms in late stage'],
 ARRAY['use condoms','regular STI screening','contact tracing and treatment'],
 ARRAY['benzathine penicillin G','doxycycline (if allergic)','ceftriaxone'],
 'severe', true, 0.60),

('Brucellosis',
 'Bacterial infection transmitted from animals to humans.',
 ARRAY['fever','sweating','headache','back pain','muscle pain','joint pain','fatigue','loss of appetite'],
 ARRAY['pasteurize milk and dairy','protective equipment around livestock','avoid raw animal products'],
 ARRAY['doxycycline','rifampicin','co-trimoxazole'],
 'moderate', false, 0.00),

-- ============================================================
-- 8.  MUSCULOSKELETAL / JOINT
-- ============================================================

('Rheumatoid Arthritis',
 'Autoimmune and inflammatory disease affecting joints.',
 ARRAY['joint pain','joint swelling','joint stiffness (morning)','loss of joint function','fatigue','fever','loss of appetite','symmetrical joint involvement'],
 ARRAY['regular exercise','physical therapy','protect joints','stay at healthy weight'],
 ARRAY['methotrexate','hydroxychloroquine','sulfasalazine','biologics (adalimumab)','NSAIDs'],
 'moderate', false, 0.00),

('Osteoarthritis',
 'Degenerative joint disease caused by wear and tear of cartilage.',
 ARRAY['joint pain','stiffness after rest','swollen joints','bone spurs','decreased range of motion','grating sensation in joint'],
 ARRAY['maintain healthy weight','low-impact exercise','physical therapy','joint protection'],
 ARRAY['paracetamol','ibuprofen','diclofenac gel','glucosamine','corticosteroid injections'],
 'moderate', false, 0.00),

('Gout',
 'Inflammatory arthritis caused by uric acid crystal deposits in joints.',
 ARRAY['sudden severe joint pain','joint redness','joint swelling','joint warmth','limited range of motion','pain often in big toe'],
 ARRAY['limit purine-rich foods','avoid alcohol','stay hydrated','maintain healthy weight'],
 ARRAY['colchicine','indomethacin','allopurinol','febuxostat'],
 'moderate', false, 0.00),

-- ============================================================
-- 9.  MENTAL HEALTH
-- ============================================================

('Depression',
 'Mood disorder causing persistent sadness and loss of interest.',
 ARRAY['persistent sadness','hopelessness','loss of interest in activities','fatigue','sleep disturbances','appetite changes','weight changes','difficulty concentrating','suicidal thoughts'],
 ARRAY['seek professional help','regular exercise','maintain social connections','adequate sleep','therapy'],
 ARRAY['sertraline','fluoxetine','escitalopram','venlafaxine','therapy (CBT)'],
 'moderate', false, 0.00),

('Anxiety Disorder',
 'Condition of excessive, persistent worry affecting daily life.',
 ARRAY['excessive worry','restlessness','fatigue','difficulty concentrating','irritability','muscle tension','sleep problems','rapid heartbeat','shortness of breath'],
 ARRAY['seek professional help','practice mindfulness','regular exercise','limit caffeine','therapy'],
 ARRAY['sertraline','escitalopram','buspirone','benzodiazepines (short-term)','CBT therapy'],
 'moderate', false, 0.00),

-- ============================================================
-- 10. OTHER SYSTEMIC
-- ============================================================

('Kidney Stones',
 'Hard deposits of minerals and salts inside the kidneys.',
 ARRAY['severe side pain','pain below ribs','pain radiating to groin','pain during urination','pink or red urine','nausea','vomiting','frequent urination'],
 ARRAY['drink plenty of water','limit salt and animal protein','maintain healthy weight','limit high-oxalate foods'],
 ARRAY['pain relief (NSAIDs)','alpha blockers','potassium citrate','surgical removal for large stones'],
 'moderate', false, 0.00),

('Pancreatitis',
 'Inflammation of the pancreas.',
 ARRAY['upper abdominal pain radiating to back','nausea','vomiting','fever','rapid pulse','abdominal tenderness','oily stools'],
 ARRAY['avoid alcohol','low-fat diet','small frequent meals','stay hydrated'],
 ARRAY['pain relief','IV fluids','antibiotics if infected','enzyme supplements (chronic)'],
 'severe', false, 0.00),

('Lupus (SLE)',
 'Autoimmune disease where the body attacks its own tissues.',
 ARRAY['butterfly-shaped facial rash','joint pain','joint swelling','fatigue','fever','hair loss','skin lesions','chest pain','sensitivity to sunlight','kidney problems'],
 ARRAY['avoid sun exposure','use sunscreen','adequate rest','stress management','regular monitoring'],
 ARRAY['hydroxychloroquine','corticosteroids','mycophenolate','belimumab'],
 'severe', false, 0.00),

('Celiac Disease',
 'Autoimmune disorder triggered by gluten consumption.',
 ARRAY['diarrhea','bloating','gas','abdominal pain','fatigue','weight loss','nausea','vomiting','constipation','pale stools'],
 ARRAY['strict gluten-free diet','read food labels carefully','avoid cross-contamination'],
 ARRAY['strict gluten-free diet (treatment)','vitamin and mineral supplements'],
 'moderate', false, 0.00),

('Anaphylaxis',
 'Severe, life-threatening allergic reaction.',
 ARRAY['skin rash','hives','swelling of throat','rapid heartbeat','drop in blood pressure','nausea','vomiting','feeling faint','difficulty breathing','loss of consciousness'],
 ARRAY['carry epinephrine auto-injector','identify and avoid triggers','wear medical alert bracelet'],
 ARRAY['epinephrine (adrenaline) auto-injector','antihistamines','corticosteroids','oxygen'],
 'critical', false, 0.00),

('Chronic Kidney Disease',
 'Gradual loss of kidney function over time.',
 ARRAY['nausea','fatigue','decreased urine output','fluid retention','shortness of breath','confusion','chest pain','high blood pressure','anaemia'],
 ARRAY['control blood pressure','control blood sugar','limit protein intake','stop smoking','regular kidney function tests'],
 ARRAY['ACE inhibitors','ARBs','erythropoietin','phosphate binders','dialysis (advanced)'],
 'severe', false, 0.00),

('Osteoporosis',
 'Condition of weak, fragile bones prone to fractures.',
 ARRAY['back pain','loss of height','stooped posture','bone fracture from mild stress','brittle nails'],
 ARRAY['calcium and vitamin D intake','weight-bearing exercise','quit smoking','limit alcohol','fall prevention'],
 ARRAY['alendronate','risedronate','calcium supplements','vitamin D supplements','denosumab'],
 'moderate', false, 0.00);


-- ============================================================
-- SAMPLE DISEASE REPORTS (for Disease Map and Alerts tabs)
-- These simulate case reports from various Indian states.
-- ============================================================

DO $$
DECLARE
  dengue_id UUID;
  malaria_id UUID;
  cholera_id UUID;
  flu_id UUID;
  corona_id UUID;
  typhoid_id UUID;
  chikungunya_id UUID;
BEGIN
  SELECT id INTO dengue_id    FROM public.diseases WHERE name = 'Dengue Fever'      LIMIT 1;
  SELECT id INTO malaria_id   FROM public.diseases WHERE name = 'Malaria'            LIMIT 1;
  SELECT id INTO cholera_id   FROM public.diseases WHERE name = 'Cholera'            LIMIT 1;
  SELECT id INTO flu_id       FROM public.diseases WHERE name = 'Influenza (Flu)'    LIMIT 1;
  SELECT id INTO corona_id    FROM public.diseases WHERE name = 'COVID-19'           LIMIT 1;
  SELECT id INTO typhoid_id   FROM public.diseases WHERE name = 'Typhoid Fever'      LIMIT 1;
  SELECT id INTO chikungunya_id FROM public.diseases WHERE name = 'Chikungunya'      LIMIT 1;

  -- Dengue cluster in Maharashtra (Mumbai area)
  INSERT INTO public.disease_reports (disease_id, symptoms_reported, location_lat, location_lng, city, state, confidence_score, reported_at)
  SELECT dengue_id, ARRAY['sudden high fever','headache','joint pain','skin rash'],
         19.0760 + (random()-0.5)*0.5, 72.8777 + (random()-0.5)*0.5,
         'Mumbai', 'Maharashtra', 78 + random()*20,
         NOW() - (random()*14 || ' days')::interval
  FROM generate_series(1,18);

  -- Malaria cluster in Odisha
  INSERT INTO public.disease_reports (disease_id, symptoms_reported, location_lat, location_lng, city, state, confidence_score, reported_at)
  SELECT malaria_id, ARRAY['high fever','chills','sweating','nausea'],
         20.9517 + (random()-0.5)*1.0, 85.0985 + (random()-0.5)*1.0,
         'Bhubaneswar', 'Odisha', 70 + random()*25,
         NOW() - (random()*20 || ' days')::interval
  FROM generate_series(1,14);

  -- Cholera cluster in West Bengal
  INSERT INTO public.disease_reports (disease_id, symptoms_reported, location_lat, location_lng, city, state, confidence_score, reported_at)
  SELECT cholera_id, ARRAY['profuse diarrhea','vomiting','dehydration'],
         22.5726 + (random()-0.5)*0.5, 88.3639 + (random()-0.5)*0.5,
         'Kolkata', 'West Bengal', 65 + random()*25,
         NOW() - (random()*10 || ' days')::interval
  FROM generate_series(1,12);

  -- Flu cases across Delhi
  INSERT INTO public.disease_reports (disease_id, symptoms_reported, location_lat, location_lng, city, state, confidence_score, reported_at)
  SELECT flu_id, ARRAY['fever','chills','body aches','cough'],
         28.7041 + (random()-0.5)*0.4, 77.1025 + (random()-0.5)*0.4,
         'Delhi', 'Delhi', 72 + random()*20,
         NOW() - (random()*7 || ' days')::interval
  FROM generate_series(1,20);

  -- COVID cases in Tamil Nadu (Chennai)
  INSERT INTO public.disease_reports (disease_id, symptoms_reported, location_lat, location_lng, city, state, confidence_score, reported_at)
  SELECT corona_id, ARRAY['dry cough','fever','loss of smell','fatigue'],
         13.0827 + (random()-0.5)*0.5, 80.2707 + (random()-0.5)*0.5,
         'Chennai', 'Tamil Nadu', 80 + random()*15,
         NOW() - (random()*14 || ' days')::interval
  FROM generate_series(1,16);

  -- Typhoid cases in Uttar Pradesh (Lucknow)
  INSERT INTO public.disease_reports (disease_id, symptoms_reported, location_lat, location_lng, city, state, confidence_score, reported_at)
  SELECT typhoid_id, ARRAY['prolonged fever','fatigue','stomach pain'],
         26.8467 + (random()-0.5)*0.5, 80.9462 + (random()-0.5)*0.5,
         'Lucknow', 'Uttar Pradesh', 68 + random()*22,
         NOW() - (random()*15 || ' days')::interval
  FROM generate_series(1,11);

  -- Chikungunya cases in Karnataka (Bengaluru)
  INSERT INTO public.disease_reports (disease_id, symptoms_reported, location_lat, location_lng, city, state, confidence_score, reported_at)
  SELECT chikungunya_id, ARRAY['sudden fever','severe joint pain','rash','fatigue'],
         12.9716 + (random()-0.5)*0.4, 77.5946 + (random()-0.5)*0.4,
         'Bengaluru', 'Karnataka', 71 + random()*20,
         NOW() - (random()*10 || ' days')::interval
  FROM generate_series(1,13);

END $$;


-- ============================================================
-- EPIDEMIC ALERTS (derived from the above reports)
-- ============================================================

INSERT INTO public.epidemic_alerts (disease_id, region, case_count, threshold_exceeded, alert_level, updated_at)
SELECT d.id, 'Maharashtra', 18, true, 'high', NOW()
FROM public.diseases d WHERE d.name = 'Dengue Fever';

INSERT INTO public.epidemic_alerts (disease_id, region, case_count, threshold_exceeded, alert_level, updated_at)
SELECT d.id, 'Odisha', 14, true, 'medium', NOW()
FROM public.diseases d WHERE d.name = 'Malaria';

INSERT INTO public.epidemic_alerts (disease_id, region, case_count, threshold_exceeded, alert_level, updated_at)
SELECT d.id, 'West Bengal', 12, true, 'medium', NOW()
FROM public.diseases d WHERE d.name = 'Cholera';

INSERT INTO public.epidemic_alerts (disease_id, region, case_count, threshold_exceeded, alert_level, updated_at)
SELECT d.id, 'Delhi', 20, true, 'high', NOW()
FROM public.diseases d WHERE d.name = 'Influenza (Flu)';

INSERT INTO public.epidemic_alerts (disease_id, region, case_count, threshold_exceeded, alert_level, updated_at)
SELECT d.id, 'Tamil Nadu', 16, true, 'medium', NOW()
FROM public.diseases d WHERE d.name = 'COVID-19';

INSERT INTO public.epidemic_alerts (disease_id, region, case_count, threshold_exceeded, alert_level, updated_at)
SELECT d.id, 'Uttar Pradesh', 11, true, 'low', NOW()
FROM public.diseases d WHERE d.name = 'Typhoid Fever';

INSERT INTO public.epidemic_alerts (disease_id, region, case_count, threshold_exceeded, alert_level, updated_at)
SELECT d.id, 'Karnataka', 13, true, 'medium', NOW()
FROM public.diseases d WHERE d.name = 'Chikungunya';
