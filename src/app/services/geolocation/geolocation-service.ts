import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface LocationName {
    city: string;
    country: string
}

@Injectable({
    providedIn: 'root'
})
export class GeolocationService {

    constructor(private httpClient: HttpClient) {}

    public getCurrentLocation(): Observable<[Coordinates, LocationName]> {
        return new Observable((observer: Observer<[Coordinates, LocationName]>) => {
            if (!('geolocation' in navigator)) {
                observer.error('Geolocation is not available in this browser.')
                observer.complete();
                return;
            }

            navigator.geolocation.getCurrentPosition(
                //success
                (position: GeolocationPosition) => {
                    this.getLocationName(position.coords).subscribe({
                        next: res => {
                            const address = res.address;
                            const city = address.city || address.town || address.village;
                            const country = address.country;
                            const location: LocationName = {
                                city: city,
                                country: country
                            }

                            observer.next([position.coords, location]);
                            observer.complete();
                        },
                        error: err => {
                            observer.error(err);
                            observer.complete();
                        }
                    })
                },
                //error
                (error: GeolocationPositionError) => {
                    let errMessage: string = 'An unknown error occurred.';

                    if (error.code === error.PERMISSION_DENIED) {
                        errMessage = 'Browser location permission denied.';
                    } else if (error.code === error.POSITION_UNAVAILABLE) {
                        errMessage = 'Location information is unavailable.'
                    }

                    observer.error(errMessage);
                    observer.complete();
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        });
    }

    private getLocationName(coordinates: Coordinates): Observable<any> {
        let params = new HttpParams()
            .set('lat', coordinates.latitude)
            .set('lon', coordinates.longitude)
            .set('format', 'json')
            .set('addressdetails', '1');
        
        return this.httpClient.get<any>('https://nominatim.openstreetmap.org/reverse', { params })
    }
}
