import { useQuery } from "@tanstack/react-query";
import { authApi, logoutApi } from "../apis";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { loadUser } from "../redux/slices/userSlice";

function UseAuthListener() {
  const dispatch = useDispatch();
  const { data, isSuccess } = useQuery({
    queryKey: ["user"],
    queryFn: authApi,
  });
  useEffect(() => {
    if (data && isSuccess) {
      dispatch(loadUser(data?.data?.user));
    }
  }, [data, isSuccess]);
  return null;
}

export default UseAuthListener;

export function UseLogoutListener() {
  const { data, error, isSuccess, isLoading, refetch } = useQuery({
    queryKey: ["logout"],
    queryFn: logoutApi,
    enabled: false,
  });
  return { error, isSuccess, isLoading, data, refetch };
}
