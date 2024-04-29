import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface PropsType {
    patient: {
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
        country: {
            id: number;
            name: string;
        } | null;
        dementiaTypes: {
            id: number;
            type: string;
        } | null;
    } | null;
}

export default function PatientProfile({ patient }: PropsType) {
    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle>{patient?.name}</CardTitle>
                <CardDescription>
                    Description: {patient?.description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div>
                    Patient&apos;s sex:{" "}
                    {patient?.sex.charAt(0).toUpperCase() +
                        (patient?.sex.slice(1) || "")}
                </div>
                <div>Patient&apos;s age: {patient?.age}</div>
                <div>Dementia Type: {patient?.dementiaTypes?.type}</div>
                <div>
                    Dementia Stage:{" "}
                    {patient?.dementia_stage.charAt(0).toUpperCase() +
                        (patient?.dementia_stage.slice(1) || "")}
                </div>
                <div>Patient&apos;s Country: {patient?.country?.name}</div>
                <div>
                    Other Chronic disease(s):{" "}
                    {patient?.other_conditions?.charAt(0).toUpperCase() +
                        (patient?.other_conditions?.slice(1) || "")}
                </div>
                <div>
                    Caregiver&apos;s relation with patient:{" "}
                    {patient?.caregiver_relation.charAt(0).toUpperCase() +
                        (patient?.caregiver_relation.slice(1) || "")}
                </div>
                <div>
                    Caregiver&apos;s shift duration:{" "}
                    {patient?.caregiver_shift_duration}
                </div>
            </CardContent>
        </Card>
    );
}
