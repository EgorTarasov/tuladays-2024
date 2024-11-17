package models

type PatientCardData struct {
	UserID       int64        `json:"user_id"`
	EMIASID      string       `json:"emias_id"`
	FullName     string       `json:"full_name"`
	Alert        string       `json:"alert"`
	Diagnosis    string       `json:"diagnosis"`
	TelegramLink TelegramLink `json:"telegram_link"`
}

type TelegramLink struct {
	Joined      bool   `json:"joined"`
	Link        string `json:"link"`
	ConnectLink string `json:"connect_link"`
}

type PatientData struct {
	ID            int64     `json:"id"`
	FirstName     string    `json:"first_name"`
	LastName      string    `json:"last_name"`
	MiddleName    string    `json:"middle_name"`
	Alert         string    `json:"alert"`
	EMIASID       string    `json:"emias_id"`
	Address       string    `json:"address"`
	TelegramLink  string    `json:"telegram_link"`
	Age           uint8     `json:"age"`
	RiskOfDisease float32   `json:"risk_of_disease"`
	Temperature   float32   `json:"temperature"`
	PercentOxygen uint8     `json:"percent_oxygen"`
	BloodSugar    float32   `json:"blood_sugar"`
	HeartData     HeartData `json:"heart_data"`
	CreatedAt     string    `json:"created_at"`
	LastVisit     string    `json:"last_visit"`
	Graphs        []Graph   `json:"graphs"`
	Diagnosis     string    `json:"diagnosis"`
}

type HeartData struct {
	HeartRate uint8 `json:"heart_rate"`
	Systolic  uint8 `json:"systolic"`
	Diastolic uint8 `json:"diastolic"`
}

// {
//   date: string
//   info: number
// }[]

type GraphRecord struct {
	Date string `json:"date"`
	Info int    `json:"info"`
}

type Graph struct {
	Title string        `json:"title"`
	Data  []GraphRecord `json:"data"`
	XAxis string        `json:"x_axis"`
	YAxis string        `json:"y_axis"`
}
