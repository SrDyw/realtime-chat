# QuickChat

Chat en tiempo real construido con Next.js y Pusher.

![QuickChat](https://img.shields.io/badge/QuickChat-v1.0-violet?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)
![Pusher](https://img.shields.io/badge/Pusher-Realtime-FF6368?style=flat-square&logo=pusher)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)

## Características

### Mensajería en Tiempo Real
- Mensajes instantáneos con WebSockets (Pusher)
- Indicador de conexión en tiempo real
- Historial de mensajes persistente

### Presencia de Usuarios
- Sistema de presencia con heartbeats (10s)
- Notificaciones de entrada/salida de usuarios
- Lista de usuarios activos en la sala

### Reacciones
- Reacciones con emojis (❤️, 😂, 😮, 😢, 👍, 🔥)
- Toggle de reacciones (mismo emoji para añadir/eliminar)
- Ver quién reaccionó a cada mensaje

### Respuestas de Mensajes
- Responde a mensajes específicos
- Vista previa del mensaje respondido
- Indicador visual de respuesta

### Indicador de Escritura
- Muestra cuando otros usuarios están escribiendo
- Animación de puntos con estilo WhatsApp
- Nombres de usuarios que están escribiendo

### Temas
- Modo claro y oscuro
- Cambio de tema desde la configuración
- Persistencia del tema seleccionado

### Diseño
- UI moderna con Tailwind CSS
- Burbujas de chat estilo WhatsApp
- Colores aleatorios para cada usuario
- Diseño responsivo

## Tecnologías

- **Frontend**: Next.js 16, React, TypeScript
- **Estilos**: Tailwind CSS
- **Tiempo Real**: Pusher Channels
- **Fuente**: Geist Sans/Mono

## Requisitos Previos

- Node.js 18+
- Cuenta de Pusher (gratuita en [pusher.com](https://pusher.com))

## Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd realtime-chat
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env.local` con tus credenciales de Pusher:
```env
PUSHER_APP_ID=your_app_id
PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
PUSHER_CLUSTER=your_cluster
NEXT_PUBLIC_PUSHER_KEY=your_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster
```

4. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## Estructura del Proyecto

```
src/
├── app/
│   ├── api/
│   │   ├── messages/
│   │   │   ├── route.ts           # Guardar mensajes
│   │   │   └── reaction/
│   │   │       └── route.ts       # Reacciones
│   │   ├── presence/
│   │   │   └── broadcast/
│   │   │       └── route.ts       # Eventos de presencia
│   │   ├── typing/
│   │   │   └── route.ts           # Indicador de escritura
│   │   └── pusher/
│   │       ├── auth/
│   │       │   └── route.ts       # Auth de Pusher
│   │       └── send/
│   │           └── route.ts       # Eventos arbitrary
│   ├── chat/
│   │   ├── ChatContent.tsx        # Contenido del chat
│   │   ├── ChatHeader.tsx         # Encabezado con usuarios
│   │   ├── ChatTypingBubble.tsx    # Indicador de escritura
│   │   ├── Dropdown.tsx           # Componente reutilizable
│   │   ├── Modal.tsx              # Modal reutilizable
│   │   ├── MessageInput.tsx       # Input de mensajes
│   │   ├── MessageList.tsx         # Lista de mensajes
│   │   ├── MessageReactions.tsx    # Reacciones de mensajes
│   │   ├── ThemeDialog.tsx         # Diálogo de tema
│   │   └── useChat.ts             # Hook principal del chat
│   ├── hooks/
│   │   └── useTheme.ts            # Hook de tema
│   ├── join/
│   │   ├── layout.tsx             # Layout con metadata
│   │   └── page.tsx               # Página de unión
│   ├── globals.css                # Estilos globales
│   ├── layout.tsx                 # Layout principal
│   └── page.tsx                   # Redirección a /join
└── lib/
    ├── pusher.ts                  # Cliente Pusher (server)
    └── pusher-client.ts           # Cliente Pusher (client)
```

## API Routes

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/messages` | GET | Obtener mensajes de la sala |
| `/api/messages` | POST | Guardar nuevo mensaje |
| `/api/messages/reaction` | POST | Añadir/quitar reacción |
| `/api/presence/broadcast` | POST | Broadcast de presencia |
| `/api/typing` | POST | Indicador de escritura |
| `/api/pusher/auth` | POST | Autenticación de canal |

## Eventos de Pusher

| Canal | Evento | Descripción |
|-------|--------|-------------|
| `chat-{room}` | `new-message` | Nuevo mensaje |
| `chat-{room}` | `user-joined` | Usuario unido |
| `chat-{room}` | `user-left` | Usuario salió |
| `chat-{room}` | `heartbeat` | Heartbeat de presencia |
| `chat-{room}` | `user-typing` | Usuario escribiendo |
| `chat-{room}` | `message-reaction` | Reacción a mensaje |

## Licencia

MIT
