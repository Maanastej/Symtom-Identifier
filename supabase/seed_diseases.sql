-- ============================================================
-- Expanded seed data for diseases table - ENHANCED DATASET
-- A comprehensive, highly detailed medical dataset covering
-- various conditions including respiratory, infectious, digestive,
-- neurological, skin, metabolic, and vector-borne diseases.
-- Run this in your Supabase SQL editor (Project -> SQL Editor).
-- ============================================================

-- Clear existing data so re-runs are idempotent
TRUNCATE public.epidemic_alerts CASCADE;
TRUNCATE public.disease_reports CASCADE;
TRUNCATE public.diseases CASCADE;

INSERT INTO public.diseases (name, description, symptoms, precautions, medications, severity, is_communicable, transmission_rate) VALUES

-- RESPIRATORY
('Common Cold', 'Mild viral infection of the upper respiratory tract.', ARRAY['runny nose', 'sneezing', 'sore throat', 'cough', 'congestion', 'mild fever', 'watery eyes', 'hoarseness', 'post-nasal drip'], ARRAY['rest', 'stay hydrated', 'wash hands frequently', 'avoid close contact with sick people'], ARRAY['paracetamol', 'antihistamines', 'decongestants', 'vitamin C'], 'mild', true, 0.85),
('Influenza (Flu)', 'Contagious respiratory illness caused by influenza viruses.', ARRAY['high fever', 'chills', 'severe body aches', 'fatigue', 'dry cough', 'headache', 'sore throat', 'runny nose', 'sweating'], ARRAY['get annual flu vaccine', 'wash hands', 'stay home when sick', 'cover coughs and sneezes'], ARRAY['oseltamivir (Tamiflu)', 'paracetamol', 'ibuprofen', 'rest and fluids'], 'moderate', true, 0.70),
('COVID-19', 'Respiratory illness caused by SARS-CoV-2 coronavirus.', ARRAY['dry cough', 'fever', 'shortness of breath', 'fatigue', 'loss of taste', 'loss of smell', 'body aches', 'sore throat', 'diarrhea', 'chest pressure'], ARRAY['wear mask', 'maintain social distance', 'isolation if positive', 'get vaccinated', 'wash hands'], ARRAY['paracetamol', 'antivirals', 'corticosteroids', 'oxygen therapy for severe cases'], 'severe', true, 0.95),
('Pneumonia', 'Infection that inflames air sacs in one or both lungs.', ARRAY['chest pain when breathing', 'cough with greenish phlegm', 'fever', 'chills', 'difficulty breathing', 'fatigue', 'nausea', 'rapid heartbeat', 'confusion (in elderly)'], ARRAY['get vaccinated (pneumococcal vaccine)', 'quit smoking', 'avoid sick contacts', 'practice good hygiene'], ARRAY['amoxicillin', 'azithromycin', 'cefuroxime', 'paracetamol', 'ibuprofen'], 'severe', true, 0.40),
('Bronchitis', 'Inflammation of the lining of bronchial tubes.', ARRAY['cough with clear or yellow mucus', 'chest tightness', 'shortness of breath', 'mild fever', 'fatigue', 'sore throat', 'wheezing'], ARRAY['avoid cigarette smoke', 'wear a mask in polluted areas', 'stay hydrated', 'use a humidifier'], ARRAY['cough expectorants', 'bronchodilators', 'paracetamol', 'ibuprofen'], 'moderate', true, 0.35),
('Asthma', 'Chronic condition causing airway inflammation and narrowing.', ARRAY['wheezing', 'shortness of breath', 'chest tightness', 'cough (especially at night)', 'breathlessness on exertion', 'rapid breathing'], ARRAY['identify and avoid triggers', 'keep inhaler handy', 'monitor peak flow', 'air purifier indoors'], ARRAY['salbutamol inhaler', 'beclomethasone inhaler', 'montelukast', 'oral corticosteroids'], 'moderate', false, 0.00),
('Tuberculosis (TB)', 'Bacterial infection primarily affecting the lungs.', ARRAY['persistent cough (3+ weeks)', 'coughing blood', 'night sweats', 'fever', 'unexplained weight loss', 'fatigue', 'chest pain', 'loss of appetite'], ARRAY['complete full course of antibiotics', 'wear mask', 'improve room ventilation', 'BCG vaccination'], ARRAY['isoniazid', 'rifampicin', 'ethambutol', 'pyrazinamide'], 'critical', true, 0.30),

-- VECTOR-BORNE
('Malaria', 'Parasitic disease transmitted by the bite of infected female Anopheles mosquito.', ARRAY['high fever', 'chills', 'shaking', 'profuse sweating', 'headache', 'nausea', 'vomiting', 'muscle pain', 'anaemia', 'jaundice'], ARRAY['use mosquito nets', 'wear long-sleeved clothing', 'use DEET insect repellent', 'take antimalarial prophylaxis'], ARRAY['artemether-lumefantrine', 'chloroquine', 'primaquine', 'quinine'], 'severe', false, 0.00),
('Dengue Fever', 'Viral disease spread by Aedes mosquitoes in tropical regions.', ARRAY['sudden high fever', 'severe headache', 'pain behind eyes', 'severe joint pain', 'muscle pain', 'skin rash', 'mild bleeding (nose/gums)', 'nausea', 'extreme fatigue'], ARRAY['eliminate standing water', 'use mosquito repellent', 'wear protective clothing', 'window/door screens'], ARRAY['paracetamol (avoid NSAIDs)', 'oral rehydration', 'IV fluids', 'platelet transfusion if needed'], 'severe', false, 0.00),
('Chikungunya', 'Viral disease transmitted by Aedes mosquitoes.', ARRAY['sudden fever', 'severe debilitating joint pain', 'joint swelling', 'muscle pain', 'headache', 'maculopapular rash', 'fatigue'], ARRAY['use insect repellent', 'wear long sleeves', 'eliminate standing water'], ARRAY['paracetamol', 'naproxen', 'ibuprofen', 'physiotherapy for joint pain'], 'moderate', false, 0.00),
('Lyme Disease', 'Bacterial infection spread by black-legged ticks.', ARRAY['bullseye rash (erythema migrans)', 'fever', 'chills', 'fatigue', 'body aches', 'swollen lymph nodes', 'joint pain', 'neurological problems'], ARRAY['wear long pants in wooded areas', 'use tick repellent', 'check body for ticks daily', 'remove ticks promptly'], ARRAY['doxycycline', 'amoxicillin', 'cefuroxime axetil'], 'moderate', false, 0.00),

-- GASTROINTESTINAL
('Food Poisoning', 'Illness caused by consuming contaminated food or water.', ARRAY['nausea', 'vomiting', 'watery diarrhea', 'stomach cramps', 'mild fever', 'weakness', 'loss of appetite'], ARRAY['eat thoroughly cooked food', 'refrigerate food properly', 'wash hands before eating', 'avoid raw shellfish'], ARRAY['oral rehydration salts', 'probiotics', 'antiemetics (ondansetron)', 'antibiotics if severe bacterial'], 'mild', false, 0.00),
('Cholera', 'Acute diarrheal infection caused by Vibrio cholerae.', ARRAY['profuse watery diarrhea (rice-water stools)', 'vomiting', 'severe leg cramps', 'rapid dehydration', 'rapid heart rate', 'low blood pressure', 'extreme thirst'], ARRAY['drink safe treated water', 'proper food hygiene', 'hand washing with soap', 'oral cholera vaccine'], ARRAY['oral rehydration solution (ORS)', 'doxycycline', 'azithromycin', 'IV fluids in severe cases'], 'critical', true, 0.60),
('Typhoid Fever', 'Bacterial infection caused by Salmonella typhi.', ARRAY['prolonged high fever', 'extreme fatigue', 'stomach pain', 'constipation', 'headache', 'loss of appetite', 'rose spots on skin', 'diarrhea (later stage)'], ARRAY['drink treated water', 'proper food sanitation', 'hand washing', 'typhoid vaccination'], ARRAY['ciprofloxacin', 'azithromycin', 'ceftriaxone'], 'moderate', true, 0.20),
('Gastroenteritis (Stomach Flu)', 'Inflammation of stomach and intestines.', ARRAY['watery diarrhea', 'vomiting', 'stomach cramps', 'nausea', 'low-grade fever', 'headache', 'muscle aches'], ARRAY['strict hand washing', 'safe food handling', 'rotavirus vaccine for infants', 'disinfect contaminated surfaces'], ARRAY['oral rehydration salts', 'ondansetron', 'loperamide', 'probiotics'], 'mild', true, 0.55),
('Peptic Ulcer', 'Sores that develop on the lining of the stomach or small intestine.', ARRAY['burning stomach pain', 'feeling of fullness', 'bloating', 'burping', 'intolerance to fatty foods', 'heartburn', 'nausea', 'dark tarry stools'], ARRAY['avoid NSAIDs', 'avoid alcohol', 'eat smaller meals', 'avoid spicy food', 'quit smoking'], ARRAY['omeprazole', 'pantoprazole', 'antacids', 'amoxicillin (for H. pylori)'], 'moderate', false, 0.00),

-- SKIN / DERMATOLOGICAL
('Chickenpox (Varicella)', 'Highly contagious viral infection causing itchy blister rash.', ARRAY['itchy blister rash', 'fever', 'tiredness', 'loss of appetite', 'headache', 'red spots on skin', 'scabbing'], ARRAY['varicella vaccination', 'isolate infected person', 'trim nails short', 'cool baths with baking soda'], ARRAY['acyclovir', 'calamine lotion', 'antihistamines', 'paracetamol'], 'moderate', true, 0.90),
('Measles', 'Highly contagious viral infection spread by respiratory droplets.', ARRAY['high fever', 'dry cough', 'runny nose', 'red watery eyes', 'white spots in mouth (Koplik spots)', 'widespread skin rash', 'sensitivity to light'], ARRAY['MMR vaccination', 'isolate for 4 days after rash appears', 'Vitamin A supplementation'], ARRAY['paracetamol', 'Vitamin A', 'supportive care'], 'severe', true, 0.90),
('Scabies', 'Skin infestation caused by the mite Sarcoptes scabiei.', ARRAY['intense itching (worse at night)', 'thin irregular burrow lines', 'pimple-like skin rash', 'sores from scratching', 'crusted skin (in severe cases)'], ARRAY['treat all household members', 'wash bedding in hot water', 'avoid skin-to-skin contact with infected person'], ARRAY['permethrin cream', 'ivermectin', 'antihistamines for itching'], 'mild', true, 0.60),

-- NEUROLOGICAL
('Migraine', 'Neurological condition causing severe recurring headaches.', ARRAY['throbbing headache (often one side)', 'nausea', 'vomiting', 'extreme sensitivity to light', 'sensitivity to sound', 'visual aura (flashes of light)', 'dizziness'], ARRAY['identify and avoid triggers', 'maintain regular sleep schedule', 'manage stress', 'stay hydrated', 'limit caffeine'], ARRAY['sumatriptan', 'rizatriptan', 'ibuprofen', 'paracetamol', 'topiramate (preventive)'], 'moderate', false, 0.00),
('Meningitis', 'Inflammation of membranes surrounding the brain and spinal cord.', ARRAY['sudden severe headache', 'stiff neck', 'sudden high fever', 'sensitivity to light', 'confusion', 'nausea', 'vomiting', 'seizures', 'skin rash (in meningococcal)'], ARRAY['meningococcal vaccination', 'avoid sharing utensils', 'wash hands', 'seek emergency care immediately'], ARRAY['intravenous antibiotics (ceftriaxone)', 'dexamethasone', 'supportive ICU care'], 'critical', true, 0.25),

-- CARDIOVASCULAR / METABOLIC
('Type 2 Diabetes', 'Chronic condition affecting regulation of blood sugar (glucose).', ARRAY['increased thirst', 'frequent urination', 'increased hunger', 'extreme fatigue', 'blurred vision', 'slow healing of sores', 'frequent infections', 'numbness or tingling in hands/feet', 'dark skin patches'], ARRAY['eat healthy balanced diet', 'exercise regularly', 'monitor blood sugar', 'maintain healthy weight', 'quit smoking'], ARRAY['metformin', 'sitagliptin', 'empagliflozin', 'insulin', 'glipizide'], 'moderate', false, 0.00),
('Hypertension', 'Chronic condition with persistently elevated blood pressure.', ARRAY['often asymptomatic', 'severe headache', 'shortness of breath', 'nosebleeds', 'flushing', 'dizziness', 'chest pain', 'visual changes'], ARRAY['reduce sodium intake', 'exercise regularly', 'maintain healthy weight', 'limit alcohol', 'quit smoking', 'manage stress (DASH diet)'], ARRAY['amlodipine', 'lisinopril', 'losartan', 'hydrochlorothiazide', 'atenolol'], 'moderate', false, 0.00),

-- OTHER SYSTEMIC
('Urinary Tract Infection (UTI)', 'Infection in any part of the urinary system.', ARRAY['strong persistent urge to urinate', 'burning sensation when urinating', 'passing frequent small amounts of urine', 'cloudy urine', 'red or pink urine (blood)', 'strong-smelling urine', 'pelvic pain'], ARRAY['drink plenty of water', 'urinate after sex', 'wipe from front to back', 'avoid irritating feminine products'], ARRAY['nitrofurantoin', 'trimethoprim-sulfamethoxazole', 'ciprofloxacin', 'fosfomycin', 'phenazopyridine (for pain)'], 'mild', false, 0.00),
('Kidney Stones', 'Hard deposits of minerals and salts inside the kidneys.', ARRAY['severe sharp pain in side and back', 'pain radiating to lower abdomen and groin', 'pain comes in waves', 'pain or burning during urination', 'pink, red or brown urine', 'cloudy or foul-smelling urine', 'nausea and vomiting', 'frequent urge to urinate'], ARRAY['drink plenty of water (2-3 liters/day)', 'limit salt and animal protein', 'maintain healthy weight', 'limit high-oxalate foods'], ARRAY['pain relief (ibuprofen/ketorolac)', 'tamsulosin (alpha blockers)', 'potassium citrate', 'surgical removal for large stones'], 'severe', false, 0.00),
('Anemia', 'Deficiency of healthy red blood cells or hemoglobin.', ARRAY['fatigue', 'weakness', 'pale or yellowish skin', 'shortness of breath', 'dizziness or lightheadedness', 'cold hands and feet', 'irregular heartbeat', 'chest pain', 'headache'], ARRAY['eat iron-rich foods (spinach, red meat)', 'consume vitamin C to improve iron absorption', 'treat underlying bleeding causes'], ARRAY['ferrous sulfate (iron supplements)', 'folic acid', 'vitamin B12 injections', 'erythropoietin (in severe cases)'], 'moderate', false, 0.00);

-- Generate mock reports for testing
DO $$
DECLARE
  dengue_id UUID;
  malaria_id UUID;
  flu_id UUID;
  covid_id UUID;
BEGIN
  SELECT id INTO dengue_id FROM public.diseases WHERE name = 'Dengue Fever' LIMIT 1;
  SELECT id INTO malaria_id FROM public.diseases WHERE name = 'Malaria' LIMIT 1;
  SELECT id INTO flu_id FROM public.diseases WHERE name = 'Influenza (Flu)' LIMIT 1;
  SELECT id INTO covid_id FROM public.diseases WHERE name = 'COVID-19' LIMIT 1;

  IF dengue_id IS NOT NULL THEN
    INSERT INTO public.disease_reports (disease_id, symptoms_reported, location_lat, location_lng, city, state, confidence_score, reported_at)
    SELECT dengue_id, ARRAY['sudden high fever','headache','joint pain','skin rash'],
           19.0760 + (random()-0.5)*0.5, 72.8777 + (random()-0.5)*0.5,
           'Mumbai', 'Maharashtra', 78 + random()*20, NOW() - (random()*14 || ' days')::interval
    FROM generate_series(1,15);
  END IF;

  IF covid_id IS NOT NULL THEN
    INSERT INTO public.disease_reports (disease_id, symptoms_reported, location_lat, location_lng, city, state, confidence_score, reported_at)
    SELECT covid_id, ARRAY['dry cough','fever','loss of smell','fatigue'],
           28.7041 + (random()-0.5)*0.4, 77.1025 + (random()-0.5)*0.4,
           'Delhi', 'Delhi', 80 + random()*15, NOW() - (random()*7 || ' days')::interval
    FROM generate_series(1,25);
  END IF;
END $$;
