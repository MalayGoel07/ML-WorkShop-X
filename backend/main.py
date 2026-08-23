import io
import json
import os

import pandas as pd
from fastapi import FastAPI, Depends, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
import uvicorn
from db import users_collection
from security import Token, UserSignup, authenticate_user, create_access_token, get_password_hash,get_current_active_user,User
from datetime import timedelta
from typing import Annotated
from dotenv import load_dotenv
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

from model_registry import MODEL_REGISTRY, compute_metrics, effective_task, get_model

load_dotenv()
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

app = FastAPI(title="ML_WorkSHop API", version="0.0.1")
app.add_middleware( CORSMiddleware, allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],)

@app.get("/")
async def root():
    return {"message": "Running!"}


@app.get("/models")
async def list_models():
    descriptions = {
        "Linear Regression": "Predicts continuous values from a linear fit",
        "Logistic Regression": "Fast baseline for classification",
        "Decision Tree": "Interpretable rule-based model",
        "Random Forest": "Robust ensemble of decision trees",
        "Support Vector Machine": "Strong boundary-based classifier",
        "K-Nearest Neighbors": "Classifies by nearby observations",
        "AdaBoost": "Boosts weak learners by reweighting errors",
        "Gradient Boosting": "Sequentially improves weak learners",
        "Gradient Descent": "Optimizes a model through iterations",
    }
    return {
        "models": [
            {
                "name": name,
                "task": entry["task"],
                "needs_scaling": entry["needs_scaling"],
                "description": descriptions.get(name, "Available model"),
            }
            for name, entry in MODEL_REGISTRY.items()
        ]
    }


def load_dataset(file: UploadFile, contents: bytes) -> pd.DataFrame:
    filename = (file.filename or "").lower()
    try:
        if filename.endswith(".json"):
            return pd.DataFrame(json.loads(contents.decode("utf-8")))
        if filename.endswith(".xlsx"):
            return pd.read_excel(io.BytesIO(contents))
        return pd.read_csv(io.BytesIO(contents))
    except (ValueError, UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise HTTPException(status_code=400, detail=f"Could not read dataset: {exc}") from exc


@app.post("/train")
async def train_models( file: UploadFile = File(...), target_column: str = Form(""), task_type: str = Form(...), models: str = Form(...),):

    if task_type not in {"classification", "regression"}:
        raise HTTPException(status_code=400, detail="Unsupported task_type")
    try:
        model_names = json.loads(models)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=400, detail="models must be a JSON array") from exc
    if not isinstance(model_names, list) or not model_names:
        raise HTTPException(status_code=400, detail="Select at least one model")

    contents = await file.read()
    dataset = load_dataset(file, contents)

    if dataset.empty:
        raise HTTPException(status_code=400, detail="Dataset is empty")
    if target_column not in dataset.columns:
        raise HTTPException(status_code=400, detail=f"Target column '{target_column}' was not found")

    features = dataset.drop(columns=[target_column], errors="ignore")
    features = pd.get_dummies(features).apply(pd.to_numeric, errors="coerce")
    features = features.fillna(features.median(numeric_only=True)).fillna(0)
    X = features.to_numpy()
    y = None
    y = dataset[target_column]

    if task_type == "classification":
        y = pd.factorize(y)[0]
    else:
        y = pd.to_numeric(y, errors="coerce").to_numpy()
        valid = ~pd.isna(y)
        X, y = X[valid], y[valid]

    results = {}
    for name in model_names:
        try:
            if name not in MODEL_REGISTRY:
                raise ValueError(f"Unknown model: {name}")
            model_task = effective_task(name, task_type)
            if model_task != task_type:
                raise ValueError(f"{name} does not support {task_type}")
            
            model = get_model(name, task_type)
            model_X = StandardScaler().fit_transform(X) if MODEL_REGISTRY[name]["needs_scaling"] else X
            
            X_train, X_test, y_train, y_test = train_test_split(model_X, y, test_size=0.2, random_state=42)
            model.fit(X_train, y_train)
            metrics = compute_metrics(task_type, y_test, model.predict(X_test))
            results[name] = {"metrics": metrics}
        except Exception as exc:
            results[name] = {"error": str(exc)}
    return {"results": results}



#--------------------authentication endpoints--------------------------------------------------------------------------------------------

@app.post("/auth/login")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]) -> Token:
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token = create_access_token( data={"sub": user.username}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return Token(access_token=access_token, token_type="bearer")


@app.post("/auth/signup")
async def signup(user: UserSignup) -> Token:
    existing = users_collection.find_one({"username": user.username})
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed = get_password_hash(user.password)
    users_collection.insert_one({
        "username": user.username,
        "full_name": user.full_name,
        "email": user.email,
        "hashed_password": hashed,
        "disabled": False
    })
    access_token = create_access_token(data={"sub": user.username})
    return Token(access_token=access_token, token_type="bearer")

class ProfileUpdate(BaseModel):
    full_name: str | None = None
    nickname: str | None = None
    instructions: str | None = None

@app.put("/me")
async def update_me(
    data: ProfileUpdate,
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    users_collection.update_one(
        {"username": current_user.username},
        {
            "$set": {
                "full_name": data.full_name,
                "nickname": data.nickname,
                "instructions": data.instructions
            }
        }
    )

    return {"message": "Profile updated"}

@app.get("/me")
async def get_me(
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    user = users_collection.find_one(
        {"username": current_user.username}
    )

    return {
        "username": user.get("full_name", user["username"]),
        "email": user.get("email", ""),
        "nickname": user.get("nickname", ""),
        "instructions": user.get("instructions", "")
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
