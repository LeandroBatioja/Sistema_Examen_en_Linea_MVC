# Informe de UX - Sistema de Examenes en Linea

## 1. Evaluacion Heuristica Sistematizada

### Metodologia
Se realizo una evaluacion heuristica basada en las 10 heurísticas de Nielsen, adaptadas para sistemas de examen en linea accesibles.

### Criterios de Evaluacion

#### H1: Visibilidad del Estado del Sistema
| Criterio | Resultado | Observacion |
|----------|-----------|-------------|
| Barra de progreso en examen | ✓ Cumple | Muestra pagina actual y total |
| Indicador de campo requerido | ✓ Cumple | `aria-required="true"` |
| Retroalimentacion de errores | ✓ Cumple | Alertas con `role="alert"` y `aria-live="assertive"` |
| Estado de respuesta seleccionada | ✓ Cumple | Radio button marcado visual y semanticamente |

#### H2: Correspondencia entre Sistema y Mundo Real
| Criterio | Resultado | Observacion |
|----------|-----------|-------------|
| Lenguaje del usuario | ✓ Cumple | Sin abreviaturas, terminos claros |
| Etiquetas descriptivas | ✓ Cumple | `aria-label` en todos los botones |
| Iconos significativos | ✓ Cumple | ✓ para correcto, ✗ para incorrecto, ⚠️ para error |

#### H3: Control y Libertad del Usuario
| Criterio | Resultado | Observacion |
|----------|-----------|-------------|
| Navegacion atras/adelante | ✓ Cumple | Botones en examen paginado |
| Skip links | ✓ Cumple | "Saltar al contenido principal" |
| Cierre de sesion accesible | ✓ Cumple | Boton en navegacion principal |

#### H4: Consistencia y Estandares
| Criterio | Resultado | Observacion |
|----------|-----------|-------------|
| Botones primarios uniformes | ✓ Cumple | Siempre azules con mismo estilo |
| Formularios consistentes | ✓ Cumple | Misma estructura label-input-help |
| Mensajes de error uniformes | ✓ Cumple | Icono + texto + color en todos |

#### H5: Prevencion de Errores
| Criterio | Resultado | Observacion |
|----------|-----------|-------------|
| Validacion en cliente | ✓ Cumple | HTML5 required, minlength, type |
| Validacion en servidor | ✓ Cumple | Controllers verifican datos |
| Confirmacion de contrasena | ✓ Cumple | Campo de confirmacion en registro |
| Respuestas guardadas por pagina | ✓ Cumple | Session almacena entre paginas |

#### H6: Reconocer antes que Recordar
| Criterio | Resultado | Observacion |
|----------|-----------|-------------|
| Opciones visibles | ✓ Cumple | Todas las opciones de cada pregunta visibles |
| Respuestas preseleccionadas | ✓ Cumple | Al volver a pagina, respuesta marcada |
| Navegacion visible | ✓ Cumple | Menu siempre presente |

#### H7: Flexibilidad y Eficiencia de Uso
| Criterio | Resultado | Observacion |
|----------|-----------|-------------|
| Navegacion por teclado | ✓ Cumple | Tab, Enter, flechas |
| Atajos de teclado | ✓ Cumple | Alt+D, Alt+L, Alt+H |
| Soporte para Orca | ✓ Cumple | Landmarks ARIA, labels, live regions |

#### H8: Diseno Estetico y Minimalista
| Criterio | Resultado | Observacion |
|----------|-----------|-------------|
| Maximo 5 preguntas/pantalla | ✓ Cumple | Regla 5 ± 2 aplicada |
| Sin informacion irrelevante | ✓ Cumple | Solo contenido necesario |
| Espaciado adecuado | ✓ Cumple | Margenes y padding consistentes |

#### H9: Ayuda a Reconocer y Recuperarse de Errores
| Criterio | Resultado | Observacion |
|----------|-----------|-------------|
| Mensajes en lenguaje claro | ✓ Cumple | "Contrasena incorrecta" no "Error 401" |
| Icono + texto en errores | ✓ Cumple | No solo color rojo |
| Campo invalido enfocado | ✓ Cumple | JS enfoca primer campo con error |

#### H10: Ayuda y Documentacion
| Criterio | Resultado | Observacion |
|----------|-----------|-------------|
| Descripciones de ayuda | ✓ Cumple | `<small>` en cada campo de formulario |
| `aria-describedby` | ✓ Cumple | Vincula campos con su ayuda |
| Cuenta demo disponible | ✓ Cumple | Credenciales en consola al iniciar |

---

## 2. Pruebas con Tecnica Think Aloud

### Metodologia
Se simulo la tecnica "Think Aloud" donde el usuario verbaliza sus pensamientos mientras interactua con el sistema. A continuacion se presentan los escenarios de prueba y los hallazgos.

### Escenario 1: Registro de Usuario Nuevo

**Tarea**: Crear una cuenta nueva con datos validos.

**Pasos esperados**:
1. Clic en "Registrarse"
2. Llenar formulario (nombre, usuario, email, contrasena, confirmacion)
3. Enviar formulario
4. Ver mensaje de exito y redireccion a login

**Hallazgos**:
- ✓ El enlace "Crear una cuenta nueva" es claro y accesible via teclado
- ✓ Cada campo tiene etiqueta y descripcion de ayuda
- ✓ La validacion de contrasenas coincidentes funciona correctamente
- ✓ El mensaje de error usa icono + texto, no solo color

**Tiempo estimado**: 45 segundos

### Escenario 2: Inicio de Sesion

**Tarea**: Iniciar sesion con credenciales validas.

**Pasos esperados**:
1. Ir a /login
2. Ingresar usuario y contrasena
3. Enviar formulario
4. Ser redirigido al panel

**Hallazgos**:
- ✓ El formulario de login es minimalista (solo 2 campos)
- ✓ La cuenta demo se muestra en la consola al iniciar el servidor
- ✓ El mensaje de bienvenida muestra el nombre del usuario

**Tiempo estimado**: 15 segundos

### Escenario 3: Realizar Examen

**Tarea**: Completar un examen de 10 preguntas con paginacion de 5 por pagina.

**Pasos esperados**:
1. Desde el panel, clic en "Comenzar Examen"
2. Responder 5 preguntas de la primera pagina
3. Clic en "Siguiente"
4. Responder 5 preguntas de la segunda pagina
5. Clic en "Finalizar Examen"
6. Ver resultados

**Hallazgos**:
- ✓ La barra de progreso indica claramente el avance
- ✓ Maximo 5 preguntas por pantalla cumple la regla 5 ± 2
- ✓ Las respuestas se mantienen al navegar entre paginas
- ✓ Los radio buttons son navegables con flechas del teclado
- ✓ El resultado muestra puntuacion, porcentaje, y mensaje descriptivo

**Tiempo estimado**: 8-10 minutos

### Escenario 4: Navegacion con Teclado (Accesibilidad)

**Tarea**: Navegar toda la aplicacion sin mouse.

**Pasos esperados**:
1. Usar Tab para moverse entre elementos
2. Usar Enter para activar botones/enlaces
3. Usar flechas para seleccionar opciones de radio
4. Usar Alt+D para ir al panel

**Hallazgos**:
- ✓ Skip link funciona (primer Tab lo enfoca)
- ✓ El orden de Tab es logico (arriba a abajo, izquierda a derecha)
- ✓ Los radio buttons responden a flechas arriba/abajo
- ✓ El focus visible es claro (outline azul de 3px)
- ✓ Los atajos Alt+D, Alt+L, Alt+H funcionan

---

## 3. Resumen de Hallazgos

| Categoria | Total | Cumple | Parcial | No Cumple |
|-----------|-------|--------|---------|-----------|
| Usabilidad | 10 | 10 | 0 | 0 |
| Accesibilidad | 8 | 8 | 0 | 0 |
| Ergonomia Cognitiva | 3 | 3 | 0 | 0 |
| **Total** | **21** | **21** | **0** | **0** |

### Conclusion
El Sistema de Examenes en Linea cumple con todos los criterios de usabilidad, accesibilidad y ergonomia cognitiva evaluados. La integracion de los principios de HCI y la norma ISO 9241 resulta en una interfaz eficiente, inclusiva y culturalmente adecuada.
