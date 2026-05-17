module.exports = {
  // ── Octave ─────────────────────────────────────────────────────────────
  'octave-hp300-se': {
    description: 'The Octave HP 300 SE is a reference tube preamplifier featuring a dual-mono circuit with ECC82 and ECC88 valves, delivering an exceptionally detailed and musical presentation.',
    specs: [
      { key: 'TYPE', value: 'Tube Preamplifier' },
      { key: 'TUBES', value: '2× ECC82, 1× ECC88' },
      { key: 'INPUTS', value: '5× RCA, 1× XLR Balanced' },
      { key: 'OUTPUTS', value: 'XLR Balanced, RCA Unbalanced' },
      { key: 'FREQUENCY RESPONSE', value: '10Hz – 200kHz (–3dB)' },
      { key: 'THD', value: '< 0.01%' },
      { key: 'WEIGHT', value: '14kg' }
    ]
  },
  'octave-hp700-se': {
    description: 'The Octave HP 700 SE is Octave\'s reference tube preamplifier with an ultra-quiet noise floor, dual-mono layout, and balanced XLR throughout the signal path.',
    specs: [
      { key: 'TYPE', value: 'Reference Tube Preamplifier' },
      { key: 'TUBES', value: 'ECC82, ECC88 (dual-mono)' },
      { key: 'INPUTS', value: '6× RCA, 2× XLR Balanced' },
      { key: 'OUTPUTS', value: 'XLR Balanced, RCA Unbalanced' },
      { key: 'FREQUENCY RESPONSE', value: '5Hz – 500kHz (–3dB)' },
      { key: 'SNR', value: '> 100dB (A-weighted)' },
      { key: 'WEIGHT', value: '18kg' }
    ]
  },
  'octave-v40-se': {
    description: 'The Octave V40 SE is a 40W per channel integrated tube amplifier using EL34 output valves, blending the warmth of classic tube sound with modern reliability.',
    specs: [
      { key: 'TYPE', value: 'Integrated Tube Amplifier' },
      { key: 'POWER OUTPUT', value: '40W per channel (EL34)' },
      { key: 'OUTPUT TUBES', value: '4× EL34' },
      { key: 'INPUTS', value: '4× RCA, 1× XLR' },
      { key: 'FREQUENCY RESPONSE', value: '10Hz – 80kHz (–1dB)' },
      { key: 'WEIGHT', value: '28kg' }
    ]
  },
  'octave-v70-se': {
    description: 'The Octave V70 SE is a 70W per channel integrated tube amplifier with KT88 or KT120 output valves and Octave\'s patented Automatic Bias system for consistent performance.',
    specs: [
      { key: 'TYPE', value: 'Integrated Tube Amplifier' },
      { key: 'POWER OUTPUT', value: '70W per channel (KT88/KT120)' },
      { key: 'OUTPUT TUBES', value: '4× KT88 or KT120' },
      { key: 'INPUTS', value: '4× RCA, 1× XLR' },
      { key: 'FREQUENCY RESPONSE', value: '10Hz – 80kHz (–1dB)' },
      { key: 'WEIGHT', value: '36kg' }
    ]
  },
  'octave-v70-class-a': {
    description: 'The Octave V70 Class A operates in pure Class A up to 25W, switching to 70W Class A/B, combining Class A warmth with practical power for real-world speaker loads.',
    specs: [
      { key: 'TYPE', value: 'Integrated Tube Amplifier (Class A/A-B)' },
      { key: 'POWER OUTPUT', value: '70W (A/B) / 25W (Pure Class A)' },
      { key: 'OUTPUT TUBES', value: '4× KT88/KT120' },
      { key: 'INPUTS', value: '4× RCA, 1× XLR' },
      { key: 'FREQUENCY RESPONSE', value: '10Hz – 80kHz (–1dB)' },
      { key: 'WEIGHT', value: '38kg' }
    ]
  },
  'octave-v110-se': {
    description: 'The Octave V110 SE is Octave\'s flagship integrated tube amplifier delivering 110W per channel with KT150 or KT120 tubes and a high-quality phono stage option.',
    specs: [
      { key: 'TYPE', value: 'Integrated Tube Amplifier (Flagship)' },
      { key: 'POWER OUTPUT', value: '110W per channel (KT150)' },
      { key: 'OUTPUT TUBES', value: '4× KT150 or KT120' },
      { key: 'INPUTS', value: '5× RCA, 1× XLR, Optional Phono' },
      { key: 'FREQUENCY RESPONSE', value: '10Hz – 100kHz (–1dB)' },
      { key: 'WEIGHT', value: '44kg' }
    ]
  },
  'octave-mre-220-pair': {
    description: 'The Octave MRE 220 is a monoblock tube power amplifier delivering 220W from KT120 output tubes, sold as a stereo pair for the ultimate tube power experience.',
    specs: [
      { key: 'TYPE', value: 'Monoblock Tube Power Amplifier (Pair)' },
      { key: 'POWER OUTPUT', value: '220W per monoblock' },
      { key: 'OUTPUT TUBES', value: '8× KT120 per monoblock' },
      { key: 'INPUTS', value: 'XLR Balanced, RCA Unbalanced' },
      { key: 'FREQUENCY RESPONSE', value: '10Hz – 80kHz (–1dB)' },
      { key: 'WEIGHT', value: '36kg each' }
    ]
  },

  // ── ProAc ──────────────────────────────────────────────────────────────
  'proac-centre-voice': {
    description: 'The ProAc Centre Voice is a precision 2-way centre-channel speaker using ProAc\'s ribbon tweeter and dedicated bass/mid driver for seamless home cinema dialogue reproduction.',
    specs: [
      { key: 'TYPE', value: '2-Way Centre Channel' },
      { key: 'DRIVERS', value: 'Ribbon HF, 130mm Bass/Mid' },
      { key: 'FREQUENCY RESPONSE', value: '45Hz – 30kHz (–6dB)' },
      { key: 'NOMINAL IMPEDANCE', value: '8 Ohms' },
      { key: 'SENSITIVITY', value: '88.5dB (1W/1m)' },
      { key: 'RECOMMENDED POWER', value: '25W – 250W' },
      { key: 'WEIGHT', value: '9kg' }
    ]
  },
  'proac-tablette-ten': {
    description: 'The ProAc Tablette Ten is a legendary miniature 2-way standmount with a 110mm bass/mid driver and silk dome tweeter, renowned for extraordinary musicality far beyond its size.',
    specs: [
      { key: 'TYPE', value: '2-Way Standmount (Bookshelf)' },
      { key: 'DRIVERS', value: '19mm Silk Dome HF, 110mm Bass/Mid' },
      { key: 'FREQUENCY RESPONSE', value: '35Hz – 30kHz (–6dB)' },
      { key: 'NOMINAL IMPEDANCE', value: '8 Ohms' },
      { key: 'SENSITIVITY', value: '84dB (1W/1m)' },
      { key: 'RECOMMENDED POWER', value: '25W – 150W' },
      { key: 'WEIGHT', value: '4.5kg each' }
    ]
  },
  'proac-tablette-ten-signature': {
    description: 'The ProAc Tablette Ten Signature is the premium edition of the Tablette Ten with upgraded internal wiring, superior crossover components, and a hand-veneered cabinet.',
    specs: [
      { key: 'TYPE', value: '2-Way Standmount (Signature Edition)' },
      { key: 'DRIVERS', value: '19mm Silk Dome HF, 110mm Bass/Mid' },
      { key: 'FREQUENCY RESPONSE', value: '35Hz – 30kHz (–6dB)' },
      { key: 'NOMINAL IMPEDANCE', value: '8 Ohms' },
      { key: 'SENSITIVITY', value: '84dB (1W/1m)' },
      { key: 'RECOMMENDED POWER', value: '25W – 150W' },
      { key: 'WEIGHT', value: '4.8kg each' }
    ]
  },
  'proac-response-two': {
    description: 'The ProAc Response TWO is a classic 2-way standmount speaker delivering ProAc\'s hallmark midrange transparency and extended bass from a carefully tuned reflex cabinet.',
    specs: [
      { key: 'TYPE', value: '2-Way Standmount' },
      { key: 'DRIVERS', value: '25mm Soft Dome HF, 165mm Bass/Mid' },
      { key: 'FREQUENCY RESPONSE', value: '30Hz – 30kHz (–6dB)' },
      { key: 'NOMINAL IMPEDANCE', value: '8 Ohms' },
      { key: 'SENSITIVITY', value: '87dB (1W/1m)' },
      { key: 'RECOMMENDED POWER', value: '25W – 250W' },
      { key: 'WEIGHT', value: '10kg each' }
    ]
  },
  'proac-response-db-three': {
    description: 'The ProAc Response DB THREE is a 2.5-way standmount with an additional bass unit for deep, articulate low-frequency extension while maintaining ProAc\'s celebrated midrange.',
    specs: [
      { key: 'TYPE', value: '2.5-Way Standmount with Bass Unit' },
      { key: 'DRIVERS', value: '25mm Ribbon HF, 130mm Bass/Mid, 130mm Auxiliary Bass' },
      { key: 'FREQUENCY RESPONSE', value: '22Hz – 30kHz (–6dB)' },
      { key: 'NOMINAL IMPEDANCE', value: '4 Ohms' },
      { key: 'SENSITIVITY', value: '88dB (1W/1m)' },
      { key: 'RECOMMENDED POWER', value: '30W – 300W' },
      { key: 'WEIGHT', value: '22kg each' }
    ]
  },
  'proac-response-dt8': {
    description: 'The ProAc Response DT8 is a slim 2-way floorstander using dual 130mm bass/mid drivers for effortless bass at moderate heights, ideal for rooms where a wide cabinet is impractical.',
    specs: [
      { key: 'TYPE', value: '2-Way Floorstander' },
      { key: 'DRIVERS', value: '25mm Ribbon HF, 2× 130mm Bass/Mid' },
      { key: 'FREQUENCY RESPONSE', value: '25Hz – 30kHz (–6dB)' },
      { key: 'NOMINAL IMPEDANCE', value: '4 Ohms' },
      { key: 'SENSITIVITY', value: '89dB (1W/1m)' },
      { key: 'RECOMMENDED POWER', value: '30W – 250W' },
      { key: 'WEIGHT', value: '28kg each' }
    ]
  },
  'proac-response-d20': {
    description: 'The ProAc Response D20 is a compact 2-way floorstander housing a 165mm bass/mid driver with a reflex cabinet tuned for extended bass and genuine full-range performance.',
    specs: [
      { key: 'TYPE', value: '2-Way Floorstander' },
      { key: 'DRIVERS', value: '25mm Soft Dome HF, 165mm Bass/Mid' },
      { key: 'FREQUENCY RESPONSE', value: '26Hz – 30kHz (–6dB)' },
      { key: 'NOMINAL IMPEDANCE', value: '8 Ohms' },
      { key: 'SENSITIVITY', value: '88dB (1W/1m)' },
      { key: 'RECOMMENDED POWER', value: '25W – 250W' },
      { key: 'WEIGHT', value: '24kg each' }
    ]
  },
  'proac-response-d48': {
    description: 'The ProAc Response D48 is a large 3-way floorstander with dual 200mm bass drivers for deep bass, ProAc\'s ribbon tweeter, and an aluminium/paper mid driver.',
    specs: [
      { key: 'TYPE', value: '3-Way Floorstander' },
      { key: 'DRIVERS', value: '25mm Ribbon HF, 150mm Mid, 2× 200mm Bass' },
      { key: 'FREQUENCY RESPONSE', value: '18Hz – 30kHz (–6dB)' },
      { key: 'NOMINAL IMPEDANCE', value: '4 Ohms' },
      { key: 'SENSITIVITY', value: '91dB (1W/1m)' },
      { key: 'RECOMMENDED POWER', value: '30W – 300W' },
      { key: 'WEIGHT', value: '68kg each' }
    ]
  },
  'proac-response-k1': {
    description: 'The ProAc Response K1 is a premium 2-way standmount with a Scan-Speak Illuminator tweeter and a custom 200mm bass/mid driver for audiophile-grade detail and soundstaging.',
    specs: [
      { key: 'TYPE', value: '2-Way Standmount (Flagship Bookshelf)' },
      { key: 'DRIVERS', value: 'Scan-Speak Illuminator HF, 200mm Bass/Mid' },
      { key: 'FREQUENCY RESPONSE', value: '22Hz – 30kHz (–6dB)' },
      { key: 'NOMINAL IMPEDANCE', value: '8 Ohms' },
      { key: 'SENSITIVITY', value: '88dB (1W/1m)' },
      { key: 'RECOMMENDED POWER', value: '30W – 250W' },
      { key: 'WEIGHT', value: '22kg each' }
    ]
  },
  'proac-response-k6-signature': {
    description: 'The ProAc Response K6 Signature is a premium 3-way floorstander featuring Scan-Speak Illuminator drivers and ProAc\'s ribbon tweeter in a signature-level finish.',
    specs: [
      { key: 'TYPE', value: '3-Way Floorstander (Signature)' },
      { key: 'DRIVERS', value: 'Ribbon HF, 150mm Mid, 2× 200mm Bass' },
      { key: 'FREQUENCY RESPONSE', value: '18Hz – 30kHz (–6dB)' },
      { key: 'NOMINAL IMPEDANCE', value: '4 Ohms' },
      { key: 'SENSITIVITY', value: '91dB (1W/1m)' },
      { key: 'RECOMMENDED POWER', value: '30W – 300W' },
      { key: 'WEIGHT', value: '72kg each' }
    ]
  },
};
