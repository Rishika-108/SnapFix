def validate_coords(lat, lon):
    return -90 <= lat <= 90 and -180 <= lon <= 180
def validate_coords(lat, lon):
    try:
        lat = float(lat)
        lon = float(lon)
        return -90 <= lat <= 90 and -180 <= lon <= 180
    except (TypeError, ValueError):
        return False
