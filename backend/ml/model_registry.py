from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.ensemble import (
    RandomForestClassifier,
    RandomForestRegressor,
    AdaBoostClassifier,
    AdaBoostRegressor,
    GradientBoostingClassifier,
    GradientBoostingRegressor,
)
from sklearn.svm import SVC, SVR
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    mean_squared_error,
    mean_absolute_error,
    r2_score,
)


MODEL_REGISTRY = {

    "Linear Regression": {
        "task": "regression",
        "needs_scaling": False,
        "build": lambda task_type=None, **params: LinearRegression(**params),
    },

    "Logistic Regression": {
        "task": "classification",
        "needs_scaling": True,
        "build": lambda task_type=None, **params: LogisticRegression(max_iter=1000, **params),
    },

    "Decision Tree": {
        "task": "both",
        "needs_scaling": False,
        "build": lambda task_type, **params: (DecisionTreeClassifier(**params) if task_type == "classification" else DecisionTreeRegressor(**params)),
    },

    "Random Forest": {
        "task": "both",
        "needs_scaling": False,
        "build": lambda task_type, **params: (RandomForestClassifier(**params) if task_type == "classification" else RandomForestRegressor(**params)),
    },

    "Support Vector Machine": {
        "task": "both",
        "needs_scaling": True,
        "build": lambda task_type, **params: (SVC(probability=True, **params) if task_type == "classification" else SVR(**params)),
    },

    "K-Nearest Neighbors": {
        "task": "both",
        "needs_scaling": True,
        "build": lambda task_type, **params: ( KNeighborsClassifier(**params) if task_type == "classification" else KNeighborsRegressor(**params)),
    },

    "AdaBoost": {
        "task": "both",
        "needs_scaling": False,
        "build": lambda task_type, **params: ( AdaBoostClassifier(**params) if task_type == "classification" else AdaBoostRegressor(**params)),
    },

    "Gradient Boosting": {
        "task": "both",
        "needs_scaling": False,
        "build": lambda task_type, **params: (GradientBoostingClassifier(**params) if task_type == "classification" else GradientBoostingRegressor(**params)),
    },

}



def get_model(name: str, task_type: str | None = None, **params):
    if name not in MODEL_REGISTRY:
        raise ValueError(f"Unknown model: {name}. Available: {list(MODEL_REGISTRY)}")
    entry = MODEL_REGISTRY[name]
    if entry["task"] == "both" and task_type not in ("classification", "regression"):
        raise ValueError(f"Model '{name}' requires task_type='classification' or 'regression'")

    return entry["build"](task_type=task_type, **params)


def needs_scaling(name: str) -> bool:
    return MODEL_REGISTRY[name]["needs_scaling"]


def supported_task(name: str) -> str:
    return MODEL_REGISTRY[name]["task"]


def effective_task(name: str, task_type: str | None) -> str:
    entry_task = MODEL_REGISTRY[name]["task"]
    return task_type if entry_task == "both" else entry_task


def compute_metrics(task_type: str, y_true=None, y_pred=None, X=None, model=None) -> dict:
    if task_type == "classification":
        return {"Accuracy": round(accuracy_score(y_true, y_pred), 4),
            "Precision": round(precision_score(y_true, y_pred, average="weighted", zero_division=0), 4),
            "Recall": round(recall_score(y_true, y_pred, average="weighted", zero_division=0), 4),
            "F1 score": round(f1_score(y_true, y_pred, average="weighted", zero_division=0), 4),
        }

    if task_type == "regression":
        mse = mean_squared_error(y_true, y_pred)
        return {"RMSE": round(mse ** 0.5, 4),"MAE": round(mean_absolute_error(y_true, y_pred), 4),"R² score": round(r2_score(y_true, y_pred), 4),}

    raise ValueError(f"Unknown task_type: {task_type}")

