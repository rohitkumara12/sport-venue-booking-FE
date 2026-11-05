export interface MembershipPlan {
    id: string;
    name: string;
    description: string | null;
    price: number | string;
    sessionCount: number;
    durationDays: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface MembershipPlanPayload {
    name: string;
    description?: string;
    price: number;
    sessionCount: number;
    durationDays: number;
}
export interface PurchaseMembershipResponse {
  membership: {
    id: string;
    userId: string;
    membershipPlanId: string;
    status: string;
    totalSessions: number;
    remainingSessions: number;
  };

  transaction: {
    id: string;
    status: string;
    amount: number | string;
    expiresAt: string;
  };

  membershipPlan: {
    id: string;
    name: string;
    price: number;
    sessionCount: number;
    durationDays: number;
  };
}
export interface MyMembership {
    id: string;
    userId: string;
    membershipPlanId: string;
    status: string;
    totalSessions: number;
    remainingSessions: number;
    startsAt: string | null;
    expiresAt: string | null;

    membershipPlan: {
        id: string;
        name: string;
        price: number | string;
        sessionCount: number;
        durationDays: number;
    };

    transactions: {
        id: string;
        status: string;
        amount: number | string;
        paymentProofUrl: string | null;
        expiresAt: string | null;
        createdAt: string;
    }[];
}