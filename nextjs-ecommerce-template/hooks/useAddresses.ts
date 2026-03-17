import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/axios";
import { useAuth } from "@clerk/nextjs";

interface Address {
  _id: string;
  label: string;
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AddressesResponse {
  success?: boolean;
  addresses: Address[];
}

export const useAddresses = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  // Scope the query cache by user ID to prevent leaking a previous user's
  // addresses after logout/login. Also guard the query with `enabled` so it
  // doesn't run before authentication completes.
  const addressesQueryKey = ["addresses", userId];

  const {
    data: addresses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: addressesQueryKey,
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await api.get<AddressesResponse>("/users/addresses");
      console.log("Fetched addresses:", data.addresses);
      return data.addresses;
    },
  });

  const addAddressMutation = useMutation({
    // Omit<Address, "_id">: here we are saying that the type used here will be the address type but it wont be including the _id because we are creating a new piece of data in the database
    mutationFn: async (addressData: Omit<Address, "_id" | "createdAt" | "updatedAt">) => {
      const { data } = await api.post<AddressesResponse>("/users/addresses", addressData);
      return data.addresses;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressesQueryKey });
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: async ({
      addressId,
      addressData,
    }: {
      addressId: string;
      // Partial here is saying that they user may not pass all information, just maybe some of them
      addressData: Partial<Address>;
    }) => {
      const { data } = await api.put<AddressesResponse>(
        `/users/addresses/${addressId}`,
        addressData
      );
      return data.addresses;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressesQueryKey });
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: async (addressId: string) => {
      const { data } = await api.delete<AddressesResponse>(`/users/addresses/${addressId}`);
      return data.addresses;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressesQueryKey });
    },
  });

  return {
    addresses: addresses || [],
    isLoading,
    isError,
    addAddress: addAddressMutation.mutate,
    updateAddress: updateAddressMutation.mutate,
    deleteAddress: deleteAddressMutation.mutate,
    isAddingAddress: addAddressMutation.isPending,
    isUpdatingAddress: updateAddressMutation.isPending,
    isDeletingAddress: deleteAddressMutation.isPending,
  };
};

export type { Address };
