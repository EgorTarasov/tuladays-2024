package models

type PatientData struct {
	ID            int64     `json:"id"`
	FirstName     string    `json:"first_name"`
	LastName      string    `json:"last_name"`
	MiddleName    string    `json:"middle_name"`
	Age           uint8     `json:"age"`
	RiskOfDisease float32   `json:"risk_of_disease"`
	Temperature   float32   `json:"temperature"`
	PercentOxygen uint8     `json:"percent_oxygen"`
	HeartData     HeartData `json:"heart_data"`
}

type HeartData struct {
	HeartRate uint8 `json:"heart_rate"`
	Systolic  uint8 `json:"systolic"`
	Diastolic uint8 `json:"diastolic"`
}
