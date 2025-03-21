# Pneumonia Detection Web Application

A modern web application that uses AI to detect pneumonia in chest X-ray images. Built with React, FastAPI, and TensorFlow.

![Pneumonia Detection App](https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2000)

## Features

- Real-time pneumonia detection from chest X-ray images
- Interactive drag-and-drop file upload
- Visual confidence score display
- Responsive design for all devices
- Fast AI-powered analysis

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Lucide React Icons
- Vite

### Backend
- FastAPI
- TensorFlow
- Python 3.8+
- Pillow for image processing

## Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- Your trained TensorFlow model file (`.h5` format)

## Getting Started

> **Important**: The application requires two separate terminal windows/tabs, one for the backend server and one for the frontend development server.

### Backend Setup (Terminal 1)

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Place your trained `.h5` model file in the `server` directory and name it `model.h5`

3. Create a Python virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Start the FastAPI server:
   ```bash
   python -m uvicorn main:app --reload
   ```

### Frontend Setup (Terminal 2)

1. Open a new terminal window/tab

2. Navigate to the project root directory and install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:8000](http://localhost:8000)

## Usage

1. Open the application in your web browser
2. Click the upload area or drag and drop a chest X-ray image
3. Wait for the AI model to analyze the image
4. View the results and confidence score



## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- TensorFlow for the machine learning framework
- React and Vite teams for the excellent development experience
- FastAPI for the high-performance Python web framework

NOTE: If you encounter an error related to Vite, run the following command: 
```bash
 npm install vite --save-dev
```