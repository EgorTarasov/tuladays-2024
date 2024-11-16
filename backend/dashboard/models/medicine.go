package models

type Dosage struct {
	Quantity        int `json:"quantity"` // in mg
	FrequencyPerDay int `json:"frequencyPerDay"`
}

type Actions struct {
	AddFromLink string `json:"addFromLink"`
}

type MedicineCreate struct {
	Name                  string   `json:"name"`
	Dosage                Dosage   `json:"dosage"`
	TreatmentDurationDays int      `json:"treatmentDurationDays"`
	Actions               Actions  `json:"actions"`
	Schedule              []string `json:"schedule"`
}

func (mc MedicineCreate) GetDosage() Dosage {
	return mc.Dosage
}

type MedicineItem struct {
	ID                    int64    `json:"id"`
	Name                  string   `json:"name"`
	Dosage                Dosage   `json:"dosage"`
	TreatmentDurationDays int      `json:"treatmentDurationDays"`
	Schedule              []string `json:"schedule"`
	RemindPatient         bool     `json:"remindPatient"`
	DisableForPatient     bool     `json:"disableForPatient"`
}
