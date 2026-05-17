module.exports = {
  // ── Ferrum ─────────────────────────────────────────────────────────────
  'oor': {
    description: 'The Ferrum OOR is a reference headphone amplifier with a fully discrete, Class A-capable circuit, offering exceptional power into any headphone impedance via balanced 4.4mm and XLR outputs.',
    specs: [
      { key: 'TYPE', value: 'Headphone Amplifier' },
      { key: 'OUTPUT POWER', value: '6W @ 16Ω (balanced), 1.5W @ 300Ω' },
      { key: 'OUTPUTS', value: '4.4mm Pentaconn, 4-pin XLR, 6.3mm SE' },
      { key: 'INPUTS', value: 'XLR Balanced, RCA Unbalanced' },
      { key: 'FREQUENCY RESPONSE', value: '10Hz – 300kHz (–3dB)' },
      { key: 'THD+N', value: '< 0.0004% (1kHz, 1W)' },
      { key: 'WEIGHT', value: '1.8kg' }
    ]
  },
  'erco': {
    description: 'The Ferrum ERCO is a premium DAC and headphone amplifier combining an ESS Sabre ES9038Q2M DAC with Ferrum\'s reference-grade headphone output stage.',
    specs: [
      { key: 'TYPE', value: 'DAC / Headphone Amplifier' },
      { key: 'DAC', value: 'ESS Sabre ES9038Q2M' },
      { key: 'PCM SUPPORT', value: 'Up to 32-bit / 768kHz' },
      { key: 'DSD SUPPORT', value: 'Up to DSD512' },
      { key: 'HEADPHONE OUTPUTS', value: '4.4mm Balanced, 6.3mm SE' },
      { key: 'INPUTS', value: 'USB, Optical, Coaxial' },
      { key: 'WEIGHT', value: '1.6kg' }
    ]
  },
  'hypsos': {
    description: 'The Ferrum HYPSOS is a Hybrid Power System providing a low-noise, adjustable linear/switching hybrid power supply (5–30V) to elevate the performance of connected audio components.',
    specs: [
      { key: 'TYPE', value: 'Hybrid Power Supply' },
      { key: 'VOLTAGE RANGE', value: '5V – 30V (adjustable)' },
      { key: 'MAX CURRENT', value: '5A continuous' },
      { key: 'NOISE FLOOR', value: '< 3µV RMS' },
      { key: 'REGULATION TYPE', value: 'Hybrid Linear/Switching' },
      { key: 'WEIGHT', value: '2.5kg' }
    ]
  },
  'hypsos-dual-hybrid-power-system': {
    description: 'The Ferrum HYPSOS Dual provides two independent low-noise hybrid power rails simultaneously, allowing two components to benefit from ultra-clean power in a single unit.',
    specs: [
      { key: 'TYPE', value: 'Dual Hybrid Power Supply' },
      { key: 'CHANNELS', value: '2× independent outputs' },
      { key: 'VOLTAGE RANGE', value: '5V – 30V per channel (adjustable)' },
      { key: 'MAX CURRENT', value: '5A per channel' },
      { key: 'NOISE FLOOR', value: '< 3µV RMS per channel' },
      { key: 'WEIGHT', value: '4kg' }
    ]
  },
  'wandla': {
    description: 'The Ferrum WANDLA is a high-resolution DAC and preamplifier with ESS Sabre ES9038PRO, MQA full decoding, and a fully balanced Class A output stage.',
    specs: [
      { key: 'TYPE', value: 'DAC / Preamplifier' },
      { key: 'DAC', value: 'ESS Sabre ES9038PRO' },
      { key: 'PCM SUPPORT', value: 'Up to 32-bit / 768kHz' },
      { key: 'DSD SUPPORT', value: 'Up to DSD512' },
      { key: 'MQA', value: 'Full Decoder' },
      { key: 'OUTPUTS', value: 'XLR Balanced, RCA Unbalanced' },
      { key: 'WEIGHT', value: '2.2kg' }
    ]
  },
  'wandla-2': {
    description: 'The Ferrum WANDLA 2 is an updated version of the WANDLA DAC/preamp with enhanced clocking, a refined analogue stage, and expanded digital input options.',
    specs: [
      { key: 'TYPE', value: 'DAC / Preamplifier (Gen 2)' },
      { key: 'DAC', value: 'ESS Sabre ES9039PRO' },
      { key: 'PCM SUPPORT', value: 'Up to 32-bit / 768kHz' },
      { key: 'DSD SUPPORT', value: 'Up to DSD512' },
      { key: 'OUTPUTS', value: 'XLR Balanced, RCA Unbalanced' },
      { key: 'WEIGHT', value: '2.4kg' }
    ]
  },
  'wandla-hp': {
    description: 'The Ferrum WANDLA HP adds a high-performance headphone amplifier output to the WANDLA DAC/preamp platform, making it a complete desktop audio hub.',
    specs: [
      { key: 'TYPE', value: 'DAC / Preamplifier / Headphone Amplifier' },
      { key: 'DAC', value: 'ESS Sabre ES9038PRO' },
      { key: 'PCM SUPPORT', value: 'Up to 32-bit / 768kHz' },
      { key: 'DSD SUPPORT', value: 'Up to DSD512' },
      { key: 'HEADPHONE OUTPUTS', value: '4.4mm Balanced, 6.3mm SE' },
      { key: 'OUTPUTS', value: 'XLR Balanced, RCA Unbalanced' }
    ]
  },

  // ── Audiovector ────────────────────────────────────────────────────────
  'audio-vector-qr-7': {
    description: 'The Audiovector QR 7 is a premium 3-way floorstander featuring AMT treble, a dedicated midrange driver, and dual bass drivers for audiophile-grade performance.',
    specs: [
      { key: 'TYPE', value: '3-Way Floorstander' },
      { key: 'DRIVERS', value: 'AMT Tweeter, 130mm Mid, 2× 180mm Bass' },
      { key: 'FREQUENCY RESPONSE', value: '28Hz – 50kHz (–6dB)' },
      { key: 'NOMINAL IMPEDANCE', value: '4 Ohms' },
      { key: 'SENSITIVITY', value: '90dB (2.83V/1m)' },
      { key: 'RECOMMENDED POWER', value: '30W – 300W' },
      { key: 'WEIGHT', value: '32kg each' }
    ]
  },
  'audio-vector-qr-5': {
    description: 'The Audiovector QR 5 is a 2.5-way floorstander with AMT tweeter and dual bass/mid drivers, offering wide dynamic range and effortless musicality.',
    specs: [
      { key: 'TYPE', value: '2.5-Way Floorstander' },
      { key: 'DRIVERS', value: 'AMT Tweeter, 2× 150mm Bass/Mid' },
      { key: 'FREQUENCY RESPONSE', value: '32Hz – 50kHz (–6dB)' },
      { key: 'NOMINAL IMPEDANCE', value: '4 Ohms' },
      { key: 'SENSITIVITY', value: '88dB (2.83V/1m)' },
      { key: 'RECOMMENDED POWER', value: '30W – 250W' },
      { key: 'WEIGHT', value: '24kg each' }
    ]
  },
  'audio-vector-qr-c': {
    description: 'The Audiovector QR C is a dedicated 2-way centre-channel speaker designed to match the QR series for seamless timbre-matched home cinema performance.',
    specs: [
      { key: 'TYPE', value: '2-Way Centre Channel' },
      { key: 'DRIVERS', value: 'AMT Tweeter, 2× 130mm Bass/Mid' },
      { key: 'FREQUENCY RESPONSE', value: '60Hz – 50kHz (–6dB)' },
      { key: 'NOMINAL IMPEDANCE', value: '4 Ohms' },
      { key: 'SENSITIVITY', value: '88dB (2.83V/1m)' },
      { key: 'RECOMMENDED POWER', value: '30W – 200W' },
      { key: 'WEIGHT', value: '11kg' }
    ]
  },
  'audio-vector-qr-wall': {
    description: 'The Audiovector QR Wall is an on-wall 2-way speaker with AMT tweeter for versatile placement in home cinema and high-quality stereo applications.',
    specs: [
      { key: 'TYPE', value: 'On-Wall 2-Way' },
      { key: 'DRIVERS', value: 'AMT Tweeter, 130mm Bass/Mid' },
      { key: 'FREQUENCY RESPONSE', value: '55Hz – 50kHz (–6dB)' },
      { key: 'NOMINAL IMPEDANCE', value: '4 Ohms' },
      { key: 'SENSITIVITY', value: '87dB (2.83V/1m)' },
      { key: 'RECOMMENDED POWER', value: '30W – 200W' },
      { key: 'WEIGHT', value: '7kg each' }
    ]
  },
  'audio-vector-qr-5-copy': {
    description: 'The Audiovector QR Sub is a powered subwoofer designed to extend the bass of the QR floorstanding series for deeper and more impactful low-frequency reproduction.',
    specs: [
      { key: 'TYPE', value: 'Active Subwoofer' },
      { key: 'DRIVER', value: '250mm (10") Long-Throw Bass' },
      { key: 'AMPLIFIER POWER', value: '300W Class D' },
      { key: 'FREQUENCY RESPONSE', value: '20Hz – 180Hz (–6dB)' },
      { key: 'CROSSOVER', value: 'Variable 40Hz – 180Hz' },
      { key: 'WEIGHT', value: '22kg' }
    ]
  },
  'audio-vector-r-c-signature': {
    description: 'The Audiovector R C Signature is a high-end timbre-matched centre speaker for the R series, using hand-selected AMT tweeter and mid/bass drivers.',
    specs: [
      { key: 'TYPE', value: '3-Way Centre Channel (Signature)' },
      { key: 'DRIVERS', value: 'AMT Tweeter, 130mm Mid, 2× 150mm Bass' },
      { key: 'FREQUENCY RESPONSE', value: '45Hz – 50kHz (–6dB)' },
      { key: 'NOMINAL IMPEDANCE', value: '4 Ohms' },
      { key: 'SENSITIVITY', value: '89dB (2.83V/1m)' },
      { key: 'RECOMMENDED POWER', value: '30W – 300W' }
    ]
  },
  'audio-vector-r-c-arrete': {
    description: 'The Audiovector R C Arrete is the flagship centre-channel speaker with the finest AMT tweeter and hand-matched drivers in a premium cabinet for the most discerning home cinema.',
    specs: [
      { key: 'TYPE', value: '3-Way Centre Channel (Arrete)' },
      { key: 'DRIVERS', value: 'Ultra AMT Tweeter, 150mm Mid, 2× 180mm Bass' },
      { key: 'FREQUENCY RESPONSE', value: '40Hz – 60kHz (–6dB)' },
      { key: 'NOMINAL IMPEDANCE', value: '4 Ohms' },
      { key: 'SENSITIVITY', value: '90dB (2.83V/1m)' },
      { key: 'RECOMMENDED POWER', value: '30W – 300W' }
    ]
  },

  // ── System Audio ────────────────────────────────────────────────────────
  'system-audio-saxo-6': {
    description: 'The System Audio Saxo 6 is a compact 2-way bookshelf speaker with a 150mm bass/mid driver and Illuminator tweeter, delivering full-range sound from a small cabinet.',
    specs: [
      { key: 'TYPE', value: '2-Way Standmount (Bookshelf)' },
      { key: 'DRIVERS', value: '28mm Soft Dome HF, 150mm Bass/Mid' },
      { key: 'FREQUENCY RESPONSE', value: '42Hz – 25kHz (±3dB)' },
      { key: 'NOMINAL IMPEDANCE', value: '4 Ohms' },
      { key: 'SENSITIVITY', value: '87dB (2.83V/1m)' },
      { key: 'RECOMMENDED POWER', value: '30W – 150W' },
      { key: 'WEIGHT', value: '6.5kg each' }
    ]
  },
  'system-audio-saxo-10': {
    description: 'The System Audio Saxo 10 is a mid-sized 2-way bookshelf speaker with a 200mm bass/mid driver for more extended bass and fuller midrange from a compact standmount.',
    specs: [
      { key: 'TYPE', value: '2-Way Standmount' },
      { key: 'DRIVERS', value: '28mm Soft Dome HF, 200mm Bass/Mid' },
      { key: 'FREQUENCY RESPONSE', value: '36Hz – 25kHz (±3dB)' },
      { key: 'NOMINAL IMPEDANCE', value: '4 Ohms' },
      { key: 'SENSITIVITY', value: '88dB (2.83V/1m)' },
      { key: 'RECOMMENDED POWER', value: '40W – 200W' },
      { key: 'WEIGHT', value: '9kg each' }
    ]
  },
  'system-audio-saxo-60': {
    description: 'The System Audio Saxo 60 is a slim 2.5-way floorstander with dual bass drivers and an Illuminator tweeter, combining elegant aesthetics with genuine floorstander performance.',
    specs: [
      { key: 'TYPE', value: '2.5-Way Floorstander' },
      { key: 'DRIVERS', value: '28mm HF, 2× 150mm Bass/Mid' },
      { key: 'FREQUENCY RESPONSE', value: '30Hz – 25kHz (±3dB)' },
      { key: 'NOMINAL IMPEDANCE', value: '4 Ohms' },
      { key: 'SENSITIVITY', value: '89dB (2.83V/1m)' },
      { key: 'RECOMMENDED POWER', value: '40W – 250W' },
      { key: 'WEIGHT', value: '22kg each' }
    ]
  },
  'system-audio-legend-10': {
    description: 'The System Audio Legend 10 is a 3-way floorstander with System Audio\'s advanced Illuminator tweeter and dual woofers, combining musicality, dynamics, and a refined finish.',
    specs: [
      { key: 'TYPE', value: '3-Way Floorstander' },
      { key: 'DRIVERS', value: '28mm Illuminator HF, 180mm Mid, 2× 180mm Bass' },
      { key: 'FREQUENCY RESPONSE', value: '26Hz – 28kHz (±3dB)' },
      { key: 'NOMINAL IMPEDANCE', value: '4 Ohms' },
      { key: 'SENSITIVITY', value: '90dB (2.83V/1m)' },
      { key: 'RECOMMENDED POWER', value: '50W – 300W' },
      { key: 'WEIGHT', value: '36kg each' }
    ]
  },
  'system-audio-legend-sub-12': {
    description: 'The System Audio Legend Sub 12 is a 300mm (12") active subwoofer with 300W amplification for seamless bass extension with Legend and Saxo series speakers.',
    specs: [
      { key: 'TYPE', value: 'Active Subwoofer' },
      { key: 'DRIVER', value: '300mm (12") Long-Throw Bass' },
      { key: 'AMPLIFIER POWER', value: '300W Class D' },
      { key: 'FREQUENCY RESPONSE', value: '20Hz – 150Hz (–6dB)' },
      { key: 'CROSSOVER', value: 'Variable 40Hz – 150Hz' },
      { key: 'WEIGHT', value: '24kg' }
    ]
  },

  // ── MJ Acoustics ───────────────────────────────────────────────────────
  'mj-acoustics-henley': {
    description: 'The MJ Acoustics HENLEY is a high-performance active subwoofer with a long-throw 250mm driver and 500W RMS amplification for deep, articulate bass in demanding hi-fi systems.',
    specs: [
      { key: 'TYPE', value: 'Active Subwoofer' },
      { key: 'DRIVER', value: '250mm (10") Long-Throw Bass' },
      { key: 'AMPLIFIER POWER', value: '500W RMS' },
      { key: 'FREQUENCY RESPONSE', value: '18Hz – 150Hz (–6dB)' },
      { key: 'CROSSOVER', value: 'Variable 40Hz – 150Hz' },
      { key: 'WEIGHT', value: '28kg' }
    ]
  },
  'mj-acoustics-ref-400-sr': {
    description: 'The MJ Acoustics Ref 400-SR is a reference-class active subwoofer with a 300mm driver and 400W amplification, incorporating MJ\'s servo feedback technology for ultra-accurate bass control.',
    specs: [
      { key: 'TYPE', value: 'Active Subwoofer (Servo-Controlled)' },
      { key: 'DRIVER', value: '300mm (12") Servo-Controlled Bass' },
      { key: 'AMPLIFIER POWER', value: '400W RMS' },
      { key: 'FREQUENCY RESPONSE', value: '16Hz – 150Hz (–6dB)' },
      { key: 'SERVO FEEDBACK', value: 'Yes (Motion Correction)' },
      { key: 'WEIGHT', value: '36kg' }
    ]
  },

  // ── Kii Audio ───────────────────────────────────────────────────────────
  'kii-three-system': {
    description: 'The Kii THREE is an active DSP-controlled 6-driver loudspeaker with built-in cardioid dispersion control, delivering studio-reference accuracy with 1500W of Class D amplification per pair.',
    specs: [
      { key: 'TYPE', value: 'Active DSP Cardioid Loudspeaker' },
      { key: 'DRIVERS', value: '6 per cabinet (2× HF, 2× Mid, 2× Bass)' },
      { key: 'AMPLIFIER POWER', value: '6× 250W Class D per cabinet' },
      { key: 'FREQUENCY RESPONSE', value: '20Hz – 25kHz (±0.5dB in-room)' },
      { key: 'DISPERSION CONTROL', value: 'Cardioid (Controlled Directivity)' },
      { key: 'CONNECTIVITY', value: 'AES3, S/PDIF, Analogue XLR' },
      { key: 'WEIGHT', value: '28kg each' }
    ]
  },
  'kii-three-bxt-system': {
    description: 'The Kii THREE BXT system adds the BXT bass extension module to the Kii THREE, creating a line-source with horizontal directivity control and bass extension to below 20Hz.',
    specs: [
      { key: 'TYPE', value: 'Active DSP System (THREE + BXT)' },
      { key: 'DRIVERS', value: '14 per stack (THREE + BXT combined)' },
      { key: 'TOTAL POWER', value: '> 3000W per stack' },
      { key: 'FREQUENCY RESPONSE', value: '< 20Hz – 25kHz (±0.5dB)' },
      { key: 'DISPERSION CONTROL', value: 'Cardioid + Line Source' },
      { key: 'CONNECTIVITY', value: 'AES3, S/PDIF, Analogue XLR' },
      { key: 'WEIGHT', value: '52kg per stack' }
    ]
  },

  // ── Accessories ─────────────────────────────────────────────────────────
  'signature-8khdmi-15m': {
    description: 'The Signature 8K HDMI 15m is a premium 48Gbps HDMI 2.1 cable supporting 8K/60Hz and 4K/120Hz with gold-plated contacts and a braided jacket for high-integrity signal transmission.',
    specs: [
      { key: 'TYPE', value: 'HDMI 2.1 Cable' },
      { key: 'LENGTH', value: '15 metres' },
      { key: 'BANDWIDTH', value: '48 Gbps' },
      { key: 'RESOLUTION', value: '8K @ 60Hz, 4K @ 120Hz' },
      { key: 'CONNECTORS', value: 'Gold-Plated HDMI Type A' },
      { key: 'FEATURES', value: 'eARC, VRR, ALLM, HDR' }
    ]
  },
  'signature-8khdmi-3m': {
    description: 'The Signature 8K HDMI 3m is a 48Gbps HDMI 2.1 cable with gold-plated contacts in a shorter length for clean AV rack installations.',
    specs: [
      { key: 'TYPE', value: 'HDMI 2.1 Cable' },
      { key: 'LENGTH', value: '3 metres' },
      { key: 'BANDWIDTH', value: '48 Gbps' },
      { key: 'RESOLUTION', value: '8K @ 60Hz, 4K @ 120Hz' },
      { key: 'CONNECTORS', value: 'Gold-Plated HDMI Type A' },
      { key: 'FEATURES', value: 'eARC, VRR, ALLM, HDR' }
    ]
  },
  'velox-8k-hdmi-15m-cable': {
    description: 'The Velox 8K HDMI 15m is a high-specification 48Gbps active optical HDMI cable delivering flawless 8K signal over 15 metres without signal degradation.',
    specs: [
      { key: 'TYPE', value: 'Active Optical HDMI 2.1 Cable' },
      { key: 'LENGTH', value: '15 metres' },
      { key: 'BANDWIDTH', value: '48 Gbps' },
      { key: 'RESOLUTION', value: '8K @ 60Hz, 4K @ 120Hz' },
      { key: 'CABLE TYPE', value: 'Active Optical (Fibre Core)' },
      { key: 'FEATURES', value: 'eARC, VRR, ALLM, Dolby Vision' }
    ]
  },
  'velox-8khdmi-2m': {
    description: 'The Velox 8K HDMI 2m is a compact 48Gbps HDMI 2.1 cable for short runs between source and display while maintaining full 8K bandwidth.',
    specs: [
      { key: 'TYPE', value: 'HDMI 2.1 Cable' },
      { key: 'LENGTH', value: '2 metres' },
      { key: 'BANDWIDTH', value: '48 Gbps' },
      { key: 'RESOLUTION', value: '8K @ 60Hz, 4K @ 120Hz' },
      { key: 'CONNECTORS', value: 'Gold-Plated HDMI Type A' },
      { key: 'FEATURES', value: 'eARC, VRR, ALLM, HDR' }
    ]
  },
};
