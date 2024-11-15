import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Activity, Heart, Droplet, Thermometer, AlertCircle, Phone, Mail, ClipboardList, ChevronLeft } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LineChart } from "recharts"

// Симулированные данные пациентов (как и раньше)
const patients = [
    {
        id: "P001",
        name: "Джон Доу",
        age: 45,
        condition: "Стабильное",
        diagnosis: "Гипертония",
        room: "201A",
        admissionDate: "2023-06-15",
        vitals: {
            heartRate: { current: 72, history: [70, 72, 71, 73, 72, 71, 72] },
            bloodPressure: {
                current: { systolic: 120, diastolic: 80 },
                history: [
                    { systolic: 118, diastolic: 78 },
                    { systolic: 120, diastolic: 80 },
                    { systolic: 119, diastolic: 79 },
                    { systolic: 121, diastolic: 81 },
                    { systolic: 120, diastolic: 80 },
                    { systolic: 118, diastolic: 79 },
                    { systolic: 120, diastolic: 80 }
                ]
            },
            oxygenSaturation: { current: 98, history: [97, 98, 98, 99, 98, 98, 98] },
            temperature: { current: 36.6, history: [36.5, 36.6, 36.6, 36.7, 36.6, 36.5, 36.6] }
        }
    },
    {
        id: "P002",
        name: "Джейн Смит",
        age: 62,
        condition: "Критическое",
        diagnosis: "Пневмония",
        room: "ICU-3",
        admissionDate: "2023-06-18",
        vitals: {
            heartRate: { current: 90, history: [85, 87, 88, 90, 90, 89, 90] },
            bloodPressure: {
                current: { systolic: 140, diastolic: 90 },
                history: [
                    { systolic: 135, diastolic: 85 },
                    { systolic: 138, diastolic: 88 },
                    { systolic: 140, diastolic: 90 },
                    { systolic: 142, diastolic: 92 },
                    { systolic: 140, diastolic: 90 },
                    { systolic: 139, diastolic: 89 },
                    { systolic: 140, diastolic: 90 }
                ]
            },
            oxygenSaturation: { current: 94, history: [93, 93, 94, 94, 94, 95, 94] },
            temperature: { current: 37.8, history: [37.5, 37.6, 37.7, 37.8, 37.8, 37.7, 37.8] }
        }
    },
    {
        id: "P003",
        name: "Боб Джонсон",
        age: 33,
        condition: "Восстанавливается",
        diagnosis: "Аппендицит (после операции)",
        room: "305B",
        admissionDate: "2023-06-20",
        vitals: {
            heartRate: { current: 68, history: [72, 70, 69, 68, 68, 67, 68] },
            bloodPressure: {
                current: { systolic: 118, diastolic: 78 },
                history: [
                    { systolic: 122, diastolic: 82 },
                    { systolic: 120, diastolic: 80 },
                    { systolic: 119, diastolic: 79 },
                    { systolic: 118, diastolic: 78 },
                    { systolic: 118, diastolic: 78 },
                    { systolic: 117, diastolic: 77 },
                    { systolic: 118, diastolic: 78 }
                ]
            },
            oxygenSaturation: { current: 99, history: [97, 98, 98, 99, 99, 99, 99] },
            temperature: { current: 36.5, history: [36.8, 36.7, 36.6, 36.5, 36.5, 36.5, 36.5] }
        }
    }
]

const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
        case 'критическое': return 'bg-red-500'
        case 'стабильное': return 'bg-green-500'
        case 'восстанавливается': return 'bg-blue-500'
        default: return 'bg-gray-500'
    }
}

const VitalSign = ({ icon: Icon, title, value, unit }: { icon: any, title: string, value: number | string, unit: string }) => (
    <div className="flex items-center space-x-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{title}:</span>
        <span className="text-sm font-bold">{value} {unit}</span>
    </div>
)

const PatientCard = ({ patient, onClick }: { patient: typeof patients[0], onClick: () => void }) => (
    <Card className="w-full cursor-pointer hover:bg-accent" onClick={onClick}>
        <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{patient.name}</CardTitle>
                <Badge className={`${getConditionColor(patient.condition)}`}>{patient.condition}</Badge>
            </div>
        </CardHeader>
        <CardContent>
            <div className="text-sm text-muted-foreground mb-2">Возраст: {patient.age}</div>
            <div className="grid grid-cols-2 gap-2">
                <VitalSign icon={Heart} title="Частота сердечных сокращений" value={patient.vitals.heartRate.current} unit="уд/мин" />
                <VitalSign icon={Activity} title="Кровяное давление" value={`${patient.vitals.bloodPressure.current.systolic}/${patient.vitals.bloodPressure.current.diastolic}`} unit="мм рт. ст." />
                <VitalSign icon={Droplet} title="Насыщение кислородом" value={patient.vitals.oxygenSaturation.current} unit="%" />
                <VitalSign icon={Thermometer} title="Температура" value={patient.vitals.temperature.current} unit="°C" />
            </div>
        </CardContent>
    </Card>
)

const DetailedPatientView = ({ patient, onBack }: { patient: typeof patients[0], onBack: () => void }) => (
    <div className="space-y-6">
        <div className="flex justify-between items-start">
            <div>
                <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 -ml-2 md:hidden">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Назад к списку
                </Button>
                <h2 className="text-2xl font-bold">{patient.name}</h2>
                <p className="text-muted-foreground">Возраст: {patient.age} | Комната: {patient.room}</p>
                <p className="text-muted-foreground">Дата поступления: {patient.admissionDate}</p>
                <p className="font-medium mt-2">Диагноз: {patient.diagnosis}</p>
            </div>
            <Badge className={`${getConditionColor(patient.condition)} text-lg py-1 px-3`}>{patient.condition}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <VitalSign icon={Heart} title="Частота сердечных сокращений" value={patient.vitals.heartRate.current} unit="уд/мин" />
            <VitalSign icon={Activity} title="Кровяное давление" value={`${patient.vitals.bloodPressure.current.systolic}/${patient.vitals.bloodPressure.current.diastolic}`} unit="мм рт. ст." />
            <VitalSign icon={Droplet} title="Насыщение кислородом" value={patient.vitals.oxygenSaturation.current} unit="%" />
            <VitalSign icon={Thermometer} title="Температура" value={patient.vitals.temperature.current} unit="°C" />
        </div>

        <Tabs defaultValue="heartRate">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="heartRate">Частота сердечных сокращений</TabsTrigger>
                <TabsTrigger value="bloodPressure">Кровяное давление</TabsTrigger>
                <TabsTrigger value="oxygenSaturation">Насыщение кислородом</TabsTrigger>
                <TabsTrigger value="temperature">Температура</TabsTrigger>
            </TabsList>
            <TabsContent value="heartRate">
                <Card>
                    <CardHeader>
                        <CardTitle>История частоты сердечных сокращений</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LineChart
                            data={patient.vitals.heartRate.history.map((value, index) => ({ x: index, y: value }))}
                            index="x"
                            categories={["y"]}
                            colors={["red"]}
                            valueFormatter={(value) => `${value} уд/мин`}
                            className="h-[200px]"
                        />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="bloodPressure">
                <Card>
                    <CardHeader>
                        <CardTitle>История кровяного давления</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LineChart
                            data={patient.vitals.bloodPressure.history.map((bp, index) => ({ x: index, systolic: bp.systolic, diastolic: bp.diastolic }))}
                            index="x"
                            categories={["systolic", "diastolic"]}
                            colors={["red", "blue"]}
                            valueFormatter={(value) => `${value} мм рт. ст.`}
                            className="h-[200px]"
                        />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="oxygenSaturation">
                <Card>
                    <CardHeader>
                        <CardTitle>История насыщения кислородом</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LineChart
                            data={patient.vitals.oxygenSaturation.history.map((value, index) => ({ x: index, y: value }))}
                            index="x"
                            categories={["y"]}
                            colors={["blue"]}
                            valueFormatter={(value) => `${value}%`}
                            className="h-[200px]"
                        />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="temperature">
                <Card>
                    <CardHeader>
                        <CardTitle>История температуры</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LineChart
                            data={patient.vitals.temperature.history.map((value, index) => ({ x: index, y: value }))}
                            index="x"
                            categories={["y"]}
                            colors={["orange"]}
                            valueFormatter={(value) => `${value}°C`}
                            className="h-[200px]"
                        />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="w-full">
                <AlertCircle className="mr-2 h-4 w-4" /> Отправить предупреждение
            </Button>
            <Button className="w-full" variant="outline">
                <Phone className="mr-2 h-4 w-4" /> Позвонить пациенту
            </Button>
            <Button className="w-full" variant="outline">
                <Mail className="mr-2 h-4 w-4" /> Написать пациенту
            </Button>
            <Button className="w-full" variant="outline">
                <ClipboardList className="mr-2 h-4 w-4" /> Обновить заметки
            </Button>
        </div>
    </div>
)

export default function ResponsivePatientDashboard() {
    const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null)

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Мониторинг пациентов</h1>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                    <ScrollArea className="h-[calc(100vh-180px)] md:h-[calc(100vh-120px)]">
                        <div className="pr-4 space-y-4">
                            {patients.map(patient => (
                                <Sheet key={patient.id}>
                                    <SheetTrigger asChild>
                                        <div className="md:hidden">
                                            <PatientCard
                                                patient={patient}
                                                onClick={() => setSelectedPatient(patient)}
                                            />
                                        </div>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-full sm:max-w-none">
                                        <DetailedPatientView
                                            patient={patient}
                                            onBack={() => setSelectedPatient(null)}
                                        />
                                    </SheetContent>
                                </Sheet>
                            ))}
                            {patients.map(patient => (
                                <div key={patient.id} className="hidden md:block">
                                    <PatientCard
                                        patient={patient}
                                        onClick={() => setSelectedPatient(patient)}
                                    />
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
                <div className="hidden md:block w-full md:w-2/3">
                    {selectedPatient ? (
                        <DetailedPatientView
                            patient={selectedPatient}
                            onBack={() => setSelectedPatient(null)}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-xl text-muted-foreground">Выберите пациента для просмотра деталей</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}