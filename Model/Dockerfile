# FROM python:3.11-slim

# WORKDIR /app

# RUN apt-get update && apt-get install -y --no-install-recommends \
#     build-essential \
#     && rm -rf /var/lib/apt/lists/*

# COPY requirements.txt .

# RUN pip install --no-cache-dir --upgrade pip && \
#     pip install --no-cache-dir -r requirements.txt

# COPY . .

# EXPOSE 7860

# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]

FROM python:3.11-slim

# Create a non-root user with ID 1000 (Required by Hugging Face Spaces)
RUN useradd -m -u 1000 user

# Set environment variables for the user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    # Optional: Set Hugging Face cache directory to the user's home
    HF_HOME=/home/user/.cache/huggingface

# Set the working directory to the user's home
WORKDIR $HOME/app

# Install build tools just in case
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file first to leverage Docker cache
COPY --chown=user requirements.txt .

# Switch to the non-root user
USER user

# Upgrade pip and install dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY --chown=user . .

# Expose the standard Hugging Face port
EXPOSE 7860

# Run the FastAPI app using Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
