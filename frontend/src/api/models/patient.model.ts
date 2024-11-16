import { z } from "zod";

export namespace PatientDto {
  // Schema for the heart data
  export const HeartDataSchema = z.object({
    heart_rate: z.number(), // Heart rate in beats per minute
    systolic: z.number(), // Systolic blood pressure in mmHg
    diastolic: z.number(), // Diastolic blood pressure in mmHg
  });
  export type HeartData = z.infer<typeof HeartDataSchema>;

  // Schema for individual data points in graphs
  export const GraphDataPointSchema = z.object({
    date: z.string(), // ISO 8601 string representing the date and time
    info: z.number(), // Data value (e.g., heart rate, blood pressure)
  });
  export type GraphDataPoint = z.infer<typeof GraphDataPointSchema>;

  // Schema for each graph
  export const GraphSchema = z.object({
    title: z.string(), // Title of the graph
    data: z.array(GraphDataPointSchema), // Array of data points
    x_axis: z.string(), // Label for the X-axis
    y_axis: z.string(), // Label for the Y-axis
  });
  export type Graph = z.infer<typeof GraphSchema>;

  // Schema for the main object
  export const ItemSchema = z.object({
    id: z.number(), // ID of the record
    first_name: z.string(), // First name
    last_name: z.string(), // Last name
    middle_name: z.string(), // Middle name
    age: z.number(), // Age (non-negative integer)
    risk_of_disease: z.number(), // Risk of disease as a percentage
    temperature: z.number(), // Temperature in °C or similar
    percent_oxygen: z.number(), // Percent oxygen saturation
    heart_data: HeartDataSchema, // Heart data object
    graphs: z.array(GraphSchema), // Array of graphs
  });
  export type Item = z.infer<typeof ItemSchema>;
}
