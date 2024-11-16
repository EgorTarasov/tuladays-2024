package service

import (
	"context"
	"encoding/csv"
	"fmt"
	"io"
	"strconv"
)

func (s *service) ProcessCSV(ctx context.Context, reader io.Reader) error {
	// Create a new CSV reader
	csvReader := csv.NewReader(reader)

	// Read all the records from the CSV file
	records, err := csvReader.ReadAll()
	if err != nil {
		return fmt.Errorf("failed to read CSV file: %w", err)
	}

	// Check if there are any records
	if len(records) == 0 {
		return fmt.Errorf("no records found in CSV file")
	}

	// Process the records (example: calculate the average of a specific column)
	columnIndex := 2 // Change this to the index of the column you want to process
	var sum float64
	var count int

	for i, record := range records {
		// Skip the header row
		if i == 0 {
			continue
		}

		// Parse the value from the specific column
		value, err := strconv.ParseFloat(record[columnIndex], 64)
		if err != nil {
			return fmt.Errorf("failed to parse value in row %d: %w", i+1, err)
		}

		// Add the value to the sum and increment the count
		sum += value
		count++
	}

	// Calculate the average
	average := sum / float64(count)
	fmt.Printf("Average value in column %d: %.2f\n", columnIndex, average)

	return nil
}
