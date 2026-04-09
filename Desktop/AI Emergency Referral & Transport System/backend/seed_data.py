import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.contrib.auth import get_user_model
from apps.hospitals.models import Hospital
from apps.ambulances.models import Ambulance, Driver

User = get_user_model()


def seed_data():
    print("🌱 Seeding database...")

    # Create superuser
    if not User.objects.filter(phone='0911000000').exists():
        admin = User.objects.create_superuser(
            phone='0911000000',
            password='admin123',
            name='System Admin'
        )
        print(f"  ✅ Admin created: {admin.phone} / admin123")

    # Create test users
    test_users = [
        {'phone': '0912111111', 'name': 'Abebe Kebede', 'age': 35, 'blood_type': 'O+'},
        {'phone': '0912222222', 'name': 'Tigist Haile', 'age': 28, 'blood_type': 'A+'},
        {'phone': '0912333333', 'name': 'Dawit Tadesse', 'age': 42, 'blood_type': 'B+'},
    ]

    for u in test_users:
        user, created = User.objects.get_or_create(phone=u['phone'], defaults={**u, 'is_verified': True})
        if created:
            user.set_password('test123')
            user.save()
            print(f"  ✅ User created: {user.name} ({user.phone})")

    # Create hospitals in Addis Ababa
    hospitals_data = [
        {
            'name': 'Tikur Anbessa Specialized Hospital',
            'facility_type': 'specialized',
            'address': 'Zambia Street, Lideta',
            'city': 'Addis Ababa',
            'region': 'Addis Ababa',
            'latitude': 9.0107,
            'longitude': 38.7468,
            'phone': '0111239720',
            'specialties': ['Cardiology', 'Neurology', 'Pediatrics', 'Surgery', 'Oncology'],
            'services': ['Emergency', 'ICU', 'Surgery', 'Laboratory', 'Radiology'],
            'capacity': 800,
            'available_beds': 120,
            'has_emergency': True,
            'has_icu': True,
            'has_surgery': True,
            'verification_status': 'approved',
        },
        {
            'name': 'St. Paul\'s Hospital Millennium Medical College',
            'facility_type': 'hospital',
            'address': 'Swaziland Street, Gulele',
            'city': 'Addis Ababa',
            'region': 'Addis Ababa',
            'latitude': 9.0417,
            'longitude': 38.7305,
            'phone': '0112757360',
            'specialties': ['Trauma', 'Orthopedics', 'Burn', 'Surgery'],
            'services': ['Emergency', 'ICU', 'Surgery', 'Burn Unit'],
            'capacity': 700,
            'available_beds': 85,
            'has_emergency': True,
            'has_icu': True,
            'has_surgery': True,
            'verification_status': 'approved',
        },
        {
            'name': 'Zewditu Memorial Hospital',
            'facility_type': 'hospital',
            'address': 'Ras Desta Damtew St, Arada',
            'city': 'Addis Ababa',
            'region': 'Addis Ababa',
            'latitude': 9.0243,
            'longitude': 38.7498,
            'phone': '0111551011',
            'specialties': ['Internal Medicine', 'Obstetrics', 'Gynecology'],
            'services': ['Emergency', 'Laboratory', 'Maternity'],
            'capacity': 350,
            'available_beds': 45,
            'has_emergency': True,
            'has_icu': False,
            'has_surgery': True,
            'verification_status': 'approved',
        },
        {
            'name': 'Korean Hospital',
            'facility_type': 'hospital',
            'address': 'Bole Road, Bole',
            'city': 'Addis Ababa',
            'region': 'Addis Ababa',
            'latitude': 8.9945,
            'longitude': 38.7875,
            'phone': '0116627364',
            'specialties': ['General Surgery', 'Pediatrics', 'Dermatology'],
            'services': ['Emergency', 'ICU', 'Surgery'],
            'capacity': 200,
            'available_beds': 30,
            'has_emergency': True,
            'has_icu': True,
            'has_surgery': True,
            'verification_status': 'approved',
        },
        {
            'name': 'Hayat General Hospital',
            'facility_type': 'hospital',
            'address': 'Bole Atlas, Bole',
            'city': 'Addis Ababa',
            'region': 'Addis Ababa',
            'latitude': 9.0058,
            'longitude': 38.7838,
            'phone': '0116616363',
            'specialties': ['Cardiology', 'Internal Medicine', 'Surgery'],
            'services': ['Emergency', 'ICU', 'Laboratory', 'Pharmacy'],
            'capacity': 150,
            'available_beds': 22,
            'has_emergency': True,
            'has_icu': True,
            'has_surgery': True,
            'verification_status': 'approved',
        },
        {
            'name': 'Yekatit 12 Hospital',
            'facility_type': 'hospital',
            'address': 'Arat Kilo, Arada',
            'city': 'Addis Ababa',
            'region': 'Addis Ababa',
            'latitude': 9.0330,
            'longitude': 38.7630,
            'phone': '0111242281',
            'specialties': ['Burn', 'Plastic Surgery', 'Emergency Medicine'],
            'services': ['Emergency', 'Burn Unit', 'ICU'],
            'capacity': 320,
            'available_beds': 50,
            'has_emergency': True,
            'has_icu': True,
            'has_surgery': True,
            'verification_status': 'approved',
        },
    ]

    for h_data in hospitals_data:
        hospital, created = Hospital.objects.get_or_create(
            name=h_data['name'],
            defaults=h_data
        )
        if created:
            print(f"  🏥 Hospital created: {hospital.name}")

    # Create ambulances
    driver_user1, _ = User.objects.get_or_create(
        phone='0913111111',
        defaults={'name': 'Yohannes Gebre', 'role': 'driver', 'is_verified': True}
    )
    driver_user2, _ = User.objects.get_or_create(
        phone='0913222222',
        defaults={'name': 'Mekdes Alemu', 'role': 'driver', 'is_verified': True}
    )
    driver_user3, _ = User.objects.get_or_create(
        phone='0913333333',
        defaults={'name': 'Solomon Bekele', 'role': 'driver', 'is_verified': True}
    )

    ambulances_data = [
        {
            'plate_number': 'AA-3-12345',
            'ambulance_type': 'advanced',
            'status': 'available',
            'latitude': 9.0150,
            'longitude': 38.7500,
            'phone': '0913111111',
            'organization': 'Addis Ababa Fire & Emergency',
            'equipment': ['Defibrillator', 'Oxygen', 'IV Kit', 'Stretcher'],
            'verification_status': 'approved',
        },
        {
            'plate_number': 'AA-3-67890',
            'ambulance_type': 'basic',
            'status': 'available',
            'latitude': 9.0300,
            'longitude': 38.7600,
            'phone': '0913222222',
            'organization': 'Ethiopian Red Cross',
            'equipment': ['First Aid Kit', 'Oxygen', 'Stretcher'],
            'verification_status': 'approved',
        },
        {
            'plate_number': 'AA-3-11223',
            'ambulance_type': 'icu_mobile',
            'status': 'available',
            'latitude': 9.0000,
            'longitude': 38.7800,
            'phone': '0913333333',
            'organization': 'Tikur Anbessa Hospital',
            'equipment': ['Ventilator', 'Defibrillator', 'Cardiac Monitor', 'IV Pump', 'Oxygen'],
            'verification_status': 'approved',
        },
    ]

    driver_users = [driver_user1, driver_user2, driver_user3]
    for i, a_data in enumerate(ambulances_data):
        ambulance, created = Ambulance.objects.get_or_create(
            plate_number=a_data['plate_number'],
            defaults=a_data
        )
        if created:
            print(f"  🚑 Ambulance created: {ambulance.plate_number}")

            Driver.objects.get_or_create(
                user=driver_users[i],
                defaults={
                    'ambulance': ambulance,
                    'license_number': f'DL-AA-{10000+i}',
                    'experience_years': 5 + i,
                    'is_on_duty': True,
                    'verification_status': 'approved',
                }
            )
            print(f"  👨‍✈️ Driver assigned: {driver_users[i].name}")

    print("\n✅ Seed data complete!")
    print(f"   📊 Users: {User.objects.count()}")
    print(f"   🏥 Hospitals: {Hospital.objects.count()}")
    print(f"   🚑 Ambulances: {Ambulance.objects.count()}")
    print(f"   👨‍✈️ Drivers: {Driver.objects.count()}")


if __name__ == '__main__':
    seed_data()
