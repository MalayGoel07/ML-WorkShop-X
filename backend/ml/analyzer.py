from __future__ import annotations
from typing import Any
import base64
import io
from itertools import combinations
import matplotlib
import pandas as pd
import seaborn as sns

matplotlib.use("Agg")
import matplotlib.pyplot as plt


def _infer_type(series: pd.Series) -> str:
    if series.dropna().empty:
        return "empty"
    if pd.api.types.is_bool_dtype(series):
        return "boolean"
    if pd.api.types.is_numeric_dtype(series):
        return "number"
    return "text"

def create_distribution_charts(dataset: pd.DataFrame) -> list[dict[str, str]]:
    charts = []
    numeric_columns = dataset.select_dtypes(include="number").columns.tolist()
    for column in numeric_columns:
        val = dataset[column].dropna()
        if len(val) < 2 or val.nunique() <= 1:
            continue
        skewness = val.skew()
        figure, axis = plt.subplots(figsize=(8, 5))
        sns.histplot(val,kde=True,ax=axis)
        axis.axvline(val.mean(),linestyle="--",label=f"Mean: {val.mean():.2f}")
        axis.axvline(val.median(),linestyle=":",label=f"Median: {val.median():.2f}")
        axis.set_title(f"{column} Distribution | Skewness: {skewness:.2f}")
        axis.set_xlabel(column)
        axis.set_ylabel("Frequency")
        axis.legend()
        charts.append(_chart(f"{column} distribution",figure))
    return charts

def stats(dataset:pd.DataFrame)->dict[str,Any]:
    num=dataset.select_dtypes(include="number")
    statistics={}
    for col in num.columns:
        val=num[col]
        statistics[col]={
            "count":int(val.count()),
            "mean":float(f"{val.mean():.2f}"),
            "median":float(f"{val.median():.2f}"),
            "std":float(f"{val.std():.2f}"),
            "min":float(f"{val.min():.2f}"),
            "max":float(f"{val.max():.2f}"),
            "q1":float(f"{val.quantile(0.25):.2f}"),
            "q3":float(f"{val.quantile(0.75):.2f}"),
            "skewness": float(f"{val.skew():.2f}"),
            "iqr": float(f"{val.quantile(0.75)-val.quantile(0.25):.2f}"),
        }
    return statistics

def find_outliers(dataset: pd.DataFrame) -> dict[str, Any]:
    num = dataset.select_dtypes(include="number")
    outliers = {}
    for col in num.columns:
        val = num[col].dropna()
        q1 = val.quantile(0.25)
        q3 = val.quantile(0.75)
        iqr = q3 - q1
        lower = q1 - 1.5 * iqr
        upper = q3 + 1.5 * iqr

        mask = (val < lower) | (val > upper)
        outliers[col] = {
            "count": int(mask.sum()),
            "percentage": float(f"{mask.mean() * 100:.2f}"),
            "lower_bound": float(f"{lower:.2f}"),
            "upper_bound": float(f"{upper:.2f}"),
        }

    return outliers

def analyze_dataset(dataset: pd.DataFrame) -> dict[str, Any]:
    if dataset.empty:
        raise ValueError("Dataset is empty")

    missing_by_column = dataset.isna().sum()
    types = [{"name": str(column), "type": _infer_type(dataset[column])} for column in dataset.columns]
    dupe_rows=dataset.duplicated().sum()
    stat_s=stats(dataset)
    return {
        "rows": int(dataset.shape[0]),
        "columns": int(dataset.shape[1]),
        "missing": int(missing_by_column.sum()),
        "types": types,
        "dup_rows":int(dupe_rows),
        "stats":stat_s,
        "outliers": find_outliers(dataset)
    }


def _chart(title: str, figure: Any) -> dict[str, str]:
    buffer = io.BytesIO()
    figure.tight_layout()
    figure.savefig(buffer, format="png", dpi=120, bbox_inches="tight")
    plt.close(figure)
    encoded = base64.b64encode(buffer.getvalue()).decode("ascii")
    return {"title": title, "image": encoded}


def create_relationship_charts(dataset: pd.DataFrame) -> list[dict[str, str]]:
    charts = []
    charts.extend(create_distribution_charts(dataset))
    numeric_columns = dataset.select_dtypes(include="number").columns.tolist()
    categorical_columns = dataset.select_dtypes(exclude="number").columns.tolist()

    if len(numeric_columns) >= 2:
        figure, axis = plt.subplots(figsize=(8, 6))
        sns.heatmap(dataset[numeric_columns].corr(), annot=True, cmap="coolwarm", center=0, ax=axis)
        axis.set_title("Numeric correlation heatmap")
        charts.append(_chart("Numeric correlation heatmap", figure))

        for first_column, second_column in list(combinations(numeric_columns, 2))[:6]:
            figure, axis = plt.subplots(figsize=(7, 5))
            sns.scatterplot(data=dataset, x=first_column, y=second_column, ax=axis)
            axis.set_title(f"{first_column} vs {second_column}")
            charts.append(_chart(f"{first_column} vs {second_column}", figure))

    for category_column in categorical_columns[:6]:
        if dataset[category_column].nunique(dropna=True) > 12:
            continue
        for numeric_column in numeric_columns[:6]:
            figure, axis = plt.subplots(figsize=(8, 5))
            sns.boxplot(data=dataset, x=category_column, y=numeric_column, ax=axis)
            axis.set_title(f"{numeric_column} by {category_column}")
            axis.tick_params(axis="x", rotation=35)
            charts.append(_chart(f"{numeric_column} by {category_column}", figure))

    for first_column, second_column in list(combinations(categorical_columns, 2))[:6]:
        if dataset[first_column].nunique(dropna=True) > 12 or dataset[second_column].nunique(dropna=True) > 12:
            continue
        figure, axis = plt.subplots(figsize=(8, 5))
        sns.countplot(data=dataset, x=first_column, hue=second_column, ax=axis)
        axis.set_title(f"{first_column} by {second_column}")
        axis.tick_params(axis="x", rotation=35)
        charts.append(_chart(f"{first_column} by {second_column}", figure))

    return charts
