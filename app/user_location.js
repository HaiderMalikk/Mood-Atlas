'use client';

export async function fetchUserCoordinates () {
try {
        const response = await fetch('/api/fetchUserCoordinates');
        const data = await response.json();
        console.log("User coordinates:", data);
        return data;
    } catch (error) {
        console.error("Error fetching user coordinates:", error);
        return null;
    }
}