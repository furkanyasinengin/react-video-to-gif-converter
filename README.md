# Client-Side Video to GIF Converter

This project is a high-performance web application that converts video files to GIF format entirely within the browser. It leverages WebAssembly (WASM) and Multithreading technologies to ensure data privacy and UI responsiveness.

## Project Overview

Unlike traditional converters that upload files to a server, this application processes video data locally on the user's device. This architecture ensures zero server costs for processing and guarantees that user files never leave their machine.

## Key Features

- **Client-Side Processing:** All conversions happen locally using FFmpeg.wasm.
- **Multithreading:** Utilizes Web Workers to offload heavy processing tasks from the main thread, keeping the UI responsive during conversion.
- **Custom Configuration:** Users can adjust:
  - Start and End time (Trimming)
  - Frame Rate (FPS)
  - Output Dimensions (Width/Scale)
- **Drag & Drop Interface:** Intuitive file upload system with validation.
- **Smart Metadata Extraction:** Automatically detects video duration and constraints input fields.
- **Real-Time Progress:** Accurate progress tracking with visual feedback.

## Technical Architecture

The application is built with a modern stack focusing on performance and type safety:

- **Frontend Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **Core Engine:** FFmpeg.wasm (0.12+)
- **Concurrency:** Web Workers API
- **Styling:** Tailwind CSS

### Security & Headers

To enable `SharedArrayBuffer` required by FFmpeg.wasm, the application enforces strict security headers:

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

## Usage

1. **Upload:** Drag and drop a video file (MP4, MOV, etc.) into the designated area.
2. **Configure:** Adjust the start/end times, FPS, and width settings if needed. The input fields automatically validate against the video's duration.
3. **Convert:** Click the "Convert To GIF" button. The processing happens in a background worker.
4. **Download:** Once completed, preview the GIF and download it to your device.
