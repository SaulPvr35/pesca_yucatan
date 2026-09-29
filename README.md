# 🎣 Pesca Yucatán — Semáforo de Pesca y Monitoreo Costero

> Aplicación web progresiva de tipo *Mobile-First* diseñada para pescadores ribereños y deportivos de la costa de Yucatán. Ofrece un **Índice de Condiciones Ambientales** en tiempo real que combina variables meteorológicas, oceanográficas y teoría solunar, priorizando la seguridad náutica mediante un sistema de evaluación ponderado con *Kill Switch*.

---

## Características Principales

*   **Regla de Seguridad Infranqueable (Kill Switch):** Cortocircuita automáticamente la evaluación a un estado de alerta ("Quédate en tierra") si se detectan vientos peligrosos (>30 km/h), oleaje alto (>1.5 m) o presiones indicativas de tormenta.
*   **Sistema de Puntuación Ponderado (0-100 pts):** Evalúa la favorabilidad ambiental cruzando tres factores críticos:
    *   *Teoría Solunar (35%):* Cálculo astronómico ultrapreciso de las fases lunares y su impacto en la actividad biológica.
    *   *Oleaje y Viento (35%):* Medición de altura, periodo y dirección de olas y brisa superficial.
    *   *Presión Barométrica (30%):* Detección de rangos estables de presión atmosférica para predecir el comportamiento de los peces.
*   **Catálogo Costero Exhaustivo:** Cobertura de 13 puntos estratégicos de la costa yucateca, desde **Celestún** hasta **El Cuyo**, con selección rápida mediante scroll horizontal inteligente y menú nativo.
*   **Arquitectura Optimizada y Gratuita:** Backend ultrarrápido desplegado en la nube con Cloudflare Workers y caché en memoria (KV), protegiendo los límites de consumo de las APIs gratuitas de Open-Meteo.

---

## Stack Tecnológico

*   **Frontend:** React (Vite) + Tailwind CSS (Diseño *Mobile-First* y componentes atómicos).
*   **Backend / Edge:** Cloudflare Workers (JavaScript puro con gestión de CORS y saneamiento estricto de coordenadas).
*   **Caché:** Cloudflare KV (Optimizado con geocercas a 2 decimales y versionado de datos).
*   **Astronomía:** `astronomy-engine` para cálculos solunares en tiempo real sin dependencias externas pesadas.
*   **Iconografía:** `lucide-react`.

---

## Arquitectura del Proyecto

```text
src/
├── componentes/
│   ├── estructura/       # Cabecera, pie de página y plantillas maestras
│   ├── modulos/          # Componentes de negocio (CondicionesActuales, SelectorUbicacion, TarjetaFaseLunar)
│   └── ui/               # Componentes atómicos reutilizables (Boton, Tarjeta, Cargador, Etiqueta)
├── data/
│   ├── ports.js          # Catálogo oficial de puertos y coordenadas de Yucatán
│   └── species.js        # Guía de especies locales
├── hooks/
│   ├── usarClima.js      # Custom Hook para consumo asíncrono con manejo de estados
│   └── usarFaseLunar.js  # Custom Hook para cálculo astronómico
├── servicios/
│   └── api.js            # Conector HTTP hacia el Cloudflare Worker
└── utilidades/
    ├── astronomia.js     # Motor matemático de fases lunares y teoría solunar
    ├── motorCondiciones.js# Sistema de pesos, umbrales y reglas de seguridad
    └── formateadores.js  # Utilidades de conversión y formato náutico