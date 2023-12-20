package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type ElevationData struct {
	Elevation float64 `json:"elevation"`
}

func elevationHandler(w http.ResponseWriter, r *http.Request) {
	latitude := r.URL.Query().Get("latitude")
	longitude := r.URL.Query().Get("longitude")

	elevationUrl := fmt.Sprintf("https://api.open-meteo.com/v1/elevation?latitude=%s&longitude=%s", latitude, longitude)
	resp, err := http.Get(elevationUrl)
	if err != nil {
		http.Error(w, "Error fetching elevation data", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	var elevationData ElevationData
	err = json.NewDecoder(resp.Body).Decode(&elevationData)
	if err != nil {
		http.Error(w, "Error decoding elevation data", http.StatusInternalServerError)
		return
	}

	// Return elevation data as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(elevationData)
}

func main() {
	http.HandleFunc("/elevation", elevationHandler)
	http.Handle("/", http.FileServer(http.Dir("../frontend")))
	http.ListenAndServe(":8080", nil)
}
