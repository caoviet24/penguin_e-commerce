import { useMutation, UseMutationResult } from "@tanstack/react-query";


type MutationFunction<TData, TVariables> = (variables: TVariables) => Promise<TData>;

export default function useHookMutation<TData, TVariables>(
    callback: MutationFunction<TData, TVariables>
): UseMutationResult<TData, unknown, TVariables> {
    return useMutation<TData, unknown, TVariables>({ mutationFn: callback });
}