"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Upload } from "lucide-react";
import { authToken } from "@/api/utils/auth-token";
import { PatientStore } from "@/stores/patient.store";
import { toast } from "sonner";

export const PatientCSVUploadModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [csvData, setCSVData] = useState<string[][]>([]);
  const [csvFile, setCSVFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log({ file });
    if (file) {
      setCSVFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split("\n");
        const parsedData = lines.map((line) => line.split(","));
        setCSVData(parsedData.slice(0, 5)); // Preview first 5 rows
        setError(null);
      };
      reader.onerror = () => {
        setError("Error reading file");
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setCSVFile(null);
      setCSVData([]);
      setError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isOpen]);

  const handleUpload = () => {
    // Here you would typically send the CSV data to your server
    console.log("Uploading data:", csvData);
    setIsOpen(false);
    // Reset state
    setCSVData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (!csvFile) return;

    // send file to "/api/external/upload" by key document, add auth header
    const formData = new FormData();
    formData.append("document", csvFile);
    toast.promise(
      fetch("/api/external/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${authToken.get()}`,
        },
      }),
      {
        loading: "Загружаем данные...",
        success: "Данные загружены",
        error: "Ошибка загрузки данных",
        finally: () => PatientStore.init(),
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Upload className="mr-2 h-4 w-4" />
          Добавить пациента
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Добавить пациента</DialogTitle>
          <DialogDescription>
            Загрузите CSV файл, содержащий данные пациента. Файл должен иметь
            заголовки в первой строке.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* <Input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            ref={fileInputRef}
          /> */}
          <input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {csvData.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {csvData[0].map((header, index) => (
                      <TableHead key={index}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvData.slice(1).map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Отмена
          </Button>
          <Button onClick={handleUpload} disabled={csvData.length === 0}>
            Добавить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
