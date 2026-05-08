# Sistema de Examenes en Linea

Sistema de examen en linea basado en el patron **MVC (Modelo-Vista-Controlador)** con enfoque en **usabilidad**, **accesibilidad universal** y **ergonomia cognitiva**.

## Tecnologias

- **Backend**: Node.js + Express
- **Vistas**: EJS (Embedded JavaScript)
- **Base de datos**: PostgreSQL
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

La base de datos PostgreSQL se ejecuta en un contenedor separado con volumen persistente `postgres_data`. Los examenes y resultados se mantienen al reiniciar los contenedores.

## Despliegue en Render (Gratuito y Persistente)

Ideal para compartir con companeros sin dejar tu PC encendida.

### Requisitos

- Cuenta en [Render](https://render.com)
- Codigo subido a GitHub

### Pasos

1. Sube tu codigo a un repositorio GitHub
2. En Render, crea un nuevo **Web Service** conectado a tu repositorio
3. Render detectara automaticamente el archivo `render.yaml`
4. Se creara automaticamente la base de datos PostgreSQL gratuita
5. Tu app estara disponible en `https://tu-app.onrender.com`

### Variables de Entorno

Render configura automaticamente:
- `DATABASE_URL`: URL de conexion a PostgreSQL
- `NODE_ENV`: production

## Despliegue Local (sin Docker)

### Requisitos

- Node.js 20+
- PostgreSQL instalado localmente (o usar Docker)

### Instalacion

```bash
cd ~/Documentos/examen-online
npm install
```

### Configuracion de Base de Datos

Crea una base de datos PostgreSQL y configura la variable de entorno:

```bash
export DATABASE_URL=postgresql://usuario:password@localhost:5432/examen_online
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

## Atajos de Teclado

### Atajos Globales (Alt)

| Atajo | Acción |
|-------|--------|
| `Alt + D` | Ir al panel de examenes (Dashboard) |
| `Alt + L` | Ir a iniciar sesión (Login) |
| `Alt + H` | Ir a página principal (Home) |
| `Alt + C` | Cerrar sesión (Logout) |

### Navegación Básica

| Tecla | Acción |
|-------|--------|
| `Tab` | Siguiente elemento |
| `Shift + Tab` | Elemento anterior |
| `Enter` | Activar botón/enlace |
| `↑` `↓` `←` `→` | Navegar entre opciones en examenes |

## Estructura del Proyecto

```
examen-online/
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
