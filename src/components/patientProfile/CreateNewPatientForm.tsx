"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

interface PropsType {
    defaultValues: z.infer<typeof formSchema> | null;
    onClose: () => void;
}

const formSchema = z.object({
    name: z.string().max(25, {
        message: "Name must be less than 25 characters.",
    }),
    sex: z.enum(["male", "female", "other", ""]),
    dementiaType: z.string(),
    dementiaStage: z.string(),
    country: z.string(),
    other_conditions: z.string(),
    age: z.number().min(0).max(150),
    caregiver_relation: z.string(),
    caregiver_shift_duration: z.number().min(0).max(24),
    description: z.string(),
});

export default function CreateNewPatientForm({
    onClose,
    defaultValues,
}: PropsType) {
    const [typesOfDementia, setTypesOfDementia] = useState<
        | {
              id: number;
              type: string;
          }[]
        | null
    >(null);
    const [countries, setCountries] = useState<
        { id: number; name: string }[] | null
    >(null);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues || {
            name: "",
            sex: "",
            dementiaType: "",
            dementiaStage: "",
            country: "",
            other_conditions: "",
            age: 0,
            caregiver_relation: "",
            caregiver_shift_duration: 0,
            description: "",
        },
    });

    useEffect(() => {
        getTypesOfDementia();
        getCountries();
    }, []);

    async function getCountries() {
        const res = await fetch("/api/getCountries");
        const data = await res.json();
        console.log({ data });
        if (res.ok) {
            setCountries(data.countries);
        } else {
            console.error({ res });
        }
    }

    async function getTypesOfDementia() {
        const res = await fetch("/api/getTypesOfDementia");
        const data = await res.json();
        console.log({ data });
        if (res.ok) {
            setTypesOfDementia(data.dementiaTypes);
        } else {
            console.error({ res });
        }
    }

    async function handleSubmit(values: z.infer<typeof formSchema>) {
        console.log({ values });
        const res = await fetch("/api/createNewPatient", {
            method: "POST",
            body: JSON.stringify({ patientInfo: { ...values } }),
        });
        const data = await res.json();
        if (res.ok) {
            alert(data.message);
            console.log({ patientInfo: data.patientInfo });
            onClose();
        } else {
            alert(data.message);
            console.log({ data });
        }
    }

    return (
        <>
            <Button
                variant="outline"
                className="rounded-xl absolute p-1 w-9 h-9 right-9 top-2"
                onClick={onClose}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                >
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
            </Button>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-4"
                >
                    {/* Form fields */}

                    {/* Name */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Name" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Sex */}
                    <FormField
                        control={form.control}
                        name="sex"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sex</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select sex" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">
                                                Male
                                            </SelectItem>
                                            <SelectItem value="female">
                                                Female
                                            </SelectItem>
                                            <SelectItem value="other">
                                                Other
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Dementia Type */}
                    <FormField
                        control={form.control}
                        name="dementiaType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type of Dementia</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {typesOfDementia &&
                                                typesOfDementia.map((item) => {
                                                    return (
                                                        <SelectItem
                                                            key={item.id}
                                                            value={item.type}
                                                        >
                                                            {item.type}
                                                        </SelectItem>
                                                    );
                                                })}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Dementia Stage */}
                    <FormField
                        control={form.control}
                        name="dementiaStage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stage of Dementia</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select stage of dementia" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="early">
                                                Early
                                            </SelectItem>
                                            <SelectItem value="middle">
                                                Middle
                                            </SelectItem>
                                            <SelectItem value="Late">
                                                Late
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Country */}
                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countries &&
                                                countries.map((country) => {
                                                    return (
                                                        <SelectItem
                                                            key={country.id}
                                                            value={country.name}
                                                        >
                                                            {country.name}
                                                        </SelectItem>
                                                    );
                                                })}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Other Conditions */}
                    <FormField
                        control={form.control}
                        name="other_conditions"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Other Conditions</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Diabetes, Hypertension, etc."
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Age */}
                    <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Age</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        value={field.value}
                                        onChange={(e) => {
                                            const val = parseInt(
                                                e.target.value
                                            );
                                            field.onChange(val);
                                        }}
                                        placeholder="Age"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Caregiver Relation */}
                    <FormField
                        control={form.control}
                        name="caregiver_relation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Caregivers Relation</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Spouse, Hired Caregiver, etc."
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Caregiver Shift Duration */}
                    <FormField
                        control={form.control}
                        name="caregiver_shift_duration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Caregiver Shift Duration</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        value={field.value}
                                        onChange={(e) => {
                                            const val = parseInt(
                                                e.target.value
                                            );
                                            field.onChange(val);
                                        }}
                                        placeholder="Caregiver Shift Duration (hours)"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Description */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Description"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </>
    );
}
