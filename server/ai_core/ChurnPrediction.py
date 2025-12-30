import logging
import pandas as pd
import numpy as np
from datetime import datetime
from typing import Dict, List

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ChurnPrediction10X")

class ChurnPredictor:
    def __init__(self):
        logger.info("Initializing Churn Prediction Model (XGBoost/LightGBM)...")
        # En prod: self.model = xgb.Booster(model_file='churn_v1.model')
    
    def predict_user_risk(self, user_features: Dict) -> Dict:
        """
        Predice la probabilidad de que un usuario abandone la plataforma (Churn).
        Features esperados: last_login_days, messages_sent, subscription_status, pets_added
        """
        
        # Extracción de features simulada
        days_inactive = user_features.get('last_login_days', 0)
        engagement_score = user_features.get('engagement_score', 50) # 0-100
        
        # Lógica heurística de riesgo (Proxy del modelo ML)
        risk_score = 0.1 # Base risk
        
        if days_inactive > 7:
            risk_score += 0.3
        if days_inactive > 30:
            risk_score += 0.4
            
        if engagement_score < 20:
            risk_score += 0.2
            
        risk_score = min(risk_score, 0.99)
        
        risk_level = "LOW"
        if risk_score > 0.4: risk_level = "MEDIUM"
        if risk_score > 0.7: risk_level = "HIGH"

        # Acciones recomendadas por el sistema experto
        recommended_actions = []
        if risk_level == "HIGH":
            recommended_actions = ["Send Discount Coupon", "Push Notification: 'We miss you!'"]
        elif risk_level == "MEDIUM":
            recommended_actions = ["Highlight New Features in Email"]

        return {
            "user_id": user_features.get('user_id'),
            "churn_probability": round(risk_score, 2),
            "risk_level": risk_level,
            "recommended_actions": recommended_actions,
            "prediction_timestamp": datetime.now().isoformat()
        }

if __name__ == "__main__":
    predictor = ChurnPredictor()
    sample_user = {
        "user_id": "u_999",
        "last_login_days": 15,
        "engagement_score": 10
    }
    print(predictor.predict_user_risk(sample_user))
