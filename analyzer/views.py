import json
from decimal import Decimal, InvalidOperation

from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .models import ElectricityBill


@require_http_methods(["GET", "POST"])
def bill_list_create(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            units = Decimal(str(data.get("units", "")))
            rate = Decimal(str(data.get("rate_per_unit", "")))

            if not units.is_finite() or not rate.is_finite():
                return JsonResponse({"error": "Enter valid numbers."}, status=400)

            if units <= 0 or rate <= 0 or units > 1000000 or rate > 1000000:
                return JsonResponse({"error": "Units and rate must be positive and within limits."}, status=400)

            total = units * rate

            bill = ElectricityBill.objects.create(
                units=units,
                rate_per_unit=rate,
                total_amount=total
            )

            return JsonResponse({
                "message": "Bill saved successfully!",
                "id": bill.id,
                "units": str(bill.units),
                "rate_per_unit": str(bill.rate_per_unit),
                "total_amount": str(bill.total_amount),
                "created_at": bill.created_at.isoformat()
            }, status=201)

        except (ValueError, TypeError, InvalidOperation, json.JSONDecodeError):
            return JsonResponse({"error": "Invalid bill details."}, status=400)

    bills = ElectricityBill.objects.all()[:50]

    results = [{
        "id": bill.id,
        "units": str(bill.units),
        "rate_per_unit": str(bill.rate_per_unit),
        "total_amount": str(bill.total_amount),
        "created_at": bill.created_at.isoformat()
    } for bill in bills]

    return JsonResponse({"bills": results})
from django.shortcuts import render

def dashboard(request):
    return render(request, "analyzer/dashboard.html")
