export interface AboutInfo
{
    brandName: string;
    title: string;
    description: string;
    values: string[];
}

export interface SupportSection
{
    title: string;
    description: string;
}

export interface SupportInfo
{
    title: string;
    email: string;
    phone: string;
    workingHours: string;
    sections: SupportSection[];
}
