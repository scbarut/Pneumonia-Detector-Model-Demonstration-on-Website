from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from PIL import Image
import numpy as np
import io

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PneumoniaModel:
    def __init__(self):
        self.model = tf.keras.models.load_model("model.h5")
        self.target_size = (150, 150)

    def preprocess_image(self, image):
        # Convert to grayscale as X-ray images are typically grayscale
        image = image.convert('L')
        # Resize image
        image = image.resize(self.target_size)
        # Convert to array
        image_array = image_array = tf.keras.utils.img_to_array(image)
        # Scale pixel values
        image_array = image_array / 255.0
        # Add batch dimension
        image_array = np.expand_dims(image_array, axis=0)
        return image_array

    def predict(self, image):
        # Preprocess the image
        processed_image = self.preprocess_image(image)

        # Make prediction
        prediction = self.model.predict(processed_image)
        confidence = float(prediction[0][0])

        # Model output: 0 = Normal, 1 = Pneumonia
        # Convert to probability
        if confidence >= 0.5:
            label = "Pneumonia"
            confidence = confidence * 100
        else:
            label = "Normal"
            confidence = (1 - confidence) * 100

        return {
            "prediction": label,
            "confidence": confidence
        }


# Initialize model
model = PneumoniaModel()


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Read image file
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))

    # Get prediction
    result = model.predict(image)

    return result
