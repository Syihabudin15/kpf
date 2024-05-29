import { handleRoute } from "@/components/utils/menuUtils";
import { Metadata } from "next"

export const metadata:Metadata = {
    title: "Logging"
}

export default async function page(){
    await handleRoute("/master/logging");
    return(
        <div>
            <h1>Logging Data</h1>
        </div>
    )
}