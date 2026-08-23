import Link from "next/link";

export default function Page() {
    return (
        <div className="h-screen w-full flex justify-center items-center flex-col">
            <Link href="/dashboard" className="text-blue-500 underline underline-offset-2">Go to dashboard</Link>
        </div>
    )
}