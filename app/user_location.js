'use client';

export async function fetchUserCoordinates () {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();  // data returns an object in json with, lat and lng as keys
        console.log('Got user coordinates:');
        // getting lat and lng to return
        return { lat: data.latitude, lng: data.longitude }
    } catch (error) {
        console.error('Error fetching user coordinates:', error, "setting default to toronto");
        return null;
    }
}