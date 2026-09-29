// Base de datos de especies marinas clave de Yucatán con calendario de vedas y recomendaciones
export const YUCATAN_SPECIES = [
  {
    id: "mero-rojo",
    name: "Mero Rojo / Cherna",
    scientificName: "Epinephelus morio",
    category: "Fondo Arrecifal",
    icon: "🐟",
    minSizeCm: 40,
    bestTechniques: ["Pesca de fondo (Bottom fishing)", "Jigging lento"],
    bestBaits: ["Calamar fresco", "Sardina entera", "Pulpo", "Camarón vivo"],
    depthMeters: "15 a 45 m",
    // Veda en Yucatán: 1 de febrero al 31 de marzo de cada año
    vedaInfo: {
      hasVeda: true,
      startMonth: 2, // Febrero (1-indexado)
      startDay: 1,
      endMonth: 3,   // Marzo
      endDay: 31,
      reason: "Periodo crítico de reproducción masiva en arrecifes del banco de Campeche/Yucatán."
    },
    activityConditions: {
      idealWaves: "0.4m - 1.0m",
      idealTide: "Media marea subiendo",
      description: "Prefiere fondos rocosos y cuevas de laja. Muy voraz durante lunas nuevas y llenas en horas tempranas."
    }
  },
  {
    id: "pulpo-maya",
    name: "Pulpo Maya",
    scientificName: "Octopus maya",
    category: "Molusco / Bentónico",
    icon: "🐙",
    minSizeCm: 11, // Longitud de manto
    bestTechniques: ["Gareteo con jimba (vara tradicional)", "Pesca artesanal"],
    bestBaits: ["Cangrejo moro", "Jaiba viva", "Sardina atada"],
    depthMeters: "3 a 18 m",
    // Temporada oficial en Yucatán: 1 de agosto al 15 de diciembre. Veda: 16 dic al 31 jul
    vedaInfo: {
      hasVeda: true,
      startMonth: 12,
      startDay: 16,
      endMonth: 7,
      endDay: 31,
      reason: "Especie endémica de la península de Yucatán. Veda estricta de 7 meses y medio para proteger desove y juveniles."
    },
    activityConditions: {
      idealWaves: "Menor a 0.7m (aguas calmas)",
      idealTide: "Baja corriente / mar en calma",
      description: "Crucial garetear al ritmo de la brisa marina. Agua transparente sobre pastos marinos y lajas de piedra."
    }
  },
  {
    id: "sabalo",
    name: "Sábalo / Tarpon (Rey de Plata)",
    scientificName: "Megalops atlanticus",
    category: "Deportiva / Pelágico Costero",
    icon: "⚡",
    minSizeCm: 70, // Altamente recomendado Catch & Release
    bestTechniques: ["Fly Fishing (Pesca con Mosca)", "Spinning con señuelos de superficie", "Trolling costero"],
    bestBaits: ["Poppers de superficie", "Moscas streamer negras y moradas", "Camarón vivo flotado", "Lisa viva"],
    depthMeters: "1 a 12 m (manglares, esteros y bocanas)",
    vedaInfo: {
      hasVeda: false,
      catchAndReleaseRecommended: true,
      reason: "Pesca deportiva regulada. Práctica preferente de Captura y Liberación inmediata en esteros y rías protegidas."
    },
    activityConditions: {
      idealWaves: "0.2m - 0.6m en rías y bocanas",
      idealTide: "Cambio de marea (Pleamar a bajamar)",
      description: "Máxima emoción por sus saltos acrobáticos fuera del agua. Se activa con el amanecer y atardecer en Celestún, Sisal y Río Lagartos."
    }
  },
  {
    id: "robalo",
    name: "Robalo Blanco / Snook",
    scientificName: "Centropomus undecimalis",
    category: "Estuarino y Costero",
    icon: "🦈",
    minSizeCm: 50,
    bestTechniques: ["Casting a estructuras", "Jigging con vinilos", "Línea con plomo corredizo"],
    bestBaits: ["Camarón vivo", "Pajarito vivo", "Minnows suspendidos (Rapala)", "Jigs con cola de vinilo blanco"],
    depthMeters: "1 a 8 m",
    vedaInfo: {
      hasVeda: true,
      startMonth: 7, // Zona Golfo de México verano
      startDay: 1,
      endMonth: 8,
      endDay: 15,
      reason: "Protección de cardúmenes reproductores en bocanas costeras."
    },
    activityConditions: {
      idealWaves: "0.3m - 0.8m",
      idealTide: "Marea vaciante (salida de manglar)",
      description: "Acecha cerca de postes de muelle, raíces de mangle y bocanas. Ataca cuando la corriente arrastra pequeños peces o camarones."
    }
  },
  {
    id: "corvina-pinta",
    name: "Corvina Pinta / Trucha de Mar",
    scientificName: "Cynoscion nebulosus",
    category: "Costero Somero",
    icon: "🐠",
    minSizeCm: 35,
    bestTechniques: ["Spinning ligero", "Flotador con camarón vivo", "Cucharas plateadas"],
    bestBaits: ["Camarón vivo con flotador sonoro (Popping cork)", "Sardina viva", "Gomas vinílicas con aroma"],
    depthMeters: "1 a 6 m",
    vedaInfo: {
      hasVeda: false,
      reason: "Pesca permitida todo el año respetando talla mínima de 35 cm."
    },
    activityConditions: {
      idealWaves: "0.2m - 0.7m",
      idealTide: "Marea alta cubriendo los bajos",
      description: "Patrulla bajos de arena y pasto marino (Thalassia) buscando camarones. Mordida suave pero carrera enérgica."
    }
  },
  {
    id: "pargo-canane",
    name: "Pargo Canané / Huachinango",
    scientificName: "Lutjanus synagris",
    category: "Fondo Rocoso",
    icon: "🐟",
    minSizeCm: 30,
    bestTechniques: ["Pesca de fondo con volantín", "Jigging ligero (Microjigs)"],
    bestBaits: ["Calamares en tiras", "Sardina en trozos", "Camarón fresco"],
    depthMeters: "10 a 35 m",
    vedaInfo: {
      hasVeda: false,
      reason: "Sin veda específica en la costa de Yucatán; respetar talla mínima reproductiva."
    },
    activityConditions: {
      idealWaves: "0.4m - 1.1m",
      idealTide: "Repunte de marea",
      description: "Vive en manadas sobre cabezas de coral y lajas. Una vez que pica uno, toda la manada entra en actividad rápida."
    }
  },
  {
    id: "jurel-toro",
    name: "Jurel Toro / Crevalle Jack",
    scientificName: "Caranx hippos",
    category: "Pelágico Rápido",
    icon: "🌊",
    minSizeCm: 45,
    bestTechniques: ["Trolling rápido", "Topwater poppers a gran velocidad", "Casting a cardumen hervidero"],
    bestBaits: ["Pencils y poppers grandes", "Cucharas de 2 a 3 oz", "Lisa viva o sardina troceada"],
    depthMeters: "Superficie a 30 m",
    vedaInfo: {
      hasVeda: false,
      reason: "Especie abundante, deportiva y combativa sin restricción de veda."
    },
    activityConditions: {
      idealWaves: "0.5m - 1.3m (mar con rompiente)",
      idealTide: "Cualquier marea con corriente viva",
      description: "Peleador brutal de mar abierto y escolleras. Forma 'hervideros' persiguiendo cardúmenes de sardina en la costa."
    }
  },
  {
    id: "barracuda",
    name: "Picuda / Gran Barracuda",
    scientificName: "Sphyraena barracuda",
    category: "Depredador de Superficie",
    icon: "🗡️",
    minSizeCm: 50,
    bestTechniques: ["Curricán (Trolling) con señuelo artificial", "Señuelos metálicos rápidos"],
    bestBaits: ["Rapalas alargadas (plata/azul/verde)", "Tubo de plástico verde limón", "Sardinas enteras con líder de acero"],
    depthMeters: "1 a 20 m",
    vedaInfo: {
      hasVeda: false,
      reason: "Sin veda en costas de Yucatán; usar siempre cable de acero por sus afilados dientes."
    },
    activityConditions: {
      idealWaves: "Aguas transparentes a moderadas",
      idealTide: "Marea viva con sol radiante",
      description: "Ataque fulminante como proyectil. Clave para jornadas de pesca de acción rápida frente a Progreso, Telchac y El Cuyo."
    }
  },
  {
    id: "langosta-espinosa",
    name: "Langosta Espinosa del Caribe",
    scientificName: "Panulirus argus",
    category: "Crustáceo / Arrecifal",
    icon: "🦞",
    minSizeCm: 13.5, // Cola mínima
    bestTechniques: ["Buceo a pulmón / Gancho artesanal en arrecife"],
    bestBaits: ["Carnada no aplicable (búsqueda en cuevas)"],
    depthMeters: "3 a 30 m",
    // Veda en Yucatán: 1 de marzo al 30 de junio
    vedaInfo: {
      hasVeda: true,
      startMonth: 3,
      startDay: 1,
      endMonth: 6,
      endDay: 30,
      reason: "Periodo de apareamiento y hembras ovígeras (con hueva)."
    },
    activityConditions: {
      idealWaves: "Menor a 0.6m",
      idealTide: "Marea baja y mar de fondo calmo",
      description: "Habita en huecos de arrecife y bajo cabezas de coral. Muy activa de noche saliendo a forrajear."
    }
  }
];

// Comprueba si una especie está en veda en una fecha dada
export function checkVedaStatus(species, date = new Date()) {
  if (!species.vedaInfo || !species.vedaInfo.hasVeda) {
    return {
      isEnVeda: false,
      badgeText: species.vedaInfo?.catchAndReleaseRecommended ? "Captura y Suelta" : "Temporada Abierta",
      color: "green",
      detail: species.vedaInfo?.reason || "Pesca permitida respetando tallas mínimas."
    };
  }

  const currentMonth = date.getMonth() + 1; // 1 - 12
  const currentDay = date.getDate();
  const { startMonth, startDay, endMonth, endDay, reason } = species.vedaInfo;

  let isInVeda = false;

  // Si la veda no cruza de año (ej. Mero: 1 Feb al 31 Mar)
  if (startMonth <= endMonth) {
    const afterStart = (currentMonth > startMonth) || (currentMonth === startMonth && currentDay >= startDay);
    const beforeEnd = (currentMonth < endMonth) || (currentMonth === endMonth && currentDay <= endDay);
    isInVeda = afterStart && beforeEnd;
  } else {
    // Si la veda cruza el año nuevo (ej. Pulpo: 16 Dic al 31 Jul)
    const inFirstPart = (currentMonth > startMonth) || (currentMonth === startMonth && currentDay >= startDay);
    const inSecondPart = (currentMonth < endMonth) || (currentMonth === endMonth && currentDay <= endDay);
    isInVeda = inFirstPart || inSecondPart;
  }

  return {
    isEnVeda: isInVeda,
    badgeText: isInVeda ? "EN VEDA OFICIAL" : "TEMPORADA ABIERTA",
    color: isInVeda ? "red" : "green",
    detail: isInVeda
      ? `PROHIBIDA SU CAPTURA. ${reason}`
      : `Pesca permitida. Veda inicia el ${startDay}/${startMonth}. Respeta la talla mínima de ${species.minSizeCm} cm.`
  };
}
