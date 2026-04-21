import { useState, useRef, useCallback, useMemo, useEffect } from "react";

// ─── MEDICATIONS DB ───────────────────────────────────────────────────────────

const MEDICATIONS_DB = [
  // ── Sintomáticos – Analgésicos e antipiréticos ──────────────────────────────
  { id:1, nome:"Paracetamol", subcat:"Analgésicos e antipiréticos", doses:["500mg","750mg","1g"], vias:["VO"], posologias:["Tomar 1 comprimido de 6 em 6 horas se dor ou febre","Tomar 1 comprimido de 8 em 8 horas","Tomar 2 comprimidos de 8 em 8 horas"] },
  { id:2, nome:"Dipirona", subcat:"Analgésicos e antipiréticos", doses:["500mg","1g"], vias:["VO","IV","IM"], posologias:{"VO":["Tomar 1 comprimido de 6 em 6 horas se dor ou febre","Tomar 1 comprimido de 8 em 8 horas"],"IV":["Aplicar 1 ampola IV lento de 6 em 6 horas se dor ou febre","Aplicar 1 ampola IV lento de 8 em 8 horas"],"IM":["Aplicar 1 ampola IM de 8 em 8 horas se dor"]} },
  { id:3, nome:"Ibuprofeno", subcat:"Analgésicos e antipiréticos", doses:["200mg","400mg","600mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 8 em 8 horas com refeição","Tomar 1 comprimido de 6 em 6 horas com refeição"] },
  { id:4, nome:"Ácido Acetilsalicílico (AAS)", subcat:"Analgésicos e antipiréticos", doses:["100mg","500mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia após o almoço (antiplaquetário)","Tomar 1-2 comprimidos de 500mg de 6 em 6 horas se dor (analgésico)"] },
  { id:5, nome:"Indometacina", subcat:"Analgésicos e antipiréticos", doses:["25mg","50mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 8 em 8 horas com refeição","Tomar 1 comprimido de 12 em 12 horas com refeição"] },
  // ── Sintomáticos – Analgésicos potentes ────────────────────────────────────
  { id:10, nome:"Tramadol", subcat:"Analgésicos potentes", doses:["50mg","100mg"], vias:["VO","IV"], posologias:{"VO":["Tomar 1 cápsula de 8 em 8 horas","Tomar 1 cápsula de 6 em 6 horas se dor"],"IV":["Aplicar 1 ampola (100mg) IV diluída em 100mL SF em 30 min de 8 em 8 horas"]} },
  { id:11, nome:"Codeína", subcat:"Analgésicos potentes", doses:["30mg","60mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 4 em 4 horas se dor","Tomar 1 comprimido de 6 em 6 horas se dor"] },
  { id:12, nome:"Morfina", subcat:"Analgésicos potentes", doses:["10mg","30mg"], vias:["VO","IV","SC"], posologias:{"VO":["Tomar 1 comprimido de 4 em 4 horas","Tomar 1 comprimido de 12 em 12 horas (liberação prolongada)"],"IV":["Aplicar 2-4mg IV de 4 em 4 horas (titular conforme dor)","Infundir 1-5mg/h IV em infusão contínua (dor crônica intensa)"],"SC":["Aplicar 5-10mg SC de 4 em 4 horas"]} },
  { id:13, nome:"Fentanila", subcat:"Analgésicos potentes", doses:["50mcg/mL","0,1mg/2mL"], vias:["IV","IM"], posologias:{"IV":["Aplicar 1-2 mcg/kg IV lento (analgesia procedimento)","Infundir 25-100 mcg/h IV em infusão contínua (sedoanalgesia)"],"IM":["Aplicar 1-2 mcg/kg IM (pré-medicação anestésica)"]} },
  { id:14, nome:"Metadona", subcat:"Analgésicos potentes", doses:["5mg","10mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 8 em 8 horas (dor crônica — iniciar com dose baixa)","Tomar 1 comprimido ao dia (dependência química — conforme protocolo)"] },
  // ── Sintomáticos – Antieméticos e procinéticos ──────────────────────────────
  { id:20, nome:"Ondansetrona", subcat:"Antieméticos e procinéticos", doses:["4mg","8mg"], vias:["VO","IV","IM"], posologias:{"VO":["Tomar 1 comprimido de 8 em 8 horas se náusea","Tomar 1 comprimido de 12 em 12 horas se náusea"],"IV":["Aplicar 1 ampola (8mg) IV lento de 8 em 8 horas se náusea/vômitos"],"IM":["Aplicar 1 ampola (4mg) IM de 8 em 8 horas se náusea"]} },
  { id:21, nome:"Metoclopramida", subcat:"Antieméticos e procinéticos", doses:["10mg"], vias:["VO","IV","IM"], posologias:{"VO":["Tomar 1 comprimido de 8 em 8 horas antes das refeições"],"IV":["Aplicar 1 ampola IV lento (em 5 min) de 8 em 8 horas"],"IM":["Aplicar 1 ampola IM de 8 em 8 horas se náusea"]} },
  { id:22, nome:"Domperidona", subcat:"Antieméticos e procinéticos", doses:["10mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 8 em 8 horas antes das refeições"] },
  // ── Sintomáticos – Anti-histamínicos ───────────────────────────────────────
  { id:30, nome:"Loratadina", subcat:"Anti-histamínicos", doses:["10mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia pela manhã"] },
  { id:31, nome:"Fexofenadina", subcat:"Anti-histamínicos", doses:["120mg","180mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia","Tomar 1 comprimido de 12 em 12 horas"] },
  { id:32, nome:"Cetirizina", subcat:"Anti-histamínicos", doses:["10mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia à noite"] },
  { id:33, nome:"Difenidramina", subcat:"Anti-histamínicos", doses:["25mg","50mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 6 em 6 horas","Tomar 1 comprimido à noite"] },
  // ── Cardiologia – Diuréticos ────────────────────────────────────────────────
  { id:40, nome:"Hidroclorotiazida", subcat:"Diuréticos", doses:["12,5mg","25mg","50mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia pela manhã","Tomar 1/2 comprimido ao dia pela manhã"] },
  { id:41, nome:"Clortalidona", subcat:"Diuréticos", doses:["12,5mg","25mg","50mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia pela manhã"] },
  { id:42, nome:"Indapamida", subcat:"Diuréticos", doses:["1,5mg","2,5mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia pela manhã"] },
  { id:43, nome:"Furosemida", subcat:"Diuréticos", doses:["40mg","80mg"], vias:["VO","IV","IM"], posologias:{"VO":["Tomar 1 comprimido ao dia pela manhã","Tomar 1 comprimido de 12 em 12 horas"],"IV":["Aplicar 1 ampola (40mg) IV lento ao dia","Aplicar 1 ampola IV de 12 em 12 horas"],"IM":["Aplicar 1 ampola IM ao dia"]} },
  { id:44, nome:"Espironolactona", subcat:"Diuréticos", doses:["25mg","50mg","100mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia","Tomar 1 comprimido de 12 em 12 horas"] },
  // ── Cardiologia – Digitálicos ────────────────────────────────────────────────
  { id:50, nome:"Digoxina", subcat:"Digitálicos", doses:["0,25mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia pela manhã","Tomar 1/2 comprimido ao dia pela manhã"] },
  // ── Cardiologia – Drogas na insuficiência cardíaca refratária ───────────────
  { id:55, nome:"Dobutamina", subcat:"Drogas na insuficiência cardíaca refratária", doses:["250mg/20mL"], vias:["IV"], posologias:["Infundir 2-20 mcg/kg/min IV em bomba de infusão","Iniciar com 2-3 mcg/kg/min IV e titular conforme resposta hemodinâmica"] },
  { id:56, nome:"Milrinona", subcat:"Drogas na insuficiência cardíaca refratária", doses:["10mg/10mL"], vias:["IV"], posologias:["Infundir ataque de 50 mcg/kg IV em 10 min, depois 0,375-0,75 mcg/kg/min em infusão contínua"] },
  // ── Cardiologia – Anti-hipertensivos ────────────────────────────────────────
  { id:60, nome:"Losartana", subcat:"Anti-hipertensivos", doses:["25mg","50mg","100mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia pela manhã","Tomar 1 comprimido de 12 em 12 horas"] },
  { id:61, nome:"Enalapril", subcat:"Anti-hipertensivos", doses:["5mg","10mg","20mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia pela manhã","Tomar 1 comprimido de 12 em 12 horas"] },
  { id:62, nome:"Captopril", subcat:"Anti-hipertensivos", doses:["12,5mg","25mg","50mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 8 em 8 horas em jejum","Tomar 1 comprimido de 12 em 12 horas (crise: 25mg SL)"] },
  { id:63, nome:"Ramipril", subcat:"Anti-hipertensivos", doses:["2,5mg","5mg","10mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia","Tomar 1 comprimido de 12 em 12 horas"] },
  { id:64, nome:"Lisinopril", subcat:"Anti-hipertensivos", doses:["5mg","10mg","20mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia","Tomar 1 comprimido de 12 em 12 horas"] },
  { id:65, nome:"Valsartana", subcat:"Anti-hipertensivos", doses:["80mg","160mg","320mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia","Tomar 1 comprimido de 12 em 12 horas"] },
  { id:66, nome:"Anlodipino", subcat:"Anti-hipertensivos", doses:["2,5mg","5mg","10mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia","Tomar 1 comprimido à noite"] },
  { id:67, nome:"Nifedipino", subcat:"Anti-hipertensivos", doses:["10mg","20mg","30mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 8 em 8 horas (liberação imediata)","Tomar 1 comprimido ao dia (liberação prolongada)"] },
  { id:68, nome:"Atenolol", subcat:"Anti-hipertensivos", doses:["25mg","50mg","100mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia pela manhã","Tomar 1/2 comprimido ao dia pela manhã"] },
  { id:69, nome:"Metoprolol", subcat:"Anti-hipertensivos", doses:["25mg","50mg","100mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia","Tomar 1 comprimido de 12 em 12 horas"] },
  { id:70, nome:"Carvedilol", subcat:"Anti-hipertensivos", doses:["3,125mg","6,25mg","12,5mg","25mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 12 em 12 horas com refeição","Tomar 1 comprimido ao dia com refeição"] },
  { id:71, nome:"Bisoprolol", subcat:"Anti-hipertensivos", doses:["2,5mg","5mg","10mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia","Tomar 1 comprimido ao dia pela manhã"] },
  { id:72, nome:"Propranolol", subcat:"Anti-hipertensivos", doses:["10mg","40mg","80mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 8 em 8 horas","Tomar 1 comprimido de 12 em 12 horas"] },
  { id:73, nome:"Hidralazina", subcat:"Anti-hipertensivos", doses:["25mg","50mg"], vias:["VO","IV"], posologias:{"VO":["Tomar 1 comprimido de 8 em 8 horas","Tomar 1 comprimido de 6 em 6 horas"],"IV":["Aplicar 20-40mg IV lento de 4 em 4 horas (crise hipertensiva na gestação)"]} },
  { id:74, nome:"Clonidina", subcat:"Anti-hipertensivos", doses:["0,1mg","0,2mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 12 em 12 horas","Tomar 1 comprimido de 8 em 8 horas"] },
  { id:75, nome:"Metildopa", subcat:"Anti-hipertensivos", doses:["250mg","500mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 8 em 8 horas (HAS na gestação)","Tomar 1 comprimido de 12 em 12 horas"] },
  // ── Cardiologia – Antiarrítmicos ─────────────────────────────────────────────
  { id:80, nome:"Amiodarona", subcat:"Antiarrítmicos", doses:["100mg","200mg"], vias:["VO","IV"], posologias:{"VO":["Tomar 1 comprimido ao dia","Tomar 1 comprimido de 12 em 12 horas por 7 dias e depois 1 ao dia"],"IV":["Aplicar 5mg/kg IV em 60 min (ataque), depois 10-15mg/kg em 24h"]} },
  { id:81, nome:"Propafenona", subcat:"Antiarrítmicos", doses:["150mg","300mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 8 em 8 horas","Tomar 1 comprimido de 12 em 12 horas"] },
  // ── Cardiologia – Antilipemiantes ────────────────────────────────────────────
  { id:85, nome:"Sinvastatina", subcat:"Antilipemiantes", doses:["10mg","20mg","40mg","80mg"], vias:["VO"], posologias:["Tomar 1 comprimido à noite","Tomar 1 comprimido antes de dormir"] },
  { id:86, nome:"Atorvastatina", subcat:"Antilipemiantes", doses:["10mg","20mg","40mg","80mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia","Tomar 1 comprimido à noite"] },
  { id:87, nome:"Rosuvastatina", subcat:"Antilipemiantes", doses:["5mg","10mg","20mg","40mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia","Tomar 1 comprimido à noite"] },
  { id:88, nome:"Pravastatina", subcat:"Antilipemiantes", doses:["10mg","20mg","40mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia à noite"] },
  { id:89, nome:"Ezetimiba", subcat:"Antilipemiantes", doses:["10mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia","Tomar 1 comprimido ao dia com ou sem refeição"] },
  { id:90, nome:"Fenofibrato", subcat:"Antilipemiantes", doses:["200mg","250mg"], vias:["VO"], posologias:["Tomar 1 cápsula ao dia com refeição"] },
  { id:91, nome:"Bezafibrato", subcat:"Antilipemiantes", doses:["400mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia com refeição","Tomar 1 comprimido de 12 em 12 horas com refeição"] },
  // ── Cardiologia – Vasodilatadores coronarianos ───────────────────────────────
  { id:95, nome:"Isossorbida 5-mononitrato", subcat:"Vasodilatadores coronarianos", doses:["20mg","40mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 12 em 12 horas","Tomar 1 comprimido ao dia"] },
  { id:96, nome:"Isossorbida dinitrato", subcat:"Vasodilatadores coronarianos", doses:["5mg","10mg","20mg"], vias:["VO","SL"], posologias:{"VO":["Tomar 1 comprimido de 8 em 8 horas","Tomar 1 comprimido de 6 em 6 horas"],"SL":["Colocar 1 comprimido sob a língua na crise anginosa"]} },
  { id:97, nome:"Nitroglicerina", subcat:"Vasodilatadores coronarianos", doses:["0,4mg","5mg/mL"], vias:["SL","IV"], posologias:{"SL":["Colocar 1 comprimido sob a língua na crise anginosa (pode repetir após 5 min, máx 3 doses)"],"IV":["Infundir 5-200 mcg/min IV em bomba de infusão — titular conforme PA"]} },
  // ── Cardiologia – Vasodilatadores periféricos e cerebrais ───────────────────
  { id:100, nome:"Pentoxifilina", subcat:"Vasodilatadores periféricos e cerebrais", doses:["400mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 8 em 8 horas com refeição"] },
  // ── Cardiologia – Trombolíticos e fibrinolíticos ─────────────────────────────
  { id:103, nome:"Alteplase (rt-PA)", subcat:"Trombolíticos e fibrinolíticos", doses:["50mg","100mg"], vias:["IV"], posologias:["Infundir 0,9mg/kg IV (máx 90mg): 10% em bolus em 1 min, restante em 60 min (AVC isquêmico)","Infundir 100mg IV em 2 horas (TEP maciço)"] },
  // ── Cardiologia – Hipertensão pulmonar ──────────────────────────────────────
  { id:105, nome:"Sildenafila", subcat:"Drogas usadas na hipertensão pulmonar", doses:["20mg","25mg","50mg","100mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 8 em 8 horas (hipertensão pulmonar: 20mg)","Tomar 1 comprimido 1h antes do ato sexual (disfunção erétil)"] },
  { id:106, nome:"Bosentana", subcat:"Drogas usadas na hipertensão pulmonar", doses:["62,5mg","125mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 12 em 12 horas"] },
  // ── Cardiologia – Doença de Chagas ──────────────────────────────────────────
  { id:108, nome:"Benznidazol", subcat:"Drogas para doença de Chagas", doses:["100mg"], vias:["VO"], posologias:["Tomar 5mg/kg/dia em 2 tomadas por 60 dias (adulto)"] },
  // ── Antiplaquetários / Anticoagulantes ───────────────────────────────────────
  { id:110, nome:"Clopidogrel", subcat:"Antiplaquetários", doses:["75mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia","Tomar 1 comprimido ao dia após o almoço"] },
  { id:111, nome:"Ticlopidina", subcat:"Antiplaquetários", doses:["250mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 12 em 12 horas com refeição"] },
  { id:112, nome:"Varfarina", subcat:"Anticoagulantes", doses:["1mg","2,5mg","5mg"], vias:["VO"], posologias:["Tomar conforme orientação médica (dose individualizada pelo INR)"] },
  { id:113, nome:"Rivaroxabana", subcat:"Anticoagulantes", doses:["10mg","15mg","20mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia com refeição","Tomar 1 comprimido de 12 em 12 horas com refeição"] },
  { id:114, nome:"Dabigatrana", subcat:"Anticoagulantes", doses:["75mg","110mg","150mg"], vias:["VO"], posologias:["Tomar 1 cápsula de 12 em 12 horas"] },
  { id:115, nome:"Heparina", subcat:"Anticoagulantes", doses:["5000UI/mL","25000UI/5mL"], vias:["IV","SC"], posologias:{"IV":["Infundir 80 UI/kg em bolus IV, depois 18 UI/kg/h em infusão contínua (ajustar pelo TTPA)"],"SC":["Aplicar 5000 UI SC de 8 em 8 horas (profilaxia de TVP)"]} },
  { id:116, nome:"Enoxaparina", subcat:"Anticoagulantes", doses:["20mg","40mg","60mg","80mg"], vias:["SC"], posologias:["Aplicar 1 seringa de 40mg SC ao dia na região abdominal (profilaxia TVP)","Aplicar 1mg/kg SC de 12 em 12 horas (tratamento TVP/TEP)"] },
  // ── Emergências ──────────────────────────────────────────────────────────────
  { id:120, nome:"Adrenalina (Epinefrina)", subcat:"Drogas para emergências e parada", doses:["1mg/mL"], vias:["IV","IM","IO"], posologias:{"IV":["Aplicar 1 ampola (1mg) IV a cada 3-5 min na PCR"],"IM":["Aplicar 0,3-0,5 mL IM na face anterolateral da coxa na anafilaxia"],"IO":["Aplicar 1 ampola IO a cada 3-5 min se sem acesso venoso"]} },
  { id:121, nome:"Atropina", subcat:"Drogas para emergências e parada", doses:["0,5mg/mL","1mg/mL"], vias:["IV","IM"], posologias:{"IV":["Aplicar 0,5-1 mL IV em bolus de 3 em 3 min se bradicardia sintomática (máx 3mg)"],"IM":["Aplicar 1-2 mL IM se acesso venoso indisponível"]} },
  { id:122, nome:"Amiodarona EV", subcat:"Drogas para emergências e parada", doses:["150mg/3mL"], vias:["IV"], posologias:["Aplicar 2 ampolas (300mg) IV em bolus na FV/TV sem pulso","Aplicar 1 ampola (150mg) IV diluída em 100mL SG5% em 10 min (arritmia estável)"] },
  { id:123, nome:"Bicarbonato de Sódio 8,4%", subcat:"Drogas para emergências e parada", doses:["8,4%"], vias:["IV"], posologias:["Infundir 1 mEq/kg IV lento na PCR prolongada (>10 min) ou hipercalemia grave"] },
  { id:124, nome:"Midazolam", subcat:"Drogas para emergências e parada", doses:["5mg/mL","15mg/3mL"], vias:["IV","IM","IN"], posologias:{"IV":["Aplicar 0,05-0,1 mg/kg IV lento (sedação procedimento)","Aplicar 0,1-0,2 mg/kg IV no estado de mal epiléptico"],"IM":["Aplicar 0,1-0,15 mg/kg IM (sedação pré-procedimento)"],"IN":["Aplicar 0,2-0,5 mg/kg intranasal (crise convulsiva em pediatria)"]} },
  { id:125, nome:"Propofol", subcat:"Drogas para emergências e parada", doses:["10mg/mL","200mg/20mL"], vias:["IV"], posologias:["Infundir 0,5-4 mg/kg/h IV em bomba de infusão (sedação em UTI)","Aplicar 1-2 mg/kg IV lento para indução anestésica"] },
  { id:126, nome:"Ketamina", subcat:"Drogas para emergências e parada", doses:["10mg/mL","50mg/mL"], vias:["IV","IM"], posologias:{"IV":["Aplicar 1-2mg/kg IV lento para indução anestésica","Infundir 0,1-0,5mg/kg/h IV para sedoanalgesia"],"IM":["Aplicar 4-6mg/kg IM para sedação dissociativa em procedimentos"]} },
  { id:127, nome:"Ácido Tranexâmico", subcat:"Drogas usadas no controle das hemorragias", doses:["500mg/5mL","1g/10mL"], vias:["IV"], posologias:["Infundir 1 ampola (1g) IV em 10 min, depois 1g em 8h (trauma com hemorragia)","Infundir 15mg/kg IV em 30 min antes de cirurgia com risco de sangramento"] },
  { id:128, nome:"Vitamina K", subcat:"Drogas usadas no controle das hemorragias", doses:["1mg","10mg"], vias:["IV","VO"], posologias:{"IV":["Infundir 1 ampola (10mg) IV lento (em 30 min) para reversão de varfarina"],"VO":["Tomar 1 comprimido de 10mg VO ao dia para reversão oral de varfarina"]} },
  { id:129, nome:"Albumina 20%", subcat:"Expansores plasmáticos coloides", doses:["20%"], vias:["IV"], posologias:["Infundir 1 frasco (100mL) IV em 60-120 min (paracentese >5L: 6-8g/L removido)"] },
  { id:130, nome:"Norepinefrina", subcat:"Drogas usadas na hipotensão sintomática", doses:["4mg/4mL"], vias:["IV"], posologias:["Infundir 0,01-3 mcg/kg/min IV em bomba de infusão","Iniciar com 0,1-0,2 mcg/kg/min IV e titular para PAM >65 mmHg"] },
  { id:131, nome:"Dopamina", subcat:"Drogas usadas na hipotensão sintomática", doses:["50mg/10mL","200mg/10mL"], vias:["IV"], posologias:["Infundir 2-20 mcg/kg/min IV em bomba de infusão (dopaminérgica: 2-5; inotrópica: 5-10; vasopressora: >10)"] },
  { id:132, nome:"Naloxona", subcat:"Antagonistas e antídotos", doses:["0,4mg/mL"], vias:["IV","IM","IN"], posologias:{"IV":["Aplicar 0,4-2mg IV em bolus (pode repetir a cada 2-3 min)"],"IM":["Aplicar 0,4-0,8mg IM se sem acesso venoso"],"IN":["Aplicar 1-2mg intranasal (0,5-1mg em cada narina)"]} },
  { id:133, nome:"Flumazenil", subcat:"Antagonistas e antídotos", doses:["0,5mg/5mL"], vias:["IV"], posologias:["Aplicar 0,2mg IV em 15s, pode repetir 0,1mg a cada 60s (máx 1mg total)"] },
  { id:134, nome:"N-acetilcisteína", subcat:"Antagonistas e antídotos", doses:["200mg","600mg"], vias:["IV","VO"], posologias:{"IV":["Infundir 150mg/kg IV em 1h, depois 50mg/kg em 4h, depois 100mg/kg em 16h (intoxicação por paracetamol)"],"VO":["Tomar 1 sachê de 600mg dissolvido em água de 8 em 8 horas (mucolítico)"]} },
  { id:135, nome:"Succinilcolina", subcat:"Curares – bloqueadores neuromusculares", doses:["100mg/2mL"], vias:["IV"], posologias:["Aplicar 1-1,5mg/kg IV em bolus rápido (intubação de sequência rápida)"] },
  { id:136, nome:"Rocurônio", subcat:"Curares – bloqueadores neuromusculares", doses:["50mg/5mL"], vias:["IV"], posologias:["Aplicar 0,6mg/kg IV em bolus (intubação eletiva)","Aplicar 1,2mg/kg IV em bolus (intubação de sequência rápida)"] },
  // ── Sistema Respiratório ─────────────────────────────────────────────────────
  { id:140, nome:"Pseudoefedrina", subcat:"Descongestionantes com anti-histamínicos", doses:["60mg","120mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 12 em 12 horas","Tomar 1 comprimido de 8 em 8 horas"] },
  { id:141, nome:"Budesonida nasal", subcat:"Tópicos nasais", doses:["32mcg/dose","64mcg/dose"], vias:["Intranasal"], posologias:["Aplicar 2 jatos em cada narina uma vez ao dia pela manhã","Aplicar 1 jato em cada narina de 12 em 12 horas"] },
  { id:142, nome:"Mometasona nasal", subcat:"Tópicos nasais", doses:["50mcg/dose"], vias:["Intranasal"], posologias:["Aplicar 2 jatos em cada narina uma vez ao dia pela manhã"] },
  { id:143, nome:"Dextrometorfano", subcat:"Antitussígenos e sedativos da tosse", doses:["30mg"], vias:["VO"], posologias:["Tomar 1 cápsula de 8 em 8 horas se tosse seca"] },
  { id:144, nome:"Codeína (xarope)", subcat:"Antitussígenos e sedativos da tosse", doses:["10mg/5mL"], vias:["VO"], posologias:["Tomar 10mL de 6 em 6 horas se tosse"] },
  { id:145, nome:"Ambroxol", subcat:"Mucolíticos e expectorantes", doses:["30mg","75mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 8 em 8 horas","Tomar 1 comprimido de 12 em 12 horas"] },
  { id:146, nome:"Acetilcisteína (oral)", subcat:"Mucolíticos e expectorantes", doses:["200mg","600mg"], vias:["VO"], posologias:["Tomar 1 sachê de 200mg de 8 em 8 horas","Tomar 1 comprimido efervescente de 600mg ao dia"] },
  { id:147, nome:"Salbutamol", subcat:"Drogas para asma", doses:["100mcg/dose"], vias:["Inalatória"], posologias:["Inalar 2 jatos de 4 em 4 horas se dispneia (resgate)","Inalar 2-4 jatos de 20 em 20 min nas primeiras 2h da crise asmática","Inalar 2 jatos 15 min antes do exercício"] },
  { id:148, nome:"Fenoterol", subcat:"Drogas para asma", doses:["100mcg/dose"], vias:["Inalatória"], posologias:["Inalar 1-2 jatos de 4 em 4 horas se dispneia (resgate)","Inalar 2 jatos de 20 em 20 min na crise (máx 3 doses)"] },
  { id:149, nome:"Salmeterol + Fluticasona", subcat:"Drogas para asma", doses:["25/125mcg","25/250mcg","50/250mcg","50/500mcg"], vias:["Inalatória"], posologias:["Inalar 2 jatos de 12 em 12 horas (aerossol)","Inalar 1 jato de 12 em 12 horas (Diskus)"] },
  { id:150, nome:"Budesonida + Formoterol", subcat:"Drogas para asma", doses:["80/4,5mcg","160/4,5mcg"], vias:["Inalatória"], posologias:["Inalar 2 jatos de 12 em 12 horas","Inalar 1 jato de 12 em 12 horas (manutenção dose baixa)"] },
  { id:151, nome:"Beclometasona inalatória", subcat:"Drogas para asma", doses:["50mcg/dose","100mcg/dose","200mcg/dose"], vias:["Inalatória"], posologias:["Inalar 2 jatos de 12 em 12 horas","Inalar 2 jatos de 8 em 8 horas (asma moderada/grave)"] },
  { id:152, nome:"Ipratrópio", subcat:"Drogas para asma", doses:["20mcg/dose","0,025%"], vias:["Inalatória"], posologias:["Inalar 2 jatos de 6 em 6 horas (aerossol)","Nebulizar 20 gotas diluídas em 3mL SF de 6 em 6 horas"] },
  { id:153, nome:"Brometo de Tiotrópio", subcat:"Drogas para asma", doses:["18mcg"], vias:["Inalatória"], posologias:["Inalar o conteúdo de 1 cápsula ao dia pelo dispositivo Handihaler"] },
  { id:154, nome:"Montelucaste", subcat:"Drogas para asma", doses:["5mg","10mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 10mg ao dia à noite"] },
  { id:155, nome:"Prednisolona", subcat:"Drogas para asma", doses:["5mg","20mg","40mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia pela manhã por 5 dias","Tomar 40mg ao dia por 5 dias e reduzir"] },
  // ── Gastroenterologia ────────────────────────────────────────────────────────
  { id:160, nome:"Hidróxido de Alumínio + Magnésio", subcat:"Antiácidos minerais", doses:["61,5mg+40mg/mL"], vias:["VO"], posologias:["Tomar 10mL após as refeições e ao deitar","Tomar 2 comprimidos após as refeições"] },
  { id:161, nome:"Bicarbonato de Sódio (oral)", subcat:"Antiácidos minerais", doses:["1g"], vias:["VO"], posologias:["Dissolver 1g em água e tomar se azia (uso eventual)"] },
  { id:162, nome:"Ranitidina", subcat:"Bloqueadores H2", doses:["150mg","300mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 12 em 12 horas","Tomar 1 comprimido à noite"] },
  { id:163, nome:"Cimetidina", subcat:"Bloqueadores H2", doses:["200mg","400mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 6 em 6 horas","Tomar 1 comprimido de 12 em 12 horas"] },
  { id:164, nome:"Omeprazol", subcat:"Inibidores da bomba de prótons", doses:["10mg","20mg","40mg"], vias:["VO","IV"], posologias:{"VO":["Tomar 1 cápsula ao dia em jejum (30 min antes do café)","Tomar 1 cápsula de 12 em 12 horas em jejum"],"IV":["Infundir 1 ampola (40mg) IV em 100mL SF em 20-30 min ao dia","Infundir 1 ampola IV de 12 em 12 horas (hemorragia digestiva alta)"]} },
  { id:165, nome:"Pantoprazol", subcat:"Inibidores da bomba de prótons", doses:["20mg","40mg"], vias:["VO","IV"], posologias:{"VO":["Tomar 1 comprimido ao dia em jejum","Tomar 1 comprimido de 12 em 12 horas em jejum"],"IV":["Infundir 1 ampola (40mg) IV em 100mL SF em 15 min ao dia"]} },
  { id:166, nome:"Lansoprazol", subcat:"Inibidores da bomba de prótons", doses:["15mg","30mg"], vias:["VO"], posologias:["Tomar 1 cápsula ao dia em jejum","Tomar 1 cápsula de 12 em 12 horas em jejum"] },
  { id:167, nome:"Esomeprazol", subcat:"Inibidores da bomba de prótons", doses:["20mg","40mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia em jejum"] },
  { id:168, nome:"Escopolamina", subcat:"Antiespasmódicos", doses:["10mg","20mg"], vias:["VO","IV","IM"], posologias:{"VO":["Tomar 1 comprimido de 8 em 8 horas"],"IV":["Aplicar 1 ampola (20mg) IV lento se cólica intensa"],"IM":["Aplicar 1 ampola (20mg) IM se cólica (sem acesso venoso)"]} },
  { id:169, nome:"Dicicloverina", subcat:"Antiespasmódicos", doses:["10mg","20mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 8 em 8 horas","Tomar 1 comprimido de 6 em 6 horas"] },
  { id:170, nome:"Dimeticona", subcat:"Antiflatulentos", doses:["40mg","125mg"], vias:["VO"], posologias:["Tomar 1 comprimido após as refeições e ao deitar","Aplicar 15 gotas após as refeições"] },
  { id:171, nome:"Lactulose", subcat:"Laxantes e catárticos", doses:["667mg/mL"], vias:["VO"], posologias:["Tomar 15 mL ao dia","Tomar 30 mL ao dia","Tomar 15 mL de 12 em 12 horas"] },
  { id:172, nome:"Bisacodil", subcat:"Laxantes e catárticos", doses:["5mg"], vias:["VO"], posologias:["Tomar 1 comprimido à noite","Tomar 2 comprimidos à noite"] },
  { id:173, nome:"Polietilenoglicol", subcat:"Laxantes e catárticos", doses:["17g"], vias:["VO"], posologias:["Dissolver 1 sachê (17g) em 120-240mL de água e tomar ao dia","Dissolver 1 sachê de 12 em 12 horas (constipação intensa)"] },
  { id:174, nome:"Picossulfato de Sódio", subcat:"Laxantes e catárticos", doses:["7,5mg/mL"], vias:["VO"], posologias:["Tomar 15-20 gotas à noite"] },
  { id:175, nome:"Loperamida", subcat:"Antidiarreicos", doses:["2mg"], vias:["VO"], posologias:["Tomar 2 cápsulas inicialmente e depois 1 após cada evacuação (máx 8/dia)"] },
  { id:176, nome:"Racecadotrila", subcat:"Antidiarreicos", doses:["100mg"], vias:["VO"], posologias:["Tomar 1 sachê de 8 em 8 horas"] },
  // ── Neurologia ───────────────────────────────────────────────────────────────
  { id:180, nome:"Fenitoína", subcat:"Anticonvulsivantes", doses:["100mg"], vias:["VO","IV"], posologias:{"VO":["Tomar 1 cápsula de 8 em 8 horas","Tomar 1 cápsula de 12 em 12 horas"],"IV":["Infundir 15-20mg/kg IV a no máximo 50mg/min — monitorar ECG e PA","Infundir 100mg IV de 8 em 8 horas (manutenção)"]} },
  { id:181, nome:"Carbamazepina", subcat:"Anticonvulsivantes", doses:["200mg","400mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 12 em 12 horas","Tomar 1 comprimido de 8 em 8 horas"] },
  { id:182, nome:"Valproato de Sódio", subcat:"Anticonvulsivantes", doses:["250mg","500mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 12 em 12 horas","Tomar 1 comprimido de 8 em 8 horas"] },
  { id:183, nome:"Fenobarbital", subcat:"Anticonvulsivantes", doses:["50mg","100mg"], vias:["VO","IV","IM"], posologias:{"VO":["Tomar 1 comprimido à noite","Tomar 1 comprimido de 12 em 12 horas"],"IV":["Aplicar 15-20mg/kg IV lento (máx 60mg/min) — estado epiléptico","Aplicar 1-3mg/kg IV de 12 em 12 horas (manutenção EV)"],"IM":["Aplicar 100-200mg IM se sem acesso venoso"]} },
  { id:184, nome:"Levetiracetam", subcat:"Anticonvulsivantes", doses:["250mg","500mg","750mg","1g"], vias:["VO","IV"], posologias:{"VO":["Tomar 1 comprimido de 12 em 12 horas","Tomar 1 comprimido de 8 em 8 horas"],"IV":["Infundir 1g IV diluída em 100mL SF em 15 min (estado epiléptico)"]} },
  { id:185, nome:"Lamotrigina", subcat:"Anticonvulsivantes", doses:["25mg","50mg","100mg","200mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia (iniciar com dose baixa e aumentar gradualmente)","Tomar 1 comprimido de 12 em 12 horas"] },
  { id:186, nome:"Topiramato", subcat:"Anticonvulsivantes", doses:["25mg","50mg","100mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia à noite (iniciar com 25mg)","Tomar 1 comprimido de 12 em 12 horas (dose plena)"] },
  { id:187, nome:"Oxcarbazepina", subcat:"Anticonvulsivantes", doses:["150mg","300mg","600mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 12 em 12 horas","Tomar 1 comprimido de 8 em 8 horas (dose plena)"] },
  { id:188, nome:"Sumatriptano", subcat:"Analgésicos para enxaqueca", doses:["50mg","100mg"], vias:["VO"], posologias:["Tomar 1 comprimido no início da crise (pode repetir após 2h se necessário)"] },
  { id:189, nome:"Rizatriptano", subcat:"Analgésicos para enxaqueca", doses:["5mg","10mg"], vias:["VO"], posologias:["Tomar 1 comprimido no início da crise"] },
  { id:190, nome:"Levodopa + Carbidopa", subcat:"Antiparkinsonianos", doses:["100/25mg","250/25mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 8 em 8 horas","Tomar 1 comprimido de 6 em 6 horas"] },
  { id:191, nome:"Biperideno", subcat:"Antiparkinsonianos", doses:["2mg","4mg"], vias:["VO","IM"], posologias:{"VO":["Tomar 1 comprimido de 8 em 8 horas","Tomar 1 comprimido de 12 em 12 horas"],"IM":["Aplicar 1 ampola (5mg) IM de 30 em 30 min se distonia aguda (máx 4 ampolas/dia)"]} },
  { id:192, nome:"Pramipexol", subcat:"Antiparkinsonianos", doses:["0,125mg","0,25mg","0,5mg","1mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 8 em 8 horas","Tomar 1 comprimido de 12 em 12 horas"] },
  { id:193, nome:"Donepezila", subcat:"Drogas usadas na demência", doses:["5mg","10mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia à noite","Tomar 1 comprimido de 5mg ao dia (iniciar)"] },
  { id:194, nome:"Memantina", subcat:"Drogas usadas na demência", doses:["5mg","10mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia (iniciar com 5mg e aumentar)","Tomar 1 comprimido de 12 em 12 horas"] },
  // ── Psiquiatria ───────────────────────────────────────────────────────────────
  { id:200, nome:"Clonazepam", subcat:"Sedativos e ansiolíticos", doses:["0,5mg","1mg","2mg"], vias:["VO"], posologias:["Tomar 1 comprimido à noite","Tomar 1/2 comprimido de 12 em 12 horas","Tomar 1 comprimido de 8 em 8 horas"] },
  { id:201, nome:"Alprazolam", subcat:"Sedativos e ansiolíticos", doses:["0,25mg","0,5mg","1mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia à noite","Tomar 1 comprimido de 12 em 12 horas"] },
  { id:202, nome:"Diazepam", subcat:"Sedativos e ansiolíticos", doses:["5mg","10mg"], vias:["VO","IV","IM"], posologias:{"VO":["Tomar 1 comprimido à noite","Tomar 1 comprimido de 12 em 12 horas"],"IV":["Aplicar 0,1-0,3 mg/kg IV lento (máx 10mg) no estado epiléptico"],"IM":["Aplicar 1 ampola (10mg) IM se crises convulsivas sem acesso venoso"]} },
  { id:203, nome:"Amitriptilina", subcat:"Antidepressivos", doses:["10mg","25mg","50mg","75mg"], vias:["VO"], posologias:["Tomar 1 comprimido à noite","Tomar 1 comprimido de 12 em 12 horas"] },
  { id:204, nome:"Imipramina", subcat:"Antidepressivos", doses:["10mg","25mg"], vias:["VO"], posologias:["Tomar 1 comprimido à noite","Tomar 1 comprimido de 8 em 8 horas"] },
  { id:205, nome:"Nortriptilina", subcat:"Antidepressivos", doses:["10mg","25mg","50mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia à noite","Tomar 1 comprimido de 12 em 12 horas"] },
  { id:206, nome:"Fluoxetina", subcat:"Antidepressivos", doses:["10mg","20mg"], vias:["VO"], posologias:["Tomar 1 cápsula ao dia pela manhã","Tomar 2 cápsulas ao dia pela manhã"] },
  { id:207, nome:"Sertralina", subcat:"Antidepressivos", doses:["25mg","50mg","100mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia pela manhã","Tomar 1 comprimido ao dia à noite"] },
  { id:208, nome:"Paroxetina", subcat:"Antidepressivos", doses:["10mg","20mg","30mg","40mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia pela manhã","Tomar 1 comprimido ao dia (iniciar com 10mg)"] },
  { id:209, nome:"Citalopram", subcat:"Antidepressivos", doses:["10mg","20mg","40mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia","Tomar 1 comprimido pela manhã"] },
  { id:210, nome:"Escitalopram", subcat:"Antidepressivos", doses:["5mg","10mg","20mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia","Tomar 1 comprimido ao dia pela manhã"] },
  { id:211, nome:"Venlafaxina", subcat:"Antidepressivos", doses:["37,5mg","75mg","150mg"], vias:["VO"], posologias:["Tomar 1 cápsula ao dia com refeição","Tomar 1 cápsula de 12 em 12 horas"] },
  { id:212, nome:"Duloxetina", subcat:"Antidepressivos", doses:["30mg","60mg"], vias:["VO"], posologias:["Tomar 1 cápsula ao dia com refeição"] },
  { id:213, nome:"Bupropiona", subcat:"Antidepressivos", doses:["150mg","300mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia pela manhã","Tomar 1 comprimido de 12 em 12 horas"] },
  { id:214, nome:"Haloperidol", subcat:"Antipsicóticos", doses:["1mg","2mg","5mg"], vias:["VO","IV","IM"], posologias:{"VO":["Tomar 1 comprimido ao dia à noite","Tomar 1 comprimido de 12 em 12 horas"],"IV":["Aplicar 2,5-5mg IV lento de 8 em 8 horas"],"IM":["Aplicar 5mg IM de 4 em 4 horas se agitação aguda"]} },
  { id:215, nome:"Clorpromazina", subcat:"Antipsicóticos", doses:["25mg","100mg","200mg"], vias:["VO","IM"], posologias:{"VO":["Tomar 1 comprimido de 8 em 8 horas","Tomar 1 comprimido de 12 em 12 horas"],"IM":["Aplicar 25-50mg IM de 6 em 6 horas (agitação aguda)"]} },
  { id:216, nome:"Risperidona", subcat:"Antipsicóticos", doses:["1mg","2mg","3mg","4mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia à noite","Tomar 1 comprimido de 12 em 12 horas"] },
  { id:217, nome:"Quetiapina", subcat:"Antipsicóticos", doses:["25mg","50mg","100mg","200mg","300mg"], vias:["VO"], posologias:["Tomar 1 comprimido à noite","Tomar 1 comprimido de 12 em 12 horas"] },
  { id:218, nome:"Olanzapina", subcat:"Antipsicóticos", doses:["2,5mg","5mg","10mg","20mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia à noite","Tomar 1 comprimido de 12 em 12 horas"] },
  { id:219, nome:"Aripiprazol", subcat:"Antipsicóticos", doses:["10mg","15mg","20mg","30mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia"] },
  { id:220, nome:"Clozapina", subcat:"Antipsicóticos", doses:["25mg","100mg"], vias:["VO"], posologias:["Tomar 1 comprimido à noite (iniciar com 12,5-25mg e titular lentamente)","Tomar 1 comprimido de 12 em 12 horas (dose plena)"] },
  { id:221, nome:"Lítio (Carbonato de Lítio)", subcat:"Antipsicóticos", doses:["150mg","300mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 8 em 8 horas (ajustar conforme litemia: alvo 0,6-1,0 mEq/L)","Tomar 1 comprimido de 12 em 12 horas"] },
  { id:222, nome:"Vareniclina", subcat:"Auxiliares no tratamento do tabagismo", doses:["0,5mg","1mg"], vias:["VO"], posologias:["Iniciar 0,5mg/dia por 3 dias, depois 0,5mg 2x/dia por 4 dias, depois 1mg 2x/dia por 12 semanas"] },
  // ── Infectologia – Antimicrobianos ───────────────────────────────────────────
  { id:230, nome:"Amoxicilina", subcat:"Antimicrobianos", doses:["250mg","500mg","875mg"], vias:["VO"], posologias:["Tomar 1 cápsula de 8 em 8 horas por 7 dias","Tomar 1 cápsula de 12 em 12 horas por 7 dias"] },
  { id:231, nome:"Amoxicilina + Clavulanato", subcat:"Antimicrobianos", doses:["500mg+125mg","875mg+125mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 8 em 8 horas por 7 dias","Tomar 1 comprimido de 12 em 12 horas por 7 dias"] },
  { id:232, nome:"Ampicilina", subcat:"Antimicrobianos", doses:["250mg","500mg","1g"], vias:["VO","IV","IM"], posologias:{"VO":["Tomar 1 cápsula de 6 em 6 horas por 7 dias"],"IV":["Infundir 1g IV diluída em 100mL SF em 30 min de 6 em 6 horas","Infundir 2g IV de 6 em 6 horas (meningite/sepse grave)"],"IM":["Aplicar 500mg-1g IM de 6 em 6 horas"]} },
  { id:233, nome:"Benzilpenicilina Benzatina", subcat:"Antimicrobianos", doses:["600.000UI","1.200.000UI","2.400.000UI"], vias:["IM"], posologias:["Aplicar 1.200.000UI IM dose única (faringoamigdalite/profilaxia febre reumática)","Aplicar 2.400.000UI IM dose única (sífilis primária/secundária)","Aplicar 2.400.000UI IM 1x por semana por 3 semanas (sífilis terciária)"] },
  { id:234, nome:"Benzilpenicilina Potássica", subcat:"Antimicrobianos", doses:["5.000.000UI"], vias:["IV"], posologias:["Infundir 2-4 milhões UI IV de 4 em 4 horas (infecções graves — meningite, endocardite)"] },
  { id:235, nome:"Cefalexina", subcat:"Antimicrobianos", doses:["250mg","500mg"], vias:["VO"], posologias:["Tomar 1 cápsula de 6 em 6 horas por 7 dias","Tomar 1 cápsula de 8 em 8 horas por 7 dias"] },
  { id:236, nome:"Cefalotina", subcat:"Antimicrobianos", doses:["1g"], vias:["IV","IM"], posologias:{"IV":["Infundir 1 ampola (1g) IV em 100mL SF em 30 min de 6 em 6 horas","Infundir 1g IV de 4 em 4 horas (infecções graves)"],"IM":["Aplicar 1g IM de 6 em 6 horas"]} },
  { id:237, nome:"Cefazolina", subcat:"Antimicrobianos", doses:["1g","2g"], vias:["IV","IM"], posologias:{"IV":["Infundir 1 ampola (1g) IV em 100mL SF em 30 min de 8 em 8 horas","Infundir 2g IV dose única 30 min antes da incisão (profilaxia cirúrgica)"],"IM":["Aplicar 1g IM de 8 em 8 horas"]} },
  { id:238, nome:"Ceftriaxona", subcat:"Antimicrobianos", doses:["1g","2g"], vias:["IV","IM"], posologias:{"IV":["Infundir 1 ampola (1g) IV em 100mL SF em 30 min 1 vez ao dia","Infundir 2g IV 1 vez ao dia (infecções graves/meningite)"],"IM":["Aplicar 1g IM diluída em lidocaína 1% 1 vez ao dia"]} },
  { id:239, nome:"Cefepima", subcat:"Antimicrobianos", doses:["1g","2g"], vias:["IV"], posologias:["Infundir 1g IV em 100mL SF em 30 min de 12 em 12 horas","Infundir 2g IV de 8 em 8 horas (Pseudomonas/infecções graves)"] },
  { id:240, nome:"Ceftazidima", subcat:"Antimicrobianos", doses:["1g","2g"], vias:["IV","IM"], posologias:{"IV":["Infundir 2g IV de 8 em 8 horas (Pseudomonas/meningite por Gram-neg)"],"IM":["Aplicar 1g IM de 8 em 8 horas"]} },
  { id:241, nome:"Azitromicina", subcat:"Antimicrobianos", doses:["250mg","500mg"], vias:["VO"], posologias:["Tomar 1 cápsula (500mg) ao dia por 5 dias","Tomar 500mg no 1° dia e 250mg do 2° ao 5° dia"] },
  { id:242, nome:"Claritromicina", subcat:"Antimicrobianos", doses:["250mg","500mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 500mg de 12 em 12 horas por 7-14 dias","Tomar 500mg de 12 em 12 horas por 14 dias (tríplice H. pylori)"] },
  { id:243, nome:"Eritromicina", subcat:"Antimicrobianos", doses:["250mg","500mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 6 em 6 horas por 7-10 dias","Tomar 500mg de 12 em 12 horas por 7 dias"] },
  { id:244, nome:"Ciprofloxacino", subcat:"Antimicrobianos", doses:["250mg","500mg","750mg"], vias:["VO","IV"], posologias:{"VO":["Tomar 1 comprimido de 12 em 12 horas por 7 dias","Tomar 1 comprimido de 12 em 12 horas por 10 dias"],"IV":["Infundir 400mg IV em 200mL SF em 60 min de 12 em 12 horas"]} },
  { id:245, nome:"Levofloxacino", subcat:"Antimicrobianos", doses:["500mg","750mg"], vias:["VO","IV"], posologias:{"VO":["Tomar 1 comprimido ao dia por 7-14 dias","Tomar 1 comprimido de 750mg ao dia por 5 dias (pneumonia)"],"IV":["Infundir 500mg IV em 100mL SF em 60 min ao dia"]} },
  { id:246, nome:"Doxiciclina", subcat:"Antimicrobianos", doses:["100mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 12 em 12 horas por 7-14 dias","Tomar 2 comprimidos no 1° dia e depois 1 ao dia"] },
  { id:247, nome:"Tetraciclina", subcat:"Antimicrobianos", doses:["250mg","500mg"], vias:["VO"], posologias:["Tomar 1 cápsula de 6 em 6 horas em jejum por 7-14 dias"] },
  { id:248, nome:"Metronidazol", subcat:"Antimicrobianos", doses:["250mg","400mg","500mg"], vias:["VO","IV"], posologias:{"VO":["Tomar 1 comprimido de 400mg de 8 em 8 horas por 7 dias","Tomar 1 comprimido de 500mg de 12 em 12 horas por 7 dias"],"IV":["Infundir 1 frasco (500mg/100mL) IV em 30-60 min de 8 em 8 horas"]} },
  { id:249, nome:"Clindamicina", subcat:"Antimicrobianos", doses:["150mg","300mg","600mg"], vias:["VO","IV","IM"], posologias:{"VO":["Tomar 1 cápsula de 300mg de 6 em 6 horas por 7 dias","Tomar 1 cápsula de 150mg de 6 em 6 horas"],"IV":["Infundir 600-900mg IV em 100mL SF em 30 min de 8 em 8 horas"],"IM":["Aplicar 600mg IM de 8 em 8 horas"]} },
  { id:250, nome:"Vancomicina", subcat:"Antimicrobianos", doses:["500mg","1g"], vias:["IV"], posologias:["Infundir 15-20mg/kg IV em 60-90 min de 12 em 12 horas (ajustar pelo nível sérico)","Infundir 1g IV de 12 em 12 horas (dose empírica adulto 70kg)"] },
  { id:251, nome:"Linezolida", subcat:"Antimicrobianos", doses:["600mg"], vias:["VO","IV"], posologias:{"VO":["Tomar 1 comprimido de 12 em 12 horas por 10-14 dias"],"IV":["Infundir 600mg IV em 30-120 min de 12 em 12 horas"]} },
  { id:252, nome:"Meropeném", subcat:"Antimicrobianos", doses:["500mg","1g"], vias:["IV"], posologias:["Infundir 1g IV em 100mL SF em 30 min de 8 em 8 horas","Infundir 2g IV de 8 em 8 horas (meningite/Pseudomonas)"] },
  { id:253, nome:"Imipeném + Cilastatina", subcat:"Antimicrobianos", doses:["500mg"], vias:["IV"], posologias:["Infundir 500mg IV em 100mL SF em 30 min de 6 em 6 horas","Infundir 1g IV de 8 em 8 horas (infecções graves)"] },
  { id:254, nome:"Gentamicina", subcat:"Antimicrobianos", doses:["40mg/mL","80mg/2mL"], vias:["IV","IM"], posologias:{"IV":["Infundir 5-7mg/kg IV 1 vez ao dia (dose única diária)","Infundir 1,5mg/kg IV de 8 em 8 horas (dose tradicional)"],"IM":["Aplicar 80mg IM de 8 em 8 horas"]} },
  { id:255, nome:"Amicacina", subcat:"Antimicrobianos", doses:["250mg/2mL","500mg/2mL"], vias:["IV","IM"], posologias:{"IV":["Infundir 15-20mg/kg IV 1 vez ao dia","Infundir 7,5mg/kg IV de 12 em 12 horas"],"IM":["Aplicar 7,5mg/kg IM de 12 em 12 horas"]} },
  { id:256, nome:"Tobramicina", subcat:"Antimicrobianos", doses:["80mg/2mL"], vias:["IV","IM"], posologias:{"IV":["Infundir 5-7mg/kg IV 1 vez ao dia","Infundir 1,5mg/kg IV de 8 em 8 horas"],"IM":["Aplicar 1,5mg/kg IM de 8 em 8 horas"]} },
  { id:257, nome:"Polimixina B", subcat:"Antimicrobianos", doses:["500.000UI"], vias:["IV"], posologias:["Infundir 25.000-30.000 UI/kg/dia IV dividido de 12 em 12 horas (ajustar em IRC)"] },
  { id:258, nome:"Sulfametoxazol + Trimetoprima", subcat:"Antimicrobianos", doses:["400/80mg","800/160mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 12 em 12 horas por 7 dias","Tomar 1 comprimido de 12 em 12 horas por 10 dias"] },
  { id:259, nome:"Nitrofurantoína", subcat:"Antimicrobianos", doses:["100mg"], vias:["VO"], posologias:["Tomar 1 cápsula de 6 em 6 horas por 7 dias com refeição"] },
  // ── Infectologia – Antifúngicos ──────────────────────────────────────────────
  { id:265, nome:"Fluconazol", subcat:"Antifúngicos sistêmicos", doses:["50mg","100mg","150mg"], vias:["VO"], posologias:["Tomar 1 cápsula de 150mg dose única (candidíase vaginal)","Tomar 1 cápsula ao dia por 7-14 dias","Tomar 1 cápsula ao dia por 14 dias (candidíase esofágica)"] },
  { id:266, nome:"Itraconazol", subcat:"Antifúngicos sistêmicos", doses:["100mg"], vias:["VO"], posologias:["Tomar 1 cápsula ao dia com refeição gordurosa","Tomar 2 cápsulas ao dia por 7 dias"] },
  { id:267, nome:"Voriconazol", subcat:"Antifúngicos sistêmicos", doses:["200mg"], vias:["VO","IV"], posologias:{"VO":["Tomar 1 comprimido de 12 em 12 horas"],"IV":["Infundir 6mg/kg IV de 12 em 12 horas nas primeiras 24h (ataque), depois 4mg/kg de 12/12h"]} },
  { id:268, nome:"Anfotericina B", subcat:"Antifúngicos sistêmicos", doses:["50mg"], vias:["IV"], posologias:["Infundir 0,5-1mg/kg IV em 500mL SG5% em 4-6h ao dia (pré-medicar com paracetamol e hidrocortisona)"] },
  { id:269, nome:"Cetoconazol", subcat:"Antifúngicos sistêmicos", doses:["200mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia com refeição","Tomar 2 comprimidos ao dia com refeição (infecções graves)"] },
  { id:270, nome:"Nistatina", subcat:"Antifúngicos sistêmicos", doses:["100.000UI/mL"], vias:["VO"], posologias:["Aplicar/gargarizar 1mL (100.000UI) de 6 em 6 horas (candidíase oral)","Tomar 1-2mL VO de 6 em 6 horas (deglutir após bochecho)"] },
  { id:271, nome:"Griseofulvina", subcat:"Antifúngicos sistêmicos", doses:["125mg","500mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 500mg ao dia com refeição gordurosa","Tomar 1 comprimido de 12 em 12 horas (tinea capitis — 6-12 semanas)"] },
  // ── Infectologia – Antivirais ─────────────────────────────────────────────────
  { id:275, nome:"Aciclovir", subcat:"Antivirais", doses:["200mg","400mg","800mg"], vias:["VO","IV","Tópica"], posologias:{"VO":["Tomar 1 comprimido de 400mg de 8 em 8 horas por 7 dias (herpes labial)","Tomar 1 comprimido de 800mg de 4 em 4 horas por 7 dias (herpes zoster)"],"IV":["Infundir 5-10mg/kg IV em 100mL SF em 1h de 8 em 8 horas (herpes encefalite/grave)"],"Tópica":["Aplicar uma fina camada sobre as lesões de 5 em 5 horas (5x ao dia)"]} },
  { id:276, nome:"Valaciclovir", subcat:"Antivirais", doses:["500mg","1g"], vias:["VO"], posologias:["Tomar 1g de 12 em 12 horas por 7 dias (herpes zoster)","Tomar 500mg de 12 em 12 horas por 5 dias (herpes genital)"] },
  { id:277, nome:"Oseltamivir", subcat:"Antivirais", doses:["75mg"], vias:["VO"], posologias:["Tomar 1 cápsula de 12 em 12 horas por 5 dias (influenza — iniciar em até 48h)"] },
  // ── Infectologia – Antirretrovirais ──────────────────────────────────────────
  { id:280, nome:"Tenofovir", subcat:"Antirretrovirais", doses:["300mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia (hepatite B crônica)","Tomar 1 comprimido ao dia em combinação TARV (HIV)"] },
  { id:281, nome:"Lamivudina", subcat:"Antirretrovirais", doses:["150mg","300mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 300mg ao dia (HIV — em combinação)","Tomar 1 comprimido de 150mg de 12 em 12 horas (hepatite B)"] },
  { id:282, nome:"Zidovudina", subcat:"Antirretrovirais", doses:["100mg","300mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 300mg de 12 em 12 horas (em combinação TARV)"] },
  { id:283, nome:"Efavirenz", subcat:"Antirretrovirais", doses:["200mg","600mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 600mg ao dia à noite em jejum (em combinação TARV)"] },
  { id:284, nome:"Lopinavir + Ritonavir", subcat:"Antirretrovirais", doses:["200mg+50mg"], vias:["VO"], posologias:["Tomar 2 comprimidos de 12 em 12 horas com refeição (em combinação TARV)"] },
  // ── Infectologia – Antiparasitários ──────────────────────────────────────────
  { id:288, nome:"Ivermectina", subcat:"Antiparasitários", doses:["6mg"], vias:["VO"], posologias:["Tomar 1 comprimido dose única em jejum (200mcg/kg)"] },
  { id:289, nome:"Albendazol", subcat:"Antiparasitários", doses:["200mg","400mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 400mg dose única","Tomar 1 comprimido de 400mg ao dia por 3 dias"] },
  { id:290, nome:"Mebendazol", subcat:"Antiparasitários", doses:["100mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 12 em 12 horas por 3 dias","Tomar 1 comprimido dose única"] },
  { id:291, nome:"Praziquantel", subcat:"Antiparasitários", doses:["600mg"], vias:["VO"], posologias:["Tomar conforme peso (esquistossomose: 60mg/kg dose única)"] },
  { id:292, nome:"Secnidazol", subcat:"Antiparasitários", doses:["1g"], vias:["VO"], posologias:["Tomar 2 comprimidos (2g) dose única com refeição (giardíase/amebíase)"] },
  { id:293, nome:"Tiabendazol", subcat:"Antiparasitários", doses:["500mg"], vias:["VO"], posologias:["Tomar 25mg/kg de 12 em 12 horas por 3 dias (estrongiloidíase) — máx 3g/dia"] },
  { id:294, nome:"Dietilcarbamazina", subcat:"Antiparasitários", doses:["50mg"], vias:["VO"], posologias:["Tomar 6mg/kg/dia em 3 tomadas por 12 dias (filariose linfática)"] },
  // ── Infectologia – Antimaláricos ─────────────────────────────────────────────
  { id:298, nome:"Cloroquina", subcat:"Antimaláricos", doses:["150mg"], vias:["VO"], posologias:["Tomar conforme protocolo de malária (P. vivax: 25mg/kg em 3 dias)"] },
  { id:299, nome:"Primaquina", subcat:"Antimaláricos", doses:["5mg","15mg"], vias:["VO"], posologias:["Tomar 0,5mg/kg/dia por 7 dias (P. vivax — eliminar hipnozoítas)","Tomar 0,25mg/kg/dia por 14 dias (protocolo alternativo)"] },
  { id:300, nome:"Quinina", subcat:"Antimaláricos", doses:["300mg"], vias:["VO"], posologias:["Tomar 10mg/kg de 8 em 8 horas por 7 dias (malária complicada VO)"] },
  { id:301, nome:"Artemeter + Lumefantrina", subcat:"Antimaláricos", doses:["20/120mg"], vias:["VO"], posologias:["Tomar conforme protocolo de malária (4 comprimidos 2x/dia por 3 dias para adultos >35kg)"] },
  // ── Endocrinologia – Insulinas ───────────────────────────────────────────────
  { id:310, nome:"Insulina NPH", subcat:"Insulinas", doses:["100UI/mL"], vias:["SC"], posologias:["Aplicar __ unidades SC na região abdominal antes do café e __ antes do jantar","Aplicar __ unidades SC ao deitar (esquema basal noturno)","Aplicar 0,2-0,4 UI/kg SC ao dia dividido em 2 aplicações (dose inicial)"] },
  { id:311, nome:"Insulina Regular", subcat:"Insulinas", doses:["100UI/mL"], vias:["SC","IV"], posologias:{"SC":["Aplicar __ unidades SC 30 min antes das refeições principais","Aplicar conforme escala de correção glicêmica"],"IV":["Infundir 0,05-0,1 UI/kg/h IV (cetoacidose diabética — após K+>3,5)"]} },
  { id:312, nome:"Insulina Glargina", subcat:"Insulinas", doses:["100UI/mL","300UI/mL"], vias:["SC"], posologias:["Aplicar __ unidades SC ao dia sempre no mesmo horário (preferencialmente à noite)","Aplicar 0,2 UI/kg SC ao dia como dose inicial"] },
  { id:313, nome:"Insulina Lispro", subcat:"Insulinas", doses:["100UI/mL"], vias:["SC"], posologias:["Aplicar __ unidades SC imediatamente antes das refeições","Aplicar conforme contagem de carboidratos (individualizado)"] },
  // ── Endocrinologia – Hipoglicemiantes ────────────────────────────────────────
  { id:318, nome:"Metformina", subcat:"Hipoglicemiantes", doses:["500mg","850mg","1g"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia com o jantar","Tomar 1 comprimido de 12 em 12 horas com as refeições","Tomar 1 comprimido de 8 em 8 horas com as refeições"] },
  { id:319, nome:"Glibenclamida", subcat:"Hipoglicemiantes", doses:["5mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia antes do café","Tomar 1 comprimido de 12 em 12 horas antes das refeições"] },
  { id:320, nome:"Gliclazida MR", subcat:"Hipoglicemiantes", doses:["30mg","60mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia no café da manhã","Tomar 2 comprimidos ao dia no café da manhã"] },
  { id:321, nome:"Glipizida", subcat:"Hipoglicemiantes", doses:["5mg","10mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia antes do café","Tomar 1 comprimido de 12 em 12 horas antes das refeições"] },
  { id:322, nome:"Sitagliptina", subcat:"Hipoglicemiantes", doses:["100mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia"] },
  { id:323, nome:"Empagliflozina", subcat:"Hipoglicemiantes", doses:["10mg","25mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia pela manhã"] },
  { id:324, nome:"Dapagliflozina", subcat:"Hipoglicemiantes", doses:["10mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia pela manhã"] },
  { id:325, nome:"Liraglutida", subcat:"Hipoglicemiantes", doses:["0,6mg","1,2mg","1,8mg"], vias:["SC"], posologias:["Aplicar 0,6mg SC ao dia por 1 semana (indução), depois 1,2mg ao dia. Aumentar para 1,8mg se necessário"] },
  // ── Endocrinologia – Hormônios ────────────────────────────────────────────────
  { id:330, nome:"Levotiroxina", subcat:"Hormônios e drogas em endocrinologia", doses:["25mcg","50mcg","75mcg","88mcg","100mcg","112mcg","125mcg","150mcg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia em jejum (30 min antes do café)"] },
  { id:331, nome:"Fludrocortisona", subcat:"Hormônios e drogas em endocrinologia", doses:["0,1mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia (insuficiência adrenal — ajustar conforme PA e eletrólitos)"] },
  { id:332, nome:"Prednisona", subcat:"Hormônios e drogas em endocrinologia", doses:["5mg","20mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia pela manhã","Tomar 2 comprimidos ao dia pela manhã por 5 dias"] },
  { id:333, nome:"Dexametasona", subcat:"Hormônios e drogas em endocrinologia", doses:["4mg","8mg"], vias:["VO","IV","IM"], posologias:{"VO":["Tomar 1 comprimido (4mg) ao dia pela manhã"],"IV":["Aplicar 1 ampola (4mg) IV lento de 8 em 8 horas"],"IM":["Aplicar 1 ampola (4mg) IM de 12 em 12 horas"]} },
  { id:334, nome:"Testosterona", subcat:"Hormônios e drogas em endocrinologia", doses:["250mg/mL"], vias:["IM"], posologias:["Aplicar 250mg IM de 3 em 3 semanas (hipogonadismo masculino)","Aplicar 250mg IM a cada 4 semanas (terapia de reposição)"] },
  { id:335, nome:"Estrogênio Conjugado", subcat:"Hormônios e drogas em endocrinologia", doses:["0,3mg","0,625mg","1,25mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia (menopausa — ciclar com progestagênio)","Tomar 1 comprimido ao dia continuamente (histerectomizadas)"] },
  // ── Nutrição e Metabolismo ────────────────────────────────────────────────────
  { id:340, nome:"Vitamina D3", subcat:"Vitaminas", doses:["400UI","1000UI","2000UI","5000UI","10000UI"], vias:["VO"], posologias:["Tomar 1 cápsula ao dia","Tomar 1 cápsula por semana (dose semanal)"] },
  { id:341, nome:"Vitamina A", subcat:"Vitaminas", doses:["5000UI","25000UI","50000UI"], vias:["VO"], posologias:["Tomar 1 cápsula ao dia (deficiência)","Tomar 1 cápsula 2x/semana (profilaxia em populações de risco)"] },
  { id:342, nome:"Vitamina B12 (Cianocobalamina)", subcat:"Vitaminas", doses:["1000mcg"], vias:["VO","IM"], posologias:{"VO":["Tomar 1 comprimido de 1000mcg ao dia (reposição oral)"],"IM":["Aplicar 1 ampola (1000mcg) IM 1x/semana por 4 semanas, depois 1x/mês"]} },
  { id:343, nome:"Vitamina C (Ácido Ascórbico)", subcat:"Vitaminas", doses:["500mg","1g"], vias:["VO","IV"], posologias:{"VO":["Tomar 1 comprimido efervescente ao dia"],"IV":["Infundir 1g IV diluída em 100mL SF em 30 min (escorbuto/estados críticos)"]} },
  { id:344, nome:"Vitamina K", subcat:"Vitaminas", doses:["1mg","10mg"], vias:["IV","VO"], posologias:{"IV":["Infundir 10mg IV lento para reversão de varfarina"],"VO":["Tomar 10mg VO ao dia para reversão oral de varfarina"]} },
  { id:345, nome:"Vitamina B1 (Tiamina)", subcat:"Vitaminas", doses:["100mg"], vias:["VO","IV","IM"], posologias:{"VO":["Tomar 1 comprimido ao dia (profilaxia)","Tomar 3 comprimidos ao dia (deficiência/alcoolismo)"],"IV":["Aplicar 100-500mg IV lento de 8 em 8 horas (encefalopatia de Wernicke)"],"IM":["Aplicar 100mg IM ao dia por 7 dias"]} },
  { id:346, nome:"Vitamina B6 (Piridoxina)", subcat:"Vitaminas", doses:["40mg","50mg","100mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia","Tomar 1 comprimido de 8 em 8 horas (náuseas da gestação)"] },
  { id:347, nome:"Ácido Fólico", subcat:"Vitaminas", doses:["0,4mg","5mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia","Tomar 1 comprimido de 12 em 12 horas"] },
  { id:348, nome:"Zinco (Sulfato de Zinco)", subcat:"Vitaminas", doses:["40mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia (reposição — diarreia infantil: 20mg/dia por 10-14 dias)"] },
  { id:349, nome:"Cloreto de Potássio (KCL oral)", subcat:"Eletrólitos para uso oral", doses:["600mg","1g"], vias:["VO"], posologias:["Tomar conforme prescrição (dose calculada pelo potássio sérico)"] },
  { id:350, nome:"Soro de Reidratação Oral", subcat:"Soluções de hidratação oral", doses:["OMS"], vias:["VO"], posologias:["Dissolver 1 sachê em 1L de água e tomar aos poucos conforme tolerância"] },
  { id:351, nome:"Sibutramina", subcat:"Inibidores do apetite", doses:["10mg","15mg"], vias:["VO"], posologias:["Tomar 1 cápsula ao dia pela manhã"] },
  // ── Hematologia ────────────────────────────────────────────────────────────────
  { id:355, nome:"Sulfato Ferroso", subcat:"Ferrosos", doses:["40mg","65mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia em jejum","Tomar 1 comprimido de 8 em 8 horas em jejum"] },
  { id:356, nome:"Ferrum hausmann (Fe polimaltosado)", subcat:"Ferrosos", doses:["100mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia","Tomar 1 comprimido de 12 em 12 horas"] },
  { id:357, nome:"Eritropoetina", subcat:"Outras drogas hematológicas", doses:["2000UI","4000UI","10000UI"], vias:["SC","IV"], posologias:{"SC":["Aplicar 1 seringa de 4000UI SC 3 vezes/semana (anemia da IRC)"],"IV":["Aplicar 1 seringa IV ao final da hemodiálise (3x/semana)"]} },
  { id:358, nome:"Darbepoetina", subcat:"Outras drogas hematológicas", doses:["25mcg","40mcg","60mcg"], vias:["SC","IV"], posologias:{"SC":["Aplicar 1 seringa SC 1x/semana ou 1x a cada 2 semanas (anemia da IRC)"],"IV":["Aplicar IV ao final da hemodiálise"]} },
  { id:359, nome:"Desferoxamina", subcat:"Outras drogas hematológicas", doses:["500mg"], vias:["IV","IM","SC"], posologias:{"IV":["Infundir 15mg/kg/h IV em 8-12h (quelação de ferro — intoxicação aguda)"],"SC":["Aplicar 20-40mg/kg SC em infusão de 8-12h por bomba (terapia crônica)"],"IM":["Aplicar 500mg IM dose única (intoxicação leve)"]} },
  // ── Ginecologia e Obstetrícia ─────────────────────────────────────────────────
  { id:365, nome:"Anticoncepcional oral combinado (Etinilestradiol + Levonorgestrel)", subcat:"Anticoncepcionais", doses:["30mcg+150mcg","20mcg+100mcg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia (iniciar no 1° dia da menstruação, sem intervalo)"] },
  { id:366, nome:"Levonorgestrel (Anticoncepcional emergência)", subcat:"Anticoncepcionais", doses:["1,5mg","0,75mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 1,5mg dose única (até 72h após relação)"] },
  { id:367, nome:"Medroxiprogesterona Acetato", subcat:"Anticoncepcionais", doses:["150mg/mL","2,5mg","5mg"], vias:["IM","VO"], posologias:{"IM":["Aplicar 1 ampola (150mg) IM 1x a cada 3 meses (anticoncepcional injetável)"],"VO":["Tomar 1 comprimido ao dia (reposição hormonal — fase lútea)","Tomar 1 comprimido de 12 em 12 horas (sangramento uterino disfuncional)"]} },
  { id:368, nome:"Progesterona vaginal", subcat:"Drogas usadas em obstetrícia", doses:["100mg","200mg","8%"], vias:["Vaginal"], posologias:["Inserir 1 cápsula de 200mg pela via vaginal ao deitar (prevenção de parto prematuro)","Inserir 1 dose de gel vaginal 8% ao dia (suporte de fase lútea)"] },
  { id:369, nome:"Misoprostol", subcat:"Drogas usadas em obstetrícia", doses:["25mcg","200mcg"], vias:["VO","Vaginal"], posologias:{"VO":["Tomar 400-600mcg VO (indução do aborto — conforme protocolo)"],"Vaginal":["Inserir 25-50mcg vaginal de 4 em 4 horas (indução do trabalho de parto)","Inserir 800mcg vaginal dose única (aborto retido)"]} },
  { id:370, nome:"Ocitocina", subcat:"Drogas usadas em obstetrícia", doses:["5UI/mL","10UI/mL"], vias:["IV","IM"], posologias:{"IV":["Infundir 10-40 UI IV em 1000mL SG5% após dequitação (hemorragia pós-parto)","Infundir 0,5-2 mU/min IV com aumento gradual (indução do trabalho de parto)"],"IM":["Aplicar 10 UI IM imediatamente após o parto (manejo ativo do 3° período)"]} },
  // ── Nefrologia ────────────────────────────────────────────────────────────────
  { id:375, nome:"Carbonato de Cálcio (quelante de fósforo)", subcat:"Drogas usadas em nefrologia", doses:["500mg","1250mg"], vias:["VO"], posologias:["Tomar 1 comprimido com as refeições","Tomar 2 comprimidos com as refeições"] },
  { id:376, nome:"Sevelamer", subcat:"Drogas usadas em nefrologia", doses:["800mg"], vias:["VO"], posologias:["Tomar 1-4 comprimidos com cada refeição (ajustar conforme fósforo)"] },
  { id:377, nome:"Calcitriol (Vitamina D ativa)", subcat:"Drogas usadas em nefrologia", doses:["0,25mcg","0,5mcg"], vias:["VO"], posologias:["Tomar 1 cápsula ao dia (hiperparatireoidismo secundário à IRC)","Tomar 1 cápsula de 0,25mcg em dias alternados"] },
  // ── Ortopedia e Reumatologia ─────────────────────────────────────────────────
  { id:380, nome:"Ibuprofeno (AINE)", subcat:"Anti-inflamatórios não esteroides", doses:["200mg","400mg","600mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 8 em 8 horas com refeição","Tomar 1 comprimido de 6 em 6 horas com refeição"] },
  { id:381, nome:"Naproxeno", subcat:"Anti-inflamatórios não esteroides", doses:["250mg","500mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 12 em 12 horas com refeição","Tomar 1 comprimido de 8 em 8 horas com refeição"] },
  { id:382, nome:"Meloxicam", subcat:"Anti-inflamatórios não esteroides", doses:["7,5mg","15mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia com refeição"] },
  { id:383, nome:"Diclofenaco Sódico", subcat:"Anti-inflamatórios não esteroides", doses:["50mg","75mg","100mg"], vias:["VO","IM"], posologias:{"VO":["Tomar 1 comprimido de 8 em 8 horas com refeição","Tomar 1 comprimido de 12 em 12 horas com refeição"],"IM":["Aplicar 1 ampola (75mg) IM dose única (cólica/dor aguda)"]} },
  { id:384, nome:"Celecoxibe", subcat:"Anti-inflamatórios não esteroides", doses:["100mg","200mg"], vias:["VO"], posologias:["Tomar 1 cápsula de 12 em 12 horas com refeição","Tomar 1 cápsula ao dia"] },
  { id:385, nome:"Indometacina", subcat:"Anti-inflamatórios não esteroides", doses:["25mg","50mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 8 em 8 horas com refeição (gota aguda)","Tomar 1 comprimido de 12 em 12 horas com refeição"] },
  { id:386, nome:"Prednisona (reumatologia)", subcat:"Corticosteroides sistêmicos", doses:["5mg","20mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia pela manhã","Tomar 1-2 comprimidos ao dia pela manhã (dose de ataque)"] },
  { id:387, nome:"Corticosteroide (Triancinolona) intra-articular", subcat:"Corticosteroides sistêmicos", doses:["40mg/mL"], vias:["Intra-articular"], posologias:["Aplicar 1 mL (40mg) intra-articular no joelho (máx 3-4x/ano)","Aplicar 0,25-0,5 mL intra-articular em articulações menores"] },
  { id:388, nome:"Ciclobenzaprina", subcat:"Relaxantes musculares", doses:["5mg","10mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 8 em 8 horas","Tomar 1 comprimido à noite"] },
  { id:389, nome:"Carisoprodol + Diclofenaco", subcat:"Relaxantes musculares", doses:["125mg+50mg","250mg+50mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 8 em 8 horas por 5 dias","Tomar 1 comprimido de 12 em 12 horas"] },
  { id:390, nome:"Alopurinol", subcat:"Drogas para osteoartrite", doses:["100mg","300mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia","Tomar 1 comprimido de 12 em 12 horas"] },
  { id:391, nome:"Colchicina", subcat:"Drogas para osteoartrite", doses:["0,5mg"], vias:["VO"], posologias:["Tomar 2 comprimidos no início da crise, depois 1 a cada 1-2h até melhora (máx 8mg)","Tomar 1 comprimido ao dia (profilaxia)"] },
  { id:392, nome:"Alendronato de Sódio", subcat:"Drogas para osteoporose", doses:["70mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 70mg 1x/semana em jejum (permanecer em pé por 30 min após)"] },
  { id:393, nome:"Risedronato", subcat:"Drogas para osteoporose", doses:["35mg","150mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 35mg 1x/semana em jejum","Tomar 1 comprimido de 150mg 1x/mês em jejum"] },
  { id:394, nome:"Calcitonina", subcat:"Drogas para osteoporose", doses:["100UI/mL","200UI/dose"], vias:["IM","Intranasal"], posologias:{"IM":["Aplicar 100 UI IM ao dia (fraturas osteoporóticas agudas)"],"Intranasal":["Aplicar 1 jato (200UI) em uma narina ao dia (alternando)"]} },
  { id:395, nome:"Carbonato de Cálcio + Vit D", subcat:"Drogas para distúrbios do cálcio e fósforo", doses:["500mg+200UI","1250mg+400UI"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia com refeição","Tomar 1 comprimido de 12 em 12 horas com refeição"] },
  // ── Imunologia ─────────────────────────────────────────────────────────────────
  { id:400, nome:"Metotrexato", subcat:"Imunossupressores", doses:["2,5mg","5mg","10mg","25mg"], vias:["VO","SC","IM"], posologias:{"VO":["Tomar __ comprimidos 1x por semana (dose única semanal)"],"SC":["Aplicar __ mg SC 1x por semana"],"IM":["Aplicar __ mg IM 1x por semana"]} },
  { id:401, nome:"Azatioprina", subcat:"Imunossupressores", doses:["50mg"], vias:["VO"], posologias:["Tomar 1-3 comprimidos ao dia (2-3mg/kg/dia)"] },
  { id:402, nome:"Ciclosporina", subcat:"Imunossupressores", doses:["25mg","50mg","100mg"], vias:["VO"], posologias:["Tomar conforme nível sérico (alvo individualizado)"] },
  { id:403, nome:"Hidroxicloroquina", subcat:"Imunossupressores", doses:["400mg"], vias:["VO"], posologias:["Tomar 1 comprimido ao dia (400mg/dia ou 5mg/kg/dia)"] },
  { id:404, nome:"Sulfassalazina", subcat:"Imunossupressores", doses:["500mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 12 em 12 horas (iniciar)","Tomar 2 comprimidos de 12 em 12 horas (dose plena)"] },
  { id:405, nome:"Leflunomida", subcat:"Imunossupressores", doses:["10mg","20mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 20mg ao dia","Tomar 1 comprimido de 10mg ao dia (manutenção)"] },
  // ── Dermatologia ──────────────────────────────────────────────────────────────
  { id:410, nome:"Hidrocortisona creme 1%", subcat:"Tópicos dermatológicos", doses:["1%"], vias:["Tópica"], posologias:["Aplicar uma fina camada sobre a área afetada de 12 em 12 horas","Aplicar ao dia (manutenção)"] },
  { id:411, nome:"Betametasona creme 0,1%", subcat:"Tópicos dermatológicos", doses:["0,1%"], vias:["Tópica"], posologias:["Aplicar uma fina camada sobre a área afetada de 12 em 12 horas"] },
  { id:412, nome:"Isotretinoína", subcat:"Tópicos dermatológicos", doses:["10mg","20mg","0,05%"], vias:["VO","Tópica"], posologias:{"VO":["Tomar 0,5-1mg/kg/dia com refeição (acne grave — ciclo de 16-24 semanas)"],"Tópica":["Aplicar gel fino sobre as lesões ao deitar"]} },
  { id:413, nome:"Cetoconazol tópico", subcat:"Tópicos dermatológicos", doses:["2%"], vias:["Tópica"], posologias:["Aplicar shampoo sobre o couro cabeludo/área afetada 2x/semana (deixar agir 3-5 min)","Aplicar creme sobre a área afetada de 12 em 12 horas por 2-4 semanas"] },
  { id:414, nome:"Miconazol tópico", subcat:"Tópicos dermatológicos", doses:["2%"], vias:["Tópica"], posologias:["Aplicar creme sobre a área afetada de 12 em 12 horas por 2-4 semanas"] },
  { id:415, nome:"Permetrina", subcat:"Tópicos dermatológicos", doses:["1%","5%"], vias:["Tópica"], posologias:["Aplicar loção 5% sobre todo o corpo (pescoço para baixo) antes de dormir, lavar após 8-14h (escabiose)","Aplicar loção 1% sobre o cabelo úmido, aguardar 10 min e enxaguar (pediculose)"] },
  { id:416, nome:"Ácido Salicílico", subcat:"Tópicos dermatológicos", doses:["2%","6%","10%"], vias:["Tópica"], posologias:["Aplicar sobre a área afetada 1-2x ao dia","Aplicar sob oclusão ao deitar (hiperqueratoses)"] },
  { id:417, nome:"Benzoil Peróxido", subcat:"Tópicos dermatológicos", doses:["2,5%","5%","10%"], vias:["Tópica"], posologias:["Aplicar gel sobre as lesões de acne ao deitar (iniciar com 2,5%)","Aplicar sabonete facial e enxaguar (uso diário)"] },
  { id:418, nome:"Tretinoína", subcat:"Tópicos dermatológicos", doses:["0,025%","0,05%","0,1%"], vias:["Tópica"], posologias:["Aplicar creme/gel em fina camada sobre as lesões de acne ao deitar (iniciar 0,025%)"] },
  { id:419, nome:"Minoxidil tópico", subcat:"Tópicos dermatológicos", doses:["2%","5%"], vias:["Tópica"], posologias:["Aplicar 1mL sobre o couro cabeludo seco na área de alopecia de 12 em 12 horas","Aplicar 1mL ao dia (5% — noturno, mulheres)"] },
  // ── Oftalmologia ───────────────────────────────────────────────────────────────
  { id:425, nome:"Colírio de Tobramicina", subcat:"Tópicos oftalmológicos", doses:["0,3%"], vias:["Ocular"], posologias:["Aplicar 1-2 gotas no(s) olho(s) afetado(s) de 6 em 6 horas por 7 dias"] },
  { id:426, nome:"Colírio de Dexametasona", subcat:"Tópicos oftalmológicos", doses:["0,1%"], vias:["Ocular"], posologias:["Aplicar 1-2 gotas no(s) olho(s) afetado(s) de 6 em 6 horas"] },
  { id:427, nome:"Timolol colírio", subcat:"Tópicos oftalmológicos", doses:["0,25%","0,5%"], vias:["Ocular"], posologias:["Aplicar 1 gota no(s) olho(s) afetado(s) de 12 em 12 horas (glaucoma)"] },
  { id:428, nome:"Latanoprosta", subcat:"Tópicos oftalmológicos", doses:["0,005%"], vias:["Ocular"], posologias:["Aplicar 1 gota no(s) olho(s) afetado(s) ao deitar (glaucoma — 1x ao dia à noite)"] },
  { id:429, nome:"Pilocarpina colírio", subcat:"Tópicos oftalmológicos", doses:["1%","2%","4%"], vias:["Ocular"], posologias:["Aplicar 1-2 gotas no(s) olho(s) afetado(s) de 6 em 6 horas (glaucoma de ângulo fechado)"] },
  { id:430, nome:"Ciprofloxacino colírio", subcat:"Tópicos oftalmológicos", doses:["0,3%"], vias:["Ocular"], posologias:["Aplicar 1-2 gotas no(s) olho(s) afetado(s) de 6 em 6 horas por 7 dias"] },
  // ── Otorrinolaringologia ───────────────────────────────────────────────────────
  { id:435, nome:"Ciprofloxacino otológico", subcat:"Tópicos otológicos", doses:["0,3%"], vias:["Otológica"], posologias:["Aplicar 3-4 gotas no canal auditivo externo de 12 em 12 horas por 7 dias"] },
  // ── Cirurgia e Anestesia ───────────────────────────────────────────────────────
  { id:440, nome:"Lidocaína", subcat:"Anestésicos locais", doses:["1%","2%","10%"], vias:["SC","Tópica","Infiltração"], posologias:{"SC":["Infiltrar conforme procedimento: máx 4,5mg/kg sem vasoconstritor"],"Tópica":["Aplicar spray 10% na mucosa (2-3 jatos) — aguardar 1-2 min"]} },
  { id:441, nome:"Bupivacaína", subcat:"Anestésicos locais", doses:["0,25%","0,5%"], vias:["Infiltração","Peridural","Raquianestesia"], posologias:["Administrar conforme protocolo anestésico — dose máx: 2mg/kg","Administrar 2-4mL a 0,5% intratecal (raquianestesia)"] },
  // ── Diversos ──────────────────────────────────────────────────────────────────
  { id:450, nome:"Polidocanol", subcat:"Drogas usadas em varizes e hemorroidas", doses:["0,5%","1%","3%"], vias:["Intravenosa (escleroterapia)"], posologias:["Injetar intravascular conforme protocolo de escleroterapia (0,5-2mL/ponto)"] },
  { id:451, nome:"Contraste iodado (Iohexol)", subcat:"Contrastes para exames de imagem", doses:["300mg/mL","350mg/mL"], vias:["IV"], posologias:["Infundir conforme protocolo radiológico"] },
  { id:452, nome:"Finasterida", subcat:"Medicamentos tópicos para alopecia", doses:["1mg","5mg"], vias:["VO"], posologias:["Tomar 1 comprimido de 1mg ao dia (alopecia)","Tomar 1 comprimido de 5mg ao dia (HBP)"] },
];

const FULL_CATEGORIES = [
  {
    nome: "Sintomáticos",
    subcats: ["Analgésicos e antipiréticos","Analgésicos potentes","Antieméticos e procinéticos","Anti-histamínicos"]
  },
  {
    nome: "Cardiologia",
    subcats: ["Diuréticos","Digitálicos","Drogas na insuficiência cardíaca refratária","Anti-hipertensivos","Antiarrítmicos","Antilipemiantes","Vasodilatadores coronarianos","Vasodilatadores periféricos e cerebrais","Trombolíticos e fibrinolíticos","Drogas usadas na hipertensão pulmonar","Drogas para doença de Chagas","Antiplaquetários","Anticoagulantes"]
  },
  {
    nome: "Emergências",
    subcats: ["Drogas para emergências e parada","Drogas usadas no controle das hemorragias","Expansores plasmáticos coloides","Drogas usadas na hipotensão sintomática","Antagonistas e antídotos","Curares – bloqueadores neuromusculares","Soros heterólogos (antitoxina e antiveneno)"]
  },
  {
    nome: "Sistema Respiratório",
    subcats: ["Sintomáticos para gripes e resfriados","Descongestionantes com anti-histamínicos","Tópicos nasais","Antitussígenos e sedativos da tosse","Mucolíticos e expectorantes","Drogas para asma"]
  },
  {
    nome: "Gastroenterologia",
    subcats: ["Antiácidos minerais","Bloqueadores H2","Inibidores da bomba de prótons","Antiespasmódicos","Antiflatulentos","Laxantes e catárticos","Antidiarreicos","Colutórios e tópicos orais","Tópicos proctológicos"]
  },
  {
    nome: "Neurologia",
    subcats: ["Anticonvulsivantes","Analgésicos para enxaqueca","Antiparkinsonianos","Drogas usadas na demência","Outras drogas úteis em neurologia"]
  },
  {
    nome: "Psiquiatria",
    subcats: ["Sedativos e ansiolíticos","Antidepressivos","Antipsicóticos","Auxiliares no tratamento do tabagismo","Outras drogas psicoativas"]
  },
  {
    nome: "Infectologia",
    subcats: ["Antimicrobianos","Antifúngicos sistêmicos","Antivirais","Antirretrovirais","Antiparasitários","Antimaláricos","Vacinas"]
  },
  {
    nome: "Endocrinologia",
    subcats: ["Insulinas","Hipoglicemiantes","Hormônios e drogas em endocrinologia"]
  },
  {
    nome: "Nutrição e Metabolismo",
    subcats: ["Vitaminas","Polivitamínicos","Eletrólitos para uso oral","Eletrólitos para uso venoso","Soluções de hidratação oral","Inibidores do apetite"]
  },
  {
    nome: "Hematologia",
    subcats: ["Ferrosos","Associações para anemias pluricarenciais","Anticoagulantes","Antiplaquetários","Outras drogas hematológicas"]
  },
  {
    nome: "Ginecologia e Obstetrícia",
    subcats: ["Anticoncepcionais","Reposição hormonal","Drogas usadas em obstetrícia","Drogas usadas na infertilidade feminina","Drogas usadas em ginecologia","Tópicos ginecológicos"]
  },
  {
    nome: "Nefrologia",
    subcats: ["Drogas usadas em nefrologia"]
  },
  {
    nome: "Ortopedia e Reumatologia",
    subcats: ["Anti-inflamatórios não esteroides","Corticosteroides sistêmicos","Relaxantes musculares","Drogas para osteoartrite","Drogas para distúrbios do cálcio e fósforo","Drogas para osteoporose","Drogas para outras osteopatias"]
  },
  {
    nome: "Oncologia",
    subcats: ["Antineoplásicos e quimioterápicos","Drogas auxiliares em oncologia"]
  },
  {
    nome: "Imunologia",
    subcats: ["Imunossupressores","Imunoglobulinas humanas"]
  },
  {
    nome: "Dermatologia",
    subcats: ["Tópicos dermatológicos"]
  },
  {
    nome: "Oftalmologia",
    subcats: ["Tópicos oftalmológicos"]
  },
  {
    nome: "Otorrinolaringologia",
    subcats: ["Tópicos otológicos"]
  },
  {
    nome: "Cirurgia e Anestesia",
    subcats: ["Anestésicos locais","Tratamentos tópicos para feridas e curativos","Hemostáticos e colas cirúrgicas","Anestésicos gerais inalatórios"]
  },
  {
    nome: "Diversos",
    subcats: ["Drogas usadas em varizes e hemorroidas","Drogas para erros inatos do metabolismo","Contrastes para exames de imagem","Drogas diversas","Medicamentos tópicos para alopecia","Populares de eficácia controversa"]
  },
];

// ─── PROTOCOLS DB ─────────────────────────────────────────────────────────────
const PROTOCOLS_FULL = {
  "Sistema Circulatório": {
    icone: "❤️",
    items: {
      "Insuficiência Cardíaca": { cid:"I50", icon:"🖤", meds:[70,44,43,61,50], conduta:"IECA/BRA + Beta-bloqueador + ARM (tripla terapia). Adicionar diurético de alça se congestão. SGLT-2 reduz hospitalização. Digoxina se FA associada.", metas:["FE>35% com terapia otimizada","Redução de internações","Melhora NYHA"], descricao:"Síndrome clínica com sintomas e sinais resultantes de disfunção cardíaca estrutural ou funcional." },
      "Hipertensão Arterial": { cid:"I10", icon:"❤️", meds:[60,61,40,66,68], conduta:"Iniciar com MEV. Farmacoterapia: IECA/BRA para DM/IRC. Tiazídico ou BCC como alternativa. Associar conforme necessidade.", metas:["PA<130/80 (geral)","PA<140/90 (>65 anos frágil)"], descricao:"PA sistólica ≥140 mmHg e/ou diastólica ≥90 mmHg em pelo menos 2 aferições." },
      "Angina e Dor Torácica": { cid:"I20", icon:"💔", meds:[97,95,86,110,4], conduta:"Repouso + nitrato sublingual na crise. Antiagregante + estatina. Beta-bloqueador para redução de frequência. Avaliar revascularização.", metas:["Controle dos sintomas","Prevenção de IAM"], descricao:"Dor ou desconforto torácico por isquemia miocárdica transitória." },
      "Infarto Agudo do Miocárdio": { cid:"I21", icon:"🚨", meds:[110,111,86,70,61], conduta:"AAS 300mg + Clopidogrel 300mg. Heparina. Estatina de alta intensidade. IECA. Beta-bloqueador. Reperfusão precoce (ICP ou fibrinólise).", metas:["Reperfusão <90min (ICP)","TIMI III"], descricao:"Necrose miocárdica por oclusão coronariana prolongada." },
      "Dislipidemias": { cid:"E78", icon:"🫀", meds:[86,85,89,90], conduta:"Estatina de alta intensidade se risco cardiovascular alto. Ezetimiba associada se meta não atingida. Fibrato se hipertrigliceridemia.", metas:["LDL<70 (alto risco)","LDL<100 (risco intermediário)"], descricao:"Alterações dos lipídeos séricos: hipercolesterolemia, hipertrigliceridemia ou ambas." },
      "Tabagismo": { cid:"F17", icon:"🚬", meds:[222,213], conduta:"Terapia de reposição nicotínica + vareniclina ou bupropiona. Abordagem motivacional. Apoio grupal.", metas:["Cessação do tabagismo"], descricao:"Dependência química à nicotina com risco cardiovascular e oncológico aumentado." },
      "Parada Cardiorrespiratória": { cid:"I46", icon:"💀", meds:[120,122,123,121], conduta:"RCP de alta qualidade. Adrenalina 1mg IV a cada 3-5 min. Amiodarona 300mg na FV/TV. Tratar causas reversíveis (4H 4T).", metas:["ROSC","Neuroproteção"], descricao:"Ausência de atividade mecânica cardíaca efetiva confirmada por ausência de pulso, responsividade e respiração." },
      "Arritmia": { cid:"I49", icon:"📊", meds:[80,81,50,121], conduta:"Identificar tipo de arritmia. FA: controle de frequência (beta-bloqueador/digoxina) ou ritmo. Anticoagulação se CHADS2≥1.", metas:["Controle frequência/ritmo","Prevenção de eventos tromboembólicos"], descricao:"Alterações no ritmo, frequência ou origem do estímulo cardíaco." },
      "Choque": { cid:"R57", icon:"⚠️", meds:[130,131,129], conduta:"Identificar tipo. Cardiogênico: inotrópicos. Séptico: norepinefrina + antibióticos precoces + volume. Hipovolêmico: reposição volêmica.", metas:["PAM>65 mmHg","Lactato<2 mmol/L"], descricao:"Estado de hipoperfusão tecidual generalizada com disfunção de órgãos." },
    }
  },
  "Sistema Respiratório": {
    icone: "🫁",
    items: {
      "Gripes e Resfriados": { cid:"J06", icon:"🤧", meds:[1,2,30,143], conduta:"Tratamento sintomático. Antitérmicos, analgésicos, descongestionantes. Oseltamivir para influenza grave ou grupos de risco.", metas:["Alívio dos sintomas","Prevenção de complicações"], descricao:"Infecção viral aguda das vias aéreas superiores." },
      "Rinite Alérgica": { cid:"J30", icon:"🌿", meds:[30,31,141,142], conduta:"Anti-histamínico oral + corticosteroide nasal tópico. Imunoterapia para casos selecionados.", metas:["Controle dos sintomas","Qualidade de vida"], descricao:"Inflamação da mucosa nasal mediada por IgE com rinorreia, espirros e obstrução nasal." },
      "Sinusite": { cid:"J32", icon:"😖", meds:[231,232,141,142,1], conduta:"Viral: sintomático. Bacteriana: amoxicilina-clavulanato 7-10 dias. Corticosteroide nasal adjuvante.", metas:["Resolução dos sintomas"], descricao:"Inflamação dos seios paranasais, frequentemente seguida de resfriado." },
      "Pneumonia Comunitária": { cid:"J18", icon:"🫁", meds:[230,231,238,241], conduta:"CURB-65 0-1: amoxicilina VO. CURB-65 2: internação. CURB-65 ≥3: UTI, betalactâmico + macrolídeo EV.", metas:["Resolução do quadro infeccioso"], descricao:"Infecção pulmonar adquirida fora do ambiente hospitalar." },
      "Asma": { cid:"J45", icon:"💨", meds:[147,149,150,154,155], conduta:"Leve intermitente: SABA se necessário. Persistente leve: CI baixa dose. Moderada: CI + LABA. Grave: CI alta dose + biológico.", metas:["Sem sintomas diurnos","FEF1>80%"], descricao:"Doença inflamatória crônica das vias aéreas com hiper-responsividade brônquica." },
      "DPOC": { cid:"J44", icon:"💨", meds:[153,152,147,149], conduta:"LAMA como primeira linha. LAMA+LABA se sintomas persistentes. Adicionar CI se ≥2 exacerbações/ano ou eosinofilia.", metas:["Redução de exacerbações","Melhora da QVRS"], descricao:"Obstrução crônica e progressiva ao fluxo aéreo, irreversível, relacionada ao tabaco." },
      "Tromboembolismo Pulmonar": { cid:"I26", icon:"🩸", meds:[112,113,114,116], conduta:"Anticoagulação plena imediata (HBPM ou anticoagulante oral). Trombólise se maciço com instabilidade hemodinâmica.", metas:["Anticoagulação adequada","Prevenção de recorrência"], descricao:"Obstrução da artéria pulmonar ou seus ramos por êmbolo." },
    }
  },
  "Gastroenterologia": {
    icone: "🫄",
    items: {
      "Gastrite e Úlcera": { cid:"K25", icon:"🫄", meds:[164,165,162,231,248], conduta:"IBP por 4-8 semanas. H. pylori: tríplice (IBP + claritromicina + amoxicilina) 14 dias. Suspender AINEs.", metas:["Alívio dos sintomas","Cicatrização","Erradicação H. pylori"], descricao:"Inflamação da mucosa gástrica, frequentemente associada a H. pylori ou AINEs." },
      "Refluxo Gastroesofágico": { cid:"K21", icon:"🔥", meds:[164,165,166,162], conduta:"MEV (elevar cabeceira, evitar alimentos gatilho). IBP como primeira linha. Procinético como adjuvante.", metas:["Alívio da pirose","Cicatrização esofágica"], descricao:"Retorno do conteúdo gástrico ao esôfago causando sintomas e/ou lesões." },
      "Constipação Intestinal": { cid:"K59.0", icon:"🚽", meds:[171,172,173], conduta:"MEV (hidratação, fibras, exercício). Laxante osmótico (lactulose). Estimulante se refratário.", metas:["Evacuações regulares"], descricao:"Redução da frequência das evacuações (<3x/semana) ou dificuldade de evacuar." },
      "Diarreia Aguda": { cid:"A09", icon:"💧", meds:[175,350,1,2], conduta:"Reidratação oral. Probióticos. Antidiarreico apenas em diarreia não sanguinolenta. Antibiótico se febre + diarreia invasiva.", metas:["Controle da diarreia","Prevenção de desidratação"], descricao:"Aumento da frequência e/ou diminuição da consistência das fezes com duração <14 dias." },
      "Hepatites Virais": { cid:"B15", icon:"🟡", meds:[280,275,276], conduta:"Hepatite A e E: sintomático. Hepatite B crônica: tenofovir/entecavir. Hepatite C: DAA (sofosbuvir+ledipasvir 12 semanas).", metas:["Clearance viral","Prevenção de cirrose"], descricao:"Inflamação hepática de etiologia viral." },
      "Parasitoses Intestinais": { cid:"B82", icon:"🦠", meds:[289,290,288,291], conduta:"Identificar o parasita. Albendazol ou mebendazol para nematelmintos. Praziquantel para cestoídes/trematódeos. Ivermectina para estrongiloidíase.", metas:["Erradicação do parasita"], descricao:"Infecções por helmintos ou protozoários intestinais." },
    }
  },
  "Hematologia": {
    icone: "🔴",
    items: {
      "Anemia Ferropriva": { cid:"D50", icon:"🔴", meds:[355,356,347,343], conduta:"Sulfato ferroso 150-200mg Fe elementar/dia em 2-3 tomadas em jejum. Vitamina C facilita absorção. Tratar por 3-6 meses após normalização da Hb.", metas:["Hb>12g/dL (mulheres)","Ferritina>30 ng/mL"], descricao:"Deficiência de ferro levando a hemoglobina reduzida." },
    }
  },
  "Nefrologia": {
    icone: "🫘",
    items: {
      "Infecção do Trato Urinário": { cid:"N39.0", icon:"🦠", meds:[258,244,230], conduta:"Cistite não complicada: SMX-TMP 3 dias. Pielonefrite: fluoroquinolona 7-14 dias. Gestante: amoxicilina.", metas:["Resolução dos sintomas","Urocultura negativa"], descricao:"Infecção bacteriana do trato urinário. Principais agentes: E. coli, Klebsiella." },
      "Insuficiência Renal Crônica": { cid:"N18", icon:"🫘", meds:[60,61,318,375,376], conduta:"IECA/BRA para nefroprotecção. Controle pressórico e glicêmico. Manejo da anemia, distúrbios minerais e ósseos.", metas:["Retardar progressão","TFG estável"], descricao:"Perda progressiva e irreversível da função renal." },
    }
  },
  "Endocrinologia": {
    icone: "🩸",
    items: {
      "Diabetes Mellitus Tipo 2": { cid:"E11", icon:"🩸", meds:[318,319,320,322,323,310,311], conduta:"Primeira linha: metformina. Adicionar SGLT-2 se DCV. Sulfonilureia se custo limitante. Insulinizar se HbA1c elevada.", metas:["HbA1c<7%","Glicemia jejum 80-130 mg/dL"], descricao:"Glicemia de jejum ≥126 mg/dL ou HbA1c ≥6,5% em 2 ocasiões." },
      "Hipotireoidismo": { cid:"E03", icon:"🦋", meds:[330], conduta:"Levotiroxina em jejum, 30 min antes do café. Dose: 1,5-1,7 mcg/kg/dia. Iniciar com 25-50 mcg em idosos. Ajustar TSH a cada 6-8 semanas.", metas:["TSH 0,5-2,5 mIU/L"], descricao:"Produção insuficiente de hormônios tireoidianos. TSH elevado com T4 livre reduzido." },
      "Hipertireoidismo": { cid:"E05", icon:"⚡", meds:[68,332], conduta:"Metimazol como primeira linha. Beta-bloqueador para controle sintomático. Radioiodo ou tireoidectomia para casos selecionados.", metas:["TSH normal","Controle dos sintomas"], descricao:"Excesso de produção de hormônios tireoidianos." },
      "Obesidade": { cid:"E66", icon:"⚖️", meds:[351,318,323], conduta:"MEV como base. Farmacoterapia com IMC≥30 ou ≥27 com comorbidades. Cirurgia bariátrica se IMC≥40 ou ≥35 com comorbidades.", metas:["Perda ≥5% do peso","Melhora das comorbidades"], descricao:"IMC ≥30 kg/m² com excesso de gordura corporal." },
    }
  },
  "Neurologia": {
    icone: "🧠",
    items: {
      "Convulsões / Epilepsia": { cid:"G40", icon:"⚡", meds:[180,181,182,183,184,202], conduta:"Identificar tipo de crise. Levetiracetam ou valproato como primeira linha. Estado epiléptico: benzodiazepínico EV, depois fenitoína ou levetiracetam EV.", metas:["Controle das crises","Qualidade de vida"], descricao:"Crises epilépticas recorrentes não provocadas por causa imediata identificável." },
      "Cefaleias / Enxaqueca": { cid:"G43", icon:"🤕", meds:[188,189,1,3], conduta:"Crise: triptano + AINE. Profilaxia: propranolol ou amitriptilina ou topiramato. Evitar analgésicos >10 dias/mês.", metas:["Redução da frequência e intensidade"], descricao:"Dor de cabeça recorrente, unilateral, pulsátil, com náusea/vômito e fotofobia." },
      "AVC": { cid:"I63", icon:"🧠", meds:[110,111,86,61,68], conduta:"Isquêmico: rtPA EV se ≤4,5h. Trombectomia mecânica. Antiagregante + estatina + IECA. Hemorrágico: controle pressórico, reverter anticoagulação.", metas:["Revascularização precoce","Prevenção secundária"], descricao:"Déficit neurológico focal de início súbito por isquemia ou hemorragia cerebral." },
      "Ansiedade": { cid:"F41", icon:"😰", meds:[207,210,201,200], conduta:"ISRS como primeira linha. Benzodiazepínico apenas a curto prazo. Psicoterapia (TCC) como abordagem fundamental.", metas:["Remissão dos sintomas","Funcionamento social"], descricao:"Medo ou preocupação excessivos e persistentes que interferem no funcionamento." },
    }
  },
  "Infectologia": {
    icone: "🦠",
    items: {
      "Dengue": { cid:"A90", icon:"🦟", meds:[1,2,350], conduta:"Suporte: hidratação oral/EV, analgésico (paracetamol — NÃO AAS/AINE). Monitorar sinais de alarme. Internação se dengue grave.", metas:["Hidratação adequada","Prevenção de complicações"], descricao:"Arbovírose transmitida pelo Aedes aegypti com febre, cefaleia e mialgia." },
      "Infecções e Antibioticoterapia": { cid:"A49", icon:"💊", meds:[230,231,235,238,244,245,241,248], conduta:"Escolher antibiótico conforme foco, patógeno provável e padrão de resistência local. Ajustar dose em IRC.", metas:["Erradicação do foco infeccioso"], descricao:"Guia de escolha antibiótica racional por foco e agente provável." },
      "AIDS / HIV": { cid:"B24", icon:"🎗️", meds:[280,281,282,283], conduta:"TARV para todos independente de CD4. Profilaxia para infecções oportunistas conforme CD4. Monitorar CV e CD4 a cada 6 meses.", metas:["CV indetectável (<50 cópias)","CD4>200 células/mm³"], descricao:"Síndrome de imunodeficiência adquirida por infecção pelo HIV." },
    }
  },
  "Avaliações Clínicas": {
    icone: "📋",
    items: {
      "Avaliação Periódica de Saúde": { cid:"Z00", icon:"🩺", meds:[], conduta:"Rastreamento conforme faixa etária e sexo. PA, IMC, glicemia, lipídeos. Mamografia (>40-50 anos). Colonoscopia (>45 anos). Papanicolau (25-64 anos).", metas:["Detecção precoce de doenças","Prevenção primária"], descricao:"Check-up sistemático para promoção de saúde e detecção precoce de doenças." },
      "Pré-operatório e Risco Cirúrgico": { cid:"Z01", icon:"🏥", meds:[110,116], conduta:"Avaliar risco cardiovascular (índice de Lee). Suspender anticoagulantes. ECG e exames laboratoriais conforme faixa etária e risco.", metas:["Minimizar risco perioperatório"], descricao:"Avaliação clínica para estratificação do risco cirúrgico e anestésico." },
    }
  },
};

// ─── INTERACTIONS DB ──────────────────────────────────────────────────────────
const INTERACTIONS_DB = [
  // ─ Anticoagulantes ───────────────────────────────────────────────────────────
  { med1:"Varfarina", med2:"AAS", grav:"Grave", tipo:"Farmacodinâmica", efeito:"Risco aumentado de sangramento. Monitorar INR intensamente.", mecanismo:"Inibição plaquetária somada ao efeito anticoagulante." },
  { med1:"Varfarina", med2:"Ibuprofeno", grav:"Grave", tipo:"Farmacodinâmica", efeito:"Potencializa anticoagulação e causa sangramento GI.", mecanismo:"AINE inibe plaquetas e lesiona mucosa gástrica." },
  { med1:"Varfarina", med2:"Diclofenaco Sódico", grav:"Grave", tipo:"Farmacodinâmica", efeito:"Risco elevado de sangramento gastrointestinal.", mecanismo:"AINE inibe plaquetas e lesiona mucosa gástrica." },
  { med1:"Varfarina", med2:"Naproxeno", grav:"Grave", tipo:"Farmacodinâmica", efeito:"Potencializa anticoagulação e risco de sangramento GI.", mecanismo:"Inibição de COX-1 plaquetária." },
  { med1:"Varfarina", med2:"Amiodarona", grav:"Grave", tipo:"Farmacocinética", efeito:"Amiodarona inibe metabolismo da varfarina. Reduzir dose de varfarina em 30-50%.", mecanismo:"Inibição de CYP2C9 e CYP3A4 pela amiodarona." },
  { med1:"Varfarina", med2:"Amiodarona EV", grav:"Grave", tipo:"Farmacocinética", efeito:"Mesmo que Amiodarona oral — reduzir dose de varfarina.", mecanismo:"Inibição de CYP2C9." },
  { med1:"Varfarina", med2:"Metronidazol", grav:"Grave", tipo:"Farmacocinética", efeito:"Metronidazol inibe metabolismo da varfarina. Risco de sangramento.", mecanismo:"Inibição de CYP2C9." },
  { med1:"Varfarina", med2:"Fluconazol", grav:"Grave", tipo:"Farmacocinética", efeito:"Fluconazol aumenta níveis de varfarina. Monitorar INR.", mecanismo:"Inibição de CYP2C9." },
  { med1:"Varfarina", med2:"Ciprofloxacino", grav:"Grave", tipo:"Farmacocinética", efeito:"Ciprofloxacino potencializa anticoagulação.", mecanismo:"Inibição de CYP1A2 e redução de flora intestinal que produz vitamina K." },
  { med1:"Varfarina", med2:"Levofloxacino", grav:"Grave", tipo:"Farmacocinética", efeito:"Potencializa efeito anticoagulante da varfarina.", mecanismo:"Redução de flora intestinal produtora de vitamina K." },
  { med1:"Varfarina", med2:"Claritromicina", grav:"Moderada", tipo:"Farmacocinética", efeito:"Claritromicina aumenta níveis de varfarina.", mecanismo:"Inibição de CYP3A4." },
  { med1:"Varfarina", med2:"Carbamazepina", grav:"Grave", tipo:"Farmacocinética", efeito:"Carbamazepina reduz efeito anticoagulante. Monitorar INR.", mecanismo:"Indução de CYP2C9 e CYP3A4 pela carbamazepina." },
  { med1:"Varfarina", med2:"Fenitoína", grav:"Grave", tipo:"Farmacocinética", efeito:"Interação bidirecional imprevisível — monitorar INR e nível de fenitoína.", mecanismo:"Inibição mútua do metabolismo hepático." },
  { med1:"Varfarina", med2:"Fenobarbital", grav:"Grave", tipo:"Farmacocinética", efeito:"Fenobarbital reduz efeito da varfarina.", mecanismo:"Indução de CYP2C9 e CYP3A4." },
  { med1:"Varfarina", med2:"Itraconazol", grav:"Grave", tipo:"Farmacocinética", efeito:"Itraconazol aumenta INR. Monitorar frequentemente.", mecanismo:"Inibição de CYP3A4." },
  // ─ Antiplaquetários ───────────────────────────────────────────────────────────
  { med1:"Clopidogrel", med2:"Omeprazol", grav:"Moderada", tipo:"Farmacocinética", efeito:"Omeprazol reduz ativação do clopidogrel em até 40%. Preferir pantoprazol.", mecanismo:"Omeprazol inibe CYP2C19, responsável pela ativação do clopidogrel." },
  { med1:"Clopidogrel", med2:"Esomeprazol", grav:"Moderada", tipo:"Farmacocinética", efeito:"Esomeprazol reduz efeito antiagregante do clopidogrel.", mecanismo:"Inibição de CYP2C19." },
  // ─ Cardiovascular ─────────────────────────────────────────────────────────────
  { med1:"Amiodarona", med2:"Digoxina", grav:"Grave", tipo:"Farmacocinética", efeito:"Amiodarona aumenta níveis séricos de digoxina em até 100%. Reduzir dose de digoxina pela metade.", mecanismo:"Inibição da P-glicoproteína renal e hepática." },
  { med1:"Amiodarona", med2:"Sinvastatina", grav:"Grave", tipo:"Farmacocinética", efeito:"Risco aumentado de miopatia e rabdomiólise. Limitar sinvastatina a 20mg/dia.", mecanismo:"Inibição de CYP3A4 pela amiodarona." },
  { med1:"Amiodarona", med2:"Atorvastatina", grav:"Moderada", tipo:"Farmacocinética", efeito:"Risco aumentado de miopatia. Usar menor dose efetiva de estatina.", mecanismo:"Inibição parcial de CYP3A4." },
  { med1:"Amiodarona", med2:"Metoprolol", grav:"Moderada", tipo:"Farmacodinâmica", efeito:"Bradicardia sinusal grave e bloqueio AV. Monitorar ECG.", mecanismo:"Efeito aditivo sobre automatismo e condução cardíaca." },
  { med1:"Amiodarona", med2:"Atenolol", grav:"Moderada", tipo:"Farmacodinâmica", efeito:"Risco de bradicardia e bloqueio AV. Monitorar frequência cardíaca.", mecanismo:"Efeito aditivo sobre automatismo e condução cardíaca." },
  { med1:"Amiodarona", med2:"Bisoprolol", grav:"Moderada", tipo:"Farmacodinâmica", efeito:"Risco de bradicardia e bloqueio AV. Monitorar.", mecanismo:"Efeito aditivo sobre condução." },
  { med1:"Losartana", med2:"Espironolactona", grav:"Moderada", tipo:"Farmacodinâmica", efeito:"Risco de hipercalemia. Monitorar potássio sérico.", mecanismo:"Bloqueio duplo do SRAA aumenta retenção de potássio." },
  { med1:"Enalapril", med2:"Espironolactona", grav:"Moderada", tipo:"Farmacodinâmica", efeito:"Risco de hipercalemia. Monitorar potássio sérico.", mecanismo:"IECA + poupador de K+ — combinação frequente na ICC que requer monitoramento." },
  { med1:"Captopril", med2:"Espironolactona", grav:"Moderada", tipo:"Farmacodinâmica", efeito:"Risco de hipercalemia.", mecanismo:"Bloqueio duplo do SRAA." },
  { med1:"Enalapril", med2:"AAS", grav:"Leve", tipo:"Farmacodinâmica", efeito:"AAS pode reduzir efeito anti-hipertensivo dos IECAs.", mecanismo:"Inibição de prostaglandinas vasodilatadoras." },
  { med1:"Losartana", med2:"AAS", grav:"Leve", tipo:"Farmacodinâmica", efeito:"AAS pode reduzir efeito anti-hipertensivo dos BRAs.", mecanismo:"Antagonismo na vasodilatação mediada por prostaglandinas." },
  { med1:"Ibuprofeno", med2:"Enalapril", grav:"Moderada", tipo:"Farmacodinâmica", efeito:"AINEs reduzem efeito anti-hipertensivo e podem piorar função renal.", mecanismo:"Inibição de prostaglandinas renais vasodilatadoras." },
  { med1:"Ibuprofeno", med2:"Losartana", grav:"Moderada", tipo:"Farmacodinâmica", efeito:"AINEs reduzem efeito anti-hipertensivo e podem piorar função renal.", mecanismo:"Inibição de prostaglandinas renais." },
  { med1:"Ibuprofeno", med2:"Captopril", grav:"Moderada", tipo:"Farmacodinâmica", efeito:"AINEs reduzem efeito anti-hipertensivo.", mecanismo:"Inibição de prostaglandinas vasodilatadoras renais." },
  { med1:"Diclofenaco Sódico", med2:"Enalapril", grav:"Moderada", tipo:"Farmacodinâmica", efeito:"AINE reduz efeito anti-hipertensivo e piora função renal.", mecanismo:"Inibição de COX renal." },
  { med1:"Metformina", med2:"Furosemida", grav:"Moderada", tipo:"Farmacodinâmica", efeito:"Furosemida pode aumentar risco de acidose lática.", mecanismo:"Furosemida altera excreção renal de metformina e pode causar hipoperfusão." },
  { med1:"Digoxina", med2:"Furosemida", grav:"Moderada", tipo:"Farmacodinâmica", efeito:"Furosemida causa hipocalemia que potencializa toxicidade da digoxina.", mecanismo:"Hipocalemia aumenta sensibilidade do miocárdio à digoxina." },
  { med1:"Digoxina", med2:"Hidroclorotiazida", grav:"Moderada", tipo:"Farmacodinâmica", efeito:"Tiazídico causa hipocalemia, potencializando toxicidade da digoxina.", mecanismo:"Hipocalemia aumenta ligação da digoxina à Na+/K+ ATPase." },
  { med1:"Sinvastatina", med2:"Claritromicina", grav:"Grave", tipo:"Farmacocinética", efeito:"Risco elevado de miopatia e rabdomiólise. Suspender sinvastatina durante antibioticoterapia.", mecanismo:"Claritromicina inibe CYP3A4, principal via de metabolismo da sinvastatina." },
  { med1:"Atorvastatina", med2:"Claritromicina", grav:"Moderada", tipo:"Farmacocinética", efeito:"Risco aumentado de miopatia. Usar menor dose possível de atorvastatina.", mecanismo:"Inibição de CYP3A4." },
  // ─ SNC / Psiquiatria ──────────────────────────────────────────────────────────
  { med1:"Tramadol", med2:"Sertralina", grav:"Grave", tipo:"Farmacodinâmica", efeito:"Risco de síndrome serotoninérgica (agitação, hipertermia, rigidez muscular).", mecanismo:"Tramadol inibe recaptação de serotonina — efeito aditivo com ISRS." },
  { med1:"Tramadol", med2:"Fluoxetina", grav:"Grave", tipo:"Farmacodinâmica", efeito:"Risco de síndrome serotoninérgica.", mecanismo:"Inibição de recaptação de serotonina — efeito aditivo." },
  { med1:"Tramadol", med2:"Paroxetina", grav:"Grave", tipo:"Farmacocinética", efeito:"Paroxetina inibe ativação de tramadol E risco de síndrome serotoninérgica.", mecanismo:"Paroxetina inibe CYP2D6 (ativação de tramadol) e tem ação serotoninérgica." },
  { med1:"Tramadol", med2:"Amitriptilina", grav:"Grave", tipo:"Farmacodinâmica", efeito:"Risco de síndrome serotoninérgica e rebaixamento do limiar convulsivo.", mecanismo:"Inibição serotoninérgica e noradrenérgica somados." },
  { med1:"Tramadol", med2:"Venlafaxina", grav:"Grave", tipo:"Farmacodinâmica", efeito:"Risco de síndrome serotoninérgica.", mecanismo:"IRSN + tramadol — efeito serotoninérgico aditivo." },
  { med1:"Clonazepam", med2:"Quetiapina", grav:"Moderada", tipo:"Farmacodinâmica", efeito:"Depressão aditiva do SNC — sedação excessiva e risco respiratório.", mecanismo:"Sinergismo GABAérgico (benzodiazepínico) + antagonismo dopaminérgico." },
  { med1:"Clonazepam", med2:"Amitriptilina", grav:"Moderada", tipo:"Farmacodinâmica", efeito:"Sedação excessiva, comprometimento cognitivo.", mecanismo:"Depressão aditiva do SNC." },
  { med1:"Clonazepam", med2:"Morfina", grav:"Grave", tipo:"Farmacodinâmica", efeito:"Depressão respiratória grave — risco de apneia.", mecanismo:"Depressão aditiva do SNC e sistema respiratório." },
  { med1:"Diazepam", med2:"Morfina", grav:"Grave", tipo:"Farmacodinâmica", efeito:"Depressão respiratória grave.", mecanismo:"Depressão aditiva do SNC." },
  { med1:"Alprazolam", med2:"Amitriptilina", grav:"Moderada", tipo:"Farmacodinâmica", efeito:"Sedação excessiva.", mecanismo:"Depressão aditiva do SNC." },
  { med1:"Carbamazepina", med2:"Varfarina", grav:"Grave", tipo:"Farmacocinética", efeito:"Carbamazepina reduz eficácia da varfarina. Monitorar INR.", mecanismo:"Indução de CYP2C9 e CYP3A4." },
  { med1:"Carbamazepina", med2:"Sertralina", grav:"Moderada", tipo:"Farmacocinética", efeito:"Carbamazepina reduz níveis de sertralina.", mecanismo:"Indução de CYP3A4." },
  { med1:"Carbamazepina", med2:"Amitriptilina", grav:"Moderada", tipo:"Farmacocinética", efeito:"Carbamazepina reduz níveis de amitriptilina.", mecanismo:"Indução de CYP1A2 e CYP3A4." },
  { med1:"Carbamazepina", med2:"Haloperidol", grav:"Moderada", tipo:"Farmacocinética", efeito:"Carbamazepina reduz níveis de haloperidol em até 50%.", mecanismo:"Indução enzimática hepática." },
  { med1:"Lítio (Carbonato de Lítio)", med2:"Ibuprofeno", grav:"Grave", tipo:"Farmacocinética", efeito:"AINEs aumentam litemia (retenção de sódio) — risco de intoxicação por lítio.", mecanismo:"AINEs reduzem excreção renal de lítio." },
  { med1:"Lítio (Carbonato de Lítio)", med2:"Diclofenaco Sódico", grav:"Grave", tipo:"Farmacocinética", efeito:"Risco de intoxicação por lítio.", mecanismo:"Redução de excreção renal de lítio pelo AINE." },
  { med1:"Lítio (Carbonato de Lítio)", med2:"Hidroclorotiazida", grav:"Grave", tipo:"Farmacocinética", efeito:"Tiazídico aumenta reabsorção de lítio — risco de intoxicação.", mecanismo:"Depleção de sódio estimula reabsorção de lítio no túbulo proximal." },
  { med1:"Lítio (Carbonato de Lítio)", med2:"Furosemida", grav:"Moderada", tipo:"Farmacocinética", efeito:"Furosemida pode aumentar litemia.", mecanismo:"Depleção volêmica aumenta reabsorção de lítio." },
  { med1:"Haloperidol", med2:"Amiodarona", grav:"Grave", tipo:"Farmacodinâmica", efeito:"Risco de prolongamento do QTc e Torsades de Pointes.", mecanismo:"Ambos prolongam intervalo QT — efeito aditivo." },
  { med1:"Quetiapina", med2:"Amiodarona", grav:"Grave", tipo:"Farmacodinâmica", efeito:"Risco de prolongamento do QTc.", mecanismo:"Efeito aditivo no prolongamento do QT." },
  { med1:"Haloperidol", med2:"Metoclopramida", grav:"Moderada", tipo:"Farmacodinâmica", efeito:"Risco aumentado de sintomas extrapiramidais.", mecanismo:"Bloqueio dopaminérgico aditivo." },
  // ─ Antibióticos / Antifúngicos ───────────────────────────────────────────────
  { med1:"Ciprofloxacino", med2:"Varfarina", grav:"Grave", tipo:"Farmacocinética", efeito:"Ciprofloxacino potencializa anticoagulação.", mecanismo:"Inibição de CYP1A2 e redução de flora produtora de vitamina K." },
  { med1:"Metronidazol", med2:"Varfarina", grav:"Grave", tipo:"Farmacocinética", efeito:"Metronidazol inibe metabolismo da varfarina. Risco de sangramento.", mecanismo:"Inibição de CYP2C9." },
  { med1:"Metronidazol", med2:"Álcool", grav:"Grave", tipo:"Farmacocinética", efeito:"Reação antabuse (rubor, náusea, taquicardia, hipotensão).", mecanismo:"Metronidazol inibe aldeído desidrogenase — acúmulo de acetaldeído." },
  { med1:"Fluconazol", med2:"Varfarina", grav:"Grave", tipo:"Farmacocinética", efeito:"Fluconazol aumenta INR. Monitorar e reduzir dose de varfarina.", mecanismo:"Inibição potente de CYP2C9." },
  { med1:"Fluconazol", med2:"Sinvastatina", grav:"Grave", tipo:"Farmacocinética", efeito:"Risco elevado de miopatia. Suspender estatina.", mecanismo:"Inibição de CYP3A4." },
  { med1:"Fluconazol", med2:"Carbamazepina", grav:"Moderada", tipo:"Farmacocinética", efeito:"Fluconazol aumenta níveis de carbamazepina.", mecanismo:"Inibição de CYP3A4." },
  { med1:"Claritromicina", med2:"Sinvastatina", grav:"Grave", tipo:"Farmacocinética", efeito:"Risco elevado de rabdomiólise. Suspender sinvastatina.", mecanismo:"Inibição potente de CYP3A4." },
  // ─ Antibióticos QTc ──────────────────────────────────────────────────────────
  { med1:"Azitromicina", med2:"Amiodarona", grav:"Grave", tipo:"Farmacodinâmica", efeito:"Risco de prolongamento do QTc e arritmias ventriculares.", mecanismo:"Ambos prolongam QT — efeito aditivo." },
  { med1:"Ciprofloxacino", med2:"Amiodarona", grav:"Grave", tipo:"Farmacodinâmica", efeito:"Risco de prolongamento do QTc.", mecanismo:"Efeito aditivo no prolongamento de QT." },
  { med1:"Levofloxacino", med2:"Amiodarona", grav:"Grave", tipo:"Farmacodinâmica", efeito:"Risco de prolongamento do QTc e Torsades de Pointes.", mecanismo:"Efeito aditivo no prolongamento de QT." },
  // ─ Endocrinologia ─────────────────────────────────────────────────────────────
  { med1:"Metformina", med2:"Furosemida", grav:"Moderada", tipo:"Farmacodinâmica", efeito:"Furosemida pode aumentar risco de acidose lática por hipoperfusão renal.", mecanismo:"Redução da perfusão renal altera excreção de metformina." },
  { med1:"Glibenclamida", med2:"Ciprofloxacino", grav:"Moderada", tipo:"Farmacocinética", efeito:"Fluoroquinolonas podem causar tanto hipo como hiperglicemia com sulfonilureias.", mecanismo:"Interferência na liberação de insulina pancreática." },
  { med1:"Insulina NPH", med2:"Propranolol", grav:"Moderada", tipo:"Farmacodinâmica", efeito:"Beta-bloqueador mascara sinais de hipoglicemia (taquicardia) e prolonga hipoglicemia.", mecanismo:"Bloqueio de resposta adrenérgica à hipoglicemia." },
  { med1:"Levotiroxina", med2:"Carbonato de Cálcio + Vit D", grav:"Leve", tipo:"Farmacocinética", efeito:"Cálcio reduz absorção de levotiroxina. Separar por ao menos 4 horas.", mecanismo:"Quelação do cálcio com levotiroxina no trato digestivo." },
  // ─ Interações com álcool e outros ────────────────────────────────────────────
  { med1:"Metronidazol", med2:"Loperamida", grav:"Leve", tipo:"Farmacodinâmica", efeito:"Metronidazol pode mascarar infecção com colite associada — loperamida contraindicada em disenteria bacteriana.", mecanismo:"Risco teórico de megacólon tóxico." },
  // ─ IECA + BRA (duplo bloqueio SRAA) ─────────────────────────────────────────
  { med1:"Enalapril", med2:"Losartana", grav:"Grave", tipo:"Farmacodinâmica", efeito:"Duplo bloqueio do SRAA (IECA + BRA) — risco aumentado de hipercalemia, hipotensão grave e insuficiência renal aguda. Evitar associação.", mecanismo:"IECA inibe conversão de angiotensina I→II; BRA bloqueia receptor AT1. A combinação não oferece benefício clínico adicional e aumenta eventos adversos renais e cardiovasculares." },
  { med1:"Enalapril", med2:"Valsartana", grav:"Grave", tipo:"Farmacodinâmica", efeito:"Duplo bloqueio do SRAA — hipercalemia, hipotensão e insuficiência renal aguda. Evitar.", mecanismo:"Inibição dupla do SRAA: IECA + BRA." },
  { med1:"Captopril", med2:"Losartana", grav:"Grave", tipo:"Farmacodinâmica", efeito:"Duplo bloqueio do SRAA — hipercalemia, hipotensão e insuficiência renal aguda. Evitar.", mecanismo:"Inibição dupla do SRAA: IECA + BRA." },
  { med1:"Captopril", med2:"Valsartana", grav:"Grave", tipo:"Farmacodinâmica", efeito:"Duplo bloqueio do SRAA — hipercalemia, hipotensão e insuficiência renal aguda. Evitar.", mecanismo:"Inibição dupla do SRAA: IECA + BRA." },
  { med1:"Ramipril", med2:"Losartana", grav:"Grave", tipo:"Farmacodinâmica", efeito:"Duplo bloqueio do SRAA — hipercalemia, hipotensão e insuficiência renal aguda. Evitar.", mecanismo:"Inibição dupla do SRAA: IECA + BRA." },
  { med1:"Ramipril", med2:"Valsartana", grav:"Grave", tipo:"Farmacodinâmica", efeito:"Duplo bloqueio do SRAA — hipercalemia, hipotensão e insuficiência renal aguda. Evitar.", mecanismo:"Inibição dupla do SRAA: IECA + BRA." },
  { med1:"Lisinopril", med2:"Losartana", grav:"Grave", tipo:"Farmacodinâmica", efeito:"Duplo bloqueio do SRAA — hipercalemia, hipotensão e insuficiência renal aguda. Evitar.", mecanismo:"Inibição dupla do SRAA: IECA + BRA." },
  { med1:"Lisinopril", med2:"Valsartana", grav:"Grave", tipo:"Farmacodinâmica", efeito:"Duplo bloqueio do SRAA — hipercalemia, hipotensão e insuficiência renal aguda. Evitar.", mecanismo:"Inibição dupla do SRAA: IECA + BRA." },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getQtdLabel(via) {
  if (["IV","IM","IO","Intra-articular"].includes(via)) return "ampola(s)";
  if (via === "SC") return "seringa(s)";
  if (["Inalatória","Intranasal"].includes(via)) return "frasco(s)";
  if (["Ocular","Otológica"].includes(via)) return "frasco(s)";
  if (["Tópica","Vaginal"].includes(via)) return "unidade(s)";
  if (via === "SL") return "comprimido(s)";
  return "comprimido(s)";
}

function calcQtdMes(posologia, via) {
  const p = posologia.toLowerCase();
  if (["IV","IM","IO","Intra-articular"].includes(via)) {
    if (p.includes("dose única") || p.includes("1x ao mês") || p.includes("1x ao ano")) return 1;
    if (p.includes("6 em 6") || p.includes("6/6")) return 120;
    if (p.includes("8 em 8") || p.includes("8/8")) return 90;
    if (p.includes("12 em 12") || p.includes("12/12")) return 60;
    if (p.includes("ao dia")) return 30;
    return 5;
  }
  if (via === "SC") {
    if (p.includes("dose única")) return 1;
    if (p.includes("12 em 12")) return 60;
    if (p.includes("ao dia")) return 30;
    return 30;
  }
  if (["Inalatória","Intranasal"].includes(via)) {
    if (p.includes("12 em 12") || p.includes("8 em 8")) return 2;
    return 1;
  }
  if (["Ocular","Otológica","Tópica","Vaginal"].includes(via)) return 1;
  if (p.includes("dose única") || p.includes("1x por semana") || p.includes("1x ao ano") || p.includes("1x ao mês")) return 1;
  if (p.includes("1/2 comprimido ao dia") || p.includes("1/2 cp ao dia")) return 15;
  if (p.includes("1/2 comprimido de 12")) return 30;
  if ((p.includes("1 comprimido") || p.includes("1 cápsula") || p.includes("1 cp") || p.includes("1 cap") || p.includes("1 sachê")) && p.includes("ao dia")) return 30;
  if ((p.includes("1 comprimido") || p.includes("1 cápsula") || p.includes("1 sachê")) && p.includes("12 em 12")) return 60;
  if ((p.includes("1 comprimido") || p.includes("1 cápsula")) && p.includes("8 em 8")) return 90;
  if ((p.includes("1 comprimido") || p.includes("1 cápsula")) && p.includes("6 em 6")) return 120;
  if ((p.includes("2 comprimidos") || p.includes("2 cápsulas")) && p.includes("ao dia")) return 60;
  if ((p.includes("2 comprimidos") || p.includes("2 cápsulas")) && p.includes("12 em 12")) return 120;
  return 30;
}

function fuzzySearch(query, items) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  return items.filter(m => {
    const name = m.nome.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
    const sub = (m.subcat || "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
    return name.includes(q) || sub.includes(q);
  }).slice(0, 10);
}

function normName(s) {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu,"").replace(/\s*\(.*?\)/g,"").trim();
}
function namesMatch(a, b) {
  // Exact match
  if (a === b) return true;
  const na = normName(a), nb = normName(b);
  if (na === nb) return true;
  // Partial: one contains the other (handles "Ibuprofeno (AINE)" vs "Ibuprofeno")
  if (na.includes(nb) || nb.includes(na)) return true;
  return false;
}
function checkInteractions(prescItems) {
  const nomes = prescItems.map(p => p.medicamento?.nome).filter(Boolean);
  const found = [];
  for (let i = 0; i < nomes.length; i++) {
    for (let j = i + 1; j < nomes.length; j++) {
      const a = nomes[i], b = nomes[j];
      const inter = INTERACTIONS_DB.find(x =>
        (namesMatch(x.med1, a) && namesMatch(x.med2, b)) ||
        (namesMatch(x.med1, b) && namesMatch(x.med2, a))
      );
      if (inter) {
        // Avoid duplicates
        const key = [a,b].sort().join("|||");
        if (!found.some(f => [f.medA,f.medB].sort().join("|||") === key)) {
          found.push({ ...inter, pair: `${a} + ${b}`, medA: a, medB: b });
        }
      }
    }
  }
  return found;
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const IC = {
  dash: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  presc: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>,
  meds: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19.14 6.86l-1.86-1.86a4 4 0 00-5.66 0l-8.48 8.48a4 4 0 000 5.66l1.86 1.86a4 4 0 005.66 0l8.48-8.48a4 4 0 000-5.66z"/><line x1="11" y1="11" x2="13" y2="13"/></svg>,
  prot: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/></svg>,
  inter: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  hist: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  cfg: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  srch: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  plus: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  del: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  print: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  chev: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>,
};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [doctor, setDoctor] = useState({ nome: "Dr. João Silva", crm: "123456", uf: "MG", especialidade: "Clínica Médica", telefone: "(31) 98765-4321", endereco: "Av. Prof. Alfredo Balena, 110 – Belo Horizonte, MG" });
  const [prescription, setPrescription] = useState({ patient: "", birthdate: "", date: new Date().toLocaleDateString("pt-BR"), cid: "", items: [] });
  const [saved, setSaved] = useState([]);
  const [customMeds, setCustomMeds] = useState([]);
  const [customMeds, setCustomMeds] = useState([]);
  const [globalQ, setGlobalQ] = useState("");
  const [showPrint, setShowPrint] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const addMed = useCallback((med) => {
    const via = med.vias[0];
    const posArr = Array.isArray(med.posologias) ? med.posologias : (med.posologias[via] || med.posologias[Object.keys(med.posologias)[0]] || []);
    const posologia = posArr[0] || "Conforme prescrição médica";
    const item = { id: Date.now(), medicamento: med, dose: med.doses[0], via, posologia, quantidade: calcQtdMes(posologia, via), usoContínuo: false };
    setPrescription(p => ({ ...p, items: [...p.items, item] }));
    setPage("prescription");
    showToast(`${med.nome} adicionado à prescrição`);
  }, [showToast]);

  const allMedsForSearch = useMemo(() => [...MEDICATIONS_DB, ...customMeds], [customMeds]);

  const interactions = useMemo(() => checkInteractions(prescription.items), [prescription.items]);
  const globalResults = useMemo(() => {
    if (globalQ.length < 2) return [];
    return fuzzySearch(globalQ, allMedsForSearch);
  }, [globalQ, allMedsForSearch]);
  const protocolResults = useMemo(() => {
    if (globalQ.length < 2) return [];
    const q = globalQ.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu,"");
    const res = [];
    Object.entries(PROTOCOLS_FULL).forEach(([cat, data]) => {
      Object.entries(data.items).forEach(([name, proto]) => {
        const n = name.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu,"");
        if (n.includes(q)) res.push({ cat, name, proto });
      });
    });
    return res.slice(0, 4);
  }, [globalQ]);

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif", background:"#f0f2f5", color:"#1a2332" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:3px}
        ::-webkit-scrollbar-thumb:hover{background:#9ca3af}
        input,select,textarea,button{font-family:inherit}
        body{background:#f3f4f6}

        /* ── Nav Items ── */
        .ni{display:flex;align-items:center;gap:9px;padding:8px 12px;border-radius:7px;cursor:pointer;font-size:13px;font-weight:500;color:#6b7280;transition:all .12s;border:none;background:none;width:100%;text-align:left;letter-spacing:.1px}
        .ni:hover{background:#f3f4f6;color:#111827}
        .ni.act{background:#1e3a5f;color:#fff}
        .ni.act svg{stroke:#fff}

        /* ── Cards ── */
        .card{background:#fff;border-radius:10px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04)}

        /* ── Buttons ── */
        .btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;border:none;transition:all .12s;letter-spacing:.1px;white-space:nowrap}
        .bp{background:#1e3a5f;color:#fff}.bp:hover{background:#152c49;box-shadow:0 4px 14px rgba(30,58,95,.35)}
        .bs{background:#f9fafb;color:#374151;border:1px solid #e5e7eb}.bs:hover{background:#f3f4f6;border-color:#d1d5db}
        .bd{background:#fef2f2;color:#b91c1c;border:1px solid #fecaca}.bd:hover{background:#fee2e2}
        .bg{background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0}.bg:hover{background:#dcfce7}
        .btn-outline{background:transparent;color:#1e3a5f;border:1.5px solid #1e3a5f}.btn-outline:hover{background:#f0f7ff}

        /* ── Inputs ── */
        .inp{padding:8px 12px;border:1px solid #e5e7eb;border-radius:7px;font-size:13.5px;color:#111827;background:#fff;outline:none;transition:all .12s;width:100%}
        .inp:focus{border-color:#1e3a5f;box-shadow:0 0 0 3px rgba(30,58,95,.1)}
        .inp::placeholder{color:#9ca3af}
        .sel{padding:8px 10px;border:1px solid #e5e7eb;border-radius:7px;font-size:13px;color:#111827;background:#fff;outline:none;cursor:pointer;width:100%}
        .sel:focus{border-color:#1e3a5f}
        .lbl{font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.6px;margin-bottom:5px;display:block}

        /* ── Badges ── */
        .badge{display:inline-flex;padding:2px 9px;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:.3px}
        .bb{background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe}
        .br{background:#fef2f2;color:#b91c1c;border:1px solid #fecaca}
        .by{background:#fefce8;color:#854d0e;border:1px solid #fde68a}
        .bg2{background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0}
        .bn{background:#f8fafc;color:#475569;border:1px solid #e2e8f0}

        /* ── Search ── */
        .srch-wrap{position:relative}
        .srch-inp{padding:8px 14px 8px 34px;border:1px solid #e5e7eb;border-radius:7px;font-size:13.5px;background:#fff;outline:none;transition:all .12s;font-family:inherit}
        .srch-inp:focus{border-color:#1e3a5f;box-shadow:0 0 0 3px rgba(30,58,95,.1)}
        .drop{position:absolute;top:calc(100% + 4px);left:0;right:0;background:#fff;border:1px solid #e5e7eb;border-radius:9px;box-shadow:0 8px 28px rgba(0,0,0,.1);z-index:200;overflow:hidden;max-height:380px;overflow-y:auto}
        .dri{padding:10px 14px;cursor:pointer;font-size:13px;transition:background .1s;border-bottom:1px solid #f9fafb}
        .dri:last-child{border-bottom:none}
        .dri:hover{background:#f0f7ff}

        /* ── Animations ── */
        @keyframes si{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        .ani{animation:si .16s ease}

        /* ── Med Row ── */
        .med-row{display:grid;gap:7px;align-items:center;padding:11px 14px;background:#fafafa;border-radius:8px;border:1px solid #f3f4f6;margin-bottom:6px;transition:border-color .12s}
        .med-row:hover{border-color:#dbeafe;background:#fafcff}

        /* ── Protocol Cards ── */
        .prot-card{padding:14px;border-radius:9px;border:1px solid #e5e7eb;cursor:pointer;transition:all .15s;background:#fff}
        .prot-card:hover{border-color:#1e3a5f;box-shadow:0 4px 12px rgba(30,58,95,.1);background:#fafcff}

        /* ── Interaction severity ── */
        .ia{background:#fef2f2;border-left:3px solid #b91c1c}
        .im{background:#fefce8;border-left:3px solid #d97706}
        .il{background:#f0fdf4;border-left:3px solid #15803d}

        /* ── Table ── */
        table{width:100%;border-collapse:collapse;font-size:13px}
        th{padding:10px 14px;text-align:left;font-weight:600;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:.6px;background:#f9fafb;border-bottom:1px solid #e5e7eb}
        td{padding:10px 14px;border-bottom:1px solid #f3f4f6;vertical-align:top}
        tr:last-child td{border-bottom:none}
        tr:hover td{background:#fafbfc}

        /* ── Section header ── */
        .sec-title{font-size:18px;font-weight:700;color:#0f172a;letter-spacing:-.2px}
        .sec-sub{font-size:13px;color:#6b7280;margin-top:3px}

        /* ── Divider ── */
        .divider{height:1px;background:#f3f4f6;margin:4px 0}

        @media print{.no-print{display:none!important}}
      `}</style>

      {/* SIDEBAR */}
      <aside className="no-print" style={{ width:220, background:"#0f172a", display:"flex", flexDirection:"column", padding:"0", flexShrink:0 }}>
        {/* Logo */}
        <div style={{ padding:"20px 16px 16px", borderBottom:"1px solid rgba(255,255,255,.08)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, background:"linear-gradient(135deg,#3b82f6,#1d4ed8)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:18, flexShrink:0 }}>⚕</div>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:"#f1f5f9", letterSpacing:"-.1px" }}>MedPrescrição</div>
              <div style={{ fontSize:10.5, color:"#475569", marginTop:1, letterSpacing:".2px" }}>SISTEMA CLÍNICO</div>
            </div>
          </div>
        </div>
        {/* Nav */}
        <nav style={{ flex:1, padding:"10px 10px", display:"flex", flexDirection:"column", gap:1, overflowY:"auto" }}>
          <div style={{ fontSize:10, fontWeight:700, color:"#334155", letterSpacing:"1px", padding:"8px 8px 4px", marginTop:4 }}>PRINCIPAL</div>
          {[
            { id:"dashboard", label:"Dashboard", icon:IC.dash },
            { id:"prescription", label:"Prescrição", icon:IC.presc },
          ].map(item => (
            <button key={item.id} className={`ni ${page===item.id?"act":""}`} onClick={() => setPage(item.id)} style={{ color: page===item.id?"#fff":"#94a3b8" }}>
              {item.icon}<span>{item.label}</span>
              {item.id==="prescription" && prescription.items.length>0 && (
                <span style={{ marginLeft:"auto", background: page==="prescription"?"rgba(255,255,255,.25)":"#2563eb", color:"#fff", borderRadius:10, padding:"1px 7px", fontSize:10.5, fontWeight:700 }}>{prescription.items.length}</span>
              )}
            </button>
          ))}
          <div style={{ fontSize:10, fontWeight:700, color:"#334155", letterSpacing:"1px", padding:"12px 8px 4px", marginTop:4 }}>BIBLIOTECA</div>
          {[
            { id:"medications", label:"Medicamentos", icon:IC.meds },
            { id:"protocols", label:"Protocolos Clínicos", icon:IC.prot },
            { id:"interactions", label:"Interações", icon:IC.inter },
          ].map(item => (
            <button key={item.id} className={`ni ${page===item.id?"act":""}`} onClick={() => setPage(item.id)} style={{ color: page===item.id?"#fff":"#94a3b8" }}>
              {item.icon}<span>{item.label}</span>
              {item.id==="interactions" && interactions.length>0 && (
                <span style={{ marginLeft:"auto", background:"#dc2626", color:"#fff", borderRadius:10, padding:"1px 7px", fontSize:10.5, fontWeight:700 }}>{interactions.length}</span>
              )}
            </button>
          ))}
          <div style={{ fontSize:10, fontWeight:700, color:"#334155", letterSpacing:"1px", padding:"12px 8px 4px", marginTop:4 }}>ARQUIVO</div>
          {[
            { id:"history", label:"Histórico", icon:IC.hist },
            { id:"settings", label:"Configurações", icon:IC.cfg },
          ].map(item => (
            <button key={item.id} className={`ni ${page===item.id?"act":""}`} onClick={() => setPage(item.id)} style={{ color: page===item.id?"#fff":"#94a3b8" }}>
              {item.icon}<span>{item.label}</span>
            </button>
          ))}
        </nav>
        {/* Doctor info */}
        <div style={{ padding:"12px 16px", borderTop:"1px solid rgba(255,255,255,.08)", background:"rgba(255,255,255,.03)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#3b82f6,#1d4ed8)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12, fontWeight:700, flexShrink:0 }}>
              {doctor.nome.split(" ").map(w=>w[0]).slice(0,2).join("")}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:600, color:"#f1f5f9", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{doctor.nome}</div>
              <div style={{ fontSize:10.5, color:"#475569" }}>CRM/{doctor.uf} {doctor.crm}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* TOPBAR */}
        <header className="no-print" style={{ background:"#fff", borderBottom:"1px solid #e5e7eb", padding:"0 22px", height:54, display:"flex", alignItems:"center", gap:14, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
          <div className="srch-wrap" style={{ flex:1, maxWidth:420 }}>
            <div style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"#94a3b8" }}>{IC.srch}</div>
            <input className="srch-inp" style={{ width:"100%" }} placeholder="Buscar medicamento, doença ou protocolo..." value={globalQ} onChange={e => setGlobalQ(e.target.value)} onBlur={() => setTimeout(()=>setGlobalQ(""),200)} />
            {(globalResults.length>0||protocolResults.length>0) && globalQ.length>=2 && (
              <div className="drop ani">
                {globalResults.map(m => (
                  <div key={m.id} className="dri" onMouseDown={() => { addMed(m); setGlobalQ(""); }}>
                    <div style={{ fontWeight:600 }}>{m.nome}</div>
                    <div style={{ fontSize:11.5, color:"#94a3b8" }}>{m.subcat} · {m.doses.join(", ")}</div>
                  </div>
                ))}
                {protocolResults.map(({ name, proto }) => (
                  <div key={name} className="dri" style={{ borderTop:"1px solid #f1f5f9" }} onMouseDown={() => { setPage("protocols"); setGlobalQ(""); }}>
                    <div style={{ fontWeight:600 }}>{proto.icon} {name}</div>
                    <div style={{ fontSize:11.5, color:"#94a3b8" }}>Protocolo Clínico · CID {proto.cid}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ display:"flex", gap:8, marginLeft:"auto" }}>
            {interactions.length>0 && (
              <div onClick={() => setPage("interactions")} style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 12px", background:"#fff1f2", borderRadius:8, cursor:"pointer", fontSize:12.5, color:"#dc2626", fontWeight:600 }}>
                {interactions.length} interação{interactions.length>1?"ões":""}{interactions.some(i=>i.grav==="Grave") ? " — GRAVE" : ""}
              </div>
            )}
            {prescription.items.length>0 && <button className="btn bp" onClick={() => setShowPrint(true)} style={{ background:"#1e3a5f" }}>{IC.print} Gerar Receita</button>}
          </div>
        </header>

        <main style={{ flex:1, overflowY:"auto", padding:"20px 24px", background:"#f3f4f6" }}>
          {page==="dashboard" && <DashPage prescription={prescription} interactions={interactions} saved={saved} setPage={setPage} addMed={addMed} />}
          {page==="prescription" && <PrescPage prescription={prescription} setPrescription={setPrescription} addMed={addMed} interactions={interactions} saved={saved} setSaved={setSaved} showToast={showToast} allMedsForSearch={allMedsForSearch} />}
          {page==="medications" && <MedsPage addMed={addMed} customMeds={customMeds} setCustomMeds={setCustomMeds} />}
          {page==="protocols" && <ProtoPage addMed={addMed} setPage={setPage} />}
          {page==="interactions" && <InterPage prescription={prescription} interactions={interactions} />}
          {page==="history" && <HistPage saved={saved} />}
          {page==="settings" && <CfgPage doctor={doctor} setDoctor={setDoctor} showToast={showToast} customMeds={customMeds} />}
        </main>
      </div>

      {showPrint && <PrintModal prescription={prescription} doctor={doctor} onClose={() => setShowPrint(false)} />}

      {toast && (
        <div className="ani" style={{ position:"fixed", bottom:22, right:22, padding:"12px 20px", borderRadius:9, background: toast.type==="success"?"#0f172a":"#991b1b", color:"#fff", fontSize:13, fontWeight:500, zIndex:999, boxShadow:"0 8px 28px rgba(0,0,0,.25)", display:"flex", alignItems:"center", gap:8, minWidth:240 }}>
          <span style={{ width:20, height:20, borderRadius:"50%", background: toast.type==="success"?"#22c55e":"#ef4444", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, flexShrink:0 }}>{toast.type==="success"?"✓":"×"}</span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashPage({ prescription, interactions, saved, setPage, addMed }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <div><h1 className="sec-title">Dashboard</h1><p className="sec-sub">Bem-vindo ao sistema de prescrição clínica</p></div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {[
          { label:"Medicamentos na Receita", value:prescription.items.length, accent:"#1e3a5f", light:"#eff6ff" },
          { label:"Interações Detectadas", value:interactions.length, accent:interactions.length>0?"#b91c1c":"#15803d", light:interactions.length>0?"#fef2f2":"#f0fdf4" },
          { label:"Prescrições Salvas", value:saved.length, accent:"#6d28d9", light:"#f5f3ff" },
          { label:"Protocolos Disponíveis", value:Object.values(PROTOCOLS_FULL).reduce((a,c)=>a+Object.keys(c.items).length,0), accent:"#0369a1", light:"#f0f9ff" },
        ].map((s,i)=>(
          <div key={i} className="card" style={{ padding:"18px 20px", borderTop:`3px solid ${s.accent}` }}>
            <div style={{ fontSize:28, fontWeight:700, color:s.accent, fontFamily:"IBM Plex Mono, monospace", letterSpacing:"-1px" }}>{s.value}</div>
            <div style={{ fontSize:12, color:"#6b7280", fontWeight:500, marginTop:4, lineHeight:1.3 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <div className="card">
          <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>Ações Rápidas</div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {[
              { label:"Nova Prescrição", pg:"prescription", icon:IC.presc },
              { label:"Buscar Medicamento", pg:"medications", icon:IC.meds },
              { label:"Protocolos Clínicos", pg:"protocols", icon:IC.prot },
              { label:"Verificar Interações", pg:"interactions", icon:IC.inter },
            ].map((a,i)=>(
              <button key={i} onClick={()=>setPage(a.pg)} style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 13px", border:"1px solid #e5e7eb", borderRadius:8, background:"#fafafa", cursor:"pointer", fontSize:13, fontWeight:500, transition:"all .12s", fontFamily:"inherit", color:"#374151", textAlign:"left" }}
                onMouseEnter={e=>{e.currentTarget.style.background="#f0f7ff";e.currentTarget.style.borderColor="#bfdbfe";e.currentTarget.style.color="#1d4ed8";}}
                onMouseLeave={e=>{e.currentTarget.style.background="#fafafa";e.currentTarget.style.borderColor="#e5e7eb";e.currentTarget.style.color="#374151";}}>
                <span style={{ color:"#6b7280" }}>{a.icon}</span>{a.label}
              </button>
            ))}
          </div>
        </div>
        <div className="card">
          <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>Medicamentos Frequentes</div>
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            {MEDICATIONS_DB.slice(0,7).map(m=>(
              <div key={m.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"7px 9px", borderRadius:8, background:"#f8fafc" }}>
                <div><div style={{ fontSize:13, fontWeight:600 }}>{m.nome}</div><div style={{ fontSize:11, color:"#94a3b8" }}>{m.subcat}</div></div>
                <button className="btn bp" style={{ padding:"5px 10px", fontSize:12 }} onClick={()=>addMed(m)}>Adicionar</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PRESCRIPTION ─────────────────────────────────────────────────────────────
function PrescPage({ prescription, setPrescription, addMed, interactions, saved, setSaved, showToast, allMedsForSearch }) {
  const [q, setQ] = useState("");
  const [res, setRes] = useState([]);
  const [showDrop, setShowDrop] = useState(false);

  useEffect(()=>{
    if(q.length>=2){setRes(fuzzySearch(q,allMedsForSearch||MEDICATIONS_DB));setShowDrop(true)}
    else setShowDrop(false);
  },[q]);

  const updItem=(id,field,value)=>setPrescription(p=>({...p,items:p.items.map(it=>{if(it.id!==id)return it;const u={...it,[field]:value};if(field==="via"){const m=it.medicamento;const posArr=Array.isArray(m.posologias)?m.posologias:(m.posologias[value]||m.posologias[Object.keys(m.posologias)[0]]||[]);u.posologia=posArr[0]||it.posologia;if(!it.usoContínuo)u.quantidade=calcQtdMes(u.posologia,value);}if(field==="posologia"&&!it.usoContínuo)u.quantidade=calcQtdMes(value,it.via);if(field==="usoContínuo")u.quantidade=value?"Uso Contínuo":calcQtdMes(it.posologia,it.via);return u;})}));
  const delItem=id=>setPrescription(p=>({...p,items:p.items.filter(i=>i.id!==id)}));

  const savePrsc=()=>{
    if(!prescription.patient){showToast("Informe o nome do paciente","error");return;}
    if(!prescription.items.length){showToast("Adicione ao menos um medicamento","error");return;}
    setSaved(prev=>[{...prescription,savedAt:new Date().toLocaleString("pt-BR"),id:Date.now()},...prev]);
    showToast("Prescrição salva com sucesso!");
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div><h1 className="sec-title">Prescrição Médica</h1><p className="sec-sub">Monte a receita do paciente</p></div>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn bs" onClick={()=>setPrescription({patient:"",birthdate:"",date:new Date().toLocaleDateString("pt-BR"),cid:"",items:[]})}>Limpar tudo</button>
          <button className="btn bp" style={{background:"#1e3a5f"}} onClick={savePrsc}>Salvar prescrição</button>
        </div>
      </div>

      <div className="card">
        <div className="lbl" style={{ marginBottom:12 }}>Dados do Paciente</div>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:10 }}>
          <div><label className="lbl">Nome *</label><input className="inp" placeholder="Nome completo do paciente" value={prescription.patient} onChange={e=>setPrescription(p=>({...p,patient:e.target.value}))}/></div>
          <div><label className="lbl">Data de Nascimento</label><input className="inp" placeholder="dd/mm/aaaa" value={prescription.birthdate} onChange={e=>setPrescription(p=>({...p,birthdate:e.target.value}))}/></div>
          <div><label className="lbl">Data</label><input className="inp" value={prescription.date} onChange={e=>setPrescription(p=>({...p,date:e.target.value}))}/></div>
          <div><label className="lbl">CID (opcional)</label><input className="inp" placeholder="Ex: I10" value={prescription.cid} onChange={e=>setPrescription(p=>({...p,cid:e.target.value}))}/></div>
        </div>
      </div>

      <div className="card" style={{ padding:14 }}>
        <div className="srch-wrap">
          <div style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"#94a3b8" }}>{IC.srch}</div>
          <input className="srch-inp" style={{ width:"100%", fontSize:14.5 }} placeholder="Buscar medicamento para adicionar à prescrição..." value={q} onChange={e=>setQ(e.target.value)} onFocus={()=>q.length>=2&&setShowDrop(true)} onBlur={()=>setTimeout(()=>setShowDrop(false),200)}/>
          {showDrop && res.length>0 && (
            <div className="drop ani">
              {res.map(m=>(
                <div key={m.id} className="dri" onClick={()=>{addMed(m);setQ("");}}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span><strong>{m.nome}</strong> <span style={{ fontSize:11.5, background:"#dbeafe", color:"#1d4ed8", borderRadius:4, padding:"1px 7px", fontWeight:600 }}>{m.subcat}</span></span>
                    <span style={{ fontSize:12, color:"#94a3b8" }}>{m.doses.join(" · ")}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {interactions.length>0 && (
        <div style={{ background:"#fff1f2", border:"1.5px solid #fca5a5", borderRadius:11, padding:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:9 }}>
            <span style={{ fontWeight:700, color:"#dc2626", letterSpacing:"0.3px" }}>INTERAÇÕES DETECTADAS ({interactions.length})</span>
          </div>
          {interactions.map((it,i)=>(
            <div key={i} style={{ marginBottom:5, fontSize:13, color:"#7f1d1d", padding:"7px 10px", background:"rgba(255,255,255,.6)", borderRadius:6 }}>
              <strong>{it.pair}</strong> — <span className={`badge ${it.grav==="Grave"?"br":"by"}`}>{it.grav}</span>
              <br/><span style={{ color:"#991b1b" }}>{it.efeito}</span>
            </div>
          ))}
        </div>
      )}

      {prescription.items.length===0 ? (
        <div className="card" style={{ textAlign:"center", padding:36 }}>
          <div style={{ fontSize:15, fontWeight:600, color:"#64748b", marginTop:10 }}>Nenhum medicamento adicionado</div>
          <div style={{ fontSize:13, color:"#94a3b8", marginTop:3 }}>Use a busca acima ou o módulo Medicamentos para adicionar</div>
        </div>
      ) : (
        <div className="card">
          <div className="lbl" style={{ marginBottom:12 }}>Medicamentos Prescritos ({prescription.items.length})</div>
          <div style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr 1fr 2fr 110px 90px 32px", gap:7, padding:"0 14px 8px", fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:.5 }}>
            <div>Medicamento</div><div>Dose</div><div>Via</div><div>Posologia</div><div>Quantidade</div><div>Uso Contínuo</div><div></div>
          </div>
          {prescription.items.map(item=>{
            const inv=interactions.some(it=>it.pair && it.pair.includes(item.medicamento?.nome));
            const qtdLabel = getQtdLabel(item.via);
            return (
              <div key={item.id} className="med-row" style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr 1fr 2fr 110px 90px 32px", borderColor:inv?"#fca5a5":"#e8eef4" }}>
                <div>
                  <div style={{ fontWeight:600, fontSize:13 }}>{item.medicamento?.nome}</div>
                  <div style={{ fontSize:11, color:"#94a3b8" }}>{item.medicamento?.subcat}</div>
                  {inv&&<span style={{ fontSize:10, color:"#dc2626", fontWeight:600 }}>⚠ interação</span>}
                </div>
                <select className="sel" value={item.dose} onChange={e=>updItem(item.id,"dose",e.target.value)}>
                  {item.medicamento?.doses.map(d=><option key={d} value={d}>{d}</option>)}
                </select>
                <select className="sel" value={item.via} onChange={e=>updItem(item.id,"via",e.target.value)}>
                  {["VO","IV","IM","SC","Inalatória","Tópica","SL","Ocular","Otológica","Intranasal","Vaginal","Intra-articular"].map(v=><option key={v} value={v}>{v}</option>)}
                </select>
                <select className="sel" style={{ fontSize:12 }} value={item.posologia} onChange={e=>updItem(item.id,"posologia",e.target.value)}>
                  {(Array.isArray(item.medicamento?.posologias) ? item.medicamento.posologias : (item.medicamento?.posologias?.[item.via] || item.medicamento?.posologias?.[Object.keys(item.medicamento?.posologias||{})[0]] || [])).map(p=><option key={p} value={p}>{p}</option>)}
                </select>
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  {item.usoContínuo ? (
                    <div style={{ fontSize:11, fontWeight:600, color:"#2563eb", background:"#dbeafe", borderRadius:6, padding:"4px 8px", whiteSpace:"nowrap" }}>Uso Contínuo</div>
                  ) : (
                    <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                      <input className="inp" type="number" style={{ fontSize:12, padding:"7px 5px", width:52 }} value={item.quantidade} onChange={e=>updItem(item.id,"quantidade",parseInt(e.target.value)||0)} min={1}/>
                      <span style={{ fontSize:10, color:"#64748b", whiteSpace:"nowrap" }}>{qtdLabel}</span>
                    </div>
                  )}
                </div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <label style={{ display:"flex", flexDirection:"column", alignItems:"center", cursor:"pointer", gap:2 }}>
                    <input type="checkbox" checked={!!item.usoContínuo} onChange={e=>updItem(item.id,"usoContínuo",e.target.checked)} style={{ width:16, height:16, cursor:"pointer", accentColor:"#2563eb" }}/>
                    <span style={{ fontSize:9, color:"#64748b" }}>contínuo</span>
                  </label>
                </div>
                <button className="btn bd" style={{ padding:"7px" }} onClick={()=>delItem(item.id)}>{IC.del}</button>
              </div>
            );
          })}
          <div style={{ marginTop:6, padding:"9px 14px", background:"#f8fafc", borderRadius:8, fontSize:12, color:"#64748b" }}>
            Total: <strong>{prescription.items.length}</strong> medicamento(s) · <strong>{prescription.items.filter(i=>!i.usoContínuo).reduce((s,i)=>s+(parseInt(i.quantidade)||0),0)}</strong> unidade(s) + <strong>{prescription.items.filter(i=>i.usoContínuo).length}</strong> uso contínuo
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MEDICATIONS PAGE ───────────────────────────────────────────────────────
function MedsPage({ addMed, customMeds, setCustomMeds }) {
  const [selCat, setSelCat] = useState(0);
  const [selSub, setSelSub] = useState(null);
  const [q, setQ] = useState("");
  const [expandedCats, setExpandedCats] = useState({ 0: true });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMed, setEditMed] = useState(null);

  const allMeds = useMemo(() => [...MEDICATIONS_DB, ...customMeds], [customMeds]);

  const cat = FULL_CATEGORIES[selCat];
  const activeSub = selSub || cat.subcats[0];
  const meds = allMeds.filter(m => {
    if (!q) return m.subcat === activeSub;
    const qn = q.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu,"");
    return m.nome.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu,"").includes(qn) ||
           m.subcat.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu,"").includes(qn);
  });

  const toggleCat = (i) => {
    setExpandedCats(prev => ({ ...prev, [i]: !prev[i] }));
    setSelCat(i);
    setSelSub(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Remover este medicamento do banco personalizado?")) {
      setCustomMeds(prev => prev.filter(m => m.id !== id));
    }
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <h1 style={{ fontSize:21, fontWeight:700, color:"#0f172a" }}>Medicamentos</h1>
          <p className="sec-sub">{allMeds.length} medicamentos no banco · {customMeds.length} adicionados por você</p>
        </div>
        <button className="btn bp" onClick={()=>{setEditMed(null);setShowAddModal(true);}}>
          {IC.plus} Novo Medicamento
        </button>
      </div>

      <div style={{ display:"flex", gap:14 }}>
        {/* LEFT NAV */}
        <div className="card" style={{ width:228, flexShrink:0, padding:8, height:"fit-content", maxHeight:"calc(100vh - 170px)", overflowY:"auto" }}>
          {FULL_CATEGORIES.map((c,i)=>(
            <div key={i}>
              <button onClick={()=>toggleCat(i)} style={{ display:"flex", alignItems:"center", gap:6, width:"100%", padding:"7px 8px", borderRadius:6, border:"none", background: selCat===i&&!q?"#f0f7ff":"none", color: selCat===i&&!q?"#1d4ed8":"#374151", fontWeight:600, cursor:"pointer", fontSize:12.5, textAlign:"left", fontFamily:"inherit", transition:"all .1s" }}>
                <span style={{ flex:1 }}>{c.nome}</span>
                <span style={{ fontSize:10.5, color:"#94a3b8", fontWeight:400, marginRight:4 }}>{allMeds.filter(m=>c.subcats.includes(m.subcat)).length}</span>
                <span style={{ transform: expandedCats[i]?"rotate(0deg)":"rotate(-90deg)", transition:"transform .2s", color:"#cbd5e1", display:"flex" }}>{IC.chev}</span>
              </button>
              {expandedCats[i] && c.subcats.map((sub,j)=>{
                const cnt = allMeds.filter(m=>m.subcat===sub).length;
                const active = activeSub===sub&&selCat===i&&!q;
                return (
                  <button key={j} onClick={()=>{setSelCat(i);setSelSub(sub);setQ("");}} style={{ display:"flex", alignItems:"center", width:"100%", padding:"4px 8px 4px 20px", border:"none", background: active?"#dbeafe":"none", color: active?"#1d4ed8":"#6b7280", fontWeight: active?600:400, cursor:"pointer", fontSize:11.5, textAlign:"left", borderRadius:5, fontFamily:"inherit", marginTop:1, transition:"background .1s" }}>
                    <span style={{flex:1, lineHeight:1.4}}>{sub}</span>
                    <span style={{ fontSize:10, fontWeight:600, background: active?"#bfdbfe":"#f1f5f9", color: active?"#1d4ed8":"#94a3b8", borderRadius:9, padding:"1px 6px", marginLeft:4, flexShrink:0 }}>{cnt}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* CONTENT */}
        <div style={{ flex:1, minWidth:0 }}>
          <div className="card" style={{ marginBottom:10, padding:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14.5, fontWeight:700, color:"#0f172a" }}>{q ? `Resultados para "${q}"` : activeSub}</div>
                <div style={{ fontSize:11.5, color:"#94a3b8", marginTop:1 }}>{q ? "Busca global" : cat.nome} · <strong style={{color:"#374151"}}>{meds.length}</strong> medicamento(s)</div>
              </div>
              <div className="srch-wrap" style={{ width:260 }}>
                <div style={{ position:"absolute", left:9, top:"50%", transform:"translateY(-50%)", color:"#94a3b8" }}>{IC.srch}</div>
                <input className="srch-inp" style={{ width:"100%", paddingLeft:30, fontSize:13 }} placeholder="Filtrar medicamento..." value={q} onChange={e=>setQ(e.target.value)}/>
              </div>
              <button className="btn bs" style={{ fontSize:12, padding:"7px 12px", flexShrink:0 }} onClick={()=>{ setSelSub(activeSub); setShowAddModal(true); setEditMed(null); }}>
                {IC.plus} Adicionar nesta classe
              </button>
            </div>
          </div>

          {meds.length===0 ? (
            <div className="card" style={{ textAlign:"center", padding:36 }}>
              <div style={{ fontSize:14, fontWeight:600, color:"#64748b", marginBottom:8 }}>Nenhum medicamento nesta subcategoria</div>
              <p style={{ fontSize:13, color:"#94a3b8", marginBottom:16 }}>Esta classe ainda não possui medicamentos cadastrados no banco.</p>
              <button className="btn bp" onClick={()=>{setShowAddModal(true);setEditMed(null);}}>
                {IC.plus} Adicionar medicamento aqui
              </button>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {meds.map(m=>{
                const isCustom = m.isCustom;
                return (
                  <div key={m.id} className="card" style={{ padding:13, display:"flex", alignItems:"flex-start", gap:12, borderLeft: isCustom?"3px solid #2563eb":"3px solid transparent" }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5, flexWrap:"wrap" }}>
                        <span style={{ fontSize:14, fontWeight:700, color:"#0f172a" }}>{m.nome}</span>
                        {isCustom && <span style={{ fontSize:10, fontWeight:700, background:"#dbeafe", color:"#1d4ed8", borderRadius:4, padding:"2px 7px", letterSpacing:".3px" }}>PERSONALIZADO</span>}
                      </div>
                      <div style={{ display:"flex", gap:16, fontSize:12, color:"#64748b", flexWrap:"wrap" }}>
                        <span><span style={{fontWeight:600,color:"#374151"}}>Dose:</span> {m.doses.join(" · ")}</span>
                        <span><span style={{fontWeight:600,color:"#374151"}}>Via:</span> {m.vias.join(", ")}</span>
                      </div>
                      <div style={{ marginTop:5 }}>
                        {(Array.isArray(m.posologias)?m.posologias:Object.values(m.posologias).flat()).slice(0,2).map((p,i)=>(
                          <div key={i} style={{ fontSize:12, color:"#475569", marginTop:2, display:"flex", gap:5 }}>
                            <span style={{color:"#94a3b8",flexShrink:0}}>▸</span>{p}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                      {isCustom && (
                        <>
                          <button className="btn bs" style={{ padding:"5px 10px", fontSize:12 }} onClick={()=>{setEditMed(m);setShowAddModal(true);}}>Editar</button>
                          <button className="btn bd" style={{ padding:"5px 9px", fontSize:12 }} onClick={()=>handleDelete(m.id)}>{IC.del}</button>
                        </>
                      )}
                      <button className="btn bp" style={{ padding:"6px 13px", fontSize:12.5 }} onClick={()=>addMed(m)}>Prescrever</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddMedModal
          initialSub={activeSub}
          editMed={editMed}
          onClose={()=>{setShowAddModal(false);setEditMed(null);}}
          onSave={(med)=>{
            if (editMed) {
              setCustomMeds(prev => prev.map(m => m.id===med.id ? med : m));
            } else {
              setCustomMeds(prev => [...prev, med]);
            }
            setShowAddModal(false);
            setEditMed(null);
          }}
        />
      )}
    </div>
  );
}

// ─── ADD MEDICATION MODAL ─────────────────────────────────────────────────────
function AddMedModal({ initialSub, editMed, onClose, onSave }) {
  const allSubcats = FULL_CATEGORIES.flatMap(c => c.subcats);
  const [form, setForm] = useState(() => editMed ? {
    nome: editMed.nome,
    subcat: editMed.subcat,
    doses: editMed.doses.join(", "),
    vias: editMed.vias.join(", "),
    posologias: Array.isArray(editMed.posologias) ? editMed.posologias.join("\n") : Object.values(editMed.posologias).flat().join("\n"),
  } : {
    nome: "",
    subcat: initialSub || allSubcats[0],
    doses: "",
    vias: "VO",
    posologias: "",
  });
  const [errors, setErrors] = useState({});

  const upd = (f,v) => setForm(p => ({...p,[f]:v}));

  const validate = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = "Nome obrigatório";
    if (!form.doses.trim()) e.doses = "Informe ao menos uma dose";
    if (!form.posologias.trim()) e.posologias = "Informe ao menos uma posologia";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const med = {
      id: editMed ? editMed.id : Date.now(),
      nome: form.nome.trim(),
      subcat: form.subcat,
      doses: form.doses.split(",").map(s=>s.trim()).filter(Boolean),
      vias: form.vias.split(",").map(s=>s.trim()).filter(Boolean),
      posologias: form.posologias.split("\n").map(s=>s.trim()).filter(Boolean),
      isCustom: true,
    };
    onSave(med);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:600, padding:20 }}>
      <div style={{ background:"#fff", borderRadius:14, width:560, maxHeight:"90vh", overflow:"auto", boxShadow:"0 20px 60px rgba(0,0,0,.25)" }}>
        <div style={{ padding:"20px 24px 0", borderBottom:"1px solid #f1f5f9", marginBottom:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingBottom:16 }}>
            <div>
              <h2 style={{ fontSize:17, fontWeight:700, color:"#0f172a" }}>{editMed ? "Editar Medicamento" : "Adicionar Medicamento ao Banco"}</h2>
              <p style={{ fontSize:12.5, color:"#64748b", marginTop:2 }}>O medicamento ficará salvo no banco personalizado para prescrições futuras</p>
            </div>
            <button onClick={onClose} style={{ border:"none", background:"#f1f5f9", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", color:"#64748b" }}>✕</button>
          </div>
        </div>
        <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <label className="lbl">Nome do Medicamento *</label>
            <input className="inp" placeholder="Ex: Nistatina, Doxiciclina..." value={form.nome} onChange={e=>upd("nome",e.target.value)} style={{ borderColor: errors.nome?"#dc2626":"" }}/>
            {errors.nome && <div style={{ fontSize:11.5, color:"#dc2626", marginTop:3 }}>{errors.nome}</div>}
          </div>
          <div>
            <label className="lbl">Classe / Subcategoria *</label>
            <select className="sel" style={{ width:"100%" }} value={form.subcat} onChange={e=>upd("subcat",e.target.value)}>
              {FULL_CATEGORIES.map(cat=>
                cat.subcats.map(sub=>
                  <option key={sub} value={sub}>{cat.nome} › {sub}</option>
                )
              )}
            </select>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label className="lbl">Apresentações / Doses *</label>
              <input className="inp" placeholder="Ex: 100.000UI/mL, 500mg (separar por vírgula)" value={form.doses} onChange={e=>upd("doses",e.target.value)} style={{ borderColor: errors.doses?"#dc2626":"" }}/>
              {errors.doses && <div style={{ fontSize:11.5, color:"#dc2626", marginTop:3 }}>{errors.doses}</div>}
              <div style={{ fontSize:11, color:"#94a3b8", marginTop:3 }}>Separe múltiplas apresentações com vírgula</div>
            </div>
            <div>
              <label className="lbl">Vias de Administração *</label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginTop:4 }}>
                {["VO","IV","IM","SC","Inalatória","Tópica","Vaginal","Ocular","Intranasal","Otológica","SL"].map(v=>{
                  const selected = form.vias.split(",").map(s=>s.trim()).includes(v);
                  return (
                    <button key={v} type="button" onClick={()=>{
                      const arr = form.vias.split(",").map(s=>s.trim()).filter(Boolean);
                      const next = selected ? arr.filter(x=>x!==v) : [...arr, v];
                      upd("vias", next.join(", "));
                    }} style={{ padding:"4px 9px", borderRadius:5, border:"1.5px solid", fontSize:11.5, fontWeight:600, cursor:"pointer", fontFamily:"inherit", borderColor: selected?"#2563eb":"#e2e8f0", background: selected?"#2563eb":"#f8fafc", color: selected?"#fff":"#475569", transition:"all .15s" }}>
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div>
            <label className="lbl">Posologias / Modos de Uso *</label>
            <textarea className="inp" rows={5} placeholder={"Uma posologia por linha. Exemplos:\nAplicar 1mL vaginal de 8 em 8 horas por 14 dias\nTomar 1 comprimido ao dia em jejum"} value={form.posologias} onChange={e=>upd("posologias",e.target.value)} style={{ resize:"vertical", lineHeight:1.6, borderColor: errors.posologias?"#dc2626":"" }}/>
            {errors.posologias && <div style={{ fontSize:11.5, color:"#dc2626", marginTop:3 }}>{errors.posologias}</div>}
            <div style={{ fontSize:11, color:"#94a3b8", marginTop:3 }}>Uma posologia por linha — use linguagem clínica padrão</div>
          </div>
          <div style={{ display:"flex", justifyContent:"flex-end", gap:8, paddingTop:4, borderTop:"1px solid #f1f5f9" }}>
            <button className="btn bs" onClick={onClose}>Cancelar</button>
            <button className="btn bp" onClick={handleSave}>{editMed ? "Salvar Alterações" : "Adicionar ao Banco"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── PROTOCOLS PAGE ───────────────────────────────────────────────────────────
function ProtoPage({ addMed, setPage }) {
  const [selGroup, setSelGroup] = useState(null);
  const [selProto, setSelProto] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({ "Sistema Circulatório": true });

  if (selProto) {
    const proto = selProto.proto;
    const meds = MEDICATIONS_DB.filter(m => proto.meds.includes(m.id));
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        <button className="btn bs" onClick={()=>setSelProto(null)}>Voltar</button>
        <div className="card">
          <div style={{ display:"flex", alignItems:"center", gap:11, marginBottom:14 }}>
            <div><h1 style={{ fontSize:19, fontWeight:700 }}>{selProto.name}</h1><span className="badge bb">CID {proto.cid}</span></div>
          </div>
          <div style={{ marginBottom:13 }}><div className="lbl">Definição</div><p style={{ fontSize:13.5, color:"#475569", lineHeight:1.65 }}>{proto.descricao}</p></div>
          {proto.metas?.length>0 && <div style={{ marginBottom:13 }}><div className="lbl">Metas Terapêuticas</div>{proto.metas.map((m,i)=><div key={i} style={{ fontSize:13, color:"#475569", marginTop:3, display:"flex", gap:6 }}><span style={{color:"#15803d",fontWeight:700,flexShrink:0}}>✓</span>{m}</div>)}</div>}
          <div><div className="lbl">Conduta</div><p style={{ fontSize:13.5, color:"#475569", lineHeight:1.7 }}>{proto.conduta}</p></div>
        </div>
        {meds.length>0 && (
          <div className="card">
            <div style={{ fontSize:14, fontWeight:700, marginBottom:13 }}>Medicamentos Recomendados</div>
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {meds.map(m=>(
                <div key={m.id} style={{ display:"flex", alignItems:"center", gap:11, padding:"9px 13px", background:"#f8fafc", borderRadius:8 }}>
                  <div style={{ flex:1 }}><div style={{ fontWeight:600, fontSize:13 }}>{m.nome}</div><div style={{ fontSize:11, color:"#94a3b8" }}>{m.subcat} · {m.doses.join(", ")}</div></div>
                  <button className="btn bp" style={{ padding:"5px 11px", fontSize:12 }} onClick={()=>{addMed(m);setPage("prescription");}}>+ Adicionar</button>
                </div>
              ))}
            </div>
            {meds.length>1 && <button className="btn bp" style={{ marginTop:13 }} onClick={()=>{meds.forEach(m=>addMed(m));setPage("prescription");}}>Adicionar todos à prescrição</button>}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <div><h1 className="sec-title">Protocolos Clínicos</h1><p className="sec-sub">Diretrizes e condutas por patologia</p></div>
      <div style={{ display:"flex", gap:16 }}>
        {/* SIDEBAR */}
        <div className="card" style={{ width:220, flexShrink:0, padding:10, height:"fit-content", maxHeight:"calc(100vh - 160px)", overflowY:"auto" }}>
          {Object.entries(PROTOCOLS_FULL).map(([group, data])=>(
            <div key={group}>
              <button onClick={()=>setExpandedGroups(p=>({...p,[group]:!p[group]}))} style={{ display:"flex", alignItems:"center", gap:7, width:"100%", padding:"7px 8px", borderRadius:7, border:"none", background:"none", color:"#374151", fontWeight:700, cursor:"pointer", fontSize:12.5, textAlign:"left", fontFamily:"inherit" }}>
                <span style={{ flex:1 }}>{group}</span>
                <span style={{ transform: expandedGroups[group]?"rotate(0deg)":"rotate(-90deg)", transition:"transform .2s", color:"#94a3b8" }}>{IC.chev}</span>
              </button>
              {expandedGroups[group] && Object.entries(data.items).map(([name,proto])=>(
                <button key={name} onClick={()=>setSelProto({name,proto})} style={{ display:"block", width:"100%", padding:"5px 8px 5px 28px", border:"none", background:"none", color:"#4b5563", fontWeight:400, cursor:"pointer", fontSize:11.5, textAlign:"left", borderRadius:6, fontFamily:"inherit", marginTop:1 }}
                  onMouseEnter={e=>e.currentTarget.style.background="#f0f7ff"}
                  onMouseLeave={e=>e.currentTarget.style.background="none"}>
                  {proto.icon} {name}
                </button>
              ))}
            </div>
          ))}
        </div>
        {/* GRID */}
        <div style={{ flex:1 }}>
          {Object.entries(PROTOCOLS_FULL).map(([group,data])=>(
            <div key={group} style={{ marginBottom:20 }}>
              <div style={{ fontSize:13, fontWeight:700, marginBottom:8, color:"#374151", textTransform:"uppercase", letterSpacing:".5px", paddingBottom:6, borderBottom:"1px solid #f3f4f6" }}>
                {group}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                {Object.entries(data.items).map(([name,proto])=>(
                  <div key={name} className="prot-card" onClick={()=>setSelProto({name,proto})}>
                    <div style={{ display:"flex", gap:9, alignItems:"center", marginBottom:7 }}>
                      <div><div style={{ fontWeight:700, fontSize:13.5 }}>{name}</div><span className="badge bb" style={{ fontSize:10.5 }}>CID {proto.cid}</span></div>
                    </div>
                    <p style={{ fontSize:11.5, color:"#64748b", lineHeight:1.5 }}>{proto.descricao.substring(0,90)}...</p>
                    <div style={{ marginTop:7, fontSize:11, color:"#2563eb", fontWeight:600 }}>{MEDICATIONS_DB.filter(m=>proto.meds.includes(m.id)).length} medicamentos →</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── INTERACTIONS PAGE ────────────────────────────────────────────────────────
function InterPage({ prescription, interactions }) {
  const [tab, setTab] = useState("active");
  const [dbSearch, setDbSearch] = useState("");
  const [gravFilter, setGravFilter] = useState("Todas");

  const filteredDb = INTERACTIONS_DB.filter(it => {
    if (gravFilter !== "Todas" && it.grav !== gravFilter) return false;
    if (!dbSearch) return true;
    const q = dbSearch.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu,"");
    return (it.med1+it.med2+it.efeito).toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu,"").includes(q);
  });

  const gravColor = g => g==="Grave"?"br":g==="Moderada"?"by":"bg2";
  const cardColor = g => g==="Grave"?"ia":g==="Moderada"?"im":"il";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
        <div>
          <h1 className="sec-title">Interações Medicamentosas</h1>
          <p className="sec-sub">Verificação automática + banco de dados de interações</p>
        </div>
        <div style={{ display:"flex", gap:2, background:"#f1f5f9", borderRadius:10, padding:3 }}>
          {[["active","Prescrição Atual"],["db","Banco de Interações"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{ padding:"7px 16px", borderRadius:8, border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:tab===id?700:500, background:tab===id?"#2563eb":"transparent", color:tab===id?"#fff":"#475569", transition:"all .15s" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab==="active" && (
        <>
          {prescription.items.length===0 ? (
            <div className="card" style={{ textAlign:"center", padding:36 }}>
              <div style={{ fontSize:15, fontWeight:600, color:"#64748b", marginTop:10 }}>Adicione medicamentos à prescrição para verificar interações</div>
            </div>
          ) : interactions.length===0 ? (
            <div className="card" style={{ textAlign:"center", padding:36 }}>
              <div style={{ fontSize:15, fontWeight:600, color:"#16a34a", marginTop:10 }}>Nenhuma interação relevante detectada</div>
              <div style={{ fontSize:13, color:"#64748b", marginTop:3 }}>Os {prescription.items.length} medicamento(s) não apresentam interações conhecidas no banco de dados</div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom:12, display:"flex", gap:8, alignItems:"center" }}>
                <span style={{ fontSize:13.5, color:"#475569", fontWeight:500 }}>Detectadas:</span>
                {["Grave","Moderada","Leve"].map(g=>{const c=interactions.filter(i=>i.grav===g).length;if(!c)return null;return <span key={g} className={`badge ${gravColor(g)}`}>{c} {g}{c>1?"s":""}</span>;})}
              </div>
              {interactions.map((it,i)=>(
                <div key={i} className={`card ${cardColor(it.grav)}`} style={{ marginBottom:10, padding:15 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
                    <div style={{ fontWeight:700, fontSize:14.5 }}>⚠ {it.pair}</div>
                    <span className={`badge ${gravColor(it.grav)}`}>{it.grav}</span>
                  </div>
                  <div style={{ fontSize:13, marginBottom:4 }}><strong>Tipo:</strong> {it.tipo}</div>
                  <div style={{ fontSize:13, marginBottom:4 }}><strong>Efeito clínico:</strong> {it.efeito}</div>
                  {it.mecanismo && <div style={{ fontSize:12, color:"#64748b" }}><strong>Mecanismo:</strong> {it.mecanismo}</div>}
                </div>
              ))}
            </div>
          )}
          <div className="card" style={{ background:"#fffbeb", border:"1.5px solid #fde68a" }}>
            <div style={{ fontSize:13, color:"#92400e" }}>
              ⚠️ <strong>Atenção:</strong> Este banco contém {INTERACTIONS_DB.length} pares de interações conhecidas. A ausência de alerta não garante ausência de interação. Consulte sempre referências atualizadas (Micromedex, UpToDate, ANVISA).
            </div>
          </div>
        </>
      )}

      {tab==="db" && (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div className="card" style={{ padding:14 }}>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <div className="srch-wrap" style={{ flex:1 }}>
                <div style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"#94a3b8" }}>{IC.srch}</div>
                <input className="srch-inp" style={{ width:"100%", paddingLeft:32 }} placeholder="Buscar medicamento ou efeito no banco..." value={dbSearch} onChange={e=>setDbSearch(e.target.value)}/>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                {["Todas","Grave","Moderada","Leve"].map(g=>(
                  <button key={g} onClick={()=>setGravFilter(g)} style={{ padding:"6px 12px", borderRadius:7, border:"1.5px solid", fontFamily:"inherit", fontSize:12.5, fontWeight:600, cursor:"pointer", borderColor: gravFilter===g?"#2563eb":"#e2e8f0", background: gravFilter===g?"#2563eb":"#f8fafc", color: gravFilter===g?"#fff":"#475569", transition:"all .15s" }}>
                    {g}
                  </button>
                ))}
              </div>
              <span style={{ fontSize:13, color:"#64748b", whiteSpace:"nowrap" }}>{filteredDb.length} interação(ões)</span>
            </div>
          </div>
          <div className="card" style={{ padding:0, overflow:"hidden" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ background:"#f8fafc", borderBottom:"2px solid #e2e8f0" }}>
                  <th style={{ padding:"10px 14px", textAlign:"left", fontWeight:700, color:"#64748b", fontSize:11.5, textTransform:"uppercase", letterSpacing:.5, width:"18%" }}>Medicamento 1</th>
                  <th style={{ padding:"10px 14px", textAlign:"left", fontWeight:700, color:"#64748b", fontSize:11.5, textTransform:"uppercase", letterSpacing:.5, width:"18%" }}>Medicamento 2</th>
                  <th style={{ padding:"10px 6px", textAlign:"center", fontWeight:700, color:"#64748b", fontSize:11.5, textTransform:"uppercase", letterSpacing:.5, width:"9%" }}>Gravidade</th>
                  <th style={{ padding:"10px 14px", textAlign:"left", fontWeight:700, color:"#64748b", fontSize:11.5, textTransform:"uppercase", letterSpacing:.5, width:"10%" }}>Tipo</th>
                  <th style={{ padding:"10px 14px", textAlign:"left", fontWeight:700, color:"#64748b", fontSize:11.5, textTransform:"uppercase", letterSpacing:.5 }}>Efeito Clínico</th>
                </tr>
              </thead>
              <tbody>
                {filteredDb.map((it,i)=>(
                  <tr key={i} style={{ borderBottom:"1px solid #f1f5f9", background: i%2===0?"#fff":"#fafbfc" }}>
                    <td style={{ padding:"9px 14px", fontWeight:600 }}>{it.med1}</td>
                    <td style={{ padding:"9px 14px", fontWeight:600 }}>{it.med2}</td>
                    <td style={{ padding:"9px 6px", textAlign:"center" }}><span className={`badge ${gravColor(it.grav)}`}>{it.grav}</span></td>
                    <td style={{ padding:"9px 14px", color:"#64748b", fontSize:12 }}>{it.tipo}</td>
                    <td style={{ padding:"9px 14px" }}>
                      <div>{it.efeito}</div>
                      {it.mecanismo && <div style={{ fontSize:11.5, color:"#94a3b8", marginTop:3 }}>{it.mecanismo}</div>}
                    </td>
                  </tr>
                ))}
                {filteredDb.length===0 && (
                  <tr><td colSpan={5} style={{ padding:"24px", textAlign:"center", color:"#94a3b8" }}>Nenhuma interação encontrada para este filtro</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function HistPage({ saved }) {
  if(!saved.length) return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <div><h1 className="sec-title">Histórico de Prescrições</h1></div>
      <div className="card" style={{ textAlign:"center", padding:36 }}><div style={{ fontSize:14, fontWeight:600, color:"#6b7280", marginTop:10 }}>Nenhuma prescrição salva ainda</div></div>
    </div>
  );
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <div><h1 className="sec-title">Histórico de Prescrições</h1><p className="sec-sub">{saved.length} prescrição(ões) arquivada(s)</p></div>
      {saved.map(p=>(
        <div key={p.id} className="card">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:9 }}>
            <div>
              <div style={{ fontWeight:700, fontSize:14, color:"#0f172a" }}>{p.patient||"Paciente não informado"}</div>
              <div style={{ fontSize:12, color:"#94a3b8" }}>Salva em: {p.savedAt} · {p.items.length} medicamento(s)</div>
            </div>
            {p.cid&&<span className="badge bb">CID {p.cid}</span>}
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
            {p.items.map(it=><span key={it.id} style={{ background:"#f1f5f9", borderRadius:5, padding:"2px 9px", fontSize:12, color:"#475569" }}>{it.medicamento?.nome} {it.dose}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function CfgPage({ doctor, setDoctor, showToast, customMeds }) {
  const [form, setForm] = useState(doctor);
  const upd=(f,v)=>setForm(p=>({...p,[f]:v}));
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <div><h1 className="sec-title">Configurações</h1><p className="sec-sub">Dados profissionais para a receita médica</p></div>
      <div className="card" style={{ maxWidth:580 }}>
        <div style={{ fontSize:14, fontWeight:700, marginBottom:15, color:"#0f172a" }}>Dados Profissionais</div>
        <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
          {[["nome","Nome Completo","Dr. João Silva"],["crm","Número CRM","123456"],["uf","UF do CRM","MG"],["especialidade","Especialidade","Clínica Médica"],["telefone","Telefone","(31) 98765-4321"],["endereco","Endereço do Consultório","Av. ..."]].map(([f,label,ph])=>(
            <div key={f}>
              <label className="lbl">{label}</label>
              <input className="inp" placeholder={ph} value={form[f]||""} onChange={e=>upd(f,e.target.value)}/>
            </div>
          ))}
          <button className="btn bp" style={{ marginTop:4, width:"fit-content" }} onClick={()=>{setDoctor(form);showToast("Configurações salvas!");}}>Salvar Configurações</button>
        </div>
      </div>
      <div className="card" style={{ maxWidth:580 }}>
        <div style={{ fontSize:14, fontWeight:700, marginBottom:10, color:"#0f172a" }}>Sobre o Sistema</div>
        <div style={{ fontSize:13, color:"#64748b", lineHeight:1.8 }}>
          <p><strong>MedPrescrição v2.0</strong></p>
          <p><strong>{MEDICATIONS_DB.length + customMeds.length}</strong> medicamentos no banco</p>
          <p><strong>{INTERACTIONS_DB.length}</strong> pares de interações mapeadas</p>
          <p><strong>{Object.values(PROTOCOLS_FULL).reduce((a,c)=>a+Object.keys(c.items).length,0)}</strong> protocolos clínicos em <strong>{Object.keys(PROTOCOLS_FULL).length}</strong> grupos</p>
          <p><strong>{FULL_CATEGORIES.length}</strong> especialidades · <strong>{FULL_CATEGORIES.reduce((a,c)=>a+c.subcats.length,0)}</strong> subcategorias</p>
          <p style={{ marginTop:8, fontSize:11.5, color:"#94a3b8" }}>⚠️ Ferramenta de apoio clínico. Sempre baseie decisões em julgamento clínico e diretrizes atualizadas.</p>
        </div>
      </div>
    </div>
  );
}

// ─── PRINT MODAL ──────────────────────────────────────────────────────────────
function PrintModal({ prescription, doctor, onClose }) {
  // Group by via (USO ORAL, USO PARENTERAL, etc.)
  const grouped = {};
  prescription.items.forEach(item => {
    const via = item.via;
    let group = "USO ORAL";
    if (["IV","IM","SC","IO"].includes(via)) group = "USO PARENTERAL";
    else if (via === "Inalatória") group = "USO INALATÓRIO";
    else if (["Tópica","Ocular","Otológica","Intranasal","Vaginal","Intra-articular"].includes(via)) group = "USO TÓPICO";
    else if (via === "SL") group = "USO SUBLINGUAL";
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(item);
  });

  const handlePrint = () => {
    const printHTML = buildPrintHTML(prescription, doctor, grouped);
    const w = window.open("","_blank","width=800,height=900");
    w.document.write(printHTML);
    w.document.close();
    setTimeout(()=>{w.print();},800);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:500, padding:20 }}>
      <div style={{ background:"#fff", borderRadius:12, padding:24, width:760, maxHeight:"92vh", display:"flex", flexDirection:"column", boxShadow:"0 20px 60px rgba(0,0,0,.3)", border:"1px solid #e5e7eb" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <h2 style={{ fontSize:16, fontWeight:700, color:"#0f172a" }}>Visualizar Receita Médica</h2>
          <div style={{ display:"flex", gap:8 }}>
            <button className="btn bp" onClick={handlePrint}>{IC.print} Imprimir / Salvar PDF</button>
            <button className="btn bs" onClick={onClose}>Fechar</button>
          </div>
        </div>
        {/* PREVIEW */}
        <div style={{ flex:1, overflowY:"auto", background:"#f0f2f5", borderRadius:9, padding:20 }}>
          <div style={{ background:"#fff", maxWidth:680, margin:"0 auto", padding:"32px 36px", boxShadow:"0 2px 16px rgba(0,0,0,.1)", fontFamily:"Arial,sans-serif", fontSize:13 }}>
            {/* HEADER */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4, paddingBottom:8, borderBottom:"2px solid #1a2332" }}>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:"#555" }}>RECEITUÁRIO MÉDICO</div>
                <div style={{ fontSize:15, fontWeight:700, marginTop:2 }}>{doctor.nome}</div>
                <div style={{ fontSize:11, color:"#555" }}>CRM/{doctor.uf} {doctor.crm} — {doctor.especialidade}</div>
                {doctor.telefone && <div style={{ fontSize:11, color:"#555" }}>Tel: {doctor.telefone}</div>}
              </div>
              <div style={{ textAlign:"right", fontSize:11, color:"#555" }}>
                {doctor.endereco && <div style={{ maxWidth:240, textAlign:"right" }}>{doctor.endereco}</div>}
              </div>
            </div>
            {/* PATIENT */}
            <div style={{ border:"1px solid #333", padding:"6px 10px", marginTop:10, marginBottom:14, fontSize:12 }}>
              <div style={{ display:"flex", gap:20 }}>
                <span><strong>NOME:</strong> {prescription.patient || "___________________________"}</span>
                {prescription.birthdate && <span><strong>DATA DE NASCIMENTO:</strong> {prescription.birthdate}</span>}
                <span style={{ marginLeft:"auto" }}><strong>DATA:</strong> {prescription.date}</span>
              </div>
            </div>
            {/* MEDS */}
            {Object.entries(grouped).map(([group, items]) => {
              let counter = 0;
              Object.entries(grouped).forEach(([g, its]) => {
                if (g === group) return;
                // count items before this group
              });
              // Calculate global numbering
              const allItems = Object.values(grouped).flat();
              const startIdx = allItems.indexOf(items[0]);
              return (
                <div key={group} style={{ marginBottom:14 }}>
                  <div style={{ fontWeight:700, fontSize:12, marginBottom:8, textTransform:"uppercase", borderBottom:"1px solid #e0e0e0", paddingBottom:4 }}>{group}</div>
                  {items.map((item, j) => {
                    const globalNum = allItems.indexOf(item) + 1;
                    return (
                      <div key={item.id} style={{ marginBottom:11 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                          <div style={{ flex:1 }}>
                            <div style={{ fontWeight:700 }}>{globalNum}. {item.medicamento?.nome.toUpperCase()} {item.dose.toUpperCase()}</div>
                            <div style={{ marginTop:2, paddingLeft:14, color:"#333" }}>{item.posologia}</div>
                          </div>
                          <div style={{ fontSize:12, color:"#333", whiteSpace:"nowrap", paddingLeft:16 }}>
                            {item.usoContínuo ? "Uso contínuo" : `${item.quantidade} ${getQtdLabel(item.via)}`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
            {/* FOOTER */}
            <div style={{ marginTop:36, paddingTop:16, borderTop:"1px solid #ccc" }}>
              <div style={{ display:"flex", justifyContent:"flex-end" }}>
                <div style={{ textAlign:"center", minWidth:280 }}>
                  <div style={{ borderTop:"1px solid #333", paddingTop:6, fontSize:11 }}>
                    <div>Assinatura do médico (a)</div>
                  </div>
                </div>
              </div>
              {doctor.endereco && (
                <div style={{ marginTop:14, fontSize:10, color:"#666", textAlign:"center", borderTop:"1px solid #eee", paddingTop:8 }}>
                  {doctor.endereco}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function buildPrintHTML(prescription, doctor, grouped) {
  const allItems = Object.values(grouped).flat();
  const medsHtml = Object.entries(grouped).map(([group, items]) => {
    const itemsHtml = items.map(item => {
      const num = allItems.indexOf(item) + 1;
      const qtdLabel = item.usoContínuo ? "Uso contínuo" : (item.quantidade + " " + getQtdLabel(item.via));
      return `
        <div style="margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <div style="flex:1;">
              <div style="font-weight:bold;">${num}. ${item.medicamento?.nome?.toUpperCase()} ${item.dose?.toUpperCase()}</div>
              <div style="margin-top:3px;padding-left:16px;color:#222;">${item.posologia}</div>
            </div>
            <div style="font-size:12px;white-space:nowrap;padding-left:16px;">${qtdLabel}</div>
          </div>
        </div>`;
    }).join("");
    return `<div style="margin-bottom:16px;">
      <div style="font-weight:bold;font-size:11px;text-transform:uppercase;border-bottom:1px solid #ddd;padding-bottom:4px;margin-bottom:10px;">${group}</div>
      ${itemsHtml}
    </div>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Receita Médica — ${doctor.nome}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#111;background:#fff;padding:0}
  .page{max-width:700px;margin:0 auto;padding:32px 40px;min-height:100vh}
  .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2.5px solid #1a2332;padding-bottom:10px;margin-bottom:10px}
  .title{font-size:16px;font-weight:bold;text-align:center;margin:10px 0 4px;letter-spacing:1px;text-transform:uppercase}
  .patient-box{border:1.5px solid #333;padding:8px 12px;margin:12px 0 18px;font-size:12px}
  .patient-row{display:flex;gap:16px;align-items:center}
  .footer{margin-top:48px;border-top:1px solid #ccc;padding-top:14px;text-align:right}
  .sig-line{display:inline-block;min-width:300px;border-top:1px solid #333;padding-top:5px;text-align:center;font-size:11px;margin-top:8px}
  .addr{margin-top:16px;font-size:10px;color:#666;text-align:center;border-top:1px solid #eee;padding-top:8px}
  @page{size:A4;margin:1.5cm}
  @media print{body{padding:0}.page{padding:0}}
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div>
      <div style="font-size:10px;font-weight:bold;color:#555;letter-spacing:1px;">RECEITUÁRIO MÉDICO</div>
      <div style="font-size:16px;font-weight:bold;margin-top:3px;">${doctor.nome}</div>
      <div style="font-size:11px;color:#555;margin-top:2px;">CRM/${doctor.uf} ${doctor.crm} — ${doctor.especialidade}</div>
      ${doctor.telefone ? `<div style="font-size:11px;color:#555;">Tel: ${doctor.telefone}</div>` : ""}
    </div>
    <div style="text-align:right;font-size:11px;color:#555;max-width:260px;">
      ${doctor.endereco || ""}
    </div>
  </div>
  <div class="patient-box">
    <div class="patient-row">
      <span><strong>NOME:</strong> ${prescription.patient || "___________________________________"}</span>
      ${prescription.birthdate ? `<span><strong>DATA DE NASCIMENTO:</strong> ${prescription.birthdate}</span>` : ""}
      <span style="margin-left:auto;"><strong>DATA:</strong> ${prescription.date}</span>
    </div>
  </div>
  ${medsHtml}
  <div class="footer">
    <div class="sig-line">Assinatura do médico (a)</div>
    ${doctor.endereco ? `<div class="addr">${doctor.endereco}</div>` : ""}
  </div>
</div>
<script>
  window.onload = function() {
    setTimeout(function(){ window.print(); }, 800);
  };
</script>
</body>
</html>`;
}
