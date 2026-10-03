# 🎣 Pesca Yucatán — Plataforma de Monitoreo Costero & Semáforo de Pesca

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Cloudflare Workers](https://img.shields.io/badge/Edge-Cloudflare_Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

> **Pesca Yucatán** es una suite web progresiva (*Mobile-First*) diseñada para la comunidad de pescadores ribereños y deportivos de la Península de Yucatán. Integra meteorología en tiempo real, oceanografía local, modelado astronómico solunar, catálogo biológico regional y un algoritmo de decisión con salvaguarda física (*Kill Switch*) para salvaguardar vidas en altamar.

---

## 🌊 Características Principales

### 1. 🛡️ Algoritmo de Decisión & Seguridad Náutica (*Kill Switch*)
* **Salvaguarda Infranqueable:** La seguridad en el mar no se negocia. Si se detectan vientos sostenidos o rachas > 30 km/h, oleaje mayor a 1.5 m o caídas abruptas de presión barométrica (indicativas de turbonadas o "nortes"), el semáforo activa automáticamente el estado **"Quédate en tierra"** con alerta visual roja, invalidando cualquier condición favorable solunar.
* **Índice Ponderado de Condiciones (0 - 100 pts):**
  * **Oleaje y Viento (35%):** Altura significativa de ola, periodo, velocidad y dirección de corrientes.
  * **Teoría Solunar y Mareas (35%):** Cálculo de tránsito lunar, ventanas mayores/menores de actividad trófica e iluminación lunar.
  * **Presión Barométrica (30%):** Monitoreo de estabilidad barométrica para proyectar el comportamiento de alimentación de los peces.

### 2. 📍 Cobertura Integral del Litoral Yucateco
Soporte geolocalizado para 13 puertos y zonas costeras estratégicas de la Península:
* **Poniente y Rías:** Celestún, Sisal, Chuburná Puerto.
* **Costa Central y Puertos de Abrigo:** Chelem, Progreso, Chicxulub Puerto, Telchac Puerto.
* **Costa Esmeralda y Oriente:** San Crisanto, Chabihau, Santa Clara, Dzilam de Bravo, San Felipe, Río Lagartos y El Cuyo.

### 3. 🐟 Catálogo Biológico & Fichas Técnicas de Yucatán
* Guía de especies locales (Mero Americano, Mero Negrillo, Robalo Blanco, Sábalo, Canané, Rubia, Corvina Pinta, Jurel, Barracuda, Esmedregal, Sierra del Golfo y Macabí).
* **Fichas Técnicas Oficiales:** Conexión directa a **Enciclovida (CONABIO)** por especie.
* **Enfoque de Pesca Sustentable:** Registro de tallas mínimas de captura, artes de pesca recomendadas, carnadas/señuelos locales y periodos de veda estipulados por **INAPESCA** y **CONAPESCA**.
* **Microanimaciones marinas:** Animación fluida de nado y estética adaptada a la Costa Esmeralda.

### 4. 📅 Planificador Semanal & Previsión Solunar
* Proyección a 7 días de condiciones marinas ideales por hora y ventana diaria.
* Identificación de periodos lunares pico (Luna Nueva y Luna Llena) y coeficientes de actividad biológica calculados localmente en el dispositivo.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | SPA ultrarrápida optimizada para consumo móvil |
| **Estilos** | Tailwind CSS v4 + Vanilla CSS | Sistema de diseño de alta fidelidad, modo cristal y animaciones marinas |
| **Iconografía** | Lucide React | Simbología vectorial náutica, meteorológica y marina |
| **Astronomía** | `astronomy-engine` | Algoritmos de efemérides y fases lunares de precisión milimétrica sin dependencias externas |
| **Edge / API Proxy** | Cloudflare Workers | Servidor serverless en el borde para sanitizar llamadas, normalizar respuestas y evitar exponer endpoints de terceros |
| **Caché en el Borde** | Cloudflare KV | Almacenamiento en caché con geocercas a 2 decimales para optimizar llamadas a APIs meteorológicas |

---

## 📁 Arquitectura del Proyecto

```text
pesca-yucatan-web/
├── public/
│   ├── Especies/               # Galería de especies locales en formato optimizado WebP
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── estructura/         # Layout principal, Navbar, Header y Footer náutico
│   │   ├── modulos/            # Módulos de funcionalidad y negocio
│   │   │   ├── CatalogoPeces.jsx       # Catálogo de especies con filtros y enlaces Enciclovida
│   │   │   ├── CondicionesActuales.jsx # Semáforo de pesca, métricas meteorológicas y Kill Switch
│   │   │   ├── PlanificadorSemanal.jsx # Pronóstico y previsión náutica a 7 días
│   │   │   ├── SelectorUbicacion.jsx   # Selector interactivo de puertos de Yucatán
│   │   │   └── TarjetaFaseLunar.jsx    # Reloj solunar y cálculo de tránsito lunar
│   │   └── ui/                 # Componentes atómicos (Botones, Tarjetas, Badges, Indicadores)
│   ├── data/
│   │   ├── pecesYucatan.js     # Base biológica de especies, vedas, técnicas y enlaces Enciclovida
│   │   ├── ports.js            # Coordenadas, mareas de referencia y metadatos de puertos yucatecos
│   │   └── species.js          # Datos complementarios de pesca deportiva
│   ├── hooks/
│   │   ├── usarClima.js        # Hook reactivo de sincronización meteorológica y oceanográfica
│   │   └── usarFaseLunar.js    # Hook para efemérides solunares
│   ├── servicios/
│   │   └── api.js              # Cliente de consumo al Cloudflare Worker
│   ├── utilidades/
│   │   ├── astronomia.js       # Modelado astronómico y cálculo solunar
│   │   ├── formateadores.js    # Transformación de nudos, km/h, metros y rumbos de viento
│   │   └── motorCondiciones.js # Motor analítico de puntuación y activación de Kill Switch
│   ├── App.jsx                 # Orquestador principal de la aplicación
│   ├── index.css               # Tokens de tema y animaciones marítimas
│   └── main.jsx                # Punto de entrada de React
├── package.json
└── vite.config.js
```

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
* **Node.js** >= 18.0.0
* **npm** o gestor compatible

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/pesca-yucatan-web.git
cd pesca-yucatan-web
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configuración de Entorno
Crea un archivo `.env.local` en la raíz si deseas apuntar a un backend propio:
```env
VITE_API_BASE_URL=https://tu-worker.tu-cuenta.workers.dev
```

### 4. Ejecutar en modo desarrollo
```bash
npm run dev
```
La aplicación iniciará localmente en `http://localhost:5173/`.

### 5. Compilar para producción
```bash
npm run build
```
Generará el bundle optimizado y minificado en la carpeta `dist/`.

---

## 🧭 Fuentes de Datos & Normativas

* **Fichas Biológicas y Taxonomía:** [Enciclovida (CONABIO)](https://enciclovida.mx/)
* **Vedas y Regulaciones Pesqueras:** [INAPESCA](https://www.gob.mx/inapesca) & [CONAPESCA](https://www.gob.mx/conapesca)
* **Datos Oceanográficos y Meteorológicos:** Modelos GFS / ECMWF / Marine Open-Meteo
* **Cálculo Astronómico:** Efemérides solunares calculadas mediante algoritmos abiertos basados en `astronomy-engine`

---

## 📜 Licencia

Distribuido bajo la Licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles.