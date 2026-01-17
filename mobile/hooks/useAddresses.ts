import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { Address } from "@/types";
import { useAuth } from "@clerk/clerk-expo";

export const useAddresses = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const {userId} = useAuth()
  // IMPORTANT:
// Scope the query cache by user ID to prevent leaking a previous user's
// addresses after logout/login. Also guard the query with `enabled` so it
// doesn't run before authentication completes.

  const addressesQuerykey = ["addresses", userId];

  const {
    data: addresses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: addressesQuerykey,
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await api.get<{ addresses: Address[] }>("/users/addresses");
      console.log("Fetched addresses:", data.addresses);
      return data.addresses;
    },
  });

  const addAddressMutation = useMutation({
    // Omit<Address, "_id">: here we are saying that the type used here will be the address type but it wont be including the _id because we are creating a new piece of data in the database
    mutationFn: async (addressData: Omit<Address, "_id">) => {
      const { data } = await api.post<{ addresses: Address[] }>("/users/addresses", addressData);
      return data.addresses;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressesQuerykey });
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: async ({
      addressId,
      addressData,
    }: {
      addressId: string;
      // Partial here is saying that they user may not pass all information, just maybesome of them
      addressData: Partial<Address>;
    }) => {
      const { data } = await api.put<{ addresses: Address[] }>(
        `/users/addresses/${addressId}`,
        addressData
      );
      return data.addresses;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressesQuerykey });
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: async (addressId: string) => {
      const { data } = await api.delete<{ addresses: Address[] }>(`/users/addresses/${addressId}`);
      return data.addresses;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressesQuerykey });
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
