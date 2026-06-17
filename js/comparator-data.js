/* =====================================================
   COMPARATOR DATA — Synchronisé avec les pages Wiki
   Chaque console et chaque mod correspond exactement
   au contenu de wiki/[console].html
   ===================================================== */

const COMPARATOR_DATA = {

  scoreCategories: [
    { id: 'image',     label: 'Image',     icon: '📺', desc: "Qualité et clarté d'affichage" },
    { id: 'audio',     label: 'Audio',     icon: '🔊', desc: 'Qualité sonore' },
    { id: 'autonomie', label: 'Autonomie', icon: '🔋', desc: 'Durée de vie / gestion énergie' },
    { id: 'ergonomie', label: 'Ergonomie', icon: '🎮', desc: 'Confort et praticité' },
    { id: 'gameplay',  label: 'Gameplay',  icon: '⚡', desc: 'Expérience de jeu globale' }
  ],

  consoles: [

    /* ======= GAME BOY DMG ======= */
    {
      id: 'dmg',
      name: 'Game Boy DMG',
      fullName: 'Game Boy DMG-001',
      icon: '🧱',
      year: 1989,
      type: 'portable',
      wikiUrl: 'wiki/dmg.html',
      description: 'La "Brique" originale. Robuste, iconique, moddable.',
      baseScores: { image: 2, audio: 3, autonomie: 6, ergonomie: 3, gameplay: 4 },
      modCategories: [
        {
          id: 'screen', label: 'Affichage', icon: '📺', exclusive: true,
          mods: [
            {
              id: 'dmg_fp_q5', name: 'RetroPixel IPS Q5 Kit', brand: 'FunnyPlaying', badge: null,
              pros: ['Image cristalline', 'Rétroéclairage lumineux', 'Palettes de couleurs', 'Installation simple'],
              cons: ['Consomme plus de batterie', 'CleanPower recommandé'],
              scoreImpact: { image: 4, audio: 0, autonomie: -1, ergonomie: 0, gameplay: 1 },
              difficulty: 2, priceRange: '€€'
            },
            {
              id: 'dmg_fp_lam', name: 'RetroPixel IPS Laminated Kit', brand: 'FunnyPlaying', badge: 'Laminé',
              pros: ['Image ultra nette', 'Zéro poussière sous vitre', 'Zéro reflet'],
              cons: ['Irréversible si mal installé', 'Prix élevé'],
              scoreImpact: { image: 5, audio: 0, autonomie: -1, ergonomie: 1, gameplay: 1 },
              difficulty: 3, priceRange: '€€€'
            },
            {
              id: 'dmg_hsd_v4', name: 'V4 Q5 IPS LCD (OSD)', brand: 'Hispeedido', badge: null,
              pros: ['Menu OSD complet', 'Effets scanlines', 'Luminosité multi-niveaux'],
              cons: ['Câblage plus complexe', 'Légère chauffe'],
              scoreImpact: { image: 4, audio: 0, autonomie: -1, ergonomie: 1, gameplay: 1 },
              difficulty: 3, priceRange: '€€'
            },
            {
              id: 'dmg_hsd_v5', name: 'V5 Ultra IPS LCD (OSD)', brand: 'Hispeedido', badge: 'Nouveauté',
              pros: ['Ultra luminosité', 'OSD avancé', "Modes d'affichage supplémentaires"],
              cons: ['Forte consommation', 'Chauffe plus que V4'],
              scoreImpact: { image: 5, audio: 0, autonomie: -2, ergonomie: 1, gameplay: 1 },
              difficulty: 3, priceRange: '€€€'
            },
            {
              id: 'dmg_bv_lcd', name: 'LCD Replacement Kit', brand: 'BennVenn', badge: null,
              pros: ['Basse consommation', 'Pas de ghosting', 'Look authentique préservé'],
              cons: ['Moins lumineux que IPS'],
              scoreImpact: { image: 3, audio: 0, autonomie: 0, ergonomie: 0, gameplay: 1 },
              difficulty: 2, priceRange: '€€'
            }
          ]
        },
        {
          id: 'power', label: 'Énergie', icon: '⚡', exclusive: false,
          mods: [
            {
              id: 'dmg_cj', name: 'CleanJuice Original 2500mAh', brand: 'RetroSix', badge: null,
              pros: ['Recharge USB-C', 'Grande autonomie', 'Sans découpe'],
              cons: ['Prix', 'Légèrement plus lourd'],
              scoreImpact: { image: 0, audio: 0, autonomie: 3, ergonomie: 2, gameplay: 0 },
              difficulty: 2, priceRange: '€€€'
            },
            {
              id: 'dmg_cj_xl', name: 'CleanJuice XL 3000mAh', brand: 'RetroSix', badge: null,
              pros: ['3000mAh max', 'Recharge USB-C', 'Format identique'],
              cons: ['Prix élevé'],
              scoreImpact: { image: 0, audio: 0, autonomie: 4, ergonomie: 2, gameplay: 0 },
              difficulty: 2, priceRange: '€€€'
            },
            {
              id: 'dmg_cp', name: 'CleanPower v2.0', brand: 'RetroSix', badge: 'Indispensable',
              pros: ['Alimentation 5V stable', 'Évite les reboots', 'Indispensable avec IPS'],
              cons: ['Quasi-obligatoire avec IPS'],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 1, gameplay: 1 },
              difficulty: 2, priceRange: '€'
            },
            {
              id: 'dmg_gboc', name: 'GBAccelerator (OC)', brand: 'Division 6', badge: 'Vitesse',
              pros: ['4 modes de vitesse', 'Contrôle par boutons', 'Indicateur LED de vitesse'],
              cons: ['Peut causer bugs audio', 'Consomme plus', 'Soudure avancée'],
              scoreImpact: { image: 0, audio: -1, autonomie: -1, ergonomie: 0, gameplay: 2 },
              difficulty: 4, priceRange: '€€'
            }
          ]
        },
        {
          id: 'audio', label: 'Audio & Lumières', icon: '🔊', exclusive: false,
          mods: [
            {
              id: 'dmg_rg', name: 'RetroGlow DMG', brand: 'Handheld Legend', badge: 'RGB',
              pros: ['Totalement personnalisable', "Modes d'animation", 'Visuel unique'],
              cons: ["Consomme de l'énergie", 'Câblage complexe'],
              scoreImpact: { image: 0, audio: 0, autonomie: -1, ergonomie: 2, gameplay: 0 },
              difficulty: 3, priceRange: '€€'
            },
            {
              id: 'dmg_arc', name: 'ARC DMG (RGB LEDs)', brand: 'NatalieTheNerd', badge: 'RGB',
              pros: ['11 couleurs', 'Très faible conso', '4 niveaux luminosité'],
              cons: ['Moins de couleurs que RetroGlow'],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 2, gameplay: 0 },
              difficulty: 2, priceRange: '€€'
            },
            {
              id: 'dmg_ca', name: 'CleanAmp DMG', brand: 'RetroSix', badge: null,
              pros: ['Son puissant et clair', 'Haut-parleur 2W inclus', 'Filtrage actif du bruit'],
              cons: ['Modification permanente', 'Soudure requise'],
              scoreImpact: { image: 0, audio: 3, autonomie: -1, ergonomie: 1, gameplay: 1 },
              difficulty: 3, priceRange: '€€'
            },
            {
              id: 'dmg_spk', name: 'Clear DMG Speaker', brand: 'FunnyPlaying', badge: null,
              pros: ['Son cristallin', "Sans soudure", "Format d'origine"],
              cons: ['Gain limité vs CleanAmp'],
              scoreImpact: { image: 0, audio: 2, autonomie: 0, ergonomie: 0, gameplay: 1 },
              difficulty: 1, priceRange: '€'
            }
          ]
        },
        {
          id: 'buttons', label: 'Boutons', icon: '🔘', exclusive: false,
          mods: [
            {
              id: 'dmg_pb', name: 'Prestige Buttons DMG', brand: 'RetroSix', badge: 'Premium',
              pros: ['Matière haute qualité', 'Feeling proche original', 'Plusieurs coloris'],
              cons: ['Prix légèrement élevé'],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 1, gameplay: 1 },
              difficulty: 1, priceRange: '€€'
            },
            {
              id: 'dmg_pm', name: 'Prestige Silicone Membranes', brand: 'RetroSix', badge: null,
              pros: ['Conduction optimisée', 'Durée de vie étendue', 'Remplacement direct'],
              cons: [],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 1, gameplay: 2 },
              difficulty: 1, priceRange: '€'
            },
            {
              id: 'dmg_cb', name: 'Custom Buttons DMG', brand: 'FunnyPlaying', badge: null,
              pros: ['Large choix coloris', 'Bonne qualité', 'Simple à installer'],
              cons: ['Feeling légèrement différent'],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 1, gameplay: 1 },
              difficulty: 1, priceRange: '€'
            },
            {
              id: 'dmg_sp', name: 'Replacement Silicone Pads', brand: 'FunnyPlaying', badge: null,
              pros: ['Compatible tous boutons DMG', 'Réactivité restaurée', 'Facile à installer'],
              cons: [],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 1, gameplay: 1 },
              difficulty: 1, priceRange: '€'
            }
          ]
        }
      ]
    },

    /* ======= GAME BOY POCKET ======= */
    {
      id: 'pocket',
      name: 'Game Boy Pocket',
      fullName: 'Game Boy Pocket & Light (MGB)',
      icon: '🎒',
      year: 1996,
      type: 'portable',
      wikiUrl: 'wiki/pocket.html',
      description: "L'élégance de la miniaturisation. La Pocket demande de l'attention.",
      baseScores: { image: 2, audio: 3, autonomie: 5, ergonomie: 4, gameplay: 4 },
      modCategories: [
        {
          id: 'screen', label: 'Affichage', icon: '📺', exclusive: true,
          mods: [
            {
              id: 'gbp_fp_lam', name: 'MGB IPS Laminated Kit', brand: 'FunnyPlaying', badge: 'Laminé',
              pros: ['Image parfaitement centrée', 'Laminée à la vitre', 'Modes scanlines'],
              cons: ['Irréversible si mal installé', 'CleanPower obligatoire'],
              scoreImpact: { image: 5, audio: 0, autonomie: -1, ergonomie: 1, gameplay: 1 },
              difficulty: 3, priceRange: '€€€'
            },
            {
              id: 'gbp_hsd_osd', name: 'GBP Q5 IPS LCD (OSD)', brand: 'Hispeedido', badge: null,
              pros: ['Menu OSD intégré', 'Luminosité ajustable', 'Effets pixel et scanlines'],
              cons: ['Câblage complexe', 'CleanPower requis'],
              scoreImpact: { image: 4, audio: 0, autonomie: -1, ergonomie: 1, gameplay: 1 },
              difficulty: 3, priceRange: '€€'
            },
            {
              id: 'gbp_hsd_28', name: 'GBP Laminated 2.8" IPS Kit', brand: 'Hispeedido', badge: 'Laminé',
              pros: ['Dalle 2.8" laminée', 'Zéro poussière', 'Angles de vision larges'],
              cons: ['Nécessite découpe coque', 'Installation délicate'],
              scoreImpact: { image: 5, audio: 0, autonomie: -1, ergonomie: 1, gameplay: 1 },
              difficulty: 3, priceRange: '€€€'
            },
            {
              id: 'gbp_cgs_tft', name: 'Drop-in TFT Kit', brand: 'Cloud Game Store', badge: null,
              pros: ['Sans découpe', 'Taille origine', 'Faible consommation'],
              cons: ['Moins lumineux que IPS', 'Moins de personnalisation'],
              scoreImpact: { image: 3, audio: 0, autonomie: 0, ergonomie: 0, gameplay: 1 },
              difficulty: 2, priceRange: '€'
            },
            {
              id: 'gbp_bivert', name: 'Backlight & Bivert', brand: 'Handheld Legend', badge: null,
              pros: ['Look authentique', 'Contraste amélioré', 'Plusieurs couleurs dispo'],
              cons: ['Pas aussi lumineux qu\'IPS', 'Méthode traditionnelle'],
              scoreImpact: { image: 2, audio: 0, autonomie: 0, ergonomie: 0, gameplay: 1 },
              difficulty: 2, priceRange: '€'
            }
          ]
        },
        {
          id: 'power', label: 'Énergie (Critique)', icon: '⚡', exclusive: false,
          mods: [
            {
              id: 'gbp_cp', name: 'CleanPower Regulator', brand: 'RetroSix', badge: 'Indispensable',
              pros: ['Supprime les reboots', 'Stabilise la luminosité', 'Efficacité énergétique élevée'],
              cons: ['Obligatoire avec IPS'],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 1, gameplay: 1 },
              difficulty: 2, priceRange: '€'
            },
            {
              id: 'gbp_safer', name: 'Safer Charge Pocket', brand: 'NatalieTheNerd', badge: null,
              pros: ['Protection courts-circuits', 'Gestion de charge propre', 'Format ultra-compact'],
              cons: ['Batterie Li-Po séparée requise'],
              scoreImpact: { image: 0, audio: 0, autonomie: 3, ergonomie: 2, gameplay: 0 },
              difficulty: 3, priceRange: '€€'
            },
            {
              id: 'gbp_cja', name: 'CleanJuice Air (MGB)', brand: 'RetroSix', badge: null,
              pros: ['Recharge sans fil Qi', 'USB-C aussi', 'Format Plug & Play'],
              cons: ['Prix élevé'],
              scoreImpact: { image: 0, audio: 0, autonomie: 3, ergonomie: 3, gameplay: 0 },
              difficulty: 2, priceRange: '€€€'
            },
            {
              id: 'gbp_frog', name: 'Frogulator DC Regulator', brand: 'FroggoCustoms', badge: null,
              pros: ['Alimentation stable', 'Compatible Pocket & GBC', 'Compact et discret'],
              cons: ['Alternative moins connue que CleanPower'],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 1, gameplay: 1 },
              difficulty: 2, priceRange: '€'
            },
            {
              id: 'gbp_usbc_cover', name: 'USB-C Battery Cover', brand: 'Hispeedido', badge: null,
              pros: ['Port USB-C intégré au couvercle', 'Installation simple', 'Compatible Li-Po'],
              cons: ['Batterie Li-Po séparée requise'],
              scoreImpact: { image: 0, audio: 0, autonomie: 2, ergonomie: 2, gameplay: 0 },
              difficulty: 1, priceRange: '€€'
            }
          ]
        },
        {
          id: 'audio', label: 'Audio', icon: '🔊', exclusive: false,
          mods: [
            {
              id: 'gbp_ca', name: 'CleanAmp Pocket', brand: 'RetroSix', badge: null,
              pros: ['Son cristallin', "Consommation d'énergie maîtrisée", 'Haut-parleur premium'],
              cons: ['Soudure requise'],
              scoreImpact: { image: 0, audio: 3, autonomie: -1, ergonomie: 1, gameplay: 1 },
              difficulty: 3, priceRange: '€€'
            },
            {
              id: 'gbp_wfa', name: 'Wire Free Audio Amplifier', brand: 'Cloud Game Store', badge: null,
              pros: ['Sans câble', 'Volume significativement amélioré', 'Compatible toutes Pocket'],
              cons: ['Gain moins précis que CleanAmp'],
              scoreImpact: { image: 0, audio: 2, autonomie: 0, ergonomie: 1, gameplay: 1 },
              difficulty: 1, priceRange: '€'
            }
          ]
        },
        {
          id: 'buttons', label: 'Boutons', icon: '🔘', exclusive: false,
          mods: [
            {
              id: 'gbp_pb', name: 'Prestige Buttons Pocket', brand: 'RetroSix', badge: 'Premium',
              pros: ['Matière haute qualité', 'Feeling proche original', 'Plusieurs coloris'],
              cons: ['Prix'],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 1, gameplay: 1 },
              difficulty: 1, priceRange: '€€'
            },
            {
              id: 'gbp_fp_btn', name: 'Custom Buttons GBP', brand: 'FunnyPlaying', badge: null,
              pros: ['Large choix coloris', 'Bonne qualité', 'Simple à installer'],
              cons: ['Feeling légèrement différent'],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 1, gameplay: 1 },
              difficulty: 1, priceRange: '€'
            },
            {
              id: 'gbp_hsd_btn', name: 'GBP Buttons', brand: 'Hispeedido', badge: null,
              pros: ['Compatible toutes Pocket', 'Plusieurs coloris', 'Bonne résistance'],
              cons: [],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 1, gameplay: 1 },
              difficulty: 1, priceRange: '€'
            }
          ]
        }
      ]
    },

    /* ======= GAME BOY COLOR ======= */
    {
      id: 'gbc',
      name: 'Game Boy Color',
      fullName: 'Game Boy Color (CGB-001)',
      icon: '🎨',
      year: 1998,
      type: 'portable',
      wikiUrl: 'wiki/gbc.html',
      description: 'La couleur dans le creux de la main. Le modding est explosif.',
      baseScores: { image: 3, audio: 3, autonomie: 5, ergonomie: 4, gameplay: 5 },
      modCategories: [
        {
          id: 'screen', label: 'Affichage', icon: '📺', exclusive: true,
          mods: [
            {
              id: 'gbc_fp_ips', name: 'RetroPixel IPS LCD Kit', brand: 'FunnyPlaying', badge: null,
              pros: ['Zone agrandie', 'Luminosité réglable', 'Modes scanlines'],
              cons: ['Consomme plus de batterie'],
              scoreImpact: { image: 4, audio: 0, autonomie: -1, ergonomie: 0, gameplay: 1 },
              difficulty: 2, priceRange: '€€'
            },
            {
              id: 'gbc_fp_q5lam', name: 'IPS Laminated Q5 V2.0', brand: 'FunnyPlaying', badge: 'Laminé',
              pros: ['Logo rétroéclairé perso', 'Modes Pixel (Scanlines)', 'Vitre laminée sans poussière'],
              cons: ['Prix plus élevé', 'Installation délicate'],
              scoreImpact: { image: 5, audio: 0, autonomie: -1, ergonomie: 1, gameplay: 1 },
              difficulty: 3, priceRange: '€€€'
            },
            {
              id: 'gbc_fp_nesves', name: 'NES/VES RetroPixel Laminated', brand: 'FunnyPlaying', badge: 'Nouveauté',
              pros: ['Mode NES (palette rétro)', 'Mode VES (rendu vintage)', 'Vitre laminée'],
              cons: ['Prix élevé', 'Modes spécifiques peuvent dérouter'],
              scoreImpact: { image: 5, audio: 0, autonomie: -1, ergonomie: 1, gameplay: 1 },
              difficulty: 3, priceRange: '€€€'
            },
            {
              id: 'gbc_hsd_amoled', name: 'AMOLED Laminated Kit', brand: 'Hispeedido', badge: 'OLED',
              pros: ['Dalle AMOLED 2.45"', 'Contraste infini', 'Menu OSD complet', 'Vitre laminée'],
              cons: ['Risque de burn-in sur images fixes', 'Prix très élevé'],
              scoreImpact: { image: 6, audio: 0, autonomie: -1, ergonomie: 1, gameplay: 1 },
              difficulty: 3, priceRange: '€€€'
            },
            {
              id: 'gbc_hsd_dropin', name: 'IPS Drop-in 2.45" (OSD)', brand: 'Hispeedido', badge: null,
              pros: ['8 modes affichage', 'Sans découpe', 'Menu OSD complet'],
              cons: ['Moins lumineux que laminé'],
              scoreImpact: { image: 4, audio: 0, autonomie: -1, ergonomie: 1, gameplay: 1 },
              difficulty: 2, priceRange: '€€'
            },
            {
              id: 'gbc_cgs_tft', name: 'TFT LCD Backlight Kit', brand: 'Cloud Game Store', badge: null,
              pros: ['Sans découpe', 'Taille origine préservée', 'Faible consommation'],
              cons: ['Moins lumineux que IPS'],
              scoreImpact: { image: 3, audio: 0, autonomie: 0, ergonomie: 0, gameplay: 1 },
              difficulty: 2, priceRange: '€'
            },
            {
              id: 'gbc_bv', name: 'GBC IPS & LCD Kits', brand: 'BennVenn', badge: null,
              pros: ['Basse consommation', 'Scaling parfait', 'Support technique réputé'],
              cons: ['Moins connu que FP', 'Disponibilité variable'],
              scoreImpact: { image: 3, audio: 0, autonomie: 0, ergonomie: 0, gameplay: 1 },
              difficulty: 2, priceRange: '€€'
            }
          ]
        },
        {
          id: 'power', label: 'Énergie & Performance', icon: '⚡', exclusive: false,
          mods: [
            {
              id: 'gbc_cja', name: 'CleanJuice Air', brand: 'RetroSix', badge: null,
              pros: ['Recharge USB-C', 'Compatible Sans Fil Qi', '1600mAh'],
              cons: ['Prix élevé', 'Modification permanente'],
              scoreImpact: { image: 0, audio: 0, autonomie: 3, ergonomie: 3, gameplay: 0 },
              difficulty: 2, priceRange: '€€€'
            },
            {
              id: 'gbc_fp_bat', name: 'GBC Battery Charging Mod', brand: 'FunnyPlaying', badge: null,
              pros: ['Recharge USB-C', 'Compact et discret', 'Installation simple'],
              cons: ['Batterie Li-Po séparée requise'],
              scoreImpact: { image: 0, audio: 0, autonomie: 2, ergonomie: 2, gameplay: 0 },
              difficulty: 2, priceRange: '€€'
            },
            {
              id: 'gbc_cp', name: 'CleanPower Regulator GBC', brand: 'RetroSix', badge: 'Indispensable',
              pros: ['Alimentation stable', 'Évite les flickering', 'Indispensable avec IPS'],
              cons: ['Quasi-obligatoire avec IPS'],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 1, gameplay: 1 },
              difficulty: 2, priceRange: '€'
            },
            {
              id: 'gbc_frog', name: 'Frogulator DC Regulator', brand: 'FroggoCustoms', badge: null,
              pros: ['Alimentation propre et stable', 'Compatible GBC & Pocket', 'Compact'],
              cons: ['Alternative moins connue'],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 1, gameplay: 1 },
              difficulty: 2, priceRange: '€'
            },
            {
              id: 'gbc_gboc', name: 'GBAccelerator (OC)', brand: 'Division 6', badge: 'Vitesse',
              pros: ['4 modes de vitesse', 'Installation propre', 'Compatible IPS'],
              cons: ['Peut causer bugs audio', 'Consomme plus'],
              scoreImpact: { image: 0, audio: -1, autonomie: -1, ergonomie: 0, gameplay: 2 },
              difficulty: 3, priceRange: '€€'
            }
          ]
        },
        {
          id: 'audio', label: 'Illumination & Audio', icon: '🔊', exclusive: false,
          mods: [
            {
              id: 'gbc_rg', name: 'RetroGlow GBC', brand: 'Handheld Legend', badge: 'RGB',
              pros: ['32 teintes & saturation', "Modes Gamer & Fairy Light", 'Contrôle Select + D-Pad'],
              cons: ["Consomme de l'énergie"],
              scoreImpact: { image: 0, audio: 0, autonomie: -1, ergonomie: 2, gameplay: 0 },
              difficulty: 3, priceRange: '€€'
            },
            {
              id: 'gbc_arc', name: 'ARC GBC (RGB LEDs)', brand: 'NatalieTheNerd', badge: 'RGB',
              pros: ['Contrôle couleur par zone', 'Modes breathing & windmill', '17 réglages'],
              cons: ['Consomme légèrement'],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 2, gameplay: 0 },
              difficulty: 2, priceRange: '€€'
            },
            {
              id: 'gbc_fp_led', name: 'GBC Button LED Kit', brand: 'FunnyPlaying', badge: 'RGB',
              pros: ['Installation simple', 'Éclairage boutons', 'Compatible tous IPS FP'],
              cons: ['Moins configurable que ARC/RetroGlow'],
              scoreImpact: { image: 0, audio: 0, autonomie: -1, ergonomie: 2, gameplay: 0 },
              difficulty: 1, priceRange: '€'
            },
            {
              id: 'gbc_ca', name: 'CleanAmp Pro', brand: 'RetroSix', badge: null,
              pros: ['Son 400% plus fort', 'Filtrage du bruit', 'Haut-parleur inclus'],
              cons: ['Soudure requise', 'Modification permanente'],
              scoreImpact: { image: 0, audio: 3, autonomie: -1, ergonomie: 1, gameplay: 1 },
              difficulty: 3, priceRange: '€€'
            },
            {
              id: 'gbc_bucket', name: 'Bucket Amp GBC', brand: 'NatalieTheNerd', badge: null,
              pros: ['Remplacement complet circuit son', 'Qualité audio supérieure', 'Résultat exceptionnel'],
              cons: ['Soudure avancée', 'Modification permanente'],
              scoreImpact: { image: 0, audio: 4, autonomie: -1, ergonomie: 1, gameplay: 1 },
              difficulty: 4, priceRange: '€€€'
            },
            {
              id: 'gbc_wfa', name: 'Wire Free Audio Amplifier GBC', brand: 'Handheld Legend', badge: null,
              pros: ['Sans câble', 'Volume amélioré', 'Compact et discret'],
              cons: ['Gain modéré'],
              scoreImpact: { image: 0, audio: 2, autonomie: 0, ergonomie: 1, gameplay: 1 },
              difficulty: 1, priceRange: '€'
            }
          ]
        },
        {
          id: 'buttons', label: 'Boutons', icon: '🔘', exclusive: false,
          mods: [
            {
              id: 'gbc_frog_tact', name: 'Wire-free Tactile Button Mod V2', brand: 'FroggoCustoms', badge: 'Clicky',
              pros: ['100% sans soudure', 'D-pad + A/B + Start/Select', 'Anti-ghosting D-pad'],
              cons: ['Feeling différent de l\'original'],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 2, gameplay: 2 },
              difficulty: 1, priceRange: '€€'
            },
            {
              id: 'gbc_fp_btn', name: 'GBC Custom Buttons', brand: 'FunnyPlaying', badge: null,
              pros: ['Large choix coloris', 'Bonne qualité', 'Simple à installer'],
              cons: ['Feeling légèrement différent'],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 1, gameplay: 1 },
              difficulty: 1, priceRange: '€'
            }
          ]
        }
      ]
    },

    /* ======= GAME BOY ADVANCE ======= */
    {
      id: 'gba',
      name: 'Game Boy Advance',
      fullName: 'Game Boy Advance (AGB-001)',
      icon: '🎮',
      year: 2001,
      type: 'portable',
      wikiUrl: 'wiki/gba.html',
      description: "L'âge d'or du 32-bit portable. Sans rétroéclairage à l'origine.",
      baseScores: { image: 2, audio: 4, autonomie: 4, ergonomie: 5, gameplay: 7 },
      modCategories: [
        {
          id: 'screen', label: 'Affichage & Vidéo', icon: '📺', exclusive: true,
          mods: [
            {
              id: 'gba_fp_ipsmax', name: 'AGB IPS MAX Laminated Kit', brand: 'FunnyPlaying', badge: 'Laminé',
              pros: ['Standard incontesté GBA', 'Clarté bluffante', 'Vitre laminée'],
              cons: ['Découpe coque requise', 'CleanJuice recommandé'],
              scoreImpact: { image: 5, audio: 0, autonomie: -1, ergonomie: 1, gameplay: 1 },
              difficulty: 2, priceRange: '€€'
            },
            {
              id: 'gba_fp_30m2', name: '3.0" IPS Backlight Kit M2', brand: 'FunnyPlaying', badge: null,
              pros: ['Dalle 3.0 pouces', 'OSD amélioré', 'Luminosité accrue'],
              cons: ['Découpe coque requise'],
              scoreImpact: { image: 5, audio: 0, autonomie: -1, ergonomie: 0, gameplay: 1 },
              difficulty: 2, priceRange: '€€'
            },
            {
              id: 'gba_fp_ita', name: 'ITA TFT Kit (sans découpe)', brand: 'FunnyPlaying', badge: null,
              pros: ['Aucune découpe', 'Plug & Play', 'Idéal pour débuter'],
              cons: ['Image moins nette que IPS laminé'],
              scoreImpact: { image: 3, audio: 0, autonomie: 0, ergonomie: 1, gameplay: 1 },
              difficulty: 1, priceRange: '€'
            },
            {
              id: 'gba_fp_ita_lam', name: 'ITA TFT Laminated Kit (OSD)', brand: 'FunnyPlaying', badge: 'Laminé',
              pros: ['Laminé sans découpe', 'Menu OSD complet', 'Meilleure qualité image'],
              cons: ['Prix plus élevé'],
              scoreImpact: { image: 4, audio: 0, autonomie: -1, ergonomie: 1, gameplay: 1 },
              difficulty: 2, priceRange: '€€'
            },
            {
              id: 'gba_hsd_v2', name: 'IPS V2 Kit (Touch Sensor)', brand: 'Hispeedido', badge: null,
              pros: ['Capteur tactile luminosité', 'Soudure optionnelle', 'Installation propre'],
              cons: ['Capteur peut être sensible'],
              scoreImpact: { image: 4, audio: 0, autonomie: -1, ergonomie: 1, gameplay: 1 },
              difficulty: 2, priceRange: '€€'
            },
            {
              id: 'gba_hsd_v5', name: 'V5 IPS Backlight Kit', brand: 'Hispeedido', badge: null,
              pros: ['Haute luminosité', 'Plusieurs modes affichage', 'Excellente fidélité couleurs'],
              cons: ['Découpe coque recommandée'],
              scoreImpact: { image: 5, audio: 0, autonomie: -1, ergonomie: 0, gameplay: 1 },
              difficulty: 2, priceRange: '€€'
            },
            {
              id: 'gba_hsd_v5lam', name: 'V5 IPS Laminated (OSD)', brand: 'Hispeedido', badge: 'Laminé',
              pros: ['Vitre laminée', 'OSD complet', 'Résolution optimisée'],
              cons: ['Prix élevé', 'Installation délicate'],
              scoreImpact: { image: 5, audio: 0, autonomie: -1, ergonomie: 1, gameplay: 1 },
              difficulty: 3, priceRange: '€€€'
            },
            {
              id: 'gba_hsd_hdmi', name: 'TFT HDMI Kit (Sortie TV)', brand: 'Hispeedido', badge: 'TV Link',
              pros: ['Sortie 720p propre', 'Câble micro-HDMI discret', 'Idéal streaming'],
              cons: ['Câble HDMI visible', 'Consomme plus'],
              scoreImpact: { image: 4, audio: 0, autonomie: -2, ergonomie: 0, gameplay: 3 },
              difficulty: 3, priceRange: '€€€'
            },
            {
              id: 'gba_cgs', name: 'IPS LCD Backlight Kit', brand: 'Cloud Game Store', badge: null,
              pros: ['Bon rapport qualité/prix', 'Installation accessible', 'Luminosité améliorée'],
              cons: ['Moins premium que FP/HSD'],
              scoreImpact: { image: 3, audio: 0, autonomie: -1, ergonomie: 0, gameplay: 1 },
              difficulty: 2, priceRange: '€'
            },
            {
              id: 'gba_bv', name: 'GBA LCD Kits', brand: 'BennVenn', badge: null,
              pros: ['Très faible ghosting', "Gestion d'énergie intelligente"],
              cons: ['Disponibilité variable'],
              scoreImpact: { image: 3, audio: 0, autonomie: 0, ergonomie: 0, gameplay: 1 },
              difficulty: 2, priceRange: '€€'
            }
          ]
        },
        {
          id: 'power', label: 'Énergie & Performance', icon: '⚡', exclusive: false,
          mods: [
            {
              id: 'gba_cj_lipo', name: 'CleanJuice V1.3 (Li-Ion, USB-C)', brand: 'RetroSix', badge: null,
              pros: ['1700mAh', 'Recharge USB-C rapide', 'Pendant le jeu'],
              cons: ['Prix', 'Modification permanente'],
              scoreImpact: { image: 0, audio: 0, autonomie: 3, ergonomie: 2, gameplay: 0 },
              difficulty: 2, priceRange: '€€€'
            },
            {
              id: 'gba_cj_aa', name: 'CleanJuice AA USB-C Pack', brand: 'RetroSix', badge: null,
              pros: ['Préserve format piles AA', 'Recharge USB-C NiMH', 'Aucune modif coque'],
              cons: ['Piles NiMH séparées requises'],
              scoreImpact: { image: 0, audio: 0, autonomie: 2, ergonomie: 2, gameplay: 0 },
              difficulty: 1, priceRange: '€€'
            },
            {
              id: 'gba_fp_bat_max', name: 'AGB IPS MAX Battery USB-C', brand: 'FunnyPlaying', badge: null,
              pros: ['Conçu pour kit AGB IPS MAX', 'Recharge USB-C', 'Installation intégrée'],
              cons: ['Spécifique au kit FP'],
              scoreImpact: { image: 0, audio: 0, autonomie: 3, ergonomie: 2, gameplay: 0 },
              difficulty: 2, priceRange: '€€'
            },
            {
              id: 'gba_fp_bat', name: 'GBA Rechargeable Battery Mod', brand: 'FunnyPlaying', badge: null,
              pros: ['Recharge USB-C', 'Compatible tous GBA', 'Installation simple'],
              cons: ['Capacité standard'],
              scoreImpact: { image: 0, audio: 0, autonomie: 2, ergonomie: 2, gameplay: 0 },
              difficulty: 1, priceRange: '€€'
            },
            {
              id: 'gba_hsd_bat', name: 'GBA USB-C Battery 1800mAh', brand: 'Hispeedido', badge: null,
              pros: ['1800mAh', 'Recharge USB-C', 'Plug & Play'],
              cons: ['Format peut varier'],
              scoreImpact: { image: 0, audio: 0, autonomie: 3, ergonomie: 2, gameplay: 0 },
              difficulty: 1, priceRange: '€€'
            },
            {
              id: 'gba_gboc', name: 'GBAccelerator (OC)', brand: 'Division 6', badge: 'Vitesse',
              pros: ['Modes interchangeables à chaud', 'Indicateur de statut'],
              cons: ['Peut causer bugs audio', 'Consomme plus'],
              scoreImpact: { image: 0, audio: -1, autonomie: -1, ergonomie: 0, gameplay: 2 },
              difficulty: 3, priceRange: '€€'
            }
          ]
        },
        {
          id: 'audio', label: 'Illumination & Audio', icon: '🔊', exclusive: false,
          mods: [
            {
              id: 'gba_rg', name: 'RetroGlow GBA', brand: 'Handheld Legend', badge: 'RGB',
              pros: ['32 teintes', 'Animations fluides', "Économie d'énergie"],
              cons: ["Consomme légèrement"],
              scoreImpact: { image: 0, audio: 0, autonomie: -1, ergonomie: 2, gameplay: 0 },
              difficulty: 3, priceRange: '€€'
            },
            {
              id: 'gba_arc', name: 'ARC GBA (RGB LEDs)', brand: 'NatalieTheNerd', badge: 'RGB',
              pros: ['Contrôle couleur par zone', 'Modes breathing & windmill', '17 réglages'],
              cons: ['Consomme légèrement'],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 2, gameplay: 0 },
              difficulty: 2, priceRange: '€€'
            },
            {
              id: 'gba_ca', name: 'CleanAmp & De-Hiss', brand: 'RetroSix', badge: null,
              pros: ['Suppression du souffle', 'Volume multiplié'],
              cons: ['Soudure requise'],
              scoreImpact: { image: 0, audio: 3, autonomie: -1, ergonomie: 1, gameplay: 1 },
              difficulty: 3, priceRange: '€€'
            },
            {
              id: 'gba_bucket', name: 'Bucket Amp GBA', brand: 'NatalieTheNerd', badge: null,
              pros: ['Remplacement complet circuit son', 'Son fort et propre', 'Résultat exceptionnel'],
              cons: ['Soudure avancée', 'Modification permanente'],
              scoreImpact: { image: 0, audio: 4, autonomie: -1, ergonomie: 1, gameplay: 1 },
              difficulty: 4, priceRange: '€€€'
            },
            {
              id: 'gba_spk', name: 'Colored Speakers GBA', brand: 'Cloud Game Store', badge: null,
              pros: ['Plusieurs coloris', 'Meilleur rendu sonore', 'Remplacement direct'],
              cons: ['Gain modéré'],
              scoreImpact: { image: 0, audio: 2, autonomie: 0, ergonomie: 1, gameplay: 1 },
              difficulty: 1, priceRange: '€'
            }
          ]
        },
        {
          id: 'buttons', label: 'Boutons', icon: '🔘', exclusive: false,
          mods: [
            {
              id: 'gba_tact', name: 'Tactile Conversion PCB', brand: 'Handheld Legend', badge: 'Clicky',
              pros: ['Tous boutons + gâchettes', 'Feeling GBA SP sur GBA', '3 flex PCB'],
              cons: ['Feeling différent de l\'original', 'Soudure'],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 2, gameplay: 2 },
              difficulty: 3, priceRange: '€€'
            },
            {
              id: 'gba_fp_btn', name: 'GBA Custom Buttons', brand: 'FunnyPlaying', badge: null,
              pros: ['Large choix coloris', 'Bonne qualité', 'Simple à installer'],
              cons: ['Feeling légèrement différent'],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 1, gameplay: 1 },
              difficulty: 1, priceRange: '€'
            }
          ]
        }
      ]
    },

    /* ======= GAME BOY ADVANCE SP ======= */
    {
      id: 'gbasp',
      name: 'GBA SP',
      fullName: 'Game Boy Advance SP (AGS-001/101)',
      icon: '📱',
      year: 2003,
      type: 'portable',
      wikiUrl: 'wiki/gbasp.html',
      description: 'Design iconique à clapet. La SP reste la reine du modding confort.',
      baseScores: { image: 4, audio: 3, autonomie: 4, ergonomie: 6, gameplay: 7 },
      modCategories: [
        {
          id: 'screen', label: 'Affichage', icon: '📺', exclusive: true,
          mods: [
            {
              id: 'sp_fp_m2', name: 'GBA SP 3.0" IPS Kit M2', brand: 'FunnyPlaying', badge: 'Laminé',
              pros: ['Référence laminée SP', 'Image ultra nette', 'Angles 178°', 'Luminosité réglable'],
              cons: ['Prix', 'Installation délicate'],
              scoreImpact: { image: 3, audio: 0, autonomie: -1, ergonomie: 1, gameplay: 1 },
              difficulty: 2, priceRange: '€€€'
            },
            {
              id: 'sp_hsd_lam', name: 'GBA SP IPS Laminated Kit', brand: 'Hispeedido', badge: 'Laminé',
              pros: ['Installation simplifiée', 'Zéro poussière', 'Angles 178°'],
              cons: ['Consomme plus'],
              scoreImpact: { image: 3, audio: 0, autonomie: -1, ergonomie: 1, gameplay: 1 },
              difficulty: 2, priceRange: '€€'
            },
            {
              id: 'sp_hsd_v5', name: 'V5 IPS Drop-in 3.0"', brand: 'Hispeedido', badge: null,
              pros: ['8 modes de rendu', 'Luminosité tactile', 'Sans soudure (optionnel)'],
              cons: ['Moins premium que laminé'],
              scoreImpact: { image: 3, audio: 0, autonomie: -1, ergonomie: 1, gameplay: 1 },
              difficulty: 2, priceRange: '€€'
            },
            {
              id: 'sp_hsd_tvout', name: 'GBA SP V2 IPS + TV Out', brand: 'Hispeedido', badge: 'TV Link',
              pros: ['Sortie TV intégrée', 'OSD complet', 'Compatible AGS-001 & AGS-101'],
              cons: ['Câble TV visible', 'Prix élevé'],
              scoreImpact: { image: 3, audio: 0, autonomie: -2, ergonomie: 1, gameplay: 3 },
              difficulty: 3, priceRange: '€€€'
            }
          ]
        },
        {
          id: 'power', label: 'Énergie', icon: '⚡', exclusive: false,
          mods: [
            {
              id: 'sp_fp_bat', name: '950mAh LiPo MaxPlay Battery', brand: 'FunnyPlaying', badge: 'Recommandé',
              pros: ['950mAh', "S'insère dans le slot d'origine", 'Cellule haute qualité'],
              cons: ['Capacité limitée'],
              scoreImpact: { image: 0, audio: 0, autonomie: 3, ergonomie: 1, gameplay: 0 },
              difficulty: 1, priceRange: '€€'
            },
            {
              id: 'sp_usbc', name: 'USB-C Charging Port', brand: 'Custom / HHL', badge: null,
              pros: ['Câble universel', 'Plus robuste que original', 'Look moderne'],
              cons: ['Soudure requise', 'Précision nécessaire'],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 3, gameplay: 0 },
              difficulty: 3, priceRange: '€'
            }
          ]
        },
        {
          id: 'audio', label: 'Illumination & Audio', icon: '🔊', exclusive: false,
          mods: [
            {
              id: 'sp_rg', name: 'RetroGlow SP', brand: 'Handheld Legend', badge: 'RGB',
              pros: ['32 teintes disponibles', "Modes d'animation", 'Contrôle par combinaisons'],
              cons: ["Consomme de l'énergie"],
              scoreImpact: { image: 0, audio: 0, autonomie: -1, ergonomie: 2, gameplay: 0 },
              difficulty: 3, priceRange: '€€'
            },
            {
              id: 'sp_arc', name: 'ARC SP (RGB LEDs)', brand: 'NatalieTheNerd', badge: 'RGB',
              pros: ['Contrôle couleur par zone', 'Modes breathing & windmill', '17 réglages'],
              cons: ['Consomme légèrement'],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 2, gameplay: 0 },
              difficulty: 2, priceRange: '€€'
            },
            {
              id: 'sp_ca', name: 'CleanAmp SP', brand: 'RetroSix', badge: null,
              pros: ['Son clair et non distordu', 'Haut-parleur premium', 'Installation directe PCB'],
              cons: ['Soudure requise'],
              scoreImpact: { image: 0, audio: 3, autonomie: -1, ergonomie: 1, gameplay: 1 },
              difficulty: 3, priceRange: '€€'
            },
            {
              id: 'sp_flexamp', name: 'GBA SP Flex Amp', brand: 'Hispeedido', badge: null,
              pros: ['Très facile à installer', 'Son nettement plus fort', 'Compatible AGS-001 & AGS-101'],
              cons: ['Gain moins précis que CleanAmp'],
              scoreImpact: { image: 0, audio: 2, autonomie: -1, ergonomie: 1, gameplay: 1 },
              difficulty: 1, priceRange: '€'
            },
            {
              id: 'sp_fp_usbc_audio', name: 'USB-C Mod with Audio', brand: 'FunnyPlaying', badge: null,
              pros: ['USB-C + audio en un seul mod', 'Installation combinée', 'Compatible toutes SP'],
              cons: ['Soudure requise'],
              scoreImpact: { image: 0, audio: 2, autonomie: 0, ergonomie: 3, gameplay: 1 },
              difficulty: 3, priceRange: '€€'
            }
          ]
        },
        {
          id: 'buttons', label: 'Boutons', icon: '🔘', exclusive: false,
          mods: [
            {
              id: 'sp_pb', name: 'Prestige Buttons GBA SP', brand: 'RetroSix', badge: 'Premium',
              pros: ['Matière haute qualité', 'Feeling proche original', 'Plusieurs coloris'],
              cons: ['Prix'],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 1, gameplay: 1 },
              difficulty: 1, priceRange: '€€'
            },
            {
              id: 'sp_memb', name: 'Silicone Membranes GBA SP', brand: 'RetroSix', badge: null,
              pros: ['Conduction optimisée', 'Durée de vie étendue', 'Remplacement direct'],
              cons: [],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 1, gameplay: 2 },
              difficulty: 1, priceRange: '€'
            }
          ]
        }
      ]
    },

    /* ======= NINTENDO 64 ======= */
    {
      id: 'n64',
      name: 'Nintendo 64',
      fullName: 'Nintendo 64 (NUS-001)',
      icon: '🕹️',
      year: 1996,
      type: 'home',
      wikiUrl: 'wiki/n64.html',
      description: 'La révolution 3D. Indispensable de moderniser la sortie vidéo pour les écrans plats.',
      baseScores: { image: 3, audio: 5, autonomie: 10, ergonomie: 6, gameplay: 8 },
      modCategories: [
        {
          id: 'video', label: 'Vidéo & HDMI', icon: '📺', exclusive: true,
          mods: [
            {
              id: 'n64_n64digital', name: 'N64Digital', brand: 'PixelFX', badge: 'Premium',
              pros: ['Image parfaite pixel-to-pixel', 'Wi-Fi pour mises à jour', 'Scanlines et filtres rétro', 'Jusqu\'en 1080p'],
              cons: ['Prix très élevé', 'Installation très complexe'],
              scoreImpact: { image: 6, audio: 0, autonomie: 0, ergonomie: 1, gameplay: 1 },
              difficulty: 4, priceRange: '€€€'
            },
            {
              id: 'n64_ultrahdmi', name: 'UltraHDMI', brand: 'Retro-Active', badge: null,
              pros: ['Fonction De-Blur intégrée', 'Scaling haute qualité', 'Menu de configuration complet'],
              cons: ['Plus rare à trouver', 'Prix élevé'],
              scoreImpact: { image: 5, audio: 0, autonomie: 0, ergonomie: 1, gameplay: 1 },
              difficulty: 4, priceRange: '€€€'
            },
            {
              id: 'n64_rgb', name: 'RGB Mod Kit', brand: 'Borti / Tim Worthington', badge: null,
              pros: ['Signal RGB analogique pur', 'Indispensable pour modèles EU', 'Qualité d\'image pro sur CRT/OSSC'],
              cons: ['Nécessite un scaler externe', 'Soudure avancée'],
              scoreImpact: { image: 4, audio: 0, autonomie: 0, ergonomie: 0, gameplay: 1 },
              difficulty: 4, priceRange: '€€'
            },
            {
              id: 'n64_64hd', name: '64HD (HDMI Interne)', brand: 'Gamebox Systems', badge: null,
              pros: ['Alternative accessible au N64Digital', 'HDMI interne', 'Scaling et filtres intégrés'],
              cons: ['Moins premium que N64Digital'],
              scoreImpact: { image: 4, audio: 0, autonomie: 0, ergonomie: 1, gameplay: 1 },
              difficulty: 3, priceRange: '€€'
            },
            {
              id: 'n64_hsd_hdmi', name: 'N64HDMI (720p)', brand: 'Hispeedido', badge: null,
              pros: ['Prix abordable', 'Sortie 720p', 'Installation accessible'],
              cons: ['Moins de fonctionnalités', 'Qualité image inférieure aux autres'],
              scoreImpact: { image: 3, audio: 0, autonomie: 0, ergonomie: 1, gameplay: 1 },
              difficulty: 2, priceRange: '€€'
            }
          ]
        },
        {
          id: 'controls', label: 'Contrôles & Matériel', icon: '🕹️', exclusive: false,
          mods: [
            {
              id: 'n64_hall', name: 'Hall Effect Joystick', brand: '8BitDo / Custom', badge: 'Nouveauté',
              pros: ['Précision chirurgicale', 'Aucun drift possible', 'Sensation proche de l\'original'],
              cons: ['Feeling légèrement différent de l\'original'],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 3, gameplay: 2 },
              difficulty: 2, priceRange: '€€'
            },
            {
              id: 'n64_expak', name: 'Expansion Pak', brand: 'Nintendo / Generic', badge: 'Essentiel',
              pros: ['4MB → 8MB de RAM', 'Requis pour Majora\'s Mask & DK64', 'Meilleures textures sur certains jeux'],
              cons: [],
              scoreImpact: { image: 1, audio: 0, autonomie: 0, ergonomie: 0, gameplay: 1 },
              difficulty: 1, priceRange: '€'
            }
          ]
        }
      ]
    },

    /* ======= GAMECUBE ======= */
    {
      id: 'gamecube',
      name: 'GameCube',
      fullName: 'Nintendo GameCube (DOL-001)',
      icon: '🟣',
      year: 2001,
      type: 'home',
      wikiUrl: 'wiki/gamecube.html',
      description: 'Le cube magique. HDMI interne + ODE = setup ultime.',
      baseScores: { image: 4, audio: 6, autonomie: 10, ergonomie: 7, gameplay: 8 },
      modCategories: [
        {
          id: 'video', label: 'Vidéo & HDMI', icon: '📺', exclusive: true,
          mods: [
            {
              id: 'gc_retrogem', name: 'Retro GEM', brand: 'PixelFX', badge: 'Premium',
              pros: ['Qualité image parfaite', 'Scanlines et filtres avancés', 'Wi-Fi pour mises à jour', 'Jusqu\'en 1440p (Shiny)'],
              cons: ['Prix très élevé', 'Installation complexe'],
              scoreImpact: { image: 5, audio: 1, autonomie: 0, ergonomie: 2, gameplay: 1 },
              difficulty: 4, priceRange: '€€€'
            },
            {
              id: 'gc_hsd_hdmi', name: 'Internal HDMI Kit', brand: 'Hispeedido', badge: null,
              pros: ['Compatible DOL-101', 'Menu OSD complet', 'Prix accessible'],
              cons: ['Installation interne requise', 'Moins premium que Retro GEM'],
              scoreImpact: { image: 4, audio: 0, autonomie: 0, ergonomie: 1, gameplay: 1 },
              difficulty: 3, priceRange: '€€'
            },
            {
              id: 'gc_pluto', name: 'Pluto-IIx HDMI', brand: 'Citrus3000psi', badge: null,
              pros: ['Sortie HDMI directe', 'Open-source (GCVideo)', 'Installation robuste'],
              cons: ['Uniquement DOL-001', 'Disponibilité variable'],
              scoreImpact: { image: 4, audio: 0, autonomie: 0, ergonomie: 1, gameplay: 1 },
              difficulty: 4, priceRange: '€€'
            }
          ]
        },
        {
          id: 'ode', label: 'ODE & Chargement', icon: '💿', exclusive: false,
          mods: [
            {
              id: 'gc_flippy', name: 'FlippyDrive', brand: 'Team Flippy', badge: 'Nouveauté',
              pros: ['100% sans soudure', 'Préserve le lecteur optique', 'Interface CubeBoot moderne'],
              cons: ['Stock limité', 'Dépend du lecteur original'],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 2, gameplay: 3 },
              difficulty: 1, priceRange: '€€€'
            },
            {
              id: 'gc_loader', name: 'GC Loader PNP', brand: 'GC Loader Team', badge: null,
              pros: ['Vitesse de chargement max', 'Plug & Play', 'Fiabilité reconnue'],
              cons: ['Lecteur optique inutilisable', 'Prix élevé'],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 2, gameplay: 3 },
              difficulty: 2, priceRange: '€€€'
            },
            {
              id: 'gc_picoboot', name: 'PicoBoot (RPi Pico)', brand: 'Open Source', badge: null,
              pros: ['Coût dérisoire', 'Basé sur Raspberry Pi Pico', 'Lance Swiss via SD'],
              cons: ['Soudure requise', 'Configuration technique'],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 1, gameplay: 3 },
              difficulty: 3, priceRange: '€'
            }
          ]
        },
        {
          id: 'storage', label: 'Maintenance & Stockage', icon: '⚙️', exclusive: false,
          mods: [
            {
              id: 'gc_sd2sp2', name: 'SD2SP2 Adapter', brand: 'Generic', badge: null,
              pros: ['Slot micro SD discret', 'Libère les ports mémoire', 'Compatible Swiss'],
              cons: ['Requiert PicoBoot ou disque boot'],
              scoreImpact: { image: 0, audio: 0, autonomie: 0, ergonomie: 2, gameplay: 2 },
              difficulty: 1, priceRange: '€'
            },
            {
              id: 'gc_fan', name: '40mm Fan Mod', brand: 'Noctua / Custom', badge: null,
              pros: ['Silence total', 'Meilleur flux air', 'Adaptateur 3D requis'],
              cons: ['Démontage complet requis'],
              scoreImpact: { image: 0, audio: 1, autonomie: 0, ergonomie: 2, gameplay: 0 },
              difficulty: 2, priceRange: '€'
            }
          ]
        }
      ]
    }

  ]
};
