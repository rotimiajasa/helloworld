from __future__ import annotations

from dataclasses import dataclass

from .models import CreditApplication


@dataclass
class FeatureVector:
    business_age_months: float
    employees: float
    requested_amount_m_ngn: float
    requested_tenor_months: float
    monthly_credit_m_ngn: float
    monthly_debit_m_ngn: float
    avg_balance_m_ngn: float
    min_balance_m_ngn: float
    bounce_rate: float
    cash_inflow_diversity: float
    pos_volume_m_ngn: float
    pos_active_days: float
    debt_service_ratio: float
    has_dpd: int
    sector_risk_idx: float
    inventory_app: int
    supplier_credit: int

    def as_array(self) -> list[float]:
        return [
            self.business_age_months,
            self.employees,
            self.requested_amount_m_ngn,
            self.requested_tenor_months,
            self.monthly_credit_m_ngn,
            self.monthly_debit_m_ngn,
            self.avg_balance_m_ngn,
            self.min_balance_m_ngn,
            self.bounce_rate,
            self.cash_inflow_diversity,
            self.pos_volume_m_ngn,
            self.pos_active_days,
            self.debt_service_ratio,
            float(self.has_dpd),
            self.sector_risk_idx,
            float(self.inventory_app),
            float(self.supplier_credit),
        ]

    @staticmethod
    def feature_names() -> list[str]:
        return [
            "business_age_months",
            "employees",
            "requested_amount_m_ngn",
            "requested_tenor_months",
            "monthly_credit_m_ngn",
            "monthly_debit_m_ngn",
            "avg_balance_m_ngn",
            "min_balance_m_ngn",
            "bounce_rate",
            "cash_inflow_diversity",
            "pos_volume_m_ngn",
            "pos_active_days",
            "debt_service_ratio",
            "has_dpd",
            "sector_risk_idx",
            "inventory_app",
            "supplier_credit",
        ]


# Sector risk index: 0 = lowest risk, 1 = highest. Calibrated against
# observed Nigerian MSME default rates (Lendsqr, Renmoney public reports).
SECTOR_RISK = {
    "retail": 0.45,
    "wholesale": 0.40,
    "agribusiness": 0.55,
    "services": 0.35,
    "light_manufacturing": 0.50,
    "logistics": 0.55,
    "hospitality": 0.60,
    "other": 0.55,
}


def extract(app: CreditApplication) -> FeatureVector:
    s = app.statement
    months = max(1, s.months_observed)
    monthly_credit = s.total_credits_kobo / months / 1_000_000_00
    monthly_debit = s.total_debits_kobo / months / 1_000_000_00
    avg_balance = s.avg_monthly_balance_kobo / 1_000_000_00
    min_balance = s.min_monthly_balance_kobo / 1_000_000_00
    bounce_rate = (
        s.bounced_debits_count / max(1, s.total_debits_kobo / 100_000_00)
    )

    monthly_obligations = sum(o.monthly_repayment_kobo for o in app.existing_obligations)
    requested_repayment = (
        app.requested_amount_kobo / max(1, app.requested_tenor_months)
    )
    if monthly_credit > 0:
        dsr = (
            (monthly_obligations / 100 + requested_repayment / 100)
            / max(1.0, monthly_credit * 1_000_000)
        )
    else:
        dsr = 1.0

    has_dpd = int(any(o.days_past_due > 0 for o in app.existing_obligations))

    inflow_diversity = min(1.0, s.distinct_inflow_payers / 30.0)

    return FeatureVector(
        business_age_months=app.business_age_months,
        employees=app.employees,
        requested_amount_m_ngn=app.requested_amount_kobo / 1_000_000_00,
        requested_tenor_months=app.requested_tenor_months,
        monthly_credit_m_ngn=monthly_credit,
        monthly_debit_m_ngn=monthly_debit,
        avg_balance_m_ngn=avg_balance,
        min_balance_m_ngn=min_balance,
        bounce_rate=round(bounce_rate, 3),
        cash_inflow_diversity=round(inflow_diversity, 3),
        pos_volume_m_ngn=s.pos_terminal_volume_kobo / 1_000_000_00,
        pos_active_days=s.pos_active_days_per_month,
        debt_service_ratio=round(min(2.0, dsr), 3),
        has_dpd=has_dpd,
        sector_risk_idx=SECTOR_RISK.get(app.sector.value, 0.55),
        inventory_app=int(app.has_inventory_app),
        supplier_credit=int(app.has_supplier_credit),
    )
