import { Navbar } from "@/app/components/navbar";
import { AdminGuard } from "../AdminGuard";
import { Footer } from "@/app/components/footer";
import { MembershipPlan,MembershipPlanPayload } from "@/types/membership";
import MembershipManagement from "./membershipManagement";



export default function AdminMembershipPage() {
    return (
        <>
        <Navbar/>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
            <h1 className="font-display text-3xl font-extrabold text-primary">
                Membership management
            </h1>

            <p className="mt-2 mb-8 text-muted">
                Kelola paket membership untuk customer
            </p>
            <AdminGuard>
                <MembershipManagement/>

            </AdminGuard>
        </main>
        <Footer/>
        </>
    )
}