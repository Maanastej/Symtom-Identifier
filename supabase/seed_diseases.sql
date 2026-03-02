-- Seed data for diseases table
-- This data acts as the "training" set for your custom prediction model

INSERT INTO public.diseases (name, description, symptoms, precautions, medications, severity, is_communicable, transmission_rate)
VALUES
  (
    'Common Cold',
    'A viral infection of your nose and throat (upper respiratory tract).',
    ARRAY['cough', 'sneezing', 'sore throat', 'runny nose', 'congestion'],
    ARRAY['rest', 'stay hydrated', 'wash hands'],
    ARRAY['paracetamol', 'antihistamines'],
    'mild',
    true,
    0.85
  ),
  (
    'Influenza (Flu)',
    'A common viral infection that can be deadly, especially in high-risk groups.',
    ARRAY['fever', 'body aches', 'chills', 'fatigue', 'cough', 'headache'],
    ARRAY['stay home', 'wash hands', 'cover coughs'],
    ARRAY['oseltamivir', 'ibuprofen'],
    'moderate',
    true,
    0.70
  ),
  (
    'COVID-19',
    'A contagious disease caused by a virus, the severe acute respiratory syndrome coronavirus 2 (SARS-COV-2).',
    ARRAY['fever', 'dry cough', 'shortness of breath', 'fatigue', 'loss of taste', 'loss of smell'],
    ARRAY['wear mask', 'isolation', 'vaccination'],
    ARRAY['antivirals', 'paracetamol'],
    'severe',
    true,
    0.95
  ),
  (
    'Malaria',
    'A disease caused by a parasite, transmitted by the bite of infected mosquitoes.',
    ARRAY['fever', 'chills', 'shaking', 'sweating', 'headache', 'nausea'],
    ARRAY['use mosquito nets', 'wear long sleeves', 'insect repellent'],
    ARRAY['artemisinin-based combination therapy', 'chloroquine'],
    'severe',
    false,
    0.00
  ),
  (
    'Dengue',
    'A mosquito-borne viral disease occurring in tropical and subtropical areas.',
    ARRAY['high fever', 'severe headache', 'pain behind eyes', 'joint pain', 'muscle pain', 'rash'],
    ARRAY['drain standing water', 'mosquito repellent', 'pain relief'],
    ARRAY['paracetamol'],
    'severe',
    false,
    0.00
  ),
  (
    'Typhoid',
    'A bacterial infection that can spread throughout the body, affecting many organs.',
    ARRAY['prolonged fever', 'fatigue', 'headache', 'stomach pain', 'constipation', 'diarrhea'],
    ARRAY['drink safe water', 'proper sanitation', 'hand washing'],
    ARRAY['antibiotics', 'fluids'],
    'moderate',
    true,
    0.20
  ),
  (
    'Asthma',
    'A condition in which your airways narrow and swell and may produce extra mucus.',
    ARRAY['shortness of breath', 'chest tightness', 'wheezing', 'cough'],
    ARRAY['avoid triggers', 'stay indoors during high pollen'],
    ARRAY['inhalers', 'corticosteroids'],
    'moderate',
    false,
    0.00
  ),
  (
    'Migraine',
    'A type of headache that can cause severe throbbing pain or a pulsing sensation.',
    ARRAY['throbbing headache', 'nausea', 'sensitivity to light', 'sensitivity to sound'],
    ARRAY['rest in dark room', 'hydrate', 'avoid stress'],
    ARRAY['triptans', 'pain killers'],
    'moderate',
    false,
    0.00
  ),
  (
    'Food Poisoning',
    'Illness caused by bacteria or other toxins in food, typically with vomiting and diarrhea.',
    ARRAY['nausea', 'vomiting', 'diarrhea', 'stomach cramps', 'fever'],
    ARRAY['stay hydrated', 'eat bland foods', 'hand hygiene'],
    ARRAY['oral rehydration salts', 'probiotics'],
    'mild',
    false,
    0.00
  ),
  (
    'Chickenpox',
    'A highly contagious viral infection causing an itchy, blister-like rash on the skin.',
    ARRAY['itchy rash', 'fever', 'headache', 'tiredness', 'loss of appetite'],
    ARRAY['isolation', 'trim nails to avoid scratching', 'tepid baths'],
    ARRAY['acyclovir', 'calamine lotion'],
    'moderate',
    true,
    0.90
  );
