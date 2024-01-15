import { useQuery } from "@tanstack/react-query";
import { logoutApi } from "../apis";

export function UseLogoutListener() {
  const { data, error, isSuccess, isLoading, refetch } = useQuery({
    queryKey: ["logout"],
    queryFn: logoutApi,
    enabled: false,
  });
  return { error, isSuccess, isLoading, data, refetch };
}
