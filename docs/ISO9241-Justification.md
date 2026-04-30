# Justificacion del Diseño bajo Normas ISO 9241

## 1. Introduccion

Este documento justifica las decisiones de diseño del **Sistema de Examenes en Linea** bajo los principios de la norma **ISO 9241** (Ergonomia de la interaccion humano-sistema), especificamente las partes relativas a usabilidad, accesibilidad y experiencia de usuario.

---

## 2. ISO 9241-110: Principios de Dialogo

### 2.1 Adecuacion a la Tarea
- **Implementacion**: El sistema permite realizar examenes en linea de forma completa: inicio de sesion, presentacion del examen, y obtencion de resultados.
- **Justificacion**: Cada pantalla presenta solo la informacion necesaria para la tarea actual. El panel muestra examenes disponibles, la vista de examen muestra preguntas, y la vista de resultados muestra la puntuacion.
- **Norma**: ISO 9241-110, seccion 6.1

### 2.2 Autodescripcion
- **Implementacion**: Todos los campos de formulario tienen etiquetas `<label>` explicitas, descripciones de ayuda (`<small>`), y mensajes de error claros con icono y texto.
- **Justificacion**: El usuario siempre sabe que se espera en cada campo gracias a `aria-describedby` que vincula el campo con su descripcion de ayuda.
- **Norma**: ISO 9241-110, seccion 6.2

### 2.3 Controlabilidad
- **Implementacion**: Navegacion por teclado completa (Tab, flechas en radio buttons, atajos Alt+D, Alt+L, Alt+H). Botones de "Anterior" y "Siguiente" en examenes paginados.
- **Justificacion**: El usuario controla el ritmo del examen y puede navegar libremente entre paginas de preguntas.
- **Norma**: ISO 9241-110, seccion 6.3

### 2.4 Conformidad con Expectativas del Usuario
- **Implementacion**: Diseno consistente: botones primarios siempre azules, errores siempre con icono de advertencia + texto, formulario de login siempre en el mismo formato.
- **Justificacion**: Se aplica la consistencia estetica para evitar frustracion oculta del estudiante (requisito del proyecto).
- **Norma**: ISO 9241-110, seccion 6.4

### 2.5 Tolerancia a Errores
- **Implementacion**: Validacion de formulario en el cliente y servidor. Mensajes de error descriptivos con `<div role="alert" aria-live="assertive">`. Las respuestas se guardan por pagina antes de avanzar.
- **Justificacion**: El sistema no permite errores silenciosos; cada problema se comunica claramente al usuario.
- **Norma**: ISO 9241-110, seccion 6.5

### 2.6 Adecuacion para la Individualizacion
- **Implementacion**: Soporte para preferencias del sistema operativo: `prefers-contrast: high` y `prefers-reduced-motion`. Fuentes escalables (`rem`).
- **Justificacion**: Cada usuario puede adaptar la interfaz a sus necesidades mediante las preferencias del sistema.
- **Norma**: ISO 9241-110, seccion 6.6

### 2.7 Adecuacion para el Aprendizaje
- **Implementacion**: Lenguaje claro sin abreviaturas complejas. Mensajes de retroalimentacion descriptivos en resultados ("Excelente dominio del tema", "Aprobado, pero puede mejorar").
- **Justificacion**: Se aplica la regla de disminucion de carga mental eliminando codigos o abreviaturas que generen cansancio mental innecesario.
- **Norma**: ISO 9241-110, seccion 6.7

---

## 3. ISO 9241-171: Accesibilidad de Software y Web

### 3.1 Independencia del Color
- **Implementacion**: Los errores usan icono ⚠️ + texto "Error:" + borde rojo. Los estados de aprobado/reprobado usan icono ✓/✗ + texto + badge con borde.
- **Justificacion**: El color NUNCA es la unica via de informacion. Un usuario daltónico puede distinguir todos los estados de la interfaz.
- **Norma**: ISO 9241-171, seccion 7.1.1

### 3.2 Compatibilidad con Tecnologias de Asistencia
- **Implementacion**: Atributos ARIA (`role`, `aria-label`, `aria-live`, `aria-describedby`, `aria-required`, `aria-invalid`). Landmarks semanticos (`<main>`, `<nav>`, `<header>`, `<footer>`). Encabezados jerarquicos (`h1` → `h2` → `h3`).
- **Justificacion**: Orca (lector de pantalla de GNOME) puede navegar y anunciar correctamente todos los elementos de la interfaz.
- **Norma**: ISO 9241-171, seccion 7.1.2

### 3.3 Flexibilidad de Entrada
- **Implementacion**: Operable con teclado (Tab, Enter, flechas), mouse (click), y atajos de teclado (Alt+D, Alt+L, Alt+H). Navegacion por radio buttons con flechas del teclado.
- **Justificacion**: Diferentes niveles de habilidad pueden interactuar con el sistema usando el dispositivo de entrada preferido.
- **Norma**: ISO 9241-171, seccion 7.1.3

### 3.4 Skip Links
- **Implementacion**: Enlace "Saltar al contenido principal" visible al enfocar con Tab.
- **Justificacion**: Usuarios de teclado pueden saltar la navegacion repetitiva y acceder directamente al contenido.
- **Norma**: ISO 9241-171, seccion 7.1.4

---

## 4. Ergonomia Cognitiva: Regla 5 ± 2

### 4.1 Implementacion
- **Paginacion de examenes**: Cada examen muestra como maximo 5 preguntas por pantalla ( configurable). Esto se basa en la regla de Miller (1956) sobre la capacidad de la memoria de trabajo humana (7 ± 2 elementos, refinado a 5 ± 2 en investigaciones modernas).
- **Formularios**: Login tiene 2 campos. Registro tiene 5 campos (maximo dentro del rango 5 ± 2).
- **Dashboard**: Muestra examenes disponibles y resultados en secciones separadas, no saturando una sola pantalla.

### 4.2 Justificacion
- **Carga cognitiva**: Al presentar 5 preguntas por pantalla, el estudiante puede concentrarse en un numero manejable de items sin sentirse abrumado.
- **Fatiga visual**: Menos contenido por pantalla reduce la fatiga visual durante examenes largos.

---

## 5. Evaluacion Heuristica (Nielsen)

El sistema se evaluó contra las 10 heurísticas de Nielsen. Ver el informe de UX para los resultados detallados.

| # | Heuristica | Cumplimiento |
|---|------------|--------------|
| 1 | Visibilidad del estado del sistema | ✓ Barra de progreso, alertas en vivo |
| 2 | Relacion entre sistema y mundo real | ✓ Lenguaje claro, sin tecnicismos |
| 3 | Control y libertad del usuario | ✓ Navegacion atras/adelante, skip links |
| 4 | Consistencia y estandares | ✓ Patrones consistentes en toda la app |
| 5 | Prevencion de errores | ✓ Validacion en cliente y servidor |
| 6 | Reconocer antes que recordar | ✓ Respuestas guardadas entre paginas |
| 7 | Flexibilidad y eficiencia de uso | ✓ Atajos de teclado, navegacion multiple |
| 8 | Diseno estetico y minimalista | ✓ Solo elementos necesarios por pantalla |
| 9 | Ayudar a reconocer, diagnosticar errores | ✓ Mensajes con icono + texto descriptivo |
| 10 | Ayuda y documentacion | ✓ Descripciones de ayuda en cada campo |

---

## 6. Conclusion

El diseño del Sistema de Examenes en Linea cumple con los principios de usabilidad ISO 9241 a traves de:

1. **Interaccion centrada en el usuario**: Formularios claros, retroalimentacion inmediata, navegacion intuitiva.
2. **Accesibilidad universal**: Compatible con Orca, operable por teclado, independiente del color.
3. **Ergonomia cognitiva**: Regla 5 ± 2 aplicada en paginacion y organizacion de contenido.
4. **Consistencia estetica**: Look & feel uniforme que evita la frustracion del estudiante.
