"""Distilled Nigerian agronomy knowledge base.

Sources: IITA bulletins, FAO West-Africa crop calendars, NAERLS extension
fact-sheets, CABI Plantwise pest profiles. Distilled into a single
~6KB block intended to be sent as the cached system prompt — large
enough to be substantive, small enough to fit comfortably alongside
the model's own training.

For a production deploy, this should be rendered from a vector store
keyed off the farmer's state + crop, not a single static block. The
single-block form is fine for MVP demo and ground-truth alignment
testing.
"""

KNOWLEDGE_BASE = """
NIGERIAN AGRONOMY REFERENCE — distilled from IITA, FAO West Africa crop
calendars, NAERLS extension bulletins, CABI Plantwise.

# 1. Crop calendars (planting / first-fertiliser / harvest windows by zone)

## Maize
- South-West (Lagos, Ogun, Oyo, Osun, Ondo, Ekiti):
  early season Mar 15–Apr 15, late season Aug 15–Sep 10. Harvest 95–115 days.
- South-East / South-South: early Apr 1–May 1, late Aug 20–Sep 15.
- Middle Belt (Plateau, Kaduna S, Nasarawa, Benue, Kogi, Kwara): May 1–Jun 5.
- Sahel (Sokoto, Kebbi, Zamfara, Katsina, Kano, Jigawa, Yobe, Borno): Jun 5–Jul 5.

## Rice (lowland)
- South: Mar 15–Apr 30 (sawah systems Apr–May).
- Middle Belt: Jun 10–Jul 10. Sahel (irrigated): Nov–Mar dry season; Jul–Oct wet.

## Cassava
- All zones: Mar–May, with second window in South Aug–Oct.
- Stem cuttings 25cm, 1m × 1m spacing, harvest 9–18 months.

## Tomato
- North: Oct–Feb (dry season under irrigation gives best fruit-set).
- South: Mar–Jun and Sep–Nov (avoid mid-rains; bacterial wilt risk).

## Cowpea
- Sahel & Middle Belt: Jun 20–Jul 25. South: Jul 15–Aug 20.

## Yam
- All zones: Nov–Jan setts (early), Mar–Apr (late). Stake at 50% emergence.

# 2. Fertiliser regimes (per hectare; smallholders may scale)

## Maize
- Basal at planting: 100kg NPK 15-15-15 + 50kg SSP.
- 4–5 weeks: 100kg urea (top-dress).
- 8 weeks: 50kg urea (split for grain fill).

## Rice
- Lowland: 60-30-30 N-P2O5-K2O kg/ha, split: 1/3 basal, 1/3 tillering, 1/3 PI.

## Tomato
- 90-60-90 NPK kg/ha + 5–10 t/ha well-rotted manure.
- Calcium spray (CaCl2 0.5%) every 2 weeks once flowering — prevents BER.

## Cassava
- Low-fertility soils: 60-30-60 NPK + 20kg/ha micronutrient mix at 8 weeks.

# 3. Pest & disease — dominant Nigerian threats

## Maize
- Fall armyworm (Spodoptera frugiperda): scout from 10 DAP. Window pane
  feeding on young leaves. Threshold 10–20% damaged whorls -> spray
  emamectin benzoate, spinetoram, or chlorantraniliprole at recommended
  rate. Avoid pyrethroids alone (resistance in Nigeria since 2019).
- Maize streak virus: vector is Cicadulina leafhopper. Plant tolerant
  varieties (TZL Comp1-W, Sammaz 26). Rogue infected plants early.
- Stem borer: install pheromone traps; intercrop with Desmodium (push-pull).

## Rice
- African Rice Gall Midge (Orseolia oryzivora): "silver shoot" tubular
  galls. Resistant varieties FARO 51, FARO 60, FARO 66.
- Blast (Pyricularia oryzae): hot-spot in Anambra/Ebonyi. Tricyclazole
  spray at booting; avoid excess N.
- Birds at grain-fill: Quelea quelea — bird-scaring, early-maturing
  varieties harvested before mass-flock arrival.

## Tomato
- Tuta absoluta (tomato leafminer): catastrophic in Kaduna/Kano since
  2015. Pheromone traps for monitoring; spinosad / chlorantraniliprole
  rotation; biological — Nesidiocoris tenuis where available.
- Bacterial wilt (Ralstonia): rotate 3+ years; resistant rootstock.
- Early/late blight: chlorothalonil 7-day intervals from first flower.

## Cassava
- Cassava mosaic disease (CMD): plant resistant varieties (TME 419,
  TMS 30572, NR 8082). Use clean stem cuttings.
- Cassava brown streak disease: NOT yet established in Nigeria —
  surveillance critical near eastern border with Cameroon.
- Mealybug, green mite: classical biocontrol largely solved this in
  the 1990s; flare-ups respond to neem extract.

## Cowpea
- Maruca pod borer + thrips + Aphis: weekly spray emamectin benzoate
  rotated with thiamethoxam from flowering through pod-fill.
- Striga gesnerioides: rotate with maize/sorghum, plant resistant
  varieties (IT97K-499-35, IT99K-573-1-1).

# 4. Soil & water

- Drought signal (Sahel): if first-flush rain doesn't continue within
  10–14 days, do NOT replant maize. Wait or switch to early millet
  (Souna 3, 65–70 days).
- Salinity in Niger Delta: leach with low-EC water; gypsum 2–4 t/ha.
- Erosion (South-East gullies): contour bunds + vetiver hedges.

# 5. Post-harvest

- Maize: dry to 13.5% MC before bag/silo. Hermetic bags (PICS) to
  prevent Sitophilus weevil without chemical fumigation.
- Tomato: handle in 12kg crates not raffia baskets — 25% shrinkage
  saving alone.
- Cassava: peel & process within 48h to limit cyanogenic deterioration.

# 6. Market & input pricing rule-of-thumb (April 2026)

- Maize farmgate ~₦450–₦650/kg in South, ~₦380–₦500/kg in Middle Belt.
- Paddy rice ₦600–₦850/kg. Milled local ₦1,200–₦1,800/kg.
- NPK 50kg bag ₦35,000–₦60,000 depending on subsidy access.
- Urea 50kg bag ₦28,000–₦45,000.

(Always verify with your local market on the day; prices are volatile.)

# 7. Safety basics

- Spray early morning or evening; never midday.
- Always wear long sleeves, boots, mask, and goggles when spraying.
- Wash and store empty containers; never reuse for water or food.
- Keep WHEN-treated produce off the family pot for the full PHI
  (pre-harvest interval) printed on the label.
""".strip()
