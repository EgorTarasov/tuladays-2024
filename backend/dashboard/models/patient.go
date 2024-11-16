package models

type UserData struct {
	ID                int64
	FirstName         string
	LastName          string
	MiddleName        string
	Age               uint8
	RiskOfDisease     float32
	Temperature       float32
	PercentOxygen     uint8
	HeartRate         uint8
	SystolicPressure  uint32
	DiastolicPressure uint32
}
