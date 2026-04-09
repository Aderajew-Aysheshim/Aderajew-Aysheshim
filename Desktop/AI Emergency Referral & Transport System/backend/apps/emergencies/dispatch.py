from haversine import haversine, Unit
from apps.ambulances.models import Ambulance
from apps.hospitals.models import Hospital
from django.conf import settings


def find_nearest_ambulance(latitude, longitude, radius_km=None):
    if radius_km is None:
        radius_km = settings.DEFAULT_AMBULANCE_SEARCH_RADIUS_KM

    user_location = (latitude, longitude)

    ambulances = Ambulance.objects.filter(
        verification_status='approved',
        status='available',
        latitude__isnull=False,
        longitude__isnull=False
    )

    nearest = None
    min_distance = float('inf')

    for ambulance in ambulances:
        amb_location = (ambulance.latitude, ambulance.longitude)
        distance = haversine(user_location, amb_location, unit=Unit.KILOMETERS)

        if distance <= radius_km and distance < min_distance:
            min_distance = distance
            nearest = ambulance
            nearest.distance_km = round(distance, 2)

    if nearest is None and radius_km < settings.MAX_AMBULANCE_SEARCH_RADIUS_KM:
        return find_nearest_ambulance(
            latitude, longitude,
            radius_km=min(radius_km * 2, settings.MAX_AMBULANCE_SEARCH_RADIUS_KM)
        )

    return nearest


def suggest_hospitals(latitude, longitude, emergency_type=None, limit=5):
    user_location = (latitude, longitude)

    hospitals = Hospital.objects.filter(
        verification_status='approved',
        is_available=True,
        has_emergency=True
    )

    scored_hospitals = []
    for hospital in hospitals:
        hosp_location = (hospital.latitude, hospital.longitude)
        distance = haversine(user_location, hosp_location, unit=Unit.KILOMETERS)

        score = distance
        reason_parts = [f"Distance: {round(distance, 2)} km"]

        if hospital.has_icu:
            score -= 2
            reason_parts.append("Has ICU")

        if hospital.has_surgery:
            score -= 1
            reason_parts.append("Has Surgery")

        if hospital.available_beds > 10:
            score -= 1
            reason_parts.append(f"Available beds: {hospital.available_beds}")

        if emergency_type and hospital.specialties:
            type_specialty_map = {
                'cardiac': ['cardiology', 'cardiac'],
                'trauma': ['trauma', 'orthopedics', 'surgery'],
                'stroke': ['neurology', 'stroke'],
                'burn': ['burn', 'plastic surgery'],
                'pediatric': ['pediatrics'],
                'pregnancy': ['obstetrics', 'gynecology', 'maternity'],
            }

            relevant_specialties = type_specialty_map.get(emergency_type, [])
            for spec in hospital.specialties:
                if any(rs in spec.lower() for rs in relevant_specialties):
                    score -= 5
                    reason_parts.append(f"Specialized: {spec}")
                    break

        scored_hospitals.append({
            'hospital': hospital,
            'distance_km': round(distance, 2),
            'score': round(score, 2),
            'reason': '; '.join(reason_parts)
        })

    scored_hospitals.sort(key=lambda x: x['score'])
    return scored_hospitals[:limit]


def estimate_arrival_time(distance_km, speed_kmh=40):
    if distance_km <= 0:
        return 1
    minutes = (distance_km / speed_kmh) * 60
    return max(1, round(minutes))
