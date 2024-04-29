"use client";
import { useEffect, useState } from "react";
import PatientProfile from "./PatientProfile";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import CreateNewPatientForm from "./CreateNewPatientForm";

interface patientType {
    id: number;
    user_id: number | null;
    name: string;
    sex: string;
    dementiaTypes_id: number | null;
    dementia_stage: string;
    country_id: number | null;
    other_conditions: string | null;
    age: number;
    caregiver_relation: string;
    caregiver_shift_duration: number;
    description: string | null;
}

interface PropsType {
    patients: patientType[];
    chatId: string;
}

export default function SelectPatient({ patients, chatId }: PropsType) {
    const [selectedPatient, setSelectedPatient] = useState<patientType | null>(
        null
    );
    const [openCreateNewPatientForm, setOpenCreateNewPatientForm] =
        useState(false);

    useEffect(() => {
        console.log({ selectedPatient });
    }, [selectedPatient]);

    async function handleSave() {
        const res = await fetch("/api/addPatientToChat", {
            method: "POST",
            body: JSON.stringify({
                chatId: chatId,
                patientId: selectedPatient?.id,
            }),
        });
        const data = await res.json();
        if (res.ok) {
            console.log({ data });
        } else {
            console.error(data);
        }
    }

    async function closeForm() {
        setOpenCreateNewPatientForm(false);
    }

    return (
        <div className="h-full flex flex-col gap-2 w-full overflow-y-auto p-3">
            {openCreateNewPatientForm ? (
                <CreateNewPatientForm
                    onClose={closeForm}
                    defaultValues={null}
                />
            ) : (
                <>
                    <div className="bg-gray-100 p-2 border-gray-300 border-[1px] rounded-sm flex gap-2">
                        <Select
                            value={selectedPatient?.id.toString() || ""}
                            onValueChange={(value) =>
                                setSelectedPatient((currPatient) => {
                                    const newSelectedPatient = patients.find(
                                        (patient) =>
                                            patient.id === parseInt(value)
                                    );
                                    if (newSelectedPatient) {
                                        return newSelectedPatient;
                                    }
                                    return currPatient;
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Patient" />
                            </SelectTrigger>
                            <SelectContent>
                                {patients.map((patient) => {
                                    return (
                                        <SelectItem
                                            value={patient.id.toString()}
                                            key={patient.id}
                                        >
                                            {patient.name}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            className="flex justify-between p-2"
                            onClick={() => setOpenCreateNewPatientForm(true)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-5 h-5"
                            >
                                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                            </svg>
                            <div>Create New</div>
                        </Button>
                    </div>
                    {selectedPatient && (
                        <>
                            {/* @ts-ignore */}
                            <PatientProfile patient={selectedPatient} />
                            <div className="flex gap-2">
                                <Button
                                    variant="destructive"
                                    onClick={() => setSelectedPatient(null)}
                                    className=" w-1/2"
                                >
                                    Clear Selection
                                </Button>
                                <Button
                                    variant="default"
                                    className=" w-1/2 bg-blue-950 hover:bg-blue-800 text-white p-2 rounded-sm gap-1"
                                    onClick={handleSave}
                                >
                                    Save
                                </Button>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
