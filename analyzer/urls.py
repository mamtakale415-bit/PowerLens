from django.urls import path
from . import views

urlpatterns = [
    path("", views.dashboard, name="dashboard"),
    path("bills/", views.bill_list_create, name="bill-list-create"),
]
