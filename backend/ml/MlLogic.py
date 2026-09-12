import io
import json
import sys
from pathlib import Path

import pandas as pd
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
    from backend.ml.analyzer import analyze_dataset, create_relationship_charts
    from backend.ml.model_registry import MODEL_REGISTRY, compute_metrics, get_model
else:
    from backend.ml.analyzer import analyze_dataset, create_relationship_charts
    from backend.ml.model_registry import MODEL_REGISTRY, compute_metrics, get_model


ml_router = APIRouter()


@ml_router.get("/models")
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


@ml_router.post("/analyze")
async def analyze_file(file: UploadFile = File(...)):
    contents = await file.read()
    dataset = load_dataset(file, contents)
    try:
        return {
            "analysis": analyze_dataset(dataset),
            "charts": create_relationship_charts(dataset),
        }
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@ml_router.post("/train")
async def train_models( file: UploadFile = File(...), target_column: str = Form(""), task_type: str = Form(...), models: str = Form(...),):
    try:
        model_names = json.loads(models)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=400, detail="models must be a JSON array") from exc

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

            model = get_model(name, task_type)
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

            if MODEL_REGISTRY[name]["needs_scaling"] :
                scaler=StandardScaler()
                X_train=scaler.fit_transform(X_train)
                X_test=scaler.transform(X_test)

            model.fit(X_train, y_train)
            metrics = compute_metrics(task_type, y_test, model.predict(X_test))
            results[name] = {"metrics": metrics, "test_samples": len(y_test)}
            
        except Exception as exc:
            results[name] = {"error": str(exc)}

    return {"results": results}
