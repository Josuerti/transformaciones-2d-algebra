# Sistema de Transformaciones Lineales 2D

## Descripción

Aplicación web profesional para la visualización interactiva de transformaciones lineales en ℝ², desarrollada con estándares de la industria. Incluye un asistente virtual inteligente que explica en tiempo real los conceptos matemáticos.

## Características Principales

### 1. Asistente IA Virtual
- Explica transformaciones en tiempo real
- Responde preguntas sobre matrices, determinantes y composición
- Feedback inteligente sobre cada acción
- Panel flotante no intrusivo

### 2. Visualización Profesional
- Plano cartesiano estilo GeoGebra
- Grid de dos niveles (mayor y menor)
- Numeración automática de coordenadas
- Canvas optimizado (700×700px)

### 3. Representación Matricial
- Matrices con formato matemático correcto
- Brackets tipográficos (⎡ ⎤)
- Cálculo automático de propiedades
- Orden de aplicación visible

### 4. Transformaciones Disponibles
- Rotación (-180° a 180°)
- Escalamiento (0.1 a 3.0)
- Corte/Shear (-2.0 a 2.0)
- Traslación (-150 a 150)
- Reflexiones (X e Y)

### 5. Figuras Geométricas
- Estrella de 5 puntas
- Pentágono regular
- Hexágono regular
- Triángulo
- Rectángulo
- Flecha
- Corazón (curva cardioide)
- Letra A

## Tecnologías

- **HTML5**: Estructura semántica
- **CSS3**: Diseño profesional con variables CSS
- **JavaScript ES6+**: Lógica sin dependencias
- **Canvas API**: Renderizado 2D
- **Google Fonts**: Tipografía Inter

## Instalación

### Uso Local
1. Descargar los archivos
2. Abrir `index.html` en navegador
3. No requiere servidor web

### GitHub Pages
1. Subir archivos a repositorio
2. Activar Pages en Settings
3. URL disponible en minutos

## Dimensiones Optimizadas

La aplicación está optimizada para:
- **Desktop**: 1366×768 mínimo (ideal: 1920×1080)
- **Tablet**: 1024×768
- **Layout**: Grid de 3 columnas (320px + flex + 320px)
- **Canvas**: 700×700px (escalable)

## Guía de Uso

### Flujo Básico
1. Seleccionar figura geométrica
2. Activar transformaciones deseadas
3. Ajustar parámetros con sliders
4. Click "Aplicar"
5. Ver matriz y propiedades

### Asistente IA
- Click en "Asistente IA" (header)
- Usar botones de sugerencias
- Recibir explicaciones automáticas

### Funciones Especiales
- **Animar**: Transición suave 60 FPS
- **Restablecer**: Volver a estado inicial
- **Opciones visualización**: Control de elementos

## Conceptos Matemáticos

### Coordenadas Homogéneas
```
(x, y) → (x, y, 1)
Matrices 3×3 en lugar de 2×2
```

### Composición
```
C = T · H · S · R
Orden: derecha → izquierda
```

### Determinante
```
det = 1  → Área preservada
det > 1  → Área aumenta
det < 1  → Área disminuye
det < 0  → Inversión orientación
```

## Propiedades Calculadas

- **Determinante**: Cambio de área
- **Orientación**: Preservada/invertida
- **Factor de área**: Multiplicador
- **Tipo**: Isometría/General

## Arquitectura

```
index.html
├── Header (asistente IA)
├── Layout (grid 3 columnas)
│   ├── Panel control (320px)
│   ├── Canvas (flex)
│   └── Panel análisis (320px)
└── Panel IA flotante

style.css
├── Variables CSS optimizadas
├── Layout responsive
├── Componentes reutilizables
└── Animaciones suaves

script.js
├── Generadores figuras
├── Matrices transformación
├── Sistema dibujo GeoGebra
├── Asistente IA
└── Event listeners
```

## Asistente IA - Funciones

### Explicaciones Disponibles
1. **Lectura de matrices**: Cómo interpretar elementos
2. **Determinante**: Significado geométrico
3. **Composición**: Orden de multiplicación

### Feedback Automático
- Al generar figura: Confirma vértices
- Al aplicar: Explica resultado
- Al animar: Describe proceso
- Al resetear: Confirma acción

## Navegadores Soportados

- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

## Responsive Design

### Desktop (1920×1080)
- Grid 3 columnas completo
- Canvas 700×700px
- Sidebars sticky

### Laptop (1366×768)
- Grid ajustado (300px + flex + 300px)
- Canvas escalado proporcionalmente
- Layout optimizado

### Tablet (1024×768)
- Grid single column
- Sidebars apilados
- Canvas centrado

### Mobile (768px-)
- Layout compacto
- Canvas responsive
- Controles simplificados

## Optimizaciones Aplicadas

### Performance
- Canvas rendering optimizado
- Animaciones 60 FPS
- Event listeners eficientes
- Sin dependencias pesadas

### UX/UI
- Feedback visual inmediato
- Transiciones suaves
- Estados claros de interacción
- Asistente IA no intrusivo

### Código
- Variables CSS centralizadas
- JavaScript modular
- HTML semántico
- CSS sin redundancias

## Casos de Uso

### Estudiantes
- Visualizar conceptos abstractos
- Experimentar con parámetros
- Entender composición
- Aprender con IA

### Profesores
- Demostración en clase
- Herramienta didáctica
- Ejemplos interactivos
- Evaluación práctica

### Investigadores
- Prototipado rápido
- Validación visual
- Análisis de casos
- Documentación gráfica

## Mejoras Futuras

- [ ] Más figuras personalizables
- [ ] Exportar como imagen
- [ ] Historial de transformaciones
- [ ] Modo oscuro
- [ ] Transformaciones 3D
- [ ] Guardado de sesión
- [ ] IA con más explicaciones
- [ ] Tutorial interactivo

## Créditos

Desarrollado como proyecto de Álgebra Lineal.

**Inspiración:**
- GeoGebra: Visualización matemática
- Desmos: Interfaz limpia
- MATLAB: Precisión numérica
- ChatGPT: Asistente IA

**Tipografía:**
- Inter (Google Fonts)
- Roboto Mono (código)

## Licencia

MIT License - Uso educativo y académico.

## Soporte

Para reportar errores o sugerencias:
- Crear issue en GitHub
- Contacto: [email institucional]

---

**Versión con Asistente IA Integrado**

**Última actualización**: Enero 31, 2026

**Canvas optimizado**: 700×700px

**Layout responsive**: 320px + flex + 320px
