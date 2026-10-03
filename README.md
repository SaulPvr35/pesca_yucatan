# Pesca Yucatan - Plataforma de Monitoreo Costero y Semaforo de Pesca

Suite web progresiva orientada a la comunidad pesquera ribereña y deportiva de la Península de Yucatán. Integra meteorología operativa en tiempo real, oceanografía física regional, modelado astronómico de efemérides y un motor algorítmico de decisión con corte de seguridad por umbral crítico (Kill Switch) para prevenir accidentes en altamar.

---

## 1. Arquitectura del Sistema

La solución opera bajo una arquitectura desacoplada orientada al rendimiento y la resiliencia en red:

1. **Cliente Web Progresivo (SPA):** Desarrollado en React 19 y compilado con Vite. Utiliza un diseño adaptativo mobile-first para facilitar la consulta directa en embarcaciones y muelles bajo condiciones de conectividad variable.
2. **Capa Edge y Gateway API:** Desplegada sobre la infraestructura serverless de Cloudflare Workers. Centraliza el procesamiento de solicitudes, aplica validación de dominios autorizados (CORS) y ejecuta geocercas sobre coordenadas para evitar consumo indebido de recursos.
3. **Caché Distribuido (KV Storage):** Normalización de coordenadas a dos decimales (~1.1 km de resolución costera) y persistencia temporal con TTL de 3600 segundos para optimizar latencias y proteger las cuotas de consulta hacia proveedores meteorológicos.

---

## 2. Caracteristicas Tecnicas Principales

### 2.1 Motor de Decision y Semaforo Ponderado (0 a 100 Puntos)
El estado de navegabilidad se calcula combinando variables ambientales mediante ponderación matemática:

* **Oleaje y Viento (35%):** Altura significativa de ola, periodo, velocidad de viento y rachas superficiales.
* **Teoria Solunar y Mareas (35%):** Coeficiente de actividad biológica, iluminación lunar, apogeo/perigeo y ventanas mayores/menores de alimentación.
* **Estabilidad Barometrica (30%):** Tendencia de la presión atmosférica en superficie para anticipar cambios tróficos en peces de fondo y pelágicos.

### 2.2 Salvaguarda de Seguridad Maritima (Kill Switch)
Mecanismo de interrupción automática que anula cualquier puntuación favorable e impone el estado **"Quedate en tierra"** cuando se sobrepasa cualquiera de los siguientes umbrales operativos:
* Velocidad sostenida o rachas de viento superiores a 30 km/h.
* Altura significativa de ola superior a 1.5 metros.
* Caída abrupta de presión barométrica indicativa de turbonadas o frentes fríos ("nortes").

### 2.3 Catalogo Biologico de Yucatan
* 12 especies marinas clave de la costa yucateca con fichas taxonómicas, artes de pesca recomendadas, carnadas/señuelos locales y tallas mínimas reglamentarias.
* Enlace directo a fichas científicas oficiales en **Enciclovida (CONABIO)**.
* Registro de vedas oficiales de acuerdo con las disposiciones vigentes de **INAPESCA** y **CONAPESCA**.

### 2.4 Cobertura Geografica Costera
Soporte georreferenciado para 13 puertos y puntos estratégicos de la costa norte de Yucatán:
* **Poniente y Rias:** Celestún, Sisal, Chuburná Puerto.
* **Costa Central y Puertos de Abrigo:** Chelem, Progreso, Chicxulub Puerto, Telchac Puerto.
* **Costa Esmeralda y Oriente:** San Crisanto, Chabihau, Santa Clara, Dzilam de Bravo, San Felipe, Río Lagartos y El Cuyo.

---

## 3. Stack Tecnologico

| Componente | Tecnologia | Funcion |
| :--- | :--- | :--- |
| Frontend | React 19 / Vite | Interfaz SPA responsiva, renderizado reactivo y carga instantánea |
| Estilos | Tailwind CSS v4 / Vanilla CSS | Sistema de diseño de alta fidelidad y consistencia visual |
| Iconografia | Lucide React | Simbologia tecnica náutica y meteorológica sin elementos gráficos informales |
| Astronomia | astronomy-engine | Motor matemático de precisión milimétrica para cálculo de efemérides y solunar |
| Backend Serverless | Cloudflare Workers | Proxy seguro en el borde, validación estricta de parámetros y saneamiento |
| Capa de Cache | Cloudflare Workers KV | Almacenamiento clave-valor geocercado para deduplicación de consultas |

---

## 4. Estructura del Repositorio

```text
pesca-yucatan-web/
├── public/
│   ├── Especies/               # Recursos gráficos optimizados de especies locales
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── estructura/         # Layout global, Cabecera y Pie de Página
│   │   ├── modulos/            # Modulos de negocio (CondicionesActuales, CatalogoPeces, PlanificadorSemanal, SelectorUbicacion, TarjetaFaseLunar)
│   │   └── ui/                 # Componentes atomicos reutilizables (Boton, Cargador, Etiqueta, Tarjeta)
│   ├── data/
│   │   ├── pecesYucatan.js     # Catalogo biologico regional, vedas y enlaces cientificos
│   │   ├── ports.js            # Puntos geograficos oficiales y referencias de navegacion
│   │   └── species.js          # Parametros complementarios de especies y tecnicas
│   ├── hooks/
│   │   ├── usarClima.js        # Gestion de estado y consumo asincrono de datos marinos
│   │   └── usarFaseLunar.js    # Calculo y estado del ciclo lunar
│   ├── servicios/
│   │   └── api.js              # Cliente HTTP configurado hacia el Worker
│   ├── utilidades/
│   │   ├── astronomia.js       # Implementacion de algoritmos solunares
│   │   ├── formateadores.js    # Normalizacion de rumbos cardinales y unidades nauticas
│   │   └── motorCondiciones.js # Algoritmo de ponderacion de semaforo y Kill Switch
│   ├── App.jsx                 # Ensamblador de vistas y navegacion
│   ├── index.css               # Configuracion de tema y animaciones
│   └── main.jsx                # Inicializador de la aplicacion
├── package.json
└── vite.config.js
```

---

## 5. Instalacion y Entorno de Desarrollo

### 5.1 Prerrequisitos
* Node.js v18.0.0 o superior
* Gestor de paquetes npm v9.0.0 o superior

### 5.2 Pasos de Configuracion

1. Clonar el repositorio localmente:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd pesca-yucatan-web
   ```

2. Instalar dependencias del proyecto:
   ```bash
   npm install
   ```

3. Variables de entorno:
   Copiar o crear un archivo `.env.local` en la raíz del proyecto para definir el endpoint del backend:
   ```env
   VITE_WORKER_URL=https://<TU_WORKER_ENDPOINT>/api/condiciones
   ```

4. Ejecutar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Generar compilación optimizada para producción:
   ```bash
   npm run build
   ```

---

## 6. Proveedores de Datos y Atribucion

* **Oceanografia y Meteorologia:** Modelos numéricos globales provistos por la API abierta de [Open-Meteo](https://open-meteo.com/) (integración de ECMWF, GFS y Copernicus Marine).
* **Taxonomia e Informacion Biologica:** Fichas de biodiversidad nacional de [Enciclovida](https://enciclovida.mx/) de la Comisión Nacional para el Conocimiento y Uso de la Biodiversidad (CONABIO).
* **Regulaciones y Vedas:** Instituto Nacional de Pesca y Acuacultura ([INAPESCA](https://www.gob.mx/inapesca)) y Comisión Nacional de Acuacultura y Pesca ([CONAPESCA](https://www.gob.mx/conapesca)).

---

## 7. Deslinde de Responsabilidad (Disclaimer)

La información proporcionada por esta plataforma tiene propósitos informativos, educativos y de recreación pesquera. Los pronósticos meteorológicos y oceanográficos son simulaciones computacionales sujetas a variaciones climáticas locales repentinas. Esta herramienta **no sustituye los avisos oficiales emitidos por Capitanía de Puerto, la Secretaría de Marina (SEMAR) ni las autoridades de Protección Civil del Estado de Yucatán**. Cada patrón de embarcación y tripulación es responsable directo de verificar las condiciones físicas antes de realizar cualquier actividad en altamar.

---

## 8. Licencia

Este proyecto está protegido bajo una **Licencia No Comercial con Atribución Obligatoria**. Consulte el archivo [LICENSE](LICENSE) para conocer los términos completos. Se prohíbe el uso comercial y la apropiación o suplantación de autoría sin consentimiento expreso por escrito.