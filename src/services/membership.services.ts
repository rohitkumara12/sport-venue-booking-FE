import { api } from "@/lib/axios.instances.lib";
import { ApiResponse } from "@/types/api.responses";
import {
    MembershipPlan,
    MembershipPlanPayload,
    MyMembership,
    PurchaseMembershipResponse,
} from "@/types/membership";
import axios from "axios";

// Customer: mengambil paket membership yang aktif
export async function getPublicMembershipPlans(): Promise<MembershipPlan[]> {
    const { data } = await api.get<ApiResponse<MembershipPlan[]>>(
        "/memberships"
    );

    return data.data;
}

// Admin: mengambil seluruh paket membership
export async function getMembershipPlans(): Promise<MembershipPlan[]> {
    const { data } = await api.get<ApiResponse<MembershipPlan[]>>(
        "/memberships/admin"
    );

    return data.data;
}

// Admin: membuat paket membership
export async function createMembershipPlan(
    payload: MembershipPlanPayload
): Promise<MembershipPlan> {
    const { data } = await api.post<ApiResponse<MembershipPlan>>(
        "/memberships",
        payload
    );

    return data.data;
}

// Admin: memperbarui paket membership
export async function updateMembershipPlan(
    id: string,
    payload: Partial<MembershipPlanPayload>
): Promise<MembershipPlan> {
    const { data } = await api.patch<ApiResponse<MembershipPlan>>(
        `/memberships/${id}`,
        payload
    );

    return data.data;
}

export function gerMembershipErrorMessage(
    err: unknown,
    fallback: string
): string {
    if (axios.isAxiosError(err)) {
        return err.response?.data?.message ?? fallback;
    }

    return err instanceof Error ? err.message : fallback;
}
export async function purchaseMembership(
    membershipPlanId: string
): Promise<PurchaseMembershipResponse> {
    const { data } = await api.post<ApiResponse<PurchaseMembershipResponse>>(
        "/memberships/purchase",
        { membershipPlanId }
    );

    return data.data;
}

export async function submitMembershipPaymentProof(
    membershipId : string,
    paymentProofUrl : string
) : Promise<void> {
    await api.patch (
        `/memberships/${membershipId}/payment-proof`,
        {paymentProofUrl}
    )
}
export async function getMyMemberships(): Promise<MyMembership[]> {
        const {data} = await api.get<ApiResponse<MyMembership[]>>(
            "/memberships/my-memberships"
        );
        return data.data
    }





