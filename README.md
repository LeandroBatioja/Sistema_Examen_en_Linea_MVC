# Sistema de Examenes en Linea

Sistema de examen en linea basado en el patron **MVC (Modelo-Vista-Controlador)** con enfoque en **usabilidad**, **accesibilidad universal** y **ergonomia cognitiva**.

## Tecnologias

- **Backend**: Node.js + Express
- **Vistas**: EJS (Embedded JavaScript)
- **Base de datos**: SQLite (sql.js)
- **Accesibilidad**: ARIA, HTML semantico, compatible con Orca

## Caracteristicas de Accesibilidad

| Criterio | Implementacion |
|---|---|
| Independencia del color | Iconos + texto en errores, no solo color |
| Etiquetas y soporte de voz | ARIA labels, landmarks semanticos para Orca |
| Flexibilidad de entrada | Teclado, mouse, atajos Alt+D/L/H |
| Carga cognitiva 5±2 | Maximo 5 preguntas por pantalla |
| Consistencia estetica | Look & feel uniforme en toda la app |

## Despliegue con Docker (Recomendado)

### Requisitos

- Docker y Docker Compose instalados

### Ejecutar

```bash
# Construir la imagen y levantar el contenedor
docker compose up -d

# Ver logs en tiempo real
docker compose logs -f

# Verificar que esta corriendo
docker compose ps
```

La aplicacion estara disponible en **http://localhost:3000**.

### Detener

```bash
docker compose down
```

### Reconstruir tras cambios

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Persistencia

La base de datos SQLite se guarda en `./data/` mediante un volumen Docker. Los examenes y resultados se mantienen al reiniciar el contenedor.

## Despliegue Local (sin Docker)

### Requisitos

- Node.js 20+

### Instalacion

```bash
cd ~/Documentos/examen-online
npm install
```

### Ejecutar

```bash
# Iniciar servidor
npm start

# Modo desarrollo (auto-reload)
npm run dev

# Ejecutar evaluacion heuristica
npm test
```

## Cuenta Demo

- **Usuario**: estudiante
- **Contrasena**: estudiante123

## Estructura del Proyecto

```
examen-online/
├── docs/                    # Documentacion
│   ├── UML-Diagram.md       # Diagramas UML
│   ├── ISO9241-Justification.md
│   └── UX-Report.md         # Informe de usabilidad
├── src/
│   ├── models/              # Capa Modelo (datos)
│   ├── controllers/         # Capa Controlador (logica)
│   ├── views/               # Capa Vista (interfaz)
│   ├── routes/              # Rutas
│   └── public/              # Estaticos (CSS, JS)
├── tests/
│   └── heuristic-evaluation.js
├── Dockerfile               # Imagen Docker
├── docker-compose.yml       # Orquestacion Docker
├── .dockerignore            # Excluidos del build Docker
└── package.json
```

## Patrones de Diseno

- **MVC**: Separacion clara de Modelo, Vista y Controlador
- **ISO 9241**: Diseno centrado en el usuario
- **Regla 5 ± 2**: Maximo 7 items por pantalla (Miller, 1956)
- **Accesibilidad WCAG 2.1**: Niveles A y AA

## Compatible con

- Lectores de pantalla **Orca** (GNOME)
- Navegacion exclusiva por teclado
- Modo de alto contraste del sistema
- Preferencia de movimiento reducido
